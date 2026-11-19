import { ApiError, GoogleGenAI, type GenerateContentResponse } from "@google/genai";
import { buildSystemPrompt } from "@/lib/knowledge";
import { LEAD_SENTINEL, toDraft } from "@/lib/lead";

type ChatMessage = { role: "user" | "assistant"; content: string };

// Preferred model first. The backup is used if the first is retired (404),
// overloaded (503) or too slow to start answering (FIRST_TOKEN_TIMEOUT_MS).
const MODELS = [process.env.GEMINI_MODEL || "gemini-3.5-flash-lite", "gemini-3.6-flash", "gemini-3.1-flash-lite"].filter(
  (m, i, a) => a.indexOf(m) === i,
);
const FIRST_TOKEN_TIMEOUT_MS = 15_000;
const MAX_MESSAGES = 16;
const MAX_CHARS = 800;

/* ---------- Lead hand-off tool ---------- */

const TOOLS = [
  {
    functionDeclarations: [
      {
        name: "show_contact_card",
        description:
          "Shows the visitor a contact card, pre-filled with what they've shared, that they review and press Send on to email Amar. Use once they want to be connected and you have their name, email and what they need.",
        parametersJsonSchema: {
          type: "object",
          properties: {
            name: { type: "string", description: "The visitor's name." },
            email: { type: "string", description: "The visitor's email, exactly as they typed it." },
            project: { type: "string", description: "What they need: the project, role or problem, in their words, 1–3 sentences." },
            budget: { type: "string", description: "Budget if they shared one, otherwise empty." },
            phone: { type: "string", description: "Phone or WhatsApp number if they shared one, otherwise empty." },
          },
        },
      },
    ],
  },
];

/** Text parts of a chunk, without the SDK's warning about non-text (function call) parts. */
function chunkText(r: GenerateContentResponse): string {
  const parts = r.candidates?.[0]?.content?.parts ?? [];
  return parts
    .filter((p) => typeof p.text === "string" && !p.thought)
    .map((p) => p.text)
    .join("");
}

/* ---------- API keys: main first, then fallback ---------- */

// GEMINI_API_KEY is the main key; GEMINI_API_KEY_2, _3… are fallbacks, tried in order.
function apiKeys(): string[] {
  const keys = [process.env.GEMINI_API_KEY];
  for (let i = 2; i <= 5; i++) keys.push(process.env[`GEMINI_API_KEY_${i}`]);
  return keys.filter((k): k is string => !!k && k.trim().length > 0);
}

// A key that hit its quota is skipped for a while, so we don't waste a call on it every message.
const COOLDOWN_MS = 15 * 60 * 1000;
const cooledUntil = new Map<string, number>();

/** Errors where trying the next key could help: quota/rate limit, bad or disabled key, overloaded model. */
function shouldTryNextKey(err: unknown): boolean {
  const status = err instanceof ApiError ? err.status : undefined;
  const msg = err instanceof Error ? err.message : String(err);
  return (
    status === 429 ||
    status === 401 ||
    status === 403 ||
    status === 503 ||
    /RESOURCE_EXHAUSTED|quota|rate limit|API_KEY_INVALID|PERMISSION_DENIED|UNAVAILABLE|overloaded/i.test(msg)
  );
}

/* ---------- Rate limit per visitor: 20 requests / 10 minutes ---------- */

const WINDOW_MS = 10 * 60 * 1000;
const LIMIT = 20;
const hits = new Map<string, number[]>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) hits.clear();
  return recent.length > LIMIT;
}

function parse(body: unknown): ChatMessage[] | null {
  if (!body || typeof body !== "object" || !Array.isArray((body as { messages?: unknown }).messages)) return null;
  const msgs = (body as { messages: unknown[] }).messages
    .filter(
      (m): m is ChatMessage =>
        !!m &&
        typeof m === "object" &&
        ((m as ChatMessage).role === "user" || (m as ChatMessage).role === "assistant") &&
        typeof (m as ChatMessage).content === "string",
    )
    .map((m) => ({ role: m.role, content: m.content.slice(0, MAX_CHARS) }))
    .slice(-MAX_MESSAGES);
  if (!msgs.length || msgs[msgs.length - 1].role !== "user") return null;
  return msgs;
}

/**
 * Opens a Gemini stream, failing over to the next key on quota / key errors.
 * The first chunk is awaited here so a quota error that only surfaces when the
 * stream starts still triggers the fallback.
 */
async function openStream(messages: ChatMessage[]) {
  const all = apiKeys();
  const now = Date.now();
  // Fresh keys first, cooled-down keys last (better a likely-429 than no attempt).
  const ordered = [...all.filter((k) => (cooledUntil.get(k) ?? 0) <= now), ...all.filter((k) => (cooledUntil.get(k) ?? 0) > now)];

  const contents = messages.map((m) => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: m.content }],
  }));
  const systemInstruction = buildSystemPrompt();

  let lastErr: unknown;
  for (const [i, key] of ordered.entries()) {
    for (const model of MODELS) {
      const ctrl = new AbortController();
      const timer = setTimeout(() => ctrl.abort(), FIRST_TOKEN_TIMEOUT_MS);
      try {
        const ai = new GoogleGenAI({ apiKey: key });
        const stream = await ai.models.generateContentStream({
          model,
          contents,
          config: { systemInstruction, temperature: 0.5, maxOutputTokens: 700, abortSignal: ctrl.signal, tools: TOOLS },
        });
        const it = stream[Symbol.asyncIterator]();
        const first = await it.next();
        clearTimeout(timer);
        cooledUntil.delete(key);
        if (i > 0 || model !== MODELS[0]) console.warn(`[chat] answered with key #${i + 1} on ${model}`);
        return { first, it };
      } catch (err) {
        clearTimeout(timer);
        lastErr = err;
        const status = err instanceof ApiError ? err.status : undefined;
        // Model problem (retired, overloaded, or slow): same key, next model.
        if (ctrl.signal.aborted || status === 404 || status === 503) {
          console.warn(`[chat] key #${i + 1} on ${model}: ${ctrl.signal.aborted ? "timed out" : status}, trying next model`);
          continue;
        }
        // Key problem (quota used up, invalid/disabled): rest this key, move to the next key.
        if (!shouldTryNextKey(err)) throw err;
        cooledUntil.set(key, Date.now() + COOLDOWN_MS);
        console.warn(`[chat] key #${i + 1} failed (${status ?? "error"}), switching to next key`);
        break;
      }
    }
  }
  throw lastErr ?? new Error("No API keys configured");
}

export async function POST(req: Request) {
  if (apiKeys().length === 0) {
    return Response.json({ error: "The assistant isn’t configured yet." }, { status: 503 });
  }

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (rateLimited(ip)) {
    return Response.json({ error: "You’re sending messages quickly. Try again in a few minutes." }, { status: 429 });
  }

  let messages: ChatMessage[] | null = null;
  try {
    messages = parse(await req.json());
  } catch {
    /* fall through */
  }
  if (!messages) return Response.json({ error: "Invalid request." }, { status: 400 });

  let opened: { first: IteratorResult<GenerateContentResponse>; it: AsyncIterator<GenerateContentResponse> };
  try {
    opened = await openStream(messages);
  } catch (err) {
    console.error("[chat] all keys failed", err);
    return Response.json(
      { error: "Amar’s assistant is taking a break right now. Please email him at amarabdulrehman123@gmail.com." },
      { status: 502 },
    );
  }

  const encoder = new TextEncoder();
  const body = new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        let res = opened.first;
        let lead: unknown = null;
        while (!res.done) {
          const text = chunkText(res.value);
          if (text) controller.enqueue(encoder.encode(text));
          const call = res.value.functionCalls?.find((c) => c.name === "show_contact_card");
          if (call) lead = call.args ?? {};
          res = await opened.it.next();
        }
        // The lead card rides at the end of the stream, after a separator the UI strips out.
        if (lead) controller.enqueue(encoder.encode(`${LEAD_SENTINEL}${JSON.stringify(toDraft(lead))}`));
      } catch (err) {
        console.error("[chat] stream error", err);
        controller.enqueue(encoder.encode("\n\nSorry, I lost my train of thought. Please try again."));
      } finally {
        controller.close();
      }
    },
  });

  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store" },
  });
}

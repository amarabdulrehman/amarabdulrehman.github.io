import { GoogleGenAI } from "@google/genai";
import { buildSystemPrompt } from "@/lib/knowledge";

type ChatMessage = { role: "user" | "assistant"; content: string };

const MODEL = process.env.GEMINI_MODEL || "gemini-flash-latest";
const MAX_MESSAGES = 16;
const MAX_CHARS = 800;

// Best-effort per-IP limit (per server instance): 20 requests / 10 minutes.
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

export async function POST(req: Request) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
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

  const ai = new GoogleGenAI({ apiKey });

  try {
    const stream = await ai.models.generateContentStream({
      model: MODEL,
      contents: messages.map((m) => ({
        role: m.role === "assistant" ? "model" : "user",
        parts: [{ text: m.content }],
      })),
      config: {
        systemInstruction: buildSystemPrompt(),
        temperature: 0.4,
        maxOutputTokens: 600,
      },
    });

    const encoder = new TextEncoder();
    const body = new ReadableStream<Uint8Array>({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            const text = chunk.text;
            if (text) controller.enqueue(encoder.encode(text));
          }
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
  } catch (err) {
    console.error("[chat] request error", err);
    return Response.json({ error: "The assistant is unavailable right now. Please email Amar instead." }, { status: 502 });
  }
}

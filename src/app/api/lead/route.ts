import { validateLead, type Lead } from "@/lib/lead";
import { profile } from "@/lib/content";

/**
 * Sends a chatbot lead to Amar (and a confirmation to the visitor) through Resend.
 *
 * Env:
 *   RESEND_API_KEY  required
 *   LEAD_TO         where leads go (defaults to Amar's email)
 *   LEAD_FROM       sender, e.g. "Ask Amar <hello@amarabdurrehman.me>" once the domain is verified in Resend.
 *                   Until then Resend's test sender is used, which can only deliver to the Resend account's own
 *                   address, so the visitor confirmation is skipped.
 */

const TEST_FROM = "Ask Amar <onboarding@resend.dev>";

type Transcript = { role: "user" | "assistant"; content: string }[];

/* ---------- per-visitor limit: 3 leads an hour ---------- */
const WINDOW_MS = 60 * 60 * 1000;
const LIMIT = 3;
const hits = new Map<string, number[]>();
function rateLimited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) hits.clear();
  return recent.length > LIMIT;
}

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");

function parseTranscript(x: unknown): Transcript {
  if (!Array.isArray(x)) return [];
  return x
    .filter(
      (m): m is Transcript[number] =>
        !!m && typeof m === "object" && ((m as { role?: unknown }).role === "user" || (m as { role?: unknown }).role === "assistant") && typeof (m as { content?: unknown }).content === "string",
    )
    .slice(-20)
    .map((m) => ({ role: m.role, content: m.content.slice(0, 1500) }));
}

function row(label: string, value: string) {
  return `<tr><td style="padding:6px 16px 6px 0;color:#64646e;font:12px ui-monospace,Menlo,monospace;text-transform:uppercase;letter-spacing:.06em;vertical-align:top;white-space:nowrap">${label}</td><td style="padding:6px 0;font:15px -apple-system,Segoe UI,sans-serif;color:#111114">${value}</td></tr>`;
}

function shell(inner: string) {
  return `<div style="background:#f3f3f6;padding:32px 16px"><div style="max-width:560px;margin:0 auto;background:#fff;border-radius:16px;padding:28px;border:1px solid #e6e6ec">${inner}</div></div>`;
}

function leadEmail(lead: Lead, transcript: Transcript) {
  const wa = lead.phone ? `https://wa.me/${lead.phone.replace(/[^\d]/g, "")}` : "";
  const rows = [
    row("Name", esc(lead.name)),
    row("Email", `<a href="mailto:${esc(lead.email)}" style="color:#4b4be6">${esc(lead.email)}</a>`),
    lead.phone ? row("Phone", `${esc(lead.phone)} · <a href="${esc(wa)}" style="color:#4b4be6">WhatsApp</a>`) : "",
    lead.budget ? row("Budget", esc(lead.budget)) : "",
    row("Project", esc(lead.project).replace(/\n/g, "<br>")),
  ].join("");
  const chat = transcript.length
    ? `<p style="margin:28px 0 8px;font:12px ui-monospace,Menlo,monospace;color:#64646e;text-transform:uppercase;letter-spacing:.06em">The chat</p>` +
      transcript
        .map(
          (m) =>
            `<p style="margin:0 0 10px;font:14px/1.5 -apple-system,Segoe UI,sans-serif;color:${m.role === "user" ? "#111114" : "#64646e"}"><b>${m.role === "user" ? esc(lead.name) : "Ask Amar"}:</b> ${esc(m.content).replace(/\n/g, "<br>")}</p>`,
        )
        .join("")
    : "";
  const html = shell(
    `<p style="margin:0 0 4px;font:12px ui-monospace,Menlo,monospace;color:#5b5bf7;text-transform:uppercase;letter-spacing:.08em">New lead · Ask Amar</p>
     <h1 style="margin:0 0 20px;font:600 22px -apple-system,Segoe UI,sans-serif;color:#111114">${esc(lead.name)} wants to work with you</h1>
     <table style="border-collapse:collapse">${rows}</table>
     <p style="margin:24px 0 0;font:14px -apple-system,Segoe UI,sans-serif;color:#64646e">Hit reply to answer ${esc(lead.name)} directly.</p>
     ${chat}`,
  );
  const text = [
    `New lead from Ask Amar`,
    ``,
    `Name: ${lead.name}`,
    `Email: ${lead.email}`,
    lead.phone ? `Phone: ${lead.phone} (${wa})` : "",
    lead.budget ? `Budget: ${lead.budget}` : "",
    `Project: ${lead.project}`,
    transcript.length ? `\nThe chat:\n${transcript.map((m) => `${m.role === "user" ? lead.name : "Ask Amar"}: ${m.content}`).join("\n")}` : "",
  ]
    .filter(Boolean)
    .join("\n");
  return { html, text };
}

function confirmationEmail(lead: Lead) {
  const first = lead.name.split(" ")[0];
  const html = shell(
    `<h1 style="margin:0 0 16px;font:600 22px -apple-system,Segoe UI,sans-serif;color:#111114">Thanks, ${esc(first)}. Amar has your message.</h1>
     <p style="margin:0 0 16px;font:15px/1.6 -apple-system,Segoe UI,sans-serif;color:#333">He’ll reply to this email address personally. If you’d like a quicker chat, message him on WhatsApp: <a href="${profile.whatsappUrl}" style="color:#4b4be6">${profile.whatsapp}</a>.</p>
     <p style="margin:24px 0 8px;font:12px ui-monospace,Menlo,monospace;color:#64646e;text-transform:uppercase;letter-spacing:.06em">What you sent</p>
     <p style="margin:0;font:14px/1.6 -apple-system,Segoe UI,sans-serif;color:#64646e">${esc(lead.project).replace(/\n/g, "<br>")}${lead.budget ? `<br>Budget: ${esc(lead.budget)}` : ""}${lead.phone ? `<br>Phone: ${esc(lead.phone)}` : ""}</p>
     <p style="margin:28px 0 0;font:14px -apple-system,Segoe UI,sans-serif;color:#111114">— Amar Abdur Rehman<br><a href="${profile.site}" style="color:#4b4be6">${new URL(profile.site).host}</a></p>`,
  );
  const text = `Thanks, ${first}. Amar has your message.\n\nHe'll reply to this email address personally. For a quicker chat, message him on WhatsApp: ${profile.whatsappUrl} (${profile.whatsapp}).\n\nWhat you sent:\n${lead.project}${lead.budget ? `\nBudget: ${lead.budget}` : ""}${lead.phone ? `\nPhone: ${lead.phone}` : ""}\n\n— Amar Abdur Rehman\n${profile.site}`;
  return { html, text };
}

async function send(apiKey: string, payload: Record<string, unknown>) {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(`Resend ${res.status}: ${await res.text().catch(() => "")}`);
}

const FALLBACK = `Please email Amar at ${profile.email} or message him on WhatsApp: ${profile.whatsappUrl}`;

export async function POST(req: Request) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return Response.json({ error: `Sending isn’t set up yet. ${FALLBACK}` }, { status: 503 });

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (rateLimited(ip)) return Response.json({ error: `Too many requests. ${FALLBACK}` }, { status: 429 });

  let body: Record<string, unknown>;
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return Response.json({ error: "Invalid request." }, { status: 400 });
  }

  // Honeypot: real visitors never fill the hidden "website" field. Pretend success for bots.
  if (typeof body.website === "string" && body.website.trim()) return Response.json({ ok: true, confirmed: false });

  const v = validateLead(body.lead);
  if (!v.ok) return Response.json({ error: v.error }, { status: 400 });
  const lead = v.lead;
  const transcript = body.includeChat === true ? parseTranscript(body.transcript) : [];

  const to = process.env.LEAD_TO || profile.email;
  const from = process.env.LEAD_FROM || TEST_FROM;
  const canConfirm = !!process.env.LEAD_FROM && !from.includes("resend.dev");

  try {
    const mail = leadEmail(lead, transcript);
    await send(apiKey, {
      from,
      to: [to],
      reply_to: lead.email,
      subject: `New lead: ${lead.name} — ${lead.project.slice(0, 60)}${lead.project.length > 60 ? "…" : ""}`,
      html: mail.html,
      text: mail.text,
    });
  } catch (err) {
    console.error("[lead] send to Amar failed", err);
    return Response.json({ error: `Couldn’t send just now. ${FALLBACK}` }, { status: 502 });
  }

  let confirmed = false;
  if (canConfirm) {
    try {
      const mail = confirmationEmail(lead);
      await send(apiKey, {
        from,
        to: [lead.email],
        reply_to: to,
        subject: "Thanks — Amar has your message",
        html: mail.html,
        text: mail.text,
      });
      confirmed = true;
    } catch (err) {
      // Amar already has the lead; a failed confirmation shouldn't fail the request.
      console.error("[lead] confirmation failed", err);
    }
  }

  return Response.json({ ok: true, confirmed });
}

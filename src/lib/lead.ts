/**
 * A potential client or recruiter who wants to reach Amar through the chatbot.
 * Shared by the chat route (tool schema), the lead card (form) and /api/lead (validation).
 */

export type Lead = {
  name: string;
  email: string;
  project: string;
  budget?: string;
  phone?: string;
};

/** Separates the visible answer from the lead-card payload in the chat stream. */
export const LEAD_SENTINEL = "\u001eLEAD";

export const LEAD_LIMITS = { name: 100, email: 200, project: 2000, budget: 100, phone: 40 } as const;

const EMAIL_RE = /^[^\s@<>()[\]\\,;:"]+@[^\s@<>()[\]\\,;:"]+\.[^\s@<>()[\]\\,;:"]{2,}$/;
const PHONE_RE = /^[+()\-.\s\d]{6,40}$/;

const clean = (v: unknown, max: number) => (typeof v === "string" ? v.replace(/\s+/g, " ").trim().slice(0, max) : "");

/** Best-effort draft from whatever the model passed; every field may be empty. */
export function toDraft(x: unknown): Partial<Lead> {
  const o = (x && typeof x === "object" ? x : {}) as Record<string, unknown>;
  return {
    name: clean(o.name, LEAD_LIMITS.name),
    email: clean(o.email, LEAD_LIMITS.email),
    project: typeof o.project === "string" ? o.project.trim().slice(0, LEAD_LIMITS.project) : "",
    budget: clean(o.budget, LEAD_LIMITS.budget),
    phone: clean(o.phone, LEAD_LIMITS.phone),
  };
}

/** Strict check used before anything is emailed. */
export function validateLead(x: unknown): { ok: true; lead: Lead } | { ok: false; error: string } {
  const d = toDraft(x);
  if (!d.name) return { ok: false, error: "Please add your name." };
  if (!d.email || !EMAIL_RE.test(d.email)) return { ok: false, error: "Please add a valid email address." };
  if (!d.project || d.project.length < 3) return { ok: false, error: "Please add a line about what you need." };
  if (d.phone && !PHONE_RE.test(d.phone)) return { ok: false, error: "That phone number doesn’t look right." };
  return {
    ok: true,
    lead: { name: d.name, email: d.email, project: d.project, budget: d.budget || undefined, phone: d.phone || undefined },
  };
}

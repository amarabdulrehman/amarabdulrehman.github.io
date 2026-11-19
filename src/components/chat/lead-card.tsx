"use client";

import { motion, useReducedMotion } from "motion/react";
import { Check, Loader2, Send } from "lucide-react";
import { useState, type ReactNode } from "react";
import { profile } from "@/lib/content";
import { LEAD_LIMITS, validateLead, type Lead } from "@/lib/lead";
import { cn } from "@/lib/utils";
import { useChat } from "./chat-context";

type Status = "idle" | "sending" | "sent" | "error";

function Field({ label, optional, children }: { label: string; optional?: boolean; children: ReactNode }) {
  return (
    <label className="grid gap-1">
      <span className="font-mono text-[10.5px] uppercase tracking-[0.08em] text-muted">
        {label}
        {optional && <span className="normal-case tracking-normal text-muted/70"> · optional</span>}
      </span>
      {children}
    </label>
  );
}

const input =
  "w-full rounded-xl border border-line bg-bg px-3 py-2 text-[14px] text-fg outline-none transition-colors placeholder:text-muted/60 focus:border-accent";

/** Editable contact card the assistant shows; nothing is sent until the visitor presses Send. */
export function LeadCard({ draft }: { draft: Partial<Lead> }) {
  const { messages, append } = useChat();
  const reduce = useReducedMotion();
  const [form, setForm] = useState({
    name: draft.name ?? "",
    email: draft.email ?? "",
    project: draft.project ?? "",
    budget: draft.budget ?? "",
    phone: draft.phone ?? "",
  });
  const [includeChat, setIncludeChat] = useState(true);
  const [honey, setHoney] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const v = validateLead(form);
    if (!v.ok) {
      setError(v.error);
      return;
    }
    setStatus("sending");
    setError(null);
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lead: v.lead,
          includeChat,
          transcript: messages.filter((m) => m.content).map(({ role, content }) => ({ role, content })),
          website: honey,
        }),
      });
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; confirmed?: boolean; error?: string };
      if (!res.ok || !data.ok) throw new Error(data.error ?? "Couldn’t send just now.");
      setStatus("sent");
      append({
        role: "assistant",
        content: `Done, ${v.lead.name.split(" ")[0]}! Amar has your details and will email you at ${v.lead.email}.${
          data.confirmed ? " A confirmation is on its way to your inbox." : ""
        }\n\nWant a quicker reply? Message him on WhatsApp: ${profile.whatsappUrl}`,
      });
    } catch (err) {
      setStatus("error");
      setError((err as Error).message);
    }
  };

  if (status === "sent") {
    return (
      <div className="flex items-center gap-2 rounded-2xl border border-line bg-bg px-4 py-3 text-[14px]">
        <span className="grid size-6 place-items-center rounded-full bg-emerald-500 text-white">
          <Check className="size-3.5" />
        </span>
        Sent to Amar
      </div>
    );
  }

  return (
    <motion.form
      onSubmit={submit}
      initial={reduce ? false : { opacity: 0, y: 10, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: "spring", stiffness: 380, damping: 30 }}
      className="ai-glow rounded-2xl [--glow-opacity:0.3]"
      aria-label="Send your details to Amar"
    >
      <div className="grid gap-3 rounded-2xl bg-card p-4">
        <div>
          <p className="text-[15px] font-semibold">Send your details to Amar</p>
          <p className="text-[12.5px] text-muted">Check them over. Nothing is sent until you press Send.</p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Name">
            <input className={input} value={form.name} onChange={set("name")} maxLength={LEAD_LIMITS.name} autoComplete="name" required />
          </Field>
          <Field label="Email">
            <input className={input} type="email" value={form.email} onChange={set("email")} maxLength={LEAD_LIMITS.email} autoComplete="email" required />
          </Field>
        </div>
        <Field label="Project or role">
          <textarea
            className={cn(input, "min-h-[72px] resize-y")}
            value={form.project}
            onChange={set("project")}
            maxLength={LEAD_LIMITS.project}
            required
          />
        </Field>
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Budget" optional>
            <input className={input} value={form.budget} onChange={set("budget")} maxLength={LEAD_LIMITS.budget} placeholder="e.g. $500" />
          </Field>
          <Field label="Phone / WhatsApp" optional>
            <input className={input} type="tel" value={form.phone} onChange={set("phone")} maxLength={LEAD_LIMITS.phone} autoComplete="tel" placeholder="+1 555 123 4567" />
          </Field>
        </div>

        {/* honeypot: hidden from people, tempting to bots */}
        <input
          type="text"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden
          value={honey}
          onChange={(e) => setHoney(e.target.value)}
          className="absolute -left-[9999px] h-0 w-0 opacity-0"
        />

        <label className="flex items-start gap-2 text-[12.5px] text-muted">
          <input type="checkbox" checked={includeChat} onChange={(e) => setIncludeChat(e.target.checked)} className="mt-0.5 accent-[var(--accent)]" />
          Include this chat so Amar has the context
        </label>

        {error && (
          <p className="text-[13px] text-red-500" role="alert">
            {error}
          </p>
        )}

        <button type="submit" disabled={status === "sending"} className="btn-primary h-10 w-full text-[15px] disabled:opacity-60">
          {status === "sending" ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
          {status === "sending" ? "Sending…" : "Send to Amar"}
        </button>
        <p className="text-center text-[11.5px] text-muted">
          Your details go only to Amar, by email. Prefer WhatsApp?{" "}
          <a href={profile.whatsappUrl} target="_blank" rel="noopener noreferrer" className="text-accent-text hover:underline">
            {profile.whatsapp}
          </a>
        </p>
      </div>
    </motion.form>
  );
}

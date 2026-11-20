"use client";

import { ArrowUpRight, Check, ClipboardCopy, Sparkles, Target, X } from "lucide-react";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import { profile } from "@/lib/content";
import { matchRole, PRESETS } from "@/lib/match";
import { cn } from "@/lib/utils";
import { ChatPanel } from "./chat/chat-panel";
import { useChat, type DrawerTab } from "./chat/chat-context";
import { Modal } from "./ui/modal";

const TABS: { id: DrawerTab; label: string; icon: typeof Target }[] = [
  { id: "fit", label: "Role fit", icon: Target },
  { id: "ask", label: "Ask Amar’s Stack", icon: Sparkles },
];

export function RoleFitDrawer() {
  const { open, setOpen, tab, setTab, openFit } = useChat();
  const base = useId();

  // /?match=1 (from the case-study footer) opens the matcher straight away
  useEffect(() => {
    const url = new URL(window.location.href);
    if (url.searchParams.get("match") !== "1") return;
    url.searchParams.delete("match");
    window.history.replaceState(null, "", url);
    openFit();
  }, [openFit]);

  return (
    <Modal open={open} onClose={() => setOpen(false)} label="Role-Fit Matcher and Ask Amar" variant="drawer">
      <div className="flex h-full flex-col border-l border-line bg-card shadow-2xl">
        <div className="flex items-center justify-between gap-3 border-b border-line px-4 py-3 sm:px-5">
          <div role="tablist" aria-label="Drawer sections" className="flex rounded-full bg-fg/[0.06] p-1">
            {TABS.map((t) => {
              const on = tab === t.id;
              return (
                <button
                  key={t.id}
                  id={`${base}-${t.id}-tab`}
                  role="tab"
                  type="button"
                  aria-selected={on}
                  aria-controls={`${base}-${t.id}-panel`}
                  onClick={() => setTab(t.id)}
                  onKeyDown={(e) => {
                    if (e.key === "ArrowRight" || e.key === "ArrowLeft") setTab(tab === "fit" ? "ask" : "fit");
                  }}
                  tabIndex={on ? 0 : -1}
                  className={cn(
                    "flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[13px] font-medium transition-colors duration-150 ease-out",
                    on ? "bg-card text-fg shadow-sm" : "text-muted hover:text-fg",
                  )}
                >
                  <t.icon className="size-3.5" /> {t.label}
                </button>
              );
            })}
          </div>
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close"
            className="grid size-9 place-items-center rounded-full text-muted transition-colors duration-150 hover:bg-fg/[0.07] hover:text-fg"
          >
            <X className="size-4" />
          </button>
        </div>

        <div
          id={`${base}-${tab}-panel`}
          role="tabpanel"
          aria-labelledby={`${base}-${tab}-tab`}
          className="min-h-0 flex-1"
        >
          {tab === "fit" ? <RoleFit /> : <ChatPanel className="h-full" autoFocus />}
        </div>
      </div>
    </Modal>
  );
}

function RoleFit() {
  const { fitSeed } = useChat();
  const [jd, setJd] = useState(fitSeed ?? "");
  const [role, setRole] = useState<string | undefined>(PRESETS.find((p) => p.jd === fitSeed)?.label);
  const [copied, setCopied] = useState(false);
  const field = useRef<HTMLTextAreaElement>(null);
  const result = useMemo(() => (jd.trim().length > 20 ? matchRole(jd, role) : null), [jd, role]);

  useEffect(() => {
    if (!fitSeed) field.current?.focus({ preventScroll: true });
  }, [fitSeed]);

  const copy = async () => {
    if (!result) return;
    try {
      await navigator.clipboard.writeText(result.pitch);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {}
  };

  return (
    <div className="h-full overflow-y-auto px-4 py-5 sm:px-6">
      <h2 className="text-[20px] font-semibold tracking-[-0.02em]">Role-Fit Matcher</h2>
      <p className="mt-1 text-[14px] leading-relaxed text-muted">
        Paste a job description. It’s scored in your browser against Amar’s real stack and shipped projects; nothing is sent anywhere.
      </p>

      <div className="mt-4 flex flex-wrap gap-2" aria-label="Preset roles">
        {PRESETS.map((p) => (
          <button
            key={p.label}
            type="button"
            aria-pressed={role === p.label}
            onClick={() => {
              setJd(p.jd);
              setRole(p.label);
            }}
            className={cn(
              "rounded-full px-3 py-1.5 font-mono text-[12px] transition-colors duration-150 ease-out",
              role === p.label ? "bg-accent text-accent-fg" : "bg-fg/[0.05] text-muted shadow-[inset_0_0_0_1px_var(--line)] hover:text-fg",
            )}
          >
            {p.label}
          </button>
        ))}
      </div>

      <label htmlFor="jd" className="sr-only">
        Job description
      </label>
      <textarea
        id="jd"
        ref={field}
        value={jd}
        onChange={(e) => {
          setJd(e.target.value);
          setRole(undefined);
        }}
        rows={6}
        maxLength={8000}
        placeholder="Paste the job description here…"
        className="mt-3 w-full resize-y rounded-2xl border border-line bg-bg px-4 py-3 text-[14px] leading-relaxed outline-none transition-colors duration-150 placeholder:text-muted focus:border-accent"
      />

      <div aria-live="polite">
        {!result ? (
          <p className="mt-4 text-[13px] text-muted">Pick a preset or paste at least a sentence to see the match.</p>
        ) : result.matched.length === 0 ? (
          <p className="mt-4 rounded-2xl border border-line p-4 text-[14px] text-muted">
            No overlap with Amar’s listed stack in this description. Try the “Ask Amar’s Stack” tab, or email {profile.email}.
          </p>
        ) : (
          <div className="mt-5 grid gap-5">
            <div className="flex items-end justify-between gap-4 border-b border-line pb-4">
              <div>
                <p className="eyebrow">Stack coverage</p>
                <p className="mt-1 font-mono text-[34px] font-semibold leading-none tracking-[-0.04em] tabular-nums">{result.score}%</p>
              </div>
              <p className="max-w-[14rem] text-right text-[12px] leading-relaxed text-muted">
                of the tools this JD names that Amar’s shipped with
              </p>
            </div>

            <div>
              <p className="eyebrow">Matched ({result.matched.length})</p>
              <ul className="mt-2 flex flex-wrap gap-1.5">
                {result.matched.map((m) => (
                  <li key={m} className="rounded-full bg-accent/10 px-2.5 py-1 font-mono text-[12px] text-accent-text">
                    {m}
                  </li>
                ))}
              </ul>
              {result.gaps.length > 0 && (
                <>
                  <p className="eyebrow mt-4">Not on his list yet</p>
                  <ul className="mt-2 flex flex-wrap gap-1.5">
                    {result.gaps.map((m) => (
                      <li key={m} className="rounded-full px-2.5 py-1 font-mono text-[12px] text-muted shadow-[inset_0_0_0_1px_var(--line)]">
                        {m}
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>

            <div>
              <p className="eyebrow">Most relevant work</p>
              <ol className="mt-2 grid gap-2">
                {result.top.map((p, i) => (
                  <li key={p.key} className="rounded-2xl border border-line bg-bg p-4">
                    <div className="flex items-center justify-between gap-3">
                      <p className="font-semibold">
                        <span className="mr-2 font-mono text-[12px] text-accent-text">0{i + 1}</span>
                        {p.title}
                      </p>
                      <a
                        href={p.link}
                        target={p.link.includes("vercel.app") ? "_blank" : undefined}
                        rel="noopener noreferrer"
                        className="link-arrow shrink-0 text-[13px]"
                      >
                        View <ArrowUpRight className="size-3.5" />
                      </a>
                    </div>
                    <p className="mt-1.5 text-[14px] leading-relaxed text-muted">{p.why}</p>
                  </li>
                ))}
              </ol>
            </div>

            <div className="rounded-2xl border border-line bg-bg-alt p-4">
              <div className="flex items-center justify-between gap-3">
                <p className="eyebrow">Tailored pitch</p>
                <button type="button" onClick={copy} className="btn-primary h-9 px-4 text-[14px]">
                  {copied ? <Check className="size-4" /> : <ClipboardCopy className="size-4" />}
                  {copied ? "Copied" : "Copy Tailored Pitch"}
                </button>
              </div>
              <pre className="mt-3 whitespace-pre-wrap font-mono text-[12px] leading-relaxed text-muted">{result.pitch}</pre>
              <span role="status" className="sr-only">
                {copied ? "Pitch copied to clipboard" : ""}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

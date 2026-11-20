"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowUp, ArrowUpRight, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { suggestedQuestions } from "@/lib/content";
import { cn } from "@/lib/utils";
import { EASE } from "../motion";
import { useChat } from "./chat-context";

const PLACEHOLDERS = [
  "Ask me anything about Amar…",
  "Is he available for remote roles?",
  "What has he shipped to real users?",
  "What’s his experience with AI?",
];

/** Rotates the placeholder like a typing hint, pausing while the field has text. */
function usePlaceholder(paused: boolean) {
  const [i, setI] = useState(0);
  const reduce = useReducedMotion();
  useEffect(() => {
    if (paused || reduce) return;
    const t = setInterval(() => setI((n) => (n + 1) % PLACEHOLDERS.length), 3200);
    return () => clearInterval(t);
  }, [paused, reduce]);
  return PLACEHOLDERS[i];
}

/** The hero's "Ask me anything" bar. Submitting opens the docked chat with the answer streaming in. */
export function HeroAsk() {
  const { send, setOpen, status } = useChat();
  const [value, setValue] = useState("");
  const reduce = useReducedMotion();
  const placeholder = usePlaceholder(value.length > 0);

  const ask = (text: string) => {
    const q = text.trim();
    if (!q || status === "streaming") return;
    setValue("");
    setOpen(true);
    void send(q);
  };

  return (
    <div className="w-full max-w-xl">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          ask(value);
        }}
        className="ai-glow rounded-full"
      >
        <div className="flex items-center gap-3 rounded-full bg-card/95 py-2 pl-5 pr-2 shadow-[0_30px_60px_-30px_rgb(0_0_0/0.35)]">
          <Sparkles aria-hidden className="size-5 shrink-0 text-accent" />
          <label htmlFor="hero-ask" className="sr-only">Ask a question about Amar</label>
          <div className="relative min-w-0 flex-1">
            <input
              id="hero-ask"
              value={value}
              maxLength={800}
              autoComplete="off"
              onChange={(e) => setValue(e.target.value)}
              className="peer h-11 w-full bg-transparent text-[17px] text-fg outline-none"
            />
            {/* animated placeholder */}
            {!value && (
              <AnimatePresence initial={false}>
                <motion.span
                  key={placeholder}
                  aria-hidden
                  initial={reduce ? false : { opacity: 0, y: 8, filter: "blur(4px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={reduce ? undefined : { opacity: 0, y: -8, filter: "blur(4px)" }}
                  transition={{ duration: 0.45, ease: EASE }}
                  className="pointer-events-none absolute inset-y-0 left-0 flex items-center truncate text-[17px] text-muted"
                >
                  {placeholder}
                </motion.span>
              </AnimatePresence>
            )}
          </div>
          <button
            type="submit"
            disabled={!value.trim()}
            aria-label="Ask"
            className="grid size-11 shrink-0 place-items-center rounded-full bg-fg text-bg transition-all duration-500 ease-[var(--ease-fluid)] hover:scale-105 active:scale-95 disabled:bg-fg/10 disabled:text-muted"
          >
            <ArrowUp className="size-5" />
          </button>
        </div>
      </form>

      <ul className="mt-4 flex flex-wrap gap-2" aria-label="Suggested questions">
        {suggestedQuestions.map((q, i) => (
          <motion.li
            key={q}
            initial={reduce ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE, delay: 0.9 + i * 0.07 }}
          >
            <button
              type="button"
              onClick={() => ask(q)}
              className="rounded-full bg-fg/[0.04] px-3 py-1.5 font-mono text-[12px] text-muted shadow-[inset_0_0_0_1px_var(--line)] transition-all duration-300 hover:bg-fg/[0.09] hover:text-fg active:scale-[0.97]"
            >
              {q}
            </button>
          </motion.li>
        ))}
      </ul>
    </div>
  );
}

/** Bento tile that invites a question, used in the "At a glance" grid. */
export function AskTile({ className }: { className?: string }) {
  const { setOpen } = useChat();
  return (
    <button
      type="button"
      onClick={() => setOpen(true)}
      className={cn("ai-glow group block h-full w-full rounded-[calc(2rem-0.375rem)] text-left [--glow-opacity:0.35]", className)}
    >
      <span className="theme-dark flex h-full flex-col justify-between rounded-[inherit] bg-bg p-8 text-fg">
      <span className="grid size-11 place-items-center rounded-2xl bg-accent text-accent-fg">
        <Sparkles className="size-5" />
      </span>
      <span className="mt-10 block">
        <span className="block text-[24px] font-semibold leading-tight tracking-[-0.03em]">
          Skip the scrolling.
          <br />
          <span className="text-muted">Ask my AI anything.</span>
        </span>
        <span className="mt-5 inline-flex items-center gap-2 text-[15px] font-medium text-link">
          Open Ask Amar
          <ArrowUpRight className="size-4 transition-transform duration-500 ease-[var(--ease-fluid)] group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </span>
      </span>
      </span>
    </button>
  );
}

/** Plain button that opens the Ask tab of the drawer (for server-rendered sections). */
export function AskButton({ className, children }: { className?: string; children: React.ReactNode }) {
  const { setOpen } = useChat();
  return (
    <button type="button" onClick={() => setOpen(true)} className={className}>
      {children}
    </button>
  );
}

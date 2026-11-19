"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowUp, RotateCcw, Sparkles, Square } from "lucide-react";
import Image from "next/image";
import { Fragment, useEffect, useRef, useState, type ReactNode } from "react";
import { profile, suggestedQuestions } from "@/lib/content";
import { cn } from "@/lib/utils";
import { useChat, type Msg } from "./chat-context";

const LINK_RE = /(https?:\/\/[^\s)]+|[\w.+-]+@[\w-]+\.[\w.-]+|\/(?:cv|toffeeos-case-study)\.pdf)/g;

function linkify(text: string): ReactNode[] {
  return text.split(LINK_RE).map((part, i) => {
    if (i % 2 === 0) return <Fragment key={i}>{part}</Fragment>;
    const clean = part.replace(/[.,;:]+$/, "");
    const trail = part.slice(clean.length);
    const href = clean.includes("@") && !clean.startsWith("http") ? `mailto:${clean}` : clean;
    return (
      <Fragment key={i}>
        <a href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer" className="text-link underline-offset-2 hover:underline">
          {clean.replace(/^https?:\/\//, "").replace(/\/$/, "")}
        </a>
        {trail}
      </Fragment>
    );
  });
}

function Rich({ text }: { text: string }) {
  const blocks = text.replace(/\*\*/g, "").split(/\n{2,}/);
  return (
    <>
      {blocks.map((b, i) => {
        const lines = b.split("\n").filter(Boolean);
        if (lines.length && lines.every((l) => /^\s*[-•*]\s+/.test(l))) {
          return (
            <ul key={i} className="my-1.5 list-disc space-y-1 pl-5">
              {lines.map((l, j) => (
                <li key={j}>{linkify(l.replace(/^\s*[-•*]\s+/, ""))}</li>
              ))}
            </ul>
          );
        }
        return (
          <p key={i} className="my-1.5 first:mt-0 last:mb-0">
            {lines.map((l, j) => (
              <Fragment key={j}>
                {j > 0 && <br />}
                {linkify(l.replace(/^\s*[-•*]\s+/, "• "))}
              </Fragment>
            ))}
          </p>
        );
      })}
    </>
  );
}

function Bubble({ m, streaming }: { m: Msg; streaming: boolean }) {
  const reduce = useReducedMotion();
  const mine = m.role === "user";
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 10, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: "spring", stiffness: 380, damping: 30 }}
      className={cn("flex", mine ? "justify-end" : "justify-start")}
    >
      <div
        className={cn(
          "max-w-[85%] rounded-[20px] px-4 py-2.5 text-[15px] leading-relaxed",
          mine ? "rounded-br-md bg-accent text-accent-fg" : "rounded-bl-md bg-fg/[0.06] text-fg",
        )}
      >
        {m.content ? (
          mine ? m.content : <Rich text={m.content} />
        ) : streaming ? (
          <span className="flex gap-1 py-1.5" aria-label="Typing">
            {[0, 1, 2].map((i) => (
              <span key={i} className="size-1.5 animate-bounce rounded-full bg-muted" style={{ animationDelay: `${i * 0.15}s` }} />
            ))}
          </span>
        ) : null}
      </div>
    </motion.div>
  );
}

export function ChatPanel({ className, autoFocus }: { className?: string; autoFocus?: boolean }) {
  const { messages, status, error, send, stop, reset } = useChat();
  const [input, setInput] = useState("");
  const scroller = useRef<HTMLDivElement>(null);
  const field = useRef<HTMLTextAreaElement>(null);
  const streaming = status === "streaming";

  useEffect(() => {
    const el = scroller.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (autoFocus) field.current?.focus({ preventScroll: true });
  }, [autoFocus]);

  const submit = (text: string) => {
    if (!text.trim() || streaming) return;
    setInput("");
    void send(text);
  };

  return (
    <div className={cn("flex min-h-0 flex-col", className)}>
      {/* header */}
      <div className="flex items-center gap-3 border-b border-line px-5 py-3.5">
        <div className="relative size-9 shrink-0 overflow-hidden rounded-full bg-bg-alt">
          <Image src={profile.portrait} alt="" fill sizes="36px" className="object-cover object-top" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[15px] font-semibold leading-tight">Ask Amar</p>
          <p className="truncate text-[12px] text-muted">AI assistant · answers from Amar’s portfolio</p>
        </div>
        {messages.length > 0 && (
          <button type="button" onClick={reset} aria-label="New conversation" className="grid size-8 place-items-center rounded-full text-muted hover:bg-fg/[0.07] hover:text-fg">
            <RotateCcw className="size-4" />
          </button>
        )}
      </div>

      {/* messages */}
      <div ref={scroller} className="min-h-0 flex-1 space-y-3 overflow-y-auto px-4 py-5" aria-live="polite">
        {messages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center text-center">
            <span className="grid size-12 place-items-center rounded-2xl bg-gradient-to-br from-[#0071e3] to-[#bf5af2] text-white">
              <Sparkles className="size-5" />
            </span>
            <p className="mt-4 text-[17px] font-semibold">Hi, I’m Amar’s assistant.</p>
            <p className="mt-1 max-w-xs text-[14px] text-muted">Ask about his projects, skills, experience or availability.</p>
            <div className="mt-6 flex flex-wrap justify-center gap-2">
              {suggestedQuestions.map((q) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => submit(q)}
                  className="rounded-full border border-line px-3.5 py-1.5 text-[13px] transition-colors hover:border-accent hover:text-link"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((m, i) => <Bubble key={m.id} m={m} streaming={streaming && i === messages.length - 1} />)
        )}
        <AnimatePresence>
          {error && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center text-[13px] text-red-500">
              {error}
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      {/* composer */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          submit(input);
        }}
        className="border-t border-line p-3"
      >
        <div className="flex items-end gap-2 rounded-[22px] border border-line bg-bg px-3 py-2 transition-colors focus-within:border-accent">
          <label htmlFor="ask-input" className="sr-only">Ask a question about Amar</label>
          <textarea
            id="ask-input"
            ref={field}
            rows={1}
            value={input}
            maxLength={800}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                submit(input);
              }
            }}
            placeholder="Ask anything about Amar…"
            className="max-h-32 min-h-[28px] flex-1 resize-none bg-transparent py-1 text-[15px] outline-none placeholder:text-muted"
            style={{ fieldSizing: "content" } as React.CSSProperties}
          />
          {streaming ? (
            <button type="button" onClick={stop} aria-label="Stop" className="grid size-8 shrink-0 place-items-center rounded-full bg-fg text-bg">
              <Square className="size-3 fill-current" />
            </button>
          ) : (
            <button
              type="submit"
              disabled={!input.trim()}
              aria-label="Send"
              className="grid size-8 shrink-0 place-items-center rounded-full bg-accent text-accent-fg transition-opacity disabled:opacity-30"
            >
              <ArrowUp className="size-4" />
            </button>
          )}
        </div>
        <p className="mt-2 text-center text-[11px] text-muted">AI can make mistakes. For anything important, email Amar.</p>
      </form>
    </div>
  );
}

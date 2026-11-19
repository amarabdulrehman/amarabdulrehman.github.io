"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { CalendarDays, FileText, MessageCircle, Mic, Sparkles, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Reveal } from "../motion";
import { ChatPanel } from "./chat-panel";

const COMING = [
  { icon: CalendarDays, label: "Book a call with Amar" },
  { icon: FileText, label: "Get a tailored CV for your role" },
  { icon: Mic, label: "Ask out loud with voice" },
];

/** The on-page "Ask Amar" section. */
export function AskAmar() {
  return (
    <section id="ask" aria-labelledby="ask-title" className="relative overflow-hidden py-28 sm:py-36">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-60 dark:opacity-30"
        style={{
          background:
            "radial-gradient(40% 50% at 80% 40%, rgb(191 90 242 / 0.18), transparent 70%), radial-gradient(40% 50% at 20% 60%, rgb(0 113 227 / 0.18), transparent 70%)",
        }}
      />
      <div className="container-apple grid items-center gap-12 md:grid-cols-[0.9fr_1.1fr]">
        <Reveal>
          <p className="eyebrow inline-flex items-center gap-1.5">
            <Sparkles className="size-3.5" /> New · AI assistant
          </p>
          <h2 id="ask-title" className="headline-lg mt-3 text-balance">
            Ask Amar.{" "}
            <span className="bg-gradient-to-r from-[#0071e3] via-[#5e5ce6] to-[#bf5af2] bg-clip-text text-transparent">
              Anything.
            </span>
          </h2>
          <p className="lede mt-5">
            Recruiters, skip the scrolling. Ask about projects, skills, experience or availability, and get an answer
            grounded in this portfolio.
          </p>
          <div className="mt-10">
            <p className="eyebrow">Coming soon</p>
            <ul className="mt-4 grid gap-3">
              {COMING.map(({ icon: Icon, label }) => (
                <li key={label} className="flex items-center gap-3 text-[15px] text-muted">
                  <span className="grid size-8 place-items-center rounded-full bg-fg/[0.06]">
                    <Icon className="size-4" />
                  </span>
                  {label}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="h-[600px] overflow-hidden rounded-[32px] border border-line bg-glass shadow-[var(--shadow)] backdrop-blur-2xl">
            <ChatPanel className="h-full" />
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/** Floating launcher that opens the same conversation anywhere on the page. */
export function ChatLauncher() {
  const [open, setOpen] = useState(false);
  const [visible, setVisible] = useState(false);
  const reduce = useReducedMotion();

  useEffect(() => {
    const ask = document.getElementById("ask");
    let askInView = false;
    const update = () => setVisible(window.scrollY > window.innerHeight * 0.8 && !askInView);
    const io = new IntersectionObserver(([e]) => {
      askInView = e.isIntersecting;
      if (askInView) setOpen(false);
      update();
    }, { threshold: 0.15 });
    if (ask) io.observe(ask);
    window.addEventListener("scroll", update, { passive: true });
    update();
    return () => {
      io.disconnect();
      window.removeEventListener("scroll", update);
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            role="dialog"
            aria-label="Ask Amar"
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 24, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: 24, scale: 0.94 }}
            transition={{ type: "spring", stiffness: 360, damping: 30 }}
            style={{ transformOrigin: "bottom right" }}
            className="fixed inset-x-3 bottom-24 z-50 h-[min(600px,calc(100dvh-8rem))] overflow-hidden rounded-[28px] border border-line bg-glass shadow-2xl backdrop-blur-2xl backdrop-saturate-[1.8] sm:inset-x-auto sm:right-6 sm:w-[400px]"
          >
            <ChatPanel className="h-full" autoFocus />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {(visible || open) && (
          <motion.button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-label={open ? "Close Ask Amar" : "Open Ask Amar"}
            initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.6, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.6, y: 20 }}
            whileHover={reduce ? undefined : { scale: 1.06 }}
            whileTap={{ scale: 0.94 }}
            transition={{ type: "spring", stiffness: 400, damping: 26 }}
            className="fixed bottom-6 right-4 z-50 flex h-14 items-center gap-2 rounded-full bg-accent pl-4 pr-5 text-accent-fg shadow-[0_12px_32px_-8px_rgb(0_113_227/0.6)] sm:right-6"
          >
            {open ? <X className="size-5" /> : <MessageCircle className="size-5" />}
            <span className="text-[15px] font-medium">{open ? "Close" : "Ask Amar"}</span>
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
}

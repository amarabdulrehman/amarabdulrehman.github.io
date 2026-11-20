"use client";

import { FlaskConical, X } from "lucide-react";
import { useApp } from "./app-state";
import { Modal } from "./ui/modal";

const TIMELINE = [
  {
    k: "Signal",
    v: "A pre-release run of the end-to-end suite failed on a checkout flow: the bill’s database transaction hit Prisma’s interactive-transaction time limit and was aborted.",
  },
  {
    k: "Why it mattered",
    v: "At the till, mid-rush, that would have meant a failed checkout on a real customer’s order. In the test run, it meant a red build.",
  },
  {
    k: "What the tests proved",
    v: "Because the write was a single transaction, the timeout rolled everything back: no half-written bill, no orphaned line items, no tax row without its order.",
  },
  {
    k: "Fix",
    v: "Keep the transaction to the writes that must succeed together, do slower work outside it, and retry the whole bill safely if it’s aborted. The suite then went green and the release shipped.",
  },
];

/** `inspect prisma-timeout`: the anonymised story of the bug the test suite caught. */
export function PrismaStory() {
  const { storyOpen, setStoryOpen } = useApp();
  return (
    <Modal open={storyOpen} onClose={() => setStoryOpen(false)} label="Prisma transaction timeout: caught before production">
      <article className="overflow-hidden rounded-[22px] border border-line bg-card shadow-2xl">
        <header className="flex items-start justify-between gap-4 border-b border-line px-6 py-5">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.1em] text-accent-text">$ inspect prisma-timeout</p>
            <h2 className="mt-2 text-[22px] font-semibold leading-tight tracking-[-0.02em]">The bug that never reached the till.</h2>
            <p className="mt-1 text-[14px] text-muted">ToffeeOS · anonymised · caught pre-release</p>
          </div>
          <button
            type="button"
            onClick={() => setStoryOpen(false)}
            aria-label="Close"
            className="grid size-9 shrink-0 place-items-center rounded-full text-muted transition-colors duration-150 hover:bg-fg/[0.07] hover:text-fg"
          >
            <X className="size-4" />
          </button>
        </header>

        <div className="grid grid-cols-3 border-b border-line font-mono">
          {[
            ["333", "Playwright E2E"],
            ["228", "Vitest unit"],
            ["0", "bills lost"],
          ].map(([v, l], i) => (
            <p key={l} className={`flex flex-col px-6 py-4 ${i ? "border-l border-line" : ""}`}>
              <span className="text-[24px] font-semibold leading-none tabular-nums">{v}</span>{" "}
              <span className="mt-1.5 text-[10.5px] uppercase tracking-[0.08em] text-muted">{l}</span>
            </p>
          ))}
        </div>

        <ol className="grid gap-4 px-6 py-5">
          {TIMELINE.map((s, i) => (
            <li key={s.k} className="grid grid-cols-[1.75rem_1fr] gap-3">
              <span className="grid size-7 place-items-center rounded-full bg-accent/10 font-mono text-[11px] font-semibold text-accent-text">{i + 1}</span>
              <div>
                <p className="text-[15px] font-semibold">{s.k}</p>
                <p className="mt-1 text-[14px] leading-relaxed text-muted">{s.v}</p>
              </div>
            </li>
          ))}
        </ol>

        <pre className="mx-6 mb-6 overflow-x-auto rounded-xl bg-bg-alt px-4 py-3 font-mono text-[12px] leading-relaxed text-muted">
          <span className="text-fg">✗</span> checkout › rings up a bill and writes tax{"\n"}
          {"  "}Transaction aborted: interactive transaction timed out{"\n"}
          {"  "}<span className="text-emerald-600 dark:text-emerald-400">rolled back · 0 rows written</span>
          {"\n\n"}
          <span className="text-emerald-600 dark:text-emerald-400">✓</span> 561 passed · release unblocked
        </pre>
        <p className="flex items-center gap-2 border-t border-line px-6 py-4 text-[12px] text-muted">
          <FlaskConical className="size-3.5" /> Replay it live with “Simulate DB Timeout” in the ToffeeOS lab.
        </p>
      </article>
    </Modal>
  );
}

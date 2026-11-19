"use client";

import { motion, useReducedMotion } from "motion/react";
import { SECTIONS } from "@/lib/sections";
import { cn } from "@/lib/utils";
import { useActiveSection } from "./use-active-section";

/** Numbered table of contents pinned to the left on wide screens. */
export function SectionIndex() {
  const active = useActiveSection();
  const reduce = useReducedMotion();
  const idx = SECTIONS.findIndex((s) => s.id === active);

  return (
    <motion.nav
      aria-label="Sections"
      initial={false}
      animate={{ opacity: active ? 1 : 0, x: active || reduce ? 0 : -8 }}
      transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
      className={cn("fixed left-6 top-1/2 z-40 hidden -translate-y-1/2 min-[1400px]:block", !active && "pointer-events-none")}
    >
      <ol className="relative grid gap-1 rounded-r-xl border-l border-line bg-glass py-2 pl-4 pr-4 font-mono text-[11px] uppercase tracking-[0.08em] backdrop-blur-xl">
        {/* progress fill */}
        <span
          aria-hidden
          className="absolute -left-px top-0 w-px bg-accent transition-[height] duration-500 ease-[var(--ease-fluid)]"
          style={{ height: `${idx < 0 ? 0 : ((idx + 1) / SECTIONS.length) * 100}%` }}
        />
        {SECTIONS.map((s, i) => {
          const on = s.id === active;
          return (
            <li key={s.id}>
              <a
                href={`#${s.id}`}
                aria-current={on ? "true" : undefined}
                className={cn("flex gap-2 py-1 transition-colors duration-300", on ? "text-fg" : "text-muted/70 hover:text-fg")}
              >
                <span className={on ? "text-accent-text" : ""}>{String(i + 1).padStart(2, "0")}</span>
                <span>{s.label}</span>
              </a>
            </li>
          );
        })}
      </ol>
    </motion.nav>
  );
}

import type { ReactNode } from "react";
import { sectionLabel, sectionNumber, type SectionId } from "@/lib/sections";
import { cn } from "@/lib/utils";
import { Reveal } from "./motion";

/**
 * The one header every numbered section uses:
 *   03 — PROJECTS ─────────────────────── meta
 *   Title
 *   Summary
 */
export function SectionHeader({
  id,
  title,
  summary,
  meta,
  aside,
  className,
}: {
  id: SectionId;
  title: ReactNode;
  summary?: ReactNode;
  meta?: ReactNode;
  aside?: ReactNode;
  className?: string;
}) {
  return (
    <Reveal className={cn("mb-14 sm:mb-16", className)}>
      <div className="flex items-center gap-4 font-mono text-[12px] uppercase tracking-[0.12em] text-muted">
        <span className="text-accent-text">{sectionNumber(id)}</span>
        <span>{sectionLabel(id)}</span>
        <span aria-hidden className="h-px flex-1 bg-line" />
        {meta && <span className="hidden sm:inline">{meta}</span>}
      </div>
      <div className="mt-8 flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
        <div className="max-w-3xl">
          <h2 className="headline-lg text-balance">{title}</h2>
          {summary && <p className="lede mt-5 max-w-2xl text-pretty">{summary}</p>}
        </div>
        {aside && <div className="shrink-0">{aside}</div>}
      </div>
    </Reveal>
  );
}

"use client";

import { ArrowUp, X } from "lucide-react";
import { projectsUsing, projectTech, stack } from "@/lib/content";
import { cn } from "@/lib/utils";
import { useApp } from "./app-state";
import { Reveal } from "./motion";
import { SectionHeader } from "./section-header";
import { SpotlightCard } from "./ui/spotlight-card";

/** "What I use day to day": every tool is a filter that highlights the projects above that use it. */
export function Stack() {
  const { stackFilter, setStackFilter, goTo } = useApp();
  const hits = stackFilter ? projectsUsing(stackFilter) : [];

  return (
    <section id="stack" className="section-y scroll-mt-24 border-t border-line">
      <div className="container-apple">
        <SectionHeader
          id="stack"
          meta={`${stack.reduce((n, s) => n + s.items.length, 0)} tools`}
          title={
            <>
              What I use <span className="text-muted">day to day.</span>
            </>
          }
          summary="Click any tool to highlight the projects above that use it."
        />

        {/* filter status */}
        <div aria-live="polite" className="mb-4 flex min-h-10 flex-wrap items-center gap-x-3 gap-y-2 text-[14px]">
          {stackFilter ? (
            <>
              <span className="font-mono text-[12px] uppercase tracking-[0.08em] text-muted">
                <span className="text-fg">{stackFilter}</span> ·{" "}
                {hits.length ? `${hits.length} featured project${hits.length > 1 ? "s" : ""}` : "not in the featured projects"}
              </span>
              {hits.map((k) => (
                <button
                  key={k}
                  type="button"
                  onClick={() => goTo(projectTech[k].anchor)}
                  className="inline-flex items-center gap-1 rounded-full bg-accent/10 px-3 py-1 font-mono text-[12px] text-accent-text transition-colors duration-150 ease-out hover:bg-accent/20"
                >
                  {projectTech[k].title} <ArrowUp className="size-3" />
                </button>
              ))}
              <button
                type="button"
                onClick={() => setStackFilter(null)}
                className="ml-auto inline-flex items-center gap-1 rounded-full px-3 py-1 text-[13px] text-muted shadow-[inset_0_0_0_1px_var(--line)] transition-colors duration-150 ease-out hover:text-fg"
              >
                <X className="size-3.5" /> Clear filter
              </button>
            </>
          ) : (
            <span className="font-mono text-[12px] uppercase tracking-[0.08em] text-muted">No filter · all projects shown</span>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {stack.map((s, i) => (
            <Reveal key={s.group} delay={(i % 4) * 0.06} className="bezel">
              <SpotlightCard className="bezel-core h-full p-5 sm:p-6">
                <div className="flex items-center justify-between">
                  <h3 className="eyebrow">{s.group}</h3>
                  <span className="font-mono text-[11px] text-muted/70">{String(i + 1).padStart(2, "0")}</span>
                </div>
                <ul className="mt-4 flex flex-wrap gap-1.5">
                  {s.items.map((it) => {
                    const on = stackFilter === it;
                    return (
                      <li key={it}>
                        <button
                          type="button"
                          aria-pressed={on}
                          onClick={() => setStackFilter(on ? null : it)}
                          className={cn(
                            "rounded-full px-2.5 py-1 font-mono text-[12.5px] transition-colors duration-150 ease-out",
                            on
                              ? "bg-accent text-accent-fg"
                              : "bg-fg/[0.04] text-fg shadow-[inset_0_0_0_1px_var(--line)] hover:bg-fg/[0.08]",
                          )}
                        >
                          {it}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </SpotlightCard>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

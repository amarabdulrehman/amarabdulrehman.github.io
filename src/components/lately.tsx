"use client";

import { ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { lately } from "@/lib/content";
import { Reveal } from "./motion";
import { SectionHeader } from "./section-header";
import { SpotlightCard } from "./ui/spotlight-card";

export function Lately() {
  const track = useRef<HTMLUListElement>(null);
  const [edge, setEdge] = useState({ start: true, end: false });

  const update = useCallback(() => {
    const el = track.current;
    if (!el) return;
    setEdge({ start: el.scrollLeft < 8, end: el.scrollLeft + el.clientWidth >= el.scrollWidth - 8 });
  }, []);

  useEffect(() => {
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [update]);

  const move = (dir: 1 | -1) => {
    const el = track.current;
    if (!el) return;
    const card = el.querySelector("li");
    el.scrollBy({ left: dir * ((card?.clientWidth ?? 360) + 20), behavior: "smooth" });
  };

  return (
    <section id="hackathons" className="section-y border-t border-line bg-bg-alt">
      <div className="container-apple">
        <SectionHeader
          id="hackathons"
          className="mb-0 sm:mb-0"
          meta="Newest first"
          title={
            <>
              Hackathons <span className="text-muted">and new builds.</span>
            </>
          }
          summary="What I’ve built this term, at hackathons and on my own."
          aside={
        <div className="hidden gap-2 sm:flex">
          <button type="button" onClick={() => move(-1)} disabled={edge.start} aria-label="Previous" className="grid size-10 place-items-center rounded-full bg-fg/[0.08] transition-opacity hover:bg-fg/[0.12] disabled:opacity-30">
            <ChevronLeft className="size-5" />
          </button>
          <button type="button" onClick={() => move(1)} disabled={edge.end} aria-label="Next" className="grid size-10 place-items-center rounded-full bg-fg/[0.08] transition-opacity hover:bg-fg/[0.12] disabled:opacity-30">
            <ChevronRight className="size-5" />
          </button>
        </div>
          }
        />
      </div>

      <ul
        ref={track}
        onScroll={update}
        className="no-scrollbar mt-12 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth scroll-px-[max(1.25rem,calc((100vw-1080px)/2+2rem))] px-[max(1.25rem,calc((100vw-1080px)/2+2rem))] pb-6"
      >
        {lately.map((p, i) => (
          <li key={p.title} className="w-[85vw] max-w-[400px] shrink-0 snap-start sm:w-[400px]">
            <Reveal delay={i * 0.06} className="bezel h-full">
            <SpotlightCard className="bezel-core flex h-full flex-col p-8">
              <div className="flex flex-wrap items-center gap-2">
                <span className="eyebrow">{p.kicker}</span>
                {p.badge && (
                  <span className="rounded-full bg-accent/10 px-2.5 py-0.5 text-[12px] font-semibold text-link">{p.badge}</span>
                )}
              </div>
              <h3 className="mt-4 text-[24px] font-semibold leading-tight tracking-[-0.03em]">{p.title}</h3>
              <p className="mt-3 flex-1 text-[15px] leading-relaxed text-muted">{p.body}</p>
              <p className="mt-6 font-mono text-[12px] text-muted">{p.tech}</p>
              {p.links.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 border-t border-line pt-4 text-[15px]">
                  {p.links.map((l) => (
                    <a key={l.href} href={l.href} target="_blank" rel="noopener noreferrer" className="link-arrow">
                      {l.label} <ArrowUpRight className="size-3.5" />
                    </a>
                  ))}
                </div>
              )}
            </SpotlightCard>
            </Reveal>
          </li>
        ))}
      </ul>
    </section>
  );
}

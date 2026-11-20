"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, ChevronRight } from "lucide-react";
import { flagship } from "@/lib/content";
import { cn } from "@/lib/utils";
import { highlightClass, useProjectHighlight } from "./app-state";
import { Reveal } from "./motion";
import { SectionHeader } from "./section-header";
import { ChaosLab, PulseBar, TaxPill } from "./toffee-lab";
import { SpotlightCard } from "./ui/spotlight-card";

export function Flagship() {
  const hl = useProjectHighlight("toffeeos");

  return (
    <section id="toffeeos" className="theme-dark relative scroll-mt-24 bg-bg text-fg">
      <div aria-hidden className="grid-bg pointer-events-none absolute inset-0 [mask-image:linear-gradient(to_bottom,#000,transparent_40%,transparent_70%,#000)]" />
      <div className="container-apple relative pt-28 sm:pt-36">
        <SectionHeader
          id="toffeeos"
          meta="Flagship · in production"
          title={`${flagship.name}.`}
          summary={
            <>
              <span className="text-fg">{flagship.tagline}</span> {flagship.summary}
            </>
          }
          aside={
            <div className="flex flex-wrap gap-3">
              <a href={flagship.url} target="_blank" rel="noopener noreferrer" className="btn-primary group">
                toffeeos.com
                <span className="btn-icon">
                  <ArrowUpRight className="size-4" />
                </span>
              </a>
              <Link href={flagship.caseStudy} className="btn-secondary">
                Read the case study <ChevronRight className="size-4" />
              </Link>
            </div>
          }
        />

        {/* showcase: heartbeat + break-my-system lab, over a restrained ambient glow */}
        <div className="relative">
          <div
            aria-hidden
            className="pointer-events-none absolute -inset-x-10 -inset-y-16 -z-0 opacity-70"
            style={{ background: "radial-gradient(55% 50% at 50% 45%, color-mix(in srgb, var(--accent) 22%, transparent), transparent 70%)" }}
          />
          <Reveal className="relative">
            {/* highlight lives on an inner element: Reveal owns the inline opacity */}
            <div className={cn("bezel rounded-[1.5rem]", highlightClass(hl))}>
            <div className="bezel-core overflow-hidden">
              <PulseBar />
              <div className="min-w-0 p-5 sm:p-7">
                <div className="mb-5 flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="text-[22px] font-semibold tracking-[-0.02em]">Break my system.</h3>
                  <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-muted">offline-first sync · live sim</p>
                </div>
                <ChaosLab
                  aside={
                    <>
                      <div className="rounded-[18px] border border-white/10 bg-[#1c1c1e] p-1.5">
                        <div className="mb-1.5 flex gap-1.5 px-1.5 pt-1" aria-hidden>
                          <span className="size-2 rounded-full bg-[#ff5f57]" />
                          <span className="size-2 rounded-full bg-[#febc2e]" />
                          <span className="size-2 rounded-full bg-[#28c840]" />
                        </div>
                        <Image
                          src={flagship.image}
                          alt="The ToffeeOS point-of-sale screen"
                          width={1440}
                          height={900}
                          sizes="(min-width: 1024px) 400px, 100vw"
                          className="w-full rounded-[12px]"
                        />
                      </div>
                      <TaxPill />
                    </>
                  }
                />
              </div>
            </div>
            </div>
          </Reveal>
        </div>
      </div>

      <div className="container-apple relative pt-3 pb-28 sm:pb-36">
        <div className="grid gap-3 sm:grid-cols-3">
          {flagship.metrics.map((m, i) => (
            <Reveal key={m.label} delay={i * 0.08} className="bezel">
              <SpotlightCard className="bezel-core h-full p-8">
                <p className="font-mono text-[44px] font-semibold leading-none tracking-[-0.04em] tabular-nums">{m.value}</p>
                <p className="mt-3 font-mono text-[12px] uppercase tracking-[0.08em] text-muted">{m.label}</p>
              </SpotlightCard>
            </Reveal>
          ))}
        </div>
        <Reveal className="mt-8 flex flex-wrap items-center gap-2">
          <span className="eyebrow mr-2">Built with</span>
          {flagship.stack.map((t) => (
            <span key={t} className="rounded-full border border-line px-3 py-1.5 font-mono text-[12px] text-muted">
              {t}
            </span>
          ))}
        </Reveal>
      </div>
    </section>
  );
}

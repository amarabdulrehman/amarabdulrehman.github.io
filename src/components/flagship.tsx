"use client";

import Image from "next/image";
import { motion, useMotionValueEvent, useReducedMotion, useScroll, useTransform } from "motion/react";
import { ArrowUpRight, ChevronRight } from "lucide-react";
import { useRef, useState } from "react";
import { flagship } from "@/lib/content";
import { cn } from "@/lib/utils";
import { Reveal } from "./motion";
import { SectionHeader } from "./section-header";
import { SpotlightCard } from "./ui/spotlight-card";

export function Flagship() {
  const pin = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: pin, offset: ["start start", "end end"] });
  const [active, setActive] = useState(0);
  const n = flagship.features.length;

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    setActive(Math.min(n - 1, Math.max(0, Math.floor(v * n))));
  });

  const imgScale = useTransform(scrollYProgress, [0, 0.35], [0.92, 1]);
  const imgY = useTransform(scrollYProgress, [0, 1], ["4%", "-4%"]);

  return (
    <section id="work" className="theme-dark relative bg-bg text-fg">
      <div aria-hidden className="grid-bg pointer-events-none absolute inset-0 [mask-image:linear-gradient(to_bottom,#000,transparent_40%,transparent_70%,#000)]" />
      <div className="container-apple relative pt-28 sm:pt-36">
        <SectionHeader
          id="work"
          className="mb-4 sm:mb-6"
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
              <a href={flagship.caseStudy} target="_blank" className="btn-secondary">
                Case study <ChevronRight className="size-4" />
              </a>
            </div>
          }
        />
      </div>

      {/* pinned stage: features advance while the screenshot stays put */}
      <div ref={pin} className="relative md:h-[260vh]">
        <div className="container-apple grid items-center gap-12 py-12 md:sticky md:top-0 md:h-dvh md:grid-cols-[0.9fr_1.1fr] md:py-0">
          <ol className="order-2 grid gap-8 md:order-1">
            {flagship.features.map((f, i) => (
              <li
                key={f.title}
                className={cn(
                  "border-l-2 pl-6 transition-all duration-500 ease-apple",
                  i === active ? "border-accent md:opacity-100" : "border-line md:opacity-35",
                )}
              >
                <h3 className="text-2xl font-semibold tracking-tight sm:text-[28px]">{f.title}</h3>
                <p className="mt-2 text-[17px] leading-relaxed text-muted">{f.body}</p>
              </li>
            ))}
          </ol>

          <motion.div
            style={reduce ? undefined : { scale: imgScale, y: imgY }}
            className="order-1 md:order-2"
          >
            <div className="rounded-[22px] border border-white/10 bg-[#1c1c1e] p-2 shadow-[0_40px_120px_-30px_color-mix(in_srgb,var(--accent)_45%,transparent)]">
              <div className="mb-2 flex gap-1.5 px-2 pt-1" aria-hidden>
                <span className="size-2.5 rounded-full bg-[#ff5f57]" />
                <span className="size-2.5 rounded-full bg-[#febc2e]" />
                <span className="size-2.5 rounded-full bg-[#28c840]" />
              </div>
              <Image
                src={flagship.image}
                alt="The ToffeeOS point-of-sale screen"
                width={1440}
                height={900}
                sizes="(min-width: 768px) 600px, 100vw"
                className="w-full rounded-[14px]"
              />
            </div>
          </motion.div>
        </div>
      </div>

      <div className="container-apple pb-28 sm:pb-36">
        <div className="grid gap-3 sm:grid-cols-3">
          {flagship.metrics.map((m, i) => (
            <Reveal key={m.label} delay={i * 0.08} className="bezel">
              <SpotlightCard className="bezel-core h-full p-8">
                <p className="headline-lg">{m.value}</p>
                <p className="mt-2 font-mono text-[12px] uppercase tracking-[0.08em] text-muted">{m.label}</p>
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

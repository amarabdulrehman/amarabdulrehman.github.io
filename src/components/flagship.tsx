"use client";

import Image from "next/image";
import { motion, useMotionValueEvent, useReducedMotion, useScroll, useTransform } from "motion/react";
import { ArrowUpRight, ChevronRight } from "lucide-react";
import { useRef, useState } from "react";
import { flagship } from "@/lib/content";
import { cn } from "@/lib/utils";
import { Reveal } from "./motion";

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
      <div className="container-apple pt-28 pb-10 text-center sm:pt-36">
        <Reveal>
          <p className="eyebrow">Flagship · in production</p>
          <h2 className="headline-xl mt-3">{flagship.name}.</h2>
          <p className="headline-md mx-auto mt-4 max-w-3xl bg-gradient-to-r from-[#2997ff] via-[#a78bfa] to-[#f472b6] bg-clip-text text-transparent">
            {flagship.tagline}
          </p>
          <p className="lede mx-auto mt-6 max-w-2xl">{flagship.summary}</p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-[17px]">
            <a href={flagship.url} target="_blank" rel="noopener noreferrer" className="link-arrow">
              Visit toffeeos.com <ArrowUpRight className="size-4" />
            </a>
            <a href={flagship.caseStudy} target="_blank" className="link-arrow">
              Read the case study <ChevronRight className="size-4" />
            </a>
          </div>
        </Reveal>
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
                  i === active ? "border-[#2997ff] md:opacity-100" : "border-line md:opacity-35",
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
            <div className="rounded-[22px] border border-white/10 bg-[#1c1c1e] p-2 shadow-[0_40px_120px_-30px_rgb(41_151_255/0.35)]">
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
        <div className="grid gap-px overflow-hidden rounded-[28px] bg-line sm:grid-cols-3">
          {flagship.metrics.map((m, i) => (
            <Reveal key={m.label} delay={i * 0.08} className="bg-bg-alt p-8 text-center">
              <p className="headline-lg">{m.value}</p>
              <p className="mt-2 text-[15px] text-muted">{m.label}</p>
            </Reveal>
          ))}
        </div>
        <Reveal className="mt-10 flex flex-wrap items-center justify-center gap-2">
          <span className="eyebrow mr-2">Built with</span>
          {flagship.stack.map((t) => (
            <span key={t} className="rounded-full border border-line px-3.5 py-1.5 text-[13px] text-muted">
              {t}
            </span>
          ))}
        </Reveal>
      </div>
    </section>
  );
}

"use client";

/**
 * Scroll-dealt deck of live client sites.
 * Adapted from "Scroll Stacking Cards" (Project Deck) by Aakash Mehra on 21st.dev.
 */

import Image from "next/image";
import { MotionConfig, motion, useReducedMotion, useScroll, useSpring, useTransform, type MotionValue } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { useRef } from "react";
import { websites, type Website } from "@/lib/content";
import { SectionHeader } from "./section-header";

const host = (url: string) => url.replace(/^https?:\/\//, "").replace(/\/$/, "");
const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const easeOut = (t: number) => 1 - (1 - t) ** 3;
const ENTER = 0.72;

function arrived(j: number, v: number, count: number) {
  if (j <= 0) return 1;
  const span = Math.max(1, count - 1);
  return easeOut(clamp01((v * span - (j - 1)) / ENTER));
}

export function Websites() {
  const deck = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion() ?? false;
  const count = websites.length;
  const { scrollYProgress } = useScroll({ target: deck, offset: ["start start", "end end"] });
  const progress = useSpring(scrollYProgress, { stiffness: 380, damping: 48, mass: 0.35 });

  return (
    <section id="websites" className="border-t border-line bg-bg">
      <div className="container-apple pt-28 sm:pt-36">
        <SectionHeader
          id="websites"
          className="mb-0 sm:mb-0"
          meta={`${websites.length} sites · all live`}
          title={
            <>
              Websites I’ve shipped <span className="text-muted">for real businesses.</span>
            </>
          }
          summary="Fast, mobile-first sites for cafés, restaurants and local businesses. Scroll through, then click to visit."
        />
      </div>

      <MotionConfig reducedMotion="user">
        <div ref={deck} className="relative" style={{ height: `${count * 85}svh` }}>
          <div className="sticky top-0 grid h-[100svh] place-items-center overflow-hidden px-5 [perspective:1800px] sm:px-10">
            {websites.map((w, i) => (
              <Card key={w.url} w={w} i={i} count={count} progress={progress} still={reduce} />
            ))}
          </div>
        </div>
      </MotionConfig>
    </section>
  );
}

function Card({ w, i, count, progress, still }: { w: Website; i: number; count: number; progress: MotionValue<number>; still: boolean }) {
  const above = (v: number) => {
    let n = 0;
    for (let j = i + 1; j < count; j++) n += arrived(j, v, count);
    return Math.min(3, n);
  };
  const y = useTransform(progress, (v) => `${(1 - arrived(i, v, count)) * 108 - above(v) * 4}svh`);
  const rotateX = useTransform(progress, (v) => -(1 - arrived(i, v, count)) * 30 + above(v) * 5);
  const scale = useTransform(progress, (v) => 0.9 + 0.1 * arrived(i, v, count) - above(v) * 0.05);
  const filter = useTransform(progress, (v) => `blur(${((1 - arrived(i, v, count)) ** 2 * 12 + above(v) * 1.1).toFixed(2)}px)`);
  const dim = useTransform(progress, (v) => above(v) * 0.15);
  const stillY = useTransform(progress, (v) => (arrived(i, v, count) >= 0.5 ? "0svh" : "110svh"));

  return (
    <motion.article
      aria-label={`${w.name}: ${w.summary}`}
      className="col-start-1 row-start-1 mt-[6svh] w-[min(100%,calc(78svh*16/10),1080px)] origin-[50%_25%] will-change-[transform,filter]"
      style={{ zIndex: i + 1, ...(still ? { y: stillY } : { y, rotateX, scale, filter }) }}
    >
      <div className="relative overflow-hidden rounded-[24px] bg-bg shadow-[0_50px_90px_-35px_rgba(10,12,20,0.5)]">
        <Image
          src={w.image}
          alt={`The ${host(w.url)} homepage`}
          width={840}
          height={525}
          sizes="(min-width: 1080px) 1080px, 100vw"
          className="block aspect-[16/10] w-full object-cover object-top max-sm:aspect-[4/5]"
        />
        <div className="absolute left-4 top-4 rounded-full bg-black/55 px-3 py-1 text-[12px] font-medium text-white backdrop-blur-md">
          {w.kind}
        </div>
        <Visit w={w} />
        <motion.div aria-hidden className="pointer-events-none absolute inset-0 bg-[#0A0C14]" style={{ opacity: still ? 0 : dim }} />
      </div>
    </motion.article>
  );
}

function Visit({ w }: { w: Website }) {
  const R = 18;
  const corner = (
    <svg aria-hidden width={R} height={R} viewBox={`0 0 ${R} ${R}`} className="block">
      <path d={`M${R} 0 V${R} H0 A${R} ${R} 0 0 0 ${R} 0 Z`} style={{ fill: "var(--bg)" }} />
    </svg>
  );
  return (
    <div className="absolute bottom-0 right-0 z-10">
      <div className="absolute bottom-full right-0">{corner}</div>
      <div className="absolute bottom-0 right-full">{corner}</div>
      <a
        href={w.url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Visit ${w.name} at ${host(w.url)} (opens in a new tab)`}
        className="group flex items-center gap-4 rounded-tl-[20px] bg-bg py-3 pl-5 pr-1 text-fg outline-none sm:gap-5 sm:py-4 sm:pl-7"
      >
        <span className="flex flex-col leading-tight">
          <span className="text-[16px] font-semibold tracking-[-0.015em] sm:text-[19px]">{w.name}</span>
          <span className="text-[13px] text-muted underline-offset-4 group-hover:underline sm:text-[15px]">{host(w.url)}</span>
        </span>
        <span
          className="grid size-11 place-items-center rounded-full text-white transition-transform duration-200 ease-out group-hover:rotate-45 group-active:scale-90 sm:size-[52px]"
          style={{ background: w.accent }}
        >
          <ArrowUpRight className="size-5 sm:size-6" strokeWidth={2.2} />
        </span>
      </a>
    </div>
  );
}

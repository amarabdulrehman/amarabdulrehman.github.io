"use client";

/**
 * Client sites: SPILL featured as the live production deployment, then a
 * scroll-dealt deck of live client prototypes.
 * Deck adapted from "Scroll Stacking Cards" (Project Deck) by Aakash Mehra on 21st.dev.
 */

import Image from "next/image";
import { MotionConfig, motion, useReducedMotion, useScroll, useSpring, useTransform, type MotionValue } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { useRef } from "react";
import { STATUS_LABEL, websites, type Website } from "@/lib/content";
import { cn } from "@/lib/utils";
import { Reveal } from "./motion";
import { SectionHeader } from "./section-header";

const host = (url: string) => url.replace(/^https?:\/\//, "").replace(/\/$/, "");
const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const easeOut = (t: number) => 1 - (1 - t) ** 3;
const ENTER = 0.72;

const production = websites.filter((w) => w.status === "production");
const prototypes = websites.filter((w) => w.status === "prototype");

/** Accessible name for a card link: what it is, its status, and that it opens a new tab. */
const linkLabel = (w: Website) => `${w.name}, ${STATUS_LABEL[w.status].toLowerCase()} at ${host(w.url)} (opens in a new tab)`;

function arrived(j: number, v: number, count: number) {
  if (j <= 0) return 1;
  const span = Math.max(1, count - 1);
  return easeOut(clamp01((v * span - (j - 1)) / ENTER));
}

function StatusBadge({ w, className }: { w: Website; className?: string }) {
  const live = w.status === "production";
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-mono text-[11px] font-medium uppercase tracking-[0.08em]",
        live ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300" : "bg-accent/12 text-accent-text",
        className,
      )}
    >
      <span className={cn("size-1.5 rounded-full", live ? "bg-emerald-500" : "bg-accent")} />
      {STATUS_LABEL[w.status]}
    </span>
  );
}

export function Websites() {
  const deck = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion() ?? false;
  const count = prototypes.length;
  const { scrollYProgress } = useScroll({ target: deck, offset: ["start start", "end end"] });
  const progress = useSpring(scrollYProgress, { stiffness: 380, damping: 48, mass: 0.35 });

  return (
    <section id="client-sites" className="scroll-mt-24 border-t border-line bg-bg">
      <div className="container-apple pt-28 sm:pt-36">
        <SectionHeader
          id="client-sites"
          meta={`${production.length} in production · ${prototypes.length} prototypes`}
          title={
            <>
              Client work <span className="text-muted">&amp; web prototypes.</span>
            </>
          }
          summary="Fast, mobile-first sites for cafés, restaurants, and local businesses—featuring a live production site and interactive prototypes."
        />

        {production.map((w) => (
          <Featured key={w.url} w={w} />
        ))}

        <Reveal className="mt-20 flex items-center gap-4 font-mono text-[12px] uppercase tracking-[0.12em] text-muted">
          <h3>Live prototypes</h3>
          <span aria-hidden className="h-px flex-1 bg-line" />
          <span className="hidden sm:inline">Scroll through, click to open</span>
        </Reveal>
      </div>

      <MotionConfig reducedMotion="user">
        <div ref={deck} className="relative" style={{ height: `${count * 85}svh` }}>
          <ul aria-label="Live prototypes" className="sticky top-0 grid h-[100svh] place-items-center overflow-hidden px-5 [perspective:1800px] sm:px-10">
            {prototypes.map((w, i) => (
              <Card key={w.url} w={w} i={i} count={count} progress={progress} still={reduce} />
            ))}
          </ul>
        </div>
      </MotionConfig>
    </section>
  );
}

/** SPILL: the production site, shown flat and large with its ToffeeOS tie-in. */
function Featured({ w }: { w: Website }) {
  return (
    <Reveal className="bezel">
      <a
        href={w.url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={linkLabel(w)}
        className="bezel-core group grid overflow-hidden outline-none focus-visible:ring-2 focus-visible:ring-accent md:grid-cols-[1.35fr_1fr] [&>*]:min-w-0"
      >
        <div className="relative overflow-hidden bg-bg-alt">
          <Image
            src={w.image}
            alt=""
            width={840}
            height={525}
            sizes="(min-width: 1080px) 600px, 100vw"
            className="block aspect-[16/10] h-full w-full object-cover object-top transition-transform duration-700 ease-apple group-hover:scale-[1.02]"
          />
        </div>
        <div aria-hidden className="flex flex-col justify-between gap-8 p-7 sm:p-9">
          <div>
            <StatusBadge w={w} />
            <p className="mt-5 text-[30px] font-semibold leading-none tracking-[-0.035em]">{w.name}</p>
            <p className="mt-2 eyebrow">{w.kind}</p>
            <p className="mt-5 text-[16px] leading-relaxed text-muted">{w.summary}</p>
          </div>
          <div className="flex items-center justify-between gap-4 border-t border-line pt-5">
            <span className="text-[15px] font-medium underline-offset-4 group-hover:underline">{host(w.url)}</span>
            <span
              className="grid size-11 shrink-0 place-items-center rounded-full text-white transition-transform duration-200 ease-out group-hover:rotate-45"
              style={{ background: w.accent }}
            >
              <ArrowUpRight className="size-5" strokeWidth={2.2} />
            </span>
          </div>
        </div>
      </a>
    </Reveal>
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
    <motion.li
      className="col-start-1 row-start-1 mt-[6svh] w-[min(100%,calc(78svh*16/10),1080px)] list-none origin-[50%_25%] will-change-[transform,filter]"
      style={{ zIndex: i + 1, ...(still ? { y: stillY } : { y, rotateX, scale, filter }) }}
    >
      {/* The whole card is one link; everything visual inside is hidden from assistive tech. */}
      <a
        href={w.url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={linkLabel(w)}
        className="group relative block overflow-hidden rounded-[24px] bg-bg shadow-[0_50px_90px_-35px_rgba(10,12,20,0.5)] outline-none focus-visible:ring-2 focus-visible:ring-accent"
      >
        <Image
          src={w.image}
          alt=""
          width={840}
          height={525}
          sizes="(min-width: 1080px) 1080px, 100vw"
          className="block aspect-[16/10] w-full object-cover object-top max-sm:aspect-[4/5]"
        />
        <div aria-hidden className="absolute left-4 top-4 flex flex-wrap items-center gap-2">
          <StatusBadge w={w} className="bg-black/55 text-white backdrop-blur-md dark:text-white" />
          <span className="rounded-full bg-black/55 px-3 py-1 text-[12px] font-medium text-white backdrop-blur-md">{w.kind}</span>
        </div>
        <Tab w={w} />
        <motion.div aria-hidden className="pointer-events-none absolute inset-0 bg-[#0A0C14]" style={{ opacity: still ? 0 : dim }} />
      </a>
    </motion.li>
  );
}

/** The notched name tab in the card's corner (visual only; the parent link carries the label). */
function Tab({ w }: { w: Website }) {
  const R = 18;
  const corner = (
    <svg width={R} height={R} viewBox={`0 0 ${R} ${R}`} className="block">
      <path d={`M${R} 0 V${R} H0 A${R} ${R} 0 0 0 ${R} 0 Z`} style={{ fill: "var(--bg)" }} />
    </svg>
  );
  return (
    <div aria-hidden className="absolute bottom-0 right-0 z-10">
      <div className="absolute bottom-full right-0">{corner}</div>
      <div className="absolute bottom-0 right-full">{corner}</div>
      <div className="flex items-center gap-4 rounded-tl-[20px] bg-bg py-3 pl-5 pr-1 text-fg sm:gap-5 sm:py-4 sm:pl-7">
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
      </div>
    </div>
  );
}

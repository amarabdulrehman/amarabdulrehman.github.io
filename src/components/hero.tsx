"use client";

import Image from "next/image";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { ArrowDownToLine, ArrowRight } from "lucide-react";
import { useRef } from "react";
import { profile } from "@/lib/content";
import { HeroAsk } from "./chat/ask-amar";
import { EASE } from "./motion";

export function Hero() {
  const reduce = useReducedMotion();
  const root = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: root, offset: ["start start", "end start"] });
  // the hero gently recedes as you scroll past it
  const y = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.94]);

  const words = profile.headline.split(" ");
  const fade = (delay: number) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 16, filter: "blur(6px)" },
          animate: { opacity: 1, y: 0, filter: "blur(0px)" },
          transition: { duration: 0.9, ease: EASE, delay },
        };

  return (
    <section ref={root} id="top" className="relative isolate flex min-h-[100dvh] items-center overflow-hidden pt-32 pb-24 sm:pt-36">
      {/* ambient mesh */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div
          className="absolute left-1/2 top-[-18%] h-[720px] w-[1100px] -translate-x-1/2 opacity-80 dark:opacity-50"
          style={{
            background:
              "radial-gradient(42% 46% at 32% 45%, rgb(8 148 255 / 0.20), transparent 70%), radial-gradient(38% 42% at 68% 40%, rgb(201 89 221 / 0.18), transparent 70%), radial-gradient(30% 30% at 50% 75%, rgb(255 144 4 / 0.10), transparent 70%)",
          }}
        />
        <div
          className="absolute inset-0 opacity-[0.35] dark:opacity-[0.18]"
          style={{
            backgroundImage: "radial-gradient(color-mix(in srgb, var(--fg) 14%, transparent) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
            maskImage: "radial-gradient(60% 55% at 50% 40%, #000, transparent 75%)",
            WebkitMaskImage: "radial-gradient(60% 55% at 50% 40%, #000, transparent 75%)",
          }}
        />
      </div>

      <motion.div style={reduce ? undefined : { y, opacity, scale }} className="container-apple text-center">
        <motion.div {...fade(0.1)} className="inline-flex items-center gap-3 rounded-full bg-fg/[0.04] py-1 pl-1 pr-4 shadow-[inset_0_0_0_1px_var(--line)]">
          <span className="relative size-7 overflow-hidden rounded-full">
            <Image src={profile.portrait} alt="" fill sizes="28px" priority className="object-cover object-top" />
          </span>
          <span className="flex items-center gap-2 text-[13px] font-medium text-muted">
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-500 opacity-60 motion-reduce:hidden" />
              <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
            </span>
            {profile.availability}
          </span>
        </motion.div>

        <h1 className="headline-xl mx-auto mt-7 max-w-5xl text-balance">
          {words.map((w, i) => (
            <motion.span
              key={i}
              className="inline-block whitespace-pre"
              initial={reduce ? false : { opacity: 0, y: 40, filter: "blur(12px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 1.1, ease: EASE, delay: 0.2 + i * 0.07 }}
            >
              {i === words.length - 1 ? (
                <span className="bg-gradient-to-r from-[#0894ff] via-[#c959dd] to-[#ff2e54] bg-clip-text pb-[0.08em] text-transparent">{w}</span>
              ) : (
                w
              )}
              {i < words.length - 1 ? " " : ""}
            </motion.span>
          ))}
        </h1>

        <motion.p {...fade(0.65)} className="lede mx-auto mt-6 max-w-2xl text-pretty">
          {profile.intro}
        </motion.p>

        <motion.div {...fade(0.85)} className="mt-11">
          <HeroAsk />
        </motion.div>

        <motion.div {...fade(1.2)} className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <a href="#work" className="btn-primary group pr-[1.375rem]">
            See the work
            <span className="btn-icon">
              <ArrowRight className="size-4" />
            </span>
          </a>
          <a href={profile.cv} className="btn-secondary" download>
            <ArrowDownToLine className="size-4" /> Download CV
          </a>
        </motion.div>
      </motion.div>
    </section>
  );
}

"use client";

import Image from "next/image";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { ArrowDownToLine, ChevronRight, MapPin, Sparkles } from "lucide-react";
import { useRef } from "react";
import { profile } from "@/lib/content";
import { EASE } from "./motion";

export function Hero() {
  const reduce = useReducedMotion();
  const media = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: media, offset: ["start end", "start 0.25"] });
  const scale = useTransform(scrollYProgress, [0, 1], [0.9, 1]);
  const radius = useTransform(scrollYProgress, [0, 1], [44, 28]);

  const words = profile.headline.split(" ");

  return (
    <section id="top" className="relative overflow-hidden pt-36 pb-20 sm:pt-44">
      {/* soft ambient glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[620px] opacity-70 dark:opacity-40"
        style={{
          background:
            "radial-gradient(60% 50% at 50% 0%, color-mix(in srgb, var(--accent) 16%, transparent), transparent 70%)",
        }}
      />

      <div className="container-apple text-center">
        <motion.p
          initial={reduce ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: EASE, delay: 0.1 }}
          className="eyebrow inline-flex items-center gap-2 rounded-full border border-line bg-bg-alt/70 px-3.5 py-1.5"
        >
          <span className="relative flex size-2">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-500 opacity-60 motion-reduce:hidden" />
            <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
          </span>
          {profile.availability}
        </motion.p>

        <h1 className="headline-xl mx-auto mt-6 max-w-4xl text-balance">
          {words.map((w, i) => (
            <motion.span
              key={i}
              className="inline-block whitespace-pre"
              initial={reduce ? false : { opacity: 0, y: 40, filter: "blur(10px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 1, ease: EASE, delay: 0.2 + i * 0.07 }}
            >
              {w}
              {i < words.length - 1 ? " " : ""}
            </motion.span>
          ))}
        </h1>

        <motion.p
          initial={reduce ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: EASE, delay: 0.7 }}
          className="lede mx-auto mt-6 max-w-2xl text-pretty"
        >
          {profile.intro}
        </motion.p>

        <motion.div
          initial={reduce ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: EASE, delay: 0.85 }}
          className="mt-9 flex flex-wrap items-center justify-center gap-3"
        >
          <a href="#ask" className="btn-primary">
            <Sparkles className="size-4" /> Ask Amar
          </a>
          <a href={profile.cv} className="btn-secondary" download>
            <ArrowDownToLine className="size-4" /> Download CV
          </a>
        </motion.div>
      </div>

      {/* portrait card that settles into place as you scroll */}
      <div className="container-apple mt-20">
        <motion.div
          ref={media}
          style={reduce ? undefined : { scale, borderRadius: radius }}
          className="relative grid overflow-hidden border border-line bg-bg-alt shadow-[var(--shadow)] md:grid-cols-[0.85fr_1.15fr]"
        >
          <div className="relative aspect-[4/5] md:aspect-auto md:min-h-[520px]">
            <Image
              src={profile.portrait}
              alt={`Portrait of ${profile.name}`}
              fill
              priority
              sizes="(min-width: 768px) 420px, 100vw"
              className="object-cover object-top"
            />
          </div>
          <div className="flex flex-col justify-between gap-10 p-8 sm:p-12">
            <div>
              <p className="eyebrow">Hello, I’m</p>
              <p className="headline-md mt-2">{profile.name}</p>
              <p className="mt-2 text-lg text-muted">{profile.role}</p>
              <p className="mt-6 inline-flex items-center gap-1.5 text-sm text-muted">
                <MapPin className="size-4" /> {profile.location}
              </p>
            </div>
            <ul className="grid gap-4 text-[15px] leading-relaxed">
              <li className="border-t border-line pt-4">
                <span className="font-semibold">Ships production software.</span>{" "}
                <span className="text-muted">ToffeeOS runs two cafés every day.</span>
              </li>
              <li className="border-t border-line pt-4">
                <span className="font-semibold">Builds AI that behaves.</span>{" "}
                <span className="text-muted">Models read; plain, tested code decides and acts.</span>
              </li>
              <li className="border-t border-line pt-4">
                <span className="font-semibold">Final-year CS at COMSATS.</span>{" "}
                <span className="text-muted">Graduating July 2027.</span>
              </li>
            </ul>
            <a href="#work" className="link-arrow text-[15px]">
              See the work <ChevronRight className="size-4" />
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

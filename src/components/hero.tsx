"use client";

import { motion, useReducedMotion } from "motion/react";
import { ArrowDownToLine, ArrowRight } from "lucide-react";
import { config, profile, uptime } from "@/lib/content";
import { HeroAsk } from "./chat/ask-amar";
import { EASE } from "./motion";

function ConfigCard() {
  return (
    <div className="bezel w-full">
      <div className="bezel-core overflow-hidden">
        <div className="flex items-center justify-between border-b border-line px-5 py-3">
          <div className="flex items-center gap-2">
            <span className="flex gap-1.5" aria-hidden>
              <span className="size-2.5 rounded-full bg-fg/15" />
              <span className="size-2.5 rounded-full bg-fg/15" />
              <span className="size-2.5 rounded-full bg-fg/15" />
            </span>
            <span className="ml-2 font-mono text-[12px] text-muted">amar.config.ts</span>
          </div>
          <span className="flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.1em] text-emerald-600 dark:text-emerald-400">
            <span className="relative flex size-1.5">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-500 opacity-60 motion-reduce:hidden" />
              <span className="relative inline-flex size-1.5 rounded-full bg-emerald-500" />
            </span>
            live
          </span>
        </div>
        <pre className="overflow-x-auto px-5 py-5 font-mono text-[12.5px] leading-[1.9] max-sm:whitespace-pre-wrap">
          <code>
            <span className="text-muted">export const </span>
            <span className="text-fg">amar</span>
            <span className="text-muted"> = {"{"}</span>
            {"\n"}
            {config.map((c) => (
              <span key={c.key}>
                {"  "}
                <span className="text-accent-text">{c.key}</span>
                <span className="text-muted">: </span>
                {Array.isArray(c.value) ? (
                  <>
                    <span className="text-muted">[</span>
                    {c.value.map((v, i) => (
                      <span key={v}>
                        <span className="text-emerald-700 dark:text-emerald-300">&quot;{v}&quot;</span>
                        {i < c.value.length - 1 && <span className="text-muted">, </span>}
                      </span>
                    ))}
                    <span className="text-muted">]</span>
                  </>
                ) : (
                  <span className="text-emerald-700 dark:text-emerald-300">&quot;{c.value}&quot;</span>
                )}
                <span className="text-muted">,</span>
                {"\n"}
              </span>
            ))}
            <span className="text-muted">{"}"};</span>
          </code>
        </pre>
      </div>
    </div>
  );
}

export function Hero() {
  const reduce = useReducedMotion();
  const fade = (delay: number) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 18, filter: "blur(6px)" },
          animate: { opacity: 1, y: 0, filter: "blur(0px)" },
          transition: { duration: 0.9, ease: EASE, delay },
        };
  const words = profile.headline.split(" ");

  return (
    <section id="top" className="relative isolate overflow-hidden pt-32 pb-20 sm:pt-40 sm:pb-28">
      {/* engineering grid + one indigo light */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div
          className="grid-bg absolute inset-0"
          style={{
            maskImage: "radial-gradient(70% 60% at 50% 30%, #000 30%, transparent 80%)",
            WebkitMaskImage: "radial-gradient(70% 60% at 50% 30%, #000 30%, transparent 80%)",
          }}
        />
        <div
          className="absolute left-[10%] top-[-10%] h-[560px] w-[760px] opacity-70 dark:opacity-60"
          style={{ background: "radial-gradient(50% 50% at 50% 50%, color-mix(in srgb, var(--accent) 22%, transparent), transparent 70%)" }}
        />
      </div>

      <div className="container-apple">
        {/* meta bar */}
        <motion.div
          {...fade(0.05)}
          className="flex flex-wrap items-center gap-x-4 gap-y-2 border-b border-line pb-4 font-mono text-[12px] uppercase tracking-[0.1em] text-muted"
        >
          <span className="text-fg">{profile.name}</span>
          <span aria-hidden className="hidden h-3 w-px bg-line sm:block" />
          <span className="hidden sm:inline">{profile.role}</span>
          <span className="ml-auto flex items-center gap-2 rounded-full bg-emerald-500/10 px-2.5 py-1 text-emerald-700 dark:text-emerald-300">
            <span className="size-1.5 rounded-full bg-emerald-500" />
            {profile.availability}
          </span>
        </motion.div>

        <div className="mt-10 grid items-center gap-14 lg:mt-16 lg:grid-cols-[1.3fr_1fr] lg:gap-12 [&>*]:min-w-0">
          <div>
            <h1 className="text-[clamp(2.5rem,4.7vw,3.9rem)] font-[650] leading-[1.02] tracking-[-0.045em] text-balance">
              {words.map((w, i) => (
                <motion.span
                  key={i}
                  className="inline-block whitespace-pre"
                  initial={reduce ? false : { opacity: 0, y: 36, filter: "blur(10px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  transition={{ duration: 1, ease: EASE, delay: 0.15 + i * 0.06 }}
                >
                  {i === words.length - 1 ? <span className="text-accent">{w}</span> : w}
                  {i < words.length - 1 ? " " : ""}
                </motion.span>
              ))}
            </h1>

            <motion.p {...fade(0.55)} className="lede mt-6 max-w-xl text-pretty">
              {profile.intro}
            </motion.p>

            <motion.div {...fade(0.7)} className="mt-9">
              <HeroAsk />
            </motion.div>

            <motion.div {...fade(0.95)} className="mt-9 flex flex-wrap items-center gap-3">
              <a href="#work" className="btn-primary group">
                See the work
                <span className="btn-icon">
                  <ArrowRight className="size-4" />
                </span>
              </a>
              <a href={profile.cv} className="btn-secondary" download>
                <ArrowDownToLine className="size-4" /> Download CV
              </a>
            </motion.div>
          </div>

          <motion.div {...fade(0.5)}>
            <ConfigCard />
          </motion.div>
        </div>

        {/* uptime strip */}
        <motion.dl
          {...fade(1.1)}
          className="mt-16 grid grid-cols-2 border-y border-line sm:grid-cols-4 lg:mt-20"
        >
          {uptime.map((u, i) => (
            <div
              key={u.label}
              className={`py-6 sm:px-6 sm:first:pl-0 ${i % 2 === 1 ? "pl-6 border-l border-line" : ""} ${i > 1 ? "border-t border-line sm:border-t-0" : ""} ${i === 2 ? "sm:border-l sm:border-line" : ""}`}
            >
              <dt className="sr-only">{u.label}</dt>
              <dd className="text-[34px] font-semibold leading-none tracking-[-0.04em] tabular-nums">{u.value}</dd>
              <dd className="mt-2 font-mono text-[11.5px] uppercase tracking-[0.08em] text-muted">{u.label}</dd>
            </div>
          ))}
        </motion.dl>
      </div>
    </section>
  );
}

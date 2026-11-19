"use client";

import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from "motion/react";
import { useRef } from "react";
import { statement } from "@/lib/content";
import { cn } from "@/lib/utils";

type Token = { text: string; hot: boolean };

// "*200+ orders a day*" → each word flagged as highlighted
const tokens: Token[] = statement.split(/(\*[^*]+\*)/).flatMap((part) => {
  const hot = part.startsWith("*");
  return part
    .replace(/\*/g, "")
    .split(" ")
    .filter(Boolean)
    .map((text) => ({ text, hot }));
});

function Word({ t, i, n, progress }: { t: Token; i: number; n: number; progress: MotionValue<number> }) {
  const start = i / n;
  const opacity = useTransform(progress, [start, start + 1.5 / n], [0.14, 1]);
  return (
    <motion.span
      style={{ opacity }}
      className={cn(
        "inline-block",
        t.hot && "bg-gradient-to-r from-[#0894ff] via-[#c959dd] to-[#ff2e54] bg-clip-text text-transparent",
      )}
    >
      {t.text}&nbsp;
    </motion.span>
  );
}

/** Apple-style statement whose words light up as you scroll through it. */
export function Statement() {
  const ref = useRef<HTMLParagraphElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.85", "end 0.45"] });

  return (
    <section aria-label="In short" className="section-y">
      <div className="container-apple">
        <p ref={ref} className="headline-lg mx-auto max-w-4xl text-balance">
          {reduce ? (
            <span>{statement.replace(/\*/g, "")}</span>
          ) : (
            tokens.map((t, i) => <Word key={i} t={t} i={i} n={tokens.length} progress={scrollYProgress} />)
          )}
        </p>
      </div>
    </section>
  );
}

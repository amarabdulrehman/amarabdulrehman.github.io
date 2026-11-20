"use client";

import { motion, useReducedMotion, type HTMLMotionProps } from "motion/react";

export const EASE = [0.28, 0.11, 0.32, 1] as const;

/** Fades and lifts content in when it scrolls into view (Apple-style). */
export function Reveal({
  delay = 0,
  y = 28,
  children,
  ...rest
}: { delay?: number; y?: number } & HTMLMotionProps<"div">) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y, filter: "blur(6px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "0px 0px -12% 0px" }}
      transition={{ duration: 0.9, ease: EASE, delay }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

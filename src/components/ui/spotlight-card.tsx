"use client";

/**
 * Card with a pointer-following spotlight, a lit edge and an optional 3D tilt.
 * Built from the ideas in 21st.dev's "Spotlight" (kevingirelli) and "Tilt" (ibelick),
 * reimplemented with CSS variables so the light never re-renders React.
 */

import { motion, useMotionValue, useReducedMotion, useSpring, type HTMLMotionProps } from "motion/react";
import { useRef, type PointerEvent } from "react";
import { cn } from "@/lib/utils";

const SPRING = { stiffness: 220, damping: 22, mass: 0.6 };

export function SpotlightCard({
  tilt = false,
  max = 6,
  className,
  children,
  onPointerMove,
  onPointerLeave,
  style,
  ...rest
}: { tilt?: boolean; max?: number } & HTMLMotionProps<"div">) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const rx = useSpring(useMotionValue(0), SPRING);
  const ry = useSpring(useMotionValue(0), SPRING);
  const canTilt = tilt && !reduce;

  const move = (e: PointerEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (el && e.pointerType === "mouse") {
      const r = el.getBoundingClientRect();
      const x = e.clientX - r.left;
      const y = e.clientY - r.top;
      el.style.setProperty("--mx", `${x}px`);
      el.style.setProperty("--my", `${y}px`);
      if (canTilt) {
        ry.set(((x / r.width) - 0.5) * max * 2);
        rx.set(-((y / r.height) - 0.5) * max * 2);
      }
    }
    onPointerMove?.(e);
  };

  const leave = (e: PointerEvent<HTMLDivElement>) => {
    rx.set(0);
    ry.set(0);
    onPointerLeave?.(e);
  };

  return (
    <motion.div
      ref={ref}
      onPointerMove={move}
      onPointerLeave={leave}
      style={canTilt ? { rotateX: rx, rotateY: ry, transformPerspective: 1100, ...style } : style}
      className={cn("spotlight", className)}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

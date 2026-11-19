"use client";

import { useEffect, useState } from "react";
import { SECTIONS, type SectionId } from "@/lib/sections";

/** The numbered section currently in the middle of the screen, or null at the hero. */
export function useActiveSection() {
  const [active, setActive] = useState<SectionId | null>(null);

  useEffect(() => {
    const els = SECTIONS.map((s) => document.getElementById(s.id)).filter((el): el is HTMLElement => !!el);
    const top = document.getElementById("top");
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          setActive(e.target.id === "top" ? null : (e.target.id as SectionId));
        }
      },
      // a thin band across the middle of the viewport
      { rootMargin: "-45% 0px -54% 0px" },
    );
    els.forEach((el) => io.observe(el));
    if (top) io.observe(top);
    return () => io.disconnect();
  }, []);

  return active;
}

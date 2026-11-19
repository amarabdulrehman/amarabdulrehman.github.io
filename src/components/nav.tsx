"use client";

/**
 * Floating glass navbar with a morphing pill indicator.
 * Adapted from "Floating Glassmorphic Navbar with Morphing Pill Indicator"
 * by themeocean on 21st.dev, restyled to the site's Apple tokens.
 */

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Moon, Sparkles, Sun } from "lucide-react";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { useChat } from "./chat/chat-context";

const NAV = [
  { label: "About", href: "#about" },
  { label: "Work", href: "#work" },
  { label: "Websites", href: "#websites" },
  { label: "Experience", href: "#experience" },
  { label: "Contact", href: "#contact" },
];

const SPRING = { type: "spring", stiffness: 420, damping: 34, mass: 0.8 } as const;

function Links({
  active,
  hovered,
  layoutId,
  vertical,
  reduce,
  onHover,
  onSelect,
}: {
  active: string;
  hovered: string | null;
  layoutId: string;
  vertical?: boolean;
  reduce: boolean;
  onHover: (h: string | null) => void;
  onSelect: (h: string) => void;
}) {
  const highlighted = hovered ?? active;
  return (
    <ul className={cn("flex", vertical ? "flex-col gap-1" : "items-center gap-0.5")}>
      {NAV.map((item) => {
        const on = item.href === highlighted;
        return (
          <li key={item.href}>
            <a
              href={item.href}
              aria-current={item.href === active ? "true" : undefined}
              onClick={() => onSelect(item.href)}
              onPointerEnter={(e) => e.pointerType === "mouse" && onHover(item.href)}
              onPointerLeave={() => onHover(null)}
              className={cn(
                "relative isolate flex items-center rounded-full px-3.5 py-1.5 text-[13px] font-medium transition-colors duration-200",
                vertical && "px-4 py-3 text-base",
                on ? "text-fg" : "text-muted hover:text-fg",
              )}
            >
              {on && (
                <motion.span
                  layoutId={layoutId}
                  aria-hidden
                  transition={reduce ? { duration: 0 } : SPRING}
                  className="absolute inset-0 -z-10 rounded-full bg-fg/[0.07]"
                />
              )}
              {item.label}
            </a>
          </li>
        );
      })}
    </ul>
  );
}

function ThemeToggle() {
  // Icons swap via CSS (dark: variant), so no state is needed and nothing flashes on load.
  const toggle = () => {
    const next = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem("theme", next);
    } catch {}
  };
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Toggle light and dark mode"
      className="grid size-9 place-items-center rounded-full text-muted transition-colors hover:bg-fg/[0.07] hover:text-fg"
    >
      <Sun className="hidden size-4 dark:block" />
      <Moon className="size-4 dark:hidden" />
    </button>
  );
}

export function Nav() {
  const [active, setActive] = useState("");
  const [hovered, setHovered] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const desktopId = useId();
  const mobileId = useId();
  const reduce = useReducedMotion() ?? false;
  const { setOpen: openChat } = useChat();

  const select = useCallback((href: string) => {
    setActive(href);
    setOpen(false);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Highlight the link whose section is on screen.
  useEffect(() => {
    // Also watch sections without a nav link (top, ask) so the pill clears there.
    const ids = ["top", ...NAV.map((n) => n.href.slice(1)), "projects"];
    const sections = ids.map((id) => document.getElementById(id)).filter(
      (el): el is HTMLElement => !!el,
    );
    const io = new IntersectionObserver(
      (entries) => {
        const hit = entries.filter((e) => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (hit) setActive(hit.target.id === "top" ? "" : hit.target.id === "projects" ? "#work" : `#${hit.target.id}`);
      },
      { rootMargin: "-40% 0px -55% 0px", threshold: [0, 0.25, 0.5, 1] },
    );
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const onDown = (e: PointerEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onDown);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onDown);
    };
  }, [open]);

  return (
    <header className="pointer-events-none fixed inset-x-0 top-3 z-50 flex justify-center px-3 sm:top-4">
      <a
        href="#main"
        className="pointer-events-auto sr-only rounded-full bg-accent px-4 py-2 text-accent-fg focus:not-sr-only focus:absolute focus:left-4 focus:top-0"
      >
        Skip to content
      </a>
      <motion.div
        ref={rootRef}
        initial={reduce ? false : { y: -28, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 26, delay: 0.15 }}
        className="pointer-events-auto relative w-full max-w-md md:w-auto md:max-w-none"
      >
        <nav
          aria-label="Main"
          className={cn(
            "relative flex items-center justify-between gap-1 rounded-full border border-line bg-glass py-1.5 pl-1.5 pr-1.5 backdrop-blur-2xl backdrop-saturate-[1.8] transition-shadow duration-300 md:gap-3",
            scrolled ? "shadow-[0_12px_40px_-12px_rgb(0_0_0/0.25)]" : "shadow-[0_6px_24px_-12px_rgb(0_0_0/0.12)]",
          )}
        >
          <span aria-hidden className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-fg/20 to-transparent" />

          <a href="#top" className="flex items-center gap-2 rounded-full py-1 pl-1 pr-2 text-[13px] font-semibold tracking-tight" onClick={() => select("")}>
            <span className="grid size-7 place-items-center rounded-[9px] bg-gradient-to-br from-fg to-fg/70 text-[11px] font-bold tracking-tight text-bg shadow-[inset_0_1px_0_rgb(255_255_255/0.2)]">AR</span>
            <span>Amar Abdur Rehman</span>
          </a>

          <div className="hidden md:block">
            <Links active={active} hovered={hovered} layoutId={`pill-${desktopId}`} reduce={reduce} onHover={setHovered} onSelect={select} />
          </div>

          <div className="flex items-center gap-1">
            <ThemeToggle />
            <button
              type="button"
              onClick={() => openChat(true)}
              className="ai-glow hidden rounded-full [--glow-blur:10px] [--glow-opacity:0.5] md:block"
            >
              <span className="flex h-8 items-center gap-1.5 rounded-full bg-fg px-3.5 text-[13px] font-medium text-bg">
                <Sparkles className="size-3.5" /> Ask Amar
              </span>
            </button>
            <button
              type="button"
              onClick={() => setOpen((o) => !o)}
              aria-expanded={open}
              aria-label={open ? "Close menu" : "Open menu"}
              className="grid size-9 place-items-center rounded-full hover:bg-fg/[0.07] md:hidden"
            >
              <span aria-hidden className="relative block h-3 w-4">
                <span className={cn("absolute left-0 block h-[1.5px] w-4 rounded-full bg-current transition-all duration-300", open ? "top-[5px] rotate-45" : "top-0.5")} />
                <span className={cn("absolute left-0 block h-[1.5px] w-4 rounded-full bg-current transition-all duration-300", open ? "top-[5px] -rotate-45" : "top-[9px]")} />
              </span>
            </button>
          </div>
        </nav>

        <AnimatePresence>
          {open && (
            <motion.div
              initial={reduce ? { opacity: 0 } : { opacity: 0, y: -10, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={reduce ? { opacity: 0 } : { opacity: 0, y: -8, scale: 0.97 }}
              transition={reduce ? { duration: 0.1 } : SPRING}
              style={{ transformOrigin: "top center" }}
              className="absolute inset-x-0 top-full mt-2 rounded-3xl border border-line bg-glass p-2 shadow-xl backdrop-blur-2xl backdrop-saturate-[1.8] md:hidden"
            >
              <Links active={active} hovered={hovered} layoutId={`pill-${mobileId}`} vertical reduce={reduce} onHover={setHovered} onSelect={select} />
              <div className="mt-2 border-t border-line p-1 pt-3">
                <button
                  type="button"
                  onClick={() => {
                    setOpen(false);
                    openChat(true);
                  }}
                  className="btn-primary w-full"
                >
                  <Sparkles className="size-4" /> Ask Amar
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </header>
  );
}

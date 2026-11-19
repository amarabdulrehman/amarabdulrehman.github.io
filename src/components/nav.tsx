"use client";

/**
 * Floating glass navbar with a morphing pill indicator.
 * Adapted from "Floating Glassmorphic Navbar with Morphing Pill Indicator"
 * by themeocean on 21st.dev, restyled to the site's tokens.
 */

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Moon, Sparkles, Sun } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";
import { SECTIONS, type SectionId } from "@/lib/sections";
import { cn } from "@/lib/utils";
import { useChat } from "./chat/chat-context";
import { useActiveSection } from "./use-active-section";

const SPRING = { type: "spring", stiffness: 420, damping: 34, mass: 0.8 } as const;

function DesktopLinks({ active, reduce }: { active: SectionId | null; reduce: boolean }) {
  const [hovered, setHovered] = useState<SectionId | null>(null);
  const layoutId = useId();
  const highlighted = hovered ?? active;
  return (
    <ul className="flex items-center" onPointerLeave={() => setHovered(null)}>
      {SECTIONS.map((s) => {
        const on = s.id === highlighted;
        return (
          <li key={s.id}>
            <a
              href={`#${s.id}`}
              aria-current={s.id === active ? "true" : undefined}
              onPointerEnter={(e) => e.pointerType === "mouse" && setHovered(s.id)}
              className={cn(
                "relative isolate flex items-center rounded-full px-2.5 py-1.5 text-[13px] font-medium transition-colors duration-200 xl:px-3",
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
              {s.label}
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
  const active = useActiveSection();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion() ?? false;
  const { setOpen: openChat } = useChat();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
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

  const current = SECTIONS.findIndex((s) => s.id === active);

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
        className="pointer-events-auto relative w-full max-w-md lg:w-auto lg:max-w-none"
      >
        <nav
          aria-label="Main"
          className={cn(
            "relative flex items-center justify-between gap-1 rounded-full border border-line bg-glass p-1.5 backdrop-blur-2xl backdrop-saturate-[1.8] transition-shadow duration-300 lg:gap-2",
            scrolled ? "shadow-[0_12px_40px_-12px_rgb(0_0_0/0.25)]" : "shadow-[0_6px_24px_-12px_rgb(0_0_0/0.12)]",
          )}
        >
          <a href="#top" className="flex items-center gap-2 rounded-full py-1 pl-1 pr-2 text-[13px] font-semibold tracking-tight">
            <span className="grid size-7 place-items-center rounded-[8px] bg-accent font-mono text-[11px] font-semibold text-accent-fg shadow-[inset_0_1px_0_rgb(255_255_255/0.25)]">
              AR
            </span>
            <span className="max-[399px]:hidden lg:hidden xl:inline">Amar Abdur Rehman</span>
          </a>

          {/* mobile: where you are */}
          <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-muted lg:hidden">
            {current >= 0 ? `${String(current + 1).padStart(2, "0")} · ${SECTIONS[current].label}` : ""}
          </span>

          <div className="hidden lg:block">
            <DesktopLinks active={active} reduce={reduce} />
          </div>

          <div className="flex items-center gap-1">
            <ThemeToggle />
            <button
              type="button"
              onClick={() => openChat(true)}
              className="ai-glow hidden rounded-full [--glow-blur:10px] [--glow-opacity:0.5] lg:block"
            >
              <span className="flex h-8 items-center gap-1.5 rounded-full bg-accent px-3.5 text-[13px] font-medium text-accent-fg">
                <Sparkles className="size-3.5" /> Ask Amar
              </span>
            </button>
            <button
              type="button"
              onClick={() => setOpen((o) => !o)}
              aria-expanded={open}
              aria-label={open ? "Close menu" : "Open menu"}
              className="grid size-9 place-items-center rounded-full hover:bg-fg/[0.07] lg:hidden"
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
              className="absolute inset-x-0 top-full mt-2 rounded-3xl border border-line bg-glass p-2 shadow-xl backdrop-blur-2xl backdrop-saturate-[1.8] lg:hidden"
            >
              <ol className="grid">
                {SECTIONS.map((s, i) => (
                  <motion.li
                    key={s.id}
                    initial={reduce ? false : { opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1], delay: 0.03 * i }}
                  >
                    <a
                      href={`#${s.id}`}
                      onClick={() => setOpen(false)}
                      aria-current={s.id === active ? "true" : undefined}
                      className={cn(
                        "flex items-center gap-4 rounded-2xl px-4 py-3 text-[17px] font-medium transition-colors hover:bg-fg/[0.05]",
                        s.id === active && "bg-fg/[0.06]",
                      )}
                    >
                      <span className="font-mono text-[12px] text-accent-text">{String(i + 1).padStart(2, "0")}</span>
                      {s.label}
                    </a>
                  </motion.li>
                ))}
              </ol>
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

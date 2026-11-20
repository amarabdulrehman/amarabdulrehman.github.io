"use client";

/**
 * Floating glass navbar with a morphing pill indicator.
 * Adapted from "Floating Glassmorphic Navbar with Morphing Pill Indicator"
 * by themeocean on 21st.dev, restyled to the site's tokens.
 */

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Moon, Sun, Target } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";
import { NAV_SECTIONS, SECTIONS, sectionNumber, type SectionId } from "@/lib/sections";
import { cn } from "@/lib/utils";
import { useAppOptional } from "./app-state";
import { useChat } from "./chat/chat-context";
import { useActiveSection } from "./use-active-section";

const SPRING = { type: "spring", stiffness: 420, damping: 34, mass: 0.8 } as const;

/** In recruiter mode the sections are hidden, so links switch back to the full story first. */
function useNavClick() {
  const app = useAppOptional();
  return (id: string) => (e: React.MouseEvent) => {
    if (!app?.recruiter) return;
    e.preventDefault();
    app.goTo(id);
  };
}

/** Segmented pill: Full Story | 15s Recruiter Mode. */
export function ViewToggle({ className, compact }: { className?: string; compact?: boolean }) {
  const app = useAppOptional();
  if (!app) return null;
  const opts = [
    { on: false, label: "Full Story", short: "Full" },
    { on: true, label: "15s Recruiter Mode", short: "15s" },
  ];
  return (
    <div role="group" aria-label="View" className={cn("flex rounded-full bg-fg/[0.06] p-0.5", className)}>
      {opts.map((o) => {
        const selected = app.recruiter === o.on;
        return (
          <button
            key={o.label}
            type="button"
            aria-pressed={selected}
            aria-label={o.label}
            onClick={() => app.setRecruiter(o.on)}
            className={cn(
              "flex-1 whitespace-nowrap rounded-full px-3 py-1.5 font-mono text-[11.5px] font-medium transition-colors duration-150 ease-out",
              selected ? "bg-fg text-bg" : "text-muted hover:text-fg",
            )}
          >
            {compact ? (
              o.label
            ) : (
              <>
                <span className="2xl:hidden">{o.short}</span>
                <span className="hidden 2xl:inline">{o.label}</span>
              </>
            )}
          </button>
        );
      })}
    </div>
  );
}

function PaletteButton() {
  const app = useAppOptional();
  const [mac, setMac] = useState(false);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- platform is only known on the client
    setMac(/Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent));
  }, []);
  if (!app) return null;
  return (
    <button
      type="button"
      onClick={() => app.setPaletteOpen(true)}
      aria-label="Open command palette"
      aria-keyshortcuts={mac ? "Meta+K" : "Control+K"}
      className="hidden h-8 items-center rounded-full px-2.5 font-mono text-[11.5px] text-muted shadow-[inset_0_0_0_1px_var(--line)] transition-colors duration-150 hover:text-fg lg:flex"
    >
      {mac ? "⌘K" : "Ctrl K"}
    </button>
  );
}

function DesktopLinks({ active, reduce }: { active: SectionId | null; reduce: boolean }) {
  const navClick = useNavClick();
  const [hovered, setHovered] = useState<SectionId | null>(null);
  const layoutId = useId();
  const highlighted = hovered ?? active;
  return (
    <ul className="flex items-center" onPointerLeave={() => setHovered(null)}>
      {NAV_SECTIONS.map((s) => {
        const on = s.id === highlighted;
        return (
          <li key={s.id}>
            <a
              href={`#${s.id}`}
              onClick={navClick(s.id)}
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

export function ThemeToggle() {
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
  const app = useAppOptional();
  const seen = useActiveSection();
  // the full story is hidden in recruiter mode, so nothing is "current"
  const active = app?.recruiter ? null : seen;
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion() ?? false;
  const { openFit } = useChat();
  const navClick = useNavClick();

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
            <ViewToggle className="hidden lg:flex" />
            <PaletteButton />
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
                {NAV_SECTIONS.map((s, i) => (
                  <motion.li
                    key={s.id}
                    initial={reduce ? false : { opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1], delay: 0.03 * i }}
                  >
                    <a
                      href={`#${s.id}`}
                      onClick={(e) => {
                        setOpen(false);
                        navClick(s.id)(e);
                      }}
                      aria-current={s.id === active ? "true" : undefined}
                      className={cn(
                        "flex items-center gap-4 rounded-2xl px-4 py-3 text-[17px] font-medium transition-colors hover:bg-fg/[0.05]",
                        s.id === active && "bg-fg/[0.06]",
                      )}
                    >
                      <span className="font-mono text-[12px] text-accent-text">{sectionNumber(s.id)}</span>
                      {s.label}
                    </a>
                  </motion.li>
                ))}
              </ol>
              <div className="mt-2 grid gap-2 border-t border-line p-1 pt-3">
                <ViewToggle compact className="w-full" />
                <button
                  type="button"
                  onClick={() => {
                    setOpen(false);
                    openFit();
                  }}
                  className="btn-primary w-full"
                >
                  <Target className="size-4" /> Match a role
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </header>
  );
}

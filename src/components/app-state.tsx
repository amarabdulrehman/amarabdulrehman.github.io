"use client";

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { projectTech, type ProjectKey } from "@/lib/content";

type AppCtx = {
  /** "15s Recruiter Mode": the page collapses into a one-screen briefing. */
  recruiter: boolean;
  setRecruiter: (on: boolean) => void;
  paletteOpen: boolean;
  setPaletteOpen: (open: boolean) => void;
  storyOpen: boolean;
  setStoryOpen: (open: boolean) => void;
  /** A tool picked in the Stack section; matching projects are highlighted. */
  stackFilter: string | null;
  setStackFilter: (tech: string | null) => void;
  /** Scrolls to a section, leaving recruiter mode first if needed. */
  goTo: (id: string) => void;
};

const Ctx = createContext<AppCtx | null>(null);
const KEY = "view";

export function AppProvider({ children }: { children: ReactNode }) {
  const [recruiter, setRecruiterRaw] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [storyOpen, setStoryOpen] = useState(false);
  const [stackFilter, setStackFilter] = useState<string | null>(null);

  // ?view=15s wins (shareable link), then the visitor's last choice.
  useEffect(() => {
    const param = new URLSearchParams(window.location.search).get(KEY);
    let saved: string | null = null;
    try {
      saved = localStorage.getItem(KEY);
    } catch {}
    const on = param ? param === "15s" : saved === "15s";
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time sync from URL/storage after hydration
    if (on) setRecruiterRaw(true);
  }, []);

  const setRecruiter = useCallback((on: boolean) => {
    setRecruiterRaw(on);
    try {
      localStorage.setItem(KEY, on ? "15s" : "full");
    } catch {}
    const url = new URL(window.location.href);
    if (on) url.searchParams.set(KEY, "15s");
    else url.searchParams.delete(KEY);
    window.history.replaceState(null, "", url);
    window.scrollTo({ top: 0 });
  }, []);

  const goTo = useCallback(
    (id: string) => {
      const jump = () => document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
      if (recruiter) {
        setRecruiter(false);
        requestAnimationFrame(() => requestAnimationFrame(jump));
      } else jump();
      window.history.replaceState(null, "", `#${id}`);
    },
    [recruiter, setRecruiter],
  );

  return (
    <Ctx.Provider value={{ recruiter, setRecruiter, paletteOpen, setPaletteOpen, storyOpen, setStoryOpen, stackFilter, setStackFilter, goTo }}>
      {children}
    </Ctx.Provider>
  );
}

export function useApp() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useApp must be used inside <AppProvider>");
  return ctx;
}

export function useAppOptional() {
  return useContext(Ctx);
}

/**
 * How a featured project should look under the Stack filter:
 * "match" (highlight), "dim" (filtered out) or null (no filter active).
 */
export function useProjectHighlight(key: ProjectKey): "match" | "dim" | null {
  const app = useContext(Ctx);
  const f = app?.stackFilter;
  if (!f) return null;
  return projectTech[key].tech.includes(f) ? "match" : "dim";
}

export const highlightClass = (h: "match" | "dim" | null) =>
  h === "match"
    ? "ring-2 ring-accent ring-offset-2 ring-offset-bg transition-[opacity,box-shadow] duration-200 ease-out"
    : h === "dim"
      ? "opacity-35 transition-opacity duration-200 ease-out"
      : "transition-opacity duration-200 ease-out";

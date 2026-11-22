"use client";

import { ArrowDownToLine, Clock, CornerDownLeft, FileSearch, Layers, Mail, Sparkles, Target, Terminal, Timer } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { profile } from "@/lib/content";
import { cn } from "@/lib/utils";
import { useApp } from "./app-state";
import { useChat } from "./chat/chat-context";
import { useCopyEmail } from "./copy-email";
import { Modal } from "./ui/modal";

type Cmd = {
  id: string;
  label: string;
  hint: string;
  group: "Commands" | "Go to" | "Actions";
  icon: typeof Terminal;
  /** Return true to keep the palette open (e.g. it printed output). */
  run: () => boolean | void;
};

const AVAILABILITY = {
  name: profile.name,
  role: profile.role,
  status: "available",
  remote: true,
  timezone: "UTC+5",
  location: "Islamabad, PK",
  overlap: ["Europe (full)", "US (about 4 hrs)"],
  weekly_hours: "30–40 hrs",
  graduation: profile.graduation,
  email: profile.email,
  cv: `${profile.site}${profile.cv}`,
};

export function CommandPalette() {
  const { paletteOpen, setPaletteOpen, recruiter, setRecruiter, setStoryOpen, goTo } = useApp();
  const { openFit, setOpen: setChat } = useChat();
  const { copy } = useCopyEmail();

  // ⌘K / Ctrl+K anywhere
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen(!paletteOpen);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [paletteOpen, setPaletteOpen]);

  const commands: Cmd[] = useMemo(
    () => [
      { id: "curl", label: "curl amar --availability", hint: "Structured availability JSON", group: "Commands", icon: Terminal, run: () => true },
      { id: "inspect", label: "inspect prisma-timeout", hint: "The bug the test suite caught", group: "Commands", icon: FileSearch, run: () => setStoryOpen(true) },
      { id: "match", label: "match", hint: "Open the Role-Fit Matcher", group: "Commands", icon: Target, run: () => openFit() },
      { id: "ask", label: "ask", hint: "Ask Amar’s Stack (AI, grounded)", group: "Commands", icon: Sparkles, run: () => setChat(true) },
      { id: "toffeeos", label: "ToffeeOS", hint: "Flagship + live lab", group: "Go to", icon: Layers, run: () => goTo("toffeeos") },
      { id: "work", label: "Selected Work", hint: "RecruitAI, AutoTwin, DentalOS, E-Challan", group: "Go to", icon: Layers, run: () => goTo("work") },
      { id: "sites", label: "Client Sites", hint: "Live production vs. prototypes", group: "Go to", icon: Layers, run: () => goTo("client-sites") },
      { id: "copy", label: "Copy Email", hint: profile.email, group: "Actions", icon: Mail, run: () => void copy() },
      { id: "cv", label: "Download CV", hint: "PDF", group: "Actions", icon: ArrowDownToLine, run: () => {
        const a = document.createElement("a");
        a.href = profile.cv;
        a.download = "";
        a.click();
      } },
      { id: "mode", label: "Toggle 15s Mode", hint: recruiter ? "Back to the full story" : "One-screen recruiter briefing", group: "Actions", icon: Timer, run: () => setRecruiter(!recruiter) },
    ],
    [copy, goTo, openFit, recruiter, setChat, setRecruiter, setStoryOpen],
  );

  return (
    <Modal open={paletteOpen} onClose={() => setPaletteOpen(false)} label="Command palette" variant="palette">
      <Palette commands={commands} close={() => setPaletteOpen(false)} />
    </Modal>
  );
}

function Palette({ commands, close }: { commands: Cmd[]; close: () => void }) {
  const [q, setQ] = useState("");
  const [sel, setSel] = useState(0);
  const [output, setOutput] = useState<string | null>(null);
  const list = useRef<HTMLUListElement>(null);

  const query = q.trim().toLowerCase();
  const shown = commands.filter((c) => !query || `${c.label} ${c.hint}`.toLowerCase().includes(query) || c.label.startsWith(query));
  const active = shown[Math.min(sel, shown.length - 1)];

  const exec = (c: Cmd | undefined) => {
    if (!c) return;
    if (c.id === "curl") {
      setOutput(JSON.stringify(AVAILABILITY, null, 2));
      setQ("curl amar --availability");
      return;
    }
    // close first so focus/scroll lock are released before the command scrolls or opens another dialog
    close();
    requestAnimationFrame(() => c.run());
  };

  useEffect(() => {
    list.current?.querySelector<HTMLElement>('[aria-selected="true"]')?.scrollIntoView({ block: "nearest" });
  }, [sel]);

  return (
    <div className="overflow-hidden rounded-[20px] border border-line bg-card shadow-2xl">
      <div className="flex items-center gap-3 border-b border-line px-4">
        <span aria-hidden className="font-mono text-[14px] text-accent-text">$</span>
        <input
          autoFocus
          role="combobox"
          aria-expanded
          aria-controls="palette-list"
          aria-activedescendant={active ? `cmd-${active.id}` : undefined}
          aria-label="Type a command"
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setSel(0);
            setOutput(null);
          }}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown") {
              e.preventDefault();
              setSel((s) => Math.min(s + 1, shown.length - 1));
            } else if (e.key === "ArrowUp") {
              e.preventDefault();
              setSel((s) => Math.max(s - 1, 0));
            } else if (e.key === "Enter") {
              e.preventDefault();
              exec(active);
            }
          }}
          placeholder="curl amar --availability, match, inspect prisma-timeout…"
          className="h-14 flex-1 bg-transparent font-mono text-[14px] outline-none placeholder:text-muted"
        />
        <kbd className="rounded-md border border-line px-1.5 py-0.5 font-mono text-[11px] text-muted">esc</kbd>
      </div>

      {output ? (
        <div className="p-4">
          <p className="mb-2 flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.08em] text-muted">
            <Clock className="size-3" /> 200 OK · application/json
          </p>
          <pre className="max-h-[50vh] overflow-auto rounded-xl bg-bg-alt p-4 font-mono text-[12.5px] leading-relaxed" aria-live="polite">
            {output}
          </pre>
          <button type="button" onClick={() => setOutput(null)} className="mt-3 font-mono text-[12px] text-link hover:underline">
            ← back to commands
          </button>
        </div>
      ) : (
        <ul id="palette-list" ref={list} role="listbox" aria-label="Commands" className="max-h-[min(60vh,420px)] overflow-y-auto p-2">
          {shown.length === 0 && <li className="px-3 py-6 text-center text-[14px] text-muted">No command matches “{q}”.</li>}
          {shown.map((c, i) => {
            const on = c === active;
            const first = i === 0 || shown[i - 1].group !== c.group;
            return (
              <li key={c.id} role="presentation">
                {first && <p className="px-3 pb-1 pt-2 font-mono text-[10.5px] uppercase tracking-[0.1em] text-muted">{c.group}</p>}
                <div
                  id={`cmd-${c.id}`}
                  role="option"
                  aria-selected={on}
                  onPointerMove={() => setSel(i)}
                  onClick={() => exec(c)}
                  className={cn(
                    "flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 transition-colors duration-150 ease-out",
                    on ? "bg-fg/[0.07]" : "",
                  )}
                >
                  <c.icon className={cn("size-4 shrink-0", on ? "text-accent-text" : "text-muted")} />
                  <span className={cn("text-[14px]", c.group === "Commands" && "font-mono")}>{c.label}</span>
                  <span className="ml-auto truncate text-[12px] text-muted">{c.hint}</span>
                  {on && <CornerDownLeft className="size-3.5 shrink-0 text-muted" />}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

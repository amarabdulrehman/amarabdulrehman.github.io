"use client";

import { useReducedMotion } from "motion/react";
import { Database, FileSearch, HardDrive, Monitor, Plus, Server, TimerOff, Wifi, WifiOff } from "lucide-react";
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { STATIC_PULSE, type Pulse } from "@/lib/pulse";
import { cn } from "@/lib/utils";
import { useApp } from "./app-state";

/* ====================================================================================
 * Production heartbeat
 * ================================================================================== */

const STATUS_TEXT: Record<Pulse["status"], string> = {
  operational: "Operational",
  "in-production": "In production",
  degraded: "Degraded",
  down: "Down",
};

export function PulseBar() {
  const [pulse, setPulse] = useState<Pulse>(STATIC_PULSE);

  useEffect(() => {
    const ctrl = new AbortController();
    fetch("/api/public-pulse", { signal: ctrl.signal })
      .then((r) => (r.ok ? r.json() : null))
      .then((p: Pulse | null) => p && setPulse(p))
      .catch(() => {}); // keep the static fallback
    return () => ctrl.abort();
  }, []);

  const healthy = pulse.status === "operational" || pulse.status === "in-production";
  const parts = [
    pulse.label,
    STATUS_TEXT[pulse.status],
    `${pulse.dailyOrders} daily orders`,
    ...(pulse.failedSyncs !== null ? [`${pulse.failedSyncs} failed syncs`] : []),
  ];

  return (
    <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 border-b border-line px-4 py-2.5 font-mono text-[11.5px] uppercase tracking-[0.08em] sm:px-5">
      <p className="flex min-w-0 items-center gap-2">
        <span className="relative flex size-2 shrink-0" aria-hidden>
          {pulse.source === "live" && healthy && (
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-500 opacity-60 motion-reduce:hidden" />
          )}
          <span className={cn("relative inline-flex size-2 rounded-full", healthy ? "bg-emerald-500" : "bg-amber-500")} />
        </span>
        <span className="sr-only">Production status: </span>
        <span className="truncate text-fg">
          {parts.map((p, i) => (
            <span key={p}>
              {i > 0 && <span className="px-1.5 text-muted">·</span>}
              {p}
            </span>
          ))}
        </span>
      </p>
      <p className="text-muted">{pulse.source === "live" ? "live · anonymous aggregate" : "verified figures"}</p>
    </div>
  );
}

/* ====================================================================================
 * IndexedDB queue (real, in this browser) with an in-memory fallback
 * ================================================================================== */

type Order = { id: number; total: number; method: "cash" | "card" };

function createQueue() {
  const mem = new Map<number, Order>();
  let dbp: Promise<IDBDatabase | null> | null = null;
  const db = () =>
    (dbp ??= new Promise((resolve) => {
      try {
        const req = indexedDB.open("toffeeos-lab", 1);
        req.onupgradeneeded = () => req.result.createObjectStore("queue", { keyPath: "id" });
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => resolve(null);
      } catch {
        resolve(null);
      }
    }));
  const tx = async <T,>(mode: IDBTransactionMode, fn: (s: IDBObjectStore) => IDBRequest<T>, fallback: () => T): Promise<T> => {
    const d = await db();
    if (!d) return fallback();
    return new Promise((resolve) => {
      const req = fn(d.transaction("queue", mode).objectStore("queue"));
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => resolve(fallback());
    });
  };
  return {
    put: (o: Order) => tx("readwrite", (s) => s.put(o), () => (mem.set(o.id, o), o.id as IDBValidKey)),
    remove: (id: number) => tx("readwrite", (s) => s.delete(id), () => void mem.delete(id)),
    all: () => tx<Order[]>("readonly", (s) => s.getAll() as IDBRequest<Order[]>, () => [...mem.values()]).then((a) => a.sort((x, y) => x.id - y.id)),
    clear: () => tx("readwrite", (s) => s.clear(), () => void mem.clear()),
  };
}

/* ====================================================================================
 * "Break My System" architecture lab
 * ================================================================================== */

type LinkState = "idle" | "active" | "offline" | "timeout";
type Tone = "ok" | "warn" | "bad" | "info";
type LogLine = { n: number; text: string; tone: Tone };

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
const TOTALS = [650, 980, 1200, 1850, 2400];
const pkr = (n: number) => `PKR ${n.toLocaleString("en-US")}`;

function Connector({ state }: { state: LinkState }) {
  return (
    <div aria-hidden className="relative flex items-center justify-center lg:flex-1">
      <div
        className={cn(
          "h-6 w-0 border-l-2 transition-colors duration-200 ease-out lg:h-0 lg:w-full lg:border-l-0 lg:border-t-2",
          state === "idle" && "border-line",
          state === "active" && "border-accent",
          state === "offline" && "border-dashed border-amber-500",
          state === "timeout" && "border-dashed border-red-500",
        )}
      />
      {state === "active" && (
        <span className="absolute top-1/2 hidden size-1.5 -translate-y-1/2 rounded-full bg-accent shadow-[0_0_10px_var(--accent)] [animation:packet_350ms_ease-out_forwards] lg:block" />
      )}
    </div>
  );
}

function Node({ icon, name, sub, state }: { icon: ReactNode; name: string; sub: string; state?: "ok" | "warn" | "bad" | "busy" }) {
  return (
    <div
      className={cn(
        "flex min-w-0 items-center gap-3 rounded-xl border bg-card px-3 py-2.5 transition-colors duration-200 ease-out lg:w-[10.5rem] lg:shrink-0 lg:flex-col lg:items-start lg:gap-2",
        state === "warn" ? "border-amber-500/60" : state === "bad" ? "border-red-500/60" : state === "busy" ? "border-accent/60" : "border-line",
      )}
    >
      <span className="text-muted">{icon}</span>
      <span className="min-w-0">
        <span className="block text-[13px] font-semibold leading-tight">{name}</span>
        <span
          className={cn(
            "mt-0.5 block truncate font-mono text-[10.5px] uppercase tracking-[0.06em]",
            state === "warn" ? "text-amber-500" : state === "bad" ? "text-red-400" : "text-muted",
          )}
        >
          {sub}
        </span>
      </span>
    </div>
  );
}

export function ChaosLab({ aside }: { aside?: ReactNode }) {
  const reduce = useReducedMotion();
  const { setStoryOpen } = useApp();
  const queue = useRef<ReturnType<typeof createQueue> | null>(null);
  const root = useRef<HTMLDivElement>(null);

  const [online, setOnline] = useState(true);
  const [armed, setArmed] = useState(false);
  const [queued, setQueued] = useState(0);
  const [synced, setSynced] = useState(0);
  const [links, setLinks] = useState<[LinkState, LinkState, LinkState]>(["idle", "idle", "idle"]);
  const [dbState, setDbState] = useState<"ok" | "bad" | "busy">("ok");
  const [log, setLog] = useState<LogLine[]>([]);

  const onlineRef = useRef(true);
  const armedRef = useRef(false);
  const busy = useRef(false);
  const nextId = useRef(1041);
  const lineN = useRef(0);

  const say = useCallback((text: string, tone: Tone = "info") => {
    setLog((l) => [...l.slice(-5), { n: ++lineN.current, text, tone }]);
  }, []);
  const queuedRef = useRef(0);
  const refreshCount = useCallback(async () => {
    queuedRef.current = (await queue.current!.all()).length;
    setQueued(queuedRef.current);
  }, []);

  const flush = useCallback(async () => {
    if (busy.current || !onlineRef.current || !queue.current) return;
    busy.current = true;
    try {
      for (;;) {
        const [o] = await queue.current.all();
        if (!o || !onlineRef.current) break;
        setLinks(["idle", "active", "idle"]);
        await sleep(350);
        setLinks(["idle", "idle", "active"]);
        setDbState("busy");
        if (armedRef.current) {
          armedRef.current = false;
          setArmed(false);
          say(`API → Postgres: BEGIN transaction for #${o.id}`);
          await sleep(650);
          setLinks(["idle", "idle", "timeout"]);
          setDbState("bad");
          say(`✗ #${o.id}: transaction timed out → ROLLBACK, 0 rows written`, "bad");
          await sleep(650);
          say(`#${o.id} stays in IndexedDB · retrying`, "warn");
          await sleep(500);
          setLinks(["idle", "idle", "active"]);
          setDbState("busy");
          await sleep(300);
          say(`↻ Retry 1: #${o.id} committed · bill intact`, "ok");
        } else {
          await sleep(250);
        }
        await queue.current.remove(o.id);
        setSynced((n) => n + 1);
        setDbState("ok");
        say(`✓ #${o.id} synced → Postgres (${pkr(o.total)} · ${o.method})`, "ok");
        await refreshCount();
      }
    } finally {
      busy.current = false;
      setLinks(["idle", onlineRef.current ? "idle" : "offline", "idle"]);
    }
  }, [refreshCount, say]);

  const ringUp = useCallback(async () => {
    if (!queue.current) return;
    const o: Order = {
      id: nextId.current++,
      total: TOTALS[Math.floor(Math.random() * TOTALS.length)],
      method: Math.random() < 0.55 ? "cash" : "card",
    };
    await queue.current.put(o);
    setLinks((l) => ["active", l[1], l[2]]);
    setTimeout(() => setLinks((l) => ["idle", l[1], l[2]]), 350);
    say(`POS #${o.id} → IndexedDB (${pkr(o.total)} · ${o.method})`, onlineRef.current ? "info" : "warn");
    await refreshCount();
    void flush();
  }, [flush, refreshCount, say]);

  // start from an empty queue each visit
  useEffect(() => {
    queue.current = createQueue();
    void queue.current.clear();
    say("Ready. Orders write to a real IndexedDB queue in your browser.");
  }, [say]);

  // a steady trickle of mock café orders while the lab is on screen
  useEffect(() => {
    if (reduce || !root.current) return;
    let timer: ReturnType<typeof setInterval> | null = null;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !timer) timer = setInterval(() => {
        // keep the offline backlog readable
        if (document.visibilityState === "visible" && queuedRef.current < 8) void ringUp();
      }, 2600);
      if (!e.isIntersecting && timer) {
        clearInterval(timer);
        timer = null;
      }
    });
    io.observe(root.current);
    return () => {
      io.disconnect();
      if (timer) clearInterval(timer);
    };
  }, [reduce, ringUp]);

  const toggleNet = () => {
    const next = !onlineRef.current;
    onlineRef.current = next;
    setOnline(next);
    if (!next) {
      setLinks(["idle", "offline", "idle"]);
      say("⚠ Internet cut. POS keeps selling; orders queue locally.", "warn");
    } else {
      setLinks(["idle", "idle", "idle"]);
      say(`Network restored → replaying ${queued} queued order${queued === 1 ? "" : "s"} in sequence`, "info");
      void flush();
    }
  };

  const armTimeout = () => {
    armedRef.current = true;
    setArmed(true);
    say(onlineRef.current ? "DB timeout armed: next sync will stall" : "DB timeout armed: fires when the network is back", "warn");
    if (onlineRef.current && queued === 0) void ringUp();
  };

  return (
    <div ref={root} className="grid grid-cols-1 gap-5 [&>*]:min-w-0">
      {/* diagram */}
      <div className="flex flex-col items-stretch lg:flex-row lg:items-center">
        <Node icon={<Monitor className="size-4" />} name="POS Client" sub={online ? "taking orders" : "offline · selling"} state={online ? "ok" : "warn"} />
        <Connector state={links[0]} />
        <Node
          icon={<HardDrive className="size-4" />}
          name="IndexedDB Queue"
          sub={`${queued} queued`}
          state={queued > 0 && !online ? "warn" : queued > 0 ? "busy" : "ok"}
        />
        <Connector state={links[1]} />
        <Node icon={<Server className="size-4" />} name="Next.js API" sub={online ? "reachable" : "unreachable"} state={online ? "ok" : "warn"} />
        <Connector state={links[2]} />
        <Node
          icon={<Database className="size-4" />}
          name="Supabase Postgres"
          sub={dbState === "bad" ? "tx timeout" : `${synced} committed`}
          state={dbState === "bad" ? "bad" : dbState === "busy" ? "busy" : "ok"}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.4fr_1fr] [&>*]:min-w-0">
      <div className="grid grid-cols-1 content-start gap-4 [&>*]:min-w-0">
      {/* fault injection */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={toggleNet}
          aria-pressed={!online}
          className={cn(
            "inline-flex h-9 items-center gap-2 rounded-full px-4 text-[13px] font-medium transition-colors duration-150 ease-out",
            online ? "bg-fg/[0.07] text-fg shadow-[inset_0_0_0_1px_var(--line)] hover:bg-fg/[0.1]" : "bg-amber-500 text-black hover:bg-amber-400",
          )}
        >
          {online ? <WifiOff className="size-4" /> : <Wifi className="size-4" />}
          {online ? "Cut Internet" : "Restore"}
        </button>
        <button
          type="button"
          onClick={armTimeout}
          disabled={armed}
          className="inline-flex h-9 items-center gap-2 rounded-full bg-fg/[0.07] px-4 text-[13px] font-medium text-fg shadow-[inset_0_0_0_1px_var(--line)] transition-colors duration-150 ease-out hover:bg-fg/[0.1] disabled:opacity-60"
        >
          <TimerOff className="size-4" /> {armed ? "Timeout armed…" : "Simulate DB Timeout"}
        </button>
        <button
          type="button"
          onClick={() => void ringUp()}
          className="inline-flex h-9 items-center gap-2 rounded-full px-3 text-[13px] font-medium text-muted transition-colors duration-150 ease-out hover:text-fg"
        >
          <Plus className="size-4" /> Ring up order
        </button>
      </div>

      {/* event log */}
      <ol aria-live="polite" aria-label="Sync log" className="min-h-[10.5rem] rounded-xl border border-line bg-bg p-3 font-mono text-[11.5px] leading-[1.75]">
        {log.map((l) => (
          <li
            key={l.n}
            className={cn(
              "break-words sm:truncate",
              l.tone === "ok" && "text-emerald-400",
              l.tone === "warn" && "text-amber-400",
              l.tone === "bad" && "text-red-400",
              l.tone === "info" && "text-muted",
            )}
          >
            <span className="mr-2 text-muted/60">{String(l.n).padStart(3, "0")}</span>
            {l.text}
          </li>
        ))}
      </ol>
      <p className="text-[13px] leading-relaxed text-muted">
        The timeout replay mirrors a real Prisma transaction timeout that the 333 Playwright + 228 Vitest suite caught before release.{" "}
        <button type="button" onClick={() => setStoryOpen(true)} className="inline-flex items-center gap-1 font-mono text-[12px] text-link hover:underline">
          <FileSearch className="size-3.5" /> inspect prisma-timeout
        </button>
      </p>
      </div>
      {aside && <div className="grid grid-cols-1 content-start gap-4">{aside}</div>}
      </div>
    </div>
  );
}

/* ====================================================================================
 * Punjab tax split
 * ================================================================================== */

const ORDER = 1200;
const RATES = { cash: 0.16, card: 0.08 } as const;

export function TaxPill() {
  const [method, setMethod] = useState<keyof typeof RATES>("cash");
  const tax = Math.round(ORDER * RATES[method]);
  return (
    <div className="rounded-xl border border-line bg-card p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="eyebrow">Punjab tax split</p>
        <div role="radiogroup" aria-label="Payment method" className="flex rounded-full bg-fg/[0.06] p-0.5">
          {(Object.keys(RATES) as (keyof typeof RATES)[]).map((m) => (
            <button
              key={m}
              type="button"
              role="radio"
              aria-checked={method === m}
              onClick={() => setMethod(m)}
              className={cn(
                "rounded-full px-3 py-1 font-mono text-[12px] transition-colors duration-150 ease-out",
                method === m ? "bg-accent text-accent-fg" : "text-muted hover:text-fg",
              )}
            >
              {m === "cash" ? "Cash" : "Card"} ({RATES[m] * 100}%)
            </button>
          ))}
        </div>
      </div>
      <dl className="mt-4 grid grid-cols-3 gap-2 font-mono tabular-nums" aria-live="polite">
        {[
          ["Order", pkr(ORDER)],
          ["Rate", `${RATES[method] * 100}%`],
          ["Tax", pkr(tax)],
        ].map(([k, v]) => (
          <div key={k}>
            <dt className="text-[10.5px] uppercase tracking-[0.08em] text-muted">{k}</dt>
            <dd className={cn("mt-1 text-[15px] font-semibold", k === "Tax" && "text-accent-text")}>{v}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

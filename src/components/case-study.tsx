import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import type { ReactNode } from "react";
import { caseStudies, type CaseBlock } from "@/lib/case-studies";
import { CopyEmailButton } from "./copy-email";
import { ThemeToggle } from "./nav";

/** Shared pieces of every /work/* case study, so they read as one series. */

export function CaseHeader({ back = "/#toffeeos" }: { back?: string }) {
  return (
    <header id="top" className="sticky top-0 z-50 border-b border-line bg-glass backdrop-blur-2xl backdrop-saturate-[1.8]">
      <div className="container-apple flex h-14 items-center justify-between">
        <Link href={back} className="inline-flex items-center gap-2 text-[14px] font-medium text-muted hover:text-fg">
          <ArrowLeft className="size-4" /> Back to portfolio
        </Link>
        <div className="flex items-center gap-2">
          <span className="hidden font-mono text-[11px] uppercase tracking-[0.1em] text-muted sm:inline">Case study</span>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}

export function FactRow({ facts }: { facts: [string, string][] }) {
  return (
    <dl className="mt-10 grid max-w-2xl grid-cols-2 gap-y-5 border-y border-line py-6 sm:grid-cols-4">
      {facts.map(([k, v]) => (
        <div key={k} className="pr-4">
          <dt className="eyebrow">{k}</dt>
          <dd className="mt-1.5 text-[14px] font-medium">{v}</dd>
        </div>
      ))}
    </dl>
  );
}

export function ChapterIndex({ chapters }: { chapters: readonly { id: string; label: string }[] }) {
  return (
    <nav aria-label="Chapters" className="mt-14">
      <ol className="flex flex-wrap gap-2">
        {chapters.map((c, i) => (
          <li key={c.id}>
            <a href={`#${c.id}`} className="pill-tag hover:text-fg">
              <span className="text-accent-text">{String(i + 1).padStart(2, "0")}</span> {c.label}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}

export function Chapter({
  n,
  id,
  label,
  title,
  children,
}: {
  n: number;
  id: string;
  label: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="scroll-mt-24 border-t border-line py-16 sm:py-20">
      <div className="grid gap-6 md:grid-cols-[12rem_1fr] md:gap-10">
        <p className="font-mono text-[12px] uppercase tracking-[0.12em] text-muted">
          <span className="text-accent-text">{String(n).padStart(2, "0")}</span>
          <span className="mx-2" aria-hidden>
            ·
          </span>
          {label}
        </p>
        <div className="max-w-2xl">
          <h2 id={`${id}-title`} className="headline-md text-balance">
            {title}
          </h2>
          <div className="mt-6 grid gap-5 text-[17px] leading-relaxed text-muted [&_strong]:font-semibold [&_strong]:text-fg">
            {children}
          </div>
        </div>
      </div>
    </section>
  );
}

/** Renders `**bold**` and `` `code` `` inside a plain string. */
export function Rich({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g);
  return (
    <>
      {parts.map((p, i) =>
        p.startsWith("**") ? (
          <strong key={i}>{p.slice(2, -2)}</strong>
        ) : p.startsWith("`") ? (
          <code key={i} className="rounded bg-fg/[0.06] px-1.5 py-0.5 font-mono text-[0.85em] text-fg">
            {p.slice(1, -1)}
          </code>
        ) : (
          p
        ),
      )}
    </>
  );
}

export function Block({ block }: { block: CaseBlock }) {
  switch (block.kind) {
    case "grid":
      return (
        <ul className="mt-2 grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2">
          {block.items.map(([name, body]) => (
            <li key={name} className="bg-card p-5">
              <p className="text-[15px] font-semibold text-fg">{name}</p>
              <p className="mt-1 text-[14px] leading-relaxed">{body}</p>
            </li>
          ))}
        </ul>
      );
    case "pipeline":
      return (
        <ol className="mt-2 overflow-hidden rounded-2xl border border-line">
          {block.steps.map(([k, v], i) => (
            <li key={k} className="grid grid-cols-[2.25rem_7.5rem_1fr] items-baseline gap-3 border-b border-line px-5 py-3.5 last:border-b-0">
              <span className="font-mono text-[12px] text-accent-text">{String(i + 1).padStart(2, "0")}</span>
              <span className="font-mono text-[12px] uppercase tracking-[0.08em]">{k}</span>
              <span className="text-[15px] text-fg">{v}</span>
            </li>
          ))}
        </ol>
      );
    case "table":
      return (
        <dl className="mt-2 overflow-hidden rounded-2xl border border-line">
          {block.rows.map(([k, v]) => (
            <div key={k} className="grid grid-cols-[8.5rem_1fr] gap-4 border-b border-line px-5 py-3.5 last:border-b-0">
              <dt className="font-mono text-[12px] uppercase tracking-[0.08em]">{k}</dt>
              <dd className="text-[15px] text-fg">{v}</dd>
            </div>
          ))}
        </dl>
      );
    case "stats":
      return (
        <div
          className="mt-2 grid overflow-hidden rounded-2xl border border-line"
          style={{ gridTemplateColumns: `repeat(${block.items.length}, minmax(0, 1fr))` }}
        >
          {block.items.map(([v, l], i) => (
            <p key={l} className={`flex flex-col p-5 ${i > 0 ? "border-l border-line" : ""}`}>
              <span className="text-[30px] font-semibold leading-none tracking-[-0.04em] text-fg tabular-nums">{v}</span>{" "}
              <span className="mt-2 font-mono text-[11px] uppercase tracking-[0.08em]">{l}</span>
            </p>
          ))}
        </div>
      );
  }
}

export function CaseCta({ secondary }: { secondary?: ReactNode }) {
  return (
    <div className="bezel mt-6">
      <div className="bezel-core flex flex-col gap-8 p-8 sm:p-12 md:flex-row md:items-end md:justify-between">
        <div className="max-w-md">
          <p className="text-[26px] font-semibold leading-tight tracking-[-0.03em]">
            Hiring a remote engineer? <span className="text-accent">Let’s talk.</span>
          </p>
          <p className="mt-3 text-[15px] leading-relaxed text-muted">
            Available for remote full-stack and Python/AI roles, 30–40 hrs/week.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <CopyEmailButton className="max-w-full" />
          {secondary}
        </div>
      </div>
    </div>
  );
}

/** "More case studies" strip at the foot of every case study. */
export function MoreCaseStudies({ current }: { current: string }) {
  const all = [
    { slug: "toffeeos", name: "ToffeeOS", kicker: "Production · Café POS", href: "/work/toffeeos" },
    ...caseStudies.map((c) => ({ slug: c.slug, name: c.name, kicker: c.kicker, href: `/work/${c.slug}` })),
  ].filter((c) => c.slug !== current);
  return (
    <nav aria-label="More case studies" className="mt-20 border-t border-line pt-10">
      <p className="eyebrow">More case studies</p>
      <ul className="mt-5 grid gap-3 sm:grid-cols-3">
        {all.map((c) => (
          <li key={c.slug}>
            <Link href={c.href} className="group flex h-full flex-col rounded-2xl border border-line bg-card p-5 transition-colors hover:border-accent/50">
              <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-muted">{c.kicker}</span>
              <span className="mt-2 inline-flex items-center gap-1.5 text-[17px] font-semibold tracking-[-0.02em]">
                {c.name} <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import { ArrowRight, ArrowUpRight, Sparkles } from "lucide-react";
import { Fragment, type ReactNode } from "react";
import { projects, recruitAI, type ProjectVisual } from "@/lib/content";
import { cn } from "@/lib/utils";
import { highlightClass, useProjectHighlight } from "./app-state";
import { useChat } from "./chat/chat-context";
import { EASE, Reveal } from "./motion";
import { SectionHeader } from "./section-header";
import { SpotlightCard } from "./ui/spotlight-card";

type Project = (typeof projects)[number];

function Ranking() {
  const reduce = useReducedMotion();
  return (
    <div className="rounded-[22px] bg-bg p-6 shadow-[0_30px_60px_-30px_rgb(0_0_0/0.3),inset_0_0_0_1px_var(--line)]">
      <div className="flex items-center justify-between text-[13px]">
        <span className="font-semibold">Senior Python Engineer</span>
        <span className="text-muted">1,000 resumes</span>
      </div>
      <ol className="mt-5 grid gap-3">
        {recruitAI.ranking.map((c, i) => (
          <li key={c.name} className="grid grid-cols-[1.25rem_1fr_auto] items-center gap-3 text-[14px]">
            <span className="text-muted tabular-nums">{i + 1}</span>
            <div>
              <div className="flex justify-between">
                <span className="font-medium">{c.name}</span>
              </div>
              <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-fg/[0.08]">
                <motion.div
                  className="h-full rounded-full bg-accent"
                  initial={reduce ? { width: `${c.score}%` } : { width: 0 }}
                  whileInView={{ width: `${c.score}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.2, ease: EASE, delay: 0.2 + i * 0.12 }}
                />
              </div>
            </div>
            <span className="font-semibold tabular-nums">{c.score}%</span>
          </li>
        ))}
      </ol>
      <p className="mt-5 border-t border-line pt-4 text-[12px] text-muted">
        Matched: {recruitAI.matched.join(" · ")}
      </p>
    </div>
  );
}

/* ---------- Visual slots: coded diagrams until a screenshot is dropped into `image` ---------- */

function Node({ children, hot }: { children: ReactNode; hot?: boolean }) {
  return (
    <span
      className={
        "rounded-lg border px-2.5 py-1.5 text-center font-mono text-[11px] leading-tight " +
        (hot ? "border-accent/40 bg-accent/10 text-accent-text" : "border-line bg-card text-fg")
      }
    >
      {children}
    </span>
  );
}

function AutoTwinDiagram() {
  return (
    <div className="grid h-full content-center gap-3 p-4 sm:p-5" aria-hidden>
      <div className="grid grid-cols-[1fr_auto_1.4fr] items-center gap-2">
        <Node>floor_plan.json</Node>
        <ArrowRight className="size-3.5 text-muted" />
        <Node hot>Unreal Engine 5.5 · 3D twin</Node>
      </div>
      <div className="grid grid-cols-3 gap-2 text-center font-mono text-[9.5px] uppercase tracking-[0.06em] text-muted">
        <span>50+ agents</span>
        <span>checkpoints</span>
        <span>attack runs</span>
      </div>
      <div className="grid grid-cols-[1fr_auto_1fr_auto_1fr] items-center gap-1.5">
        <Node>MQTT</Node>
        <ArrowRight className="size-3 text-muted" />
        <Node>FastAPI</Node>
        <ArrowRight className="size-3 text-muted" />
        <Node>Flutter</Node>
      </div>
    </div>
  );
}

const TABLES = [
  { name: "clinics", cols: ["id", "name", "plan"] },
  { name: "appointments", cols: ["clinic_id", "patient_id", "starts_at"] },
  { name: "invoices", cols: ["clinic_id", "total", "status"] },
  { name: "inventory", cols: ["clinic_id", "item", "qty"] },
];

function DentalOSSchema() {
  return (
    <div className="grid h-full content-center gap-2 p-4 sm:p-5" aria-hidden>
      <div className="grid grid-cols-2 gap-2">
        {TABLES.map((t) => (
          <div key={t.name} className="overflow-hidden rounded-lg border border-line bg-card">
            <p className="border-b border-line bg-fg/[0.03] px-2.5 py-1 font-mono text-[10.5px] font-semibold">{t.name}</p>
            <ul className="px-2.5 py-1 font-mono text-[10px] leading-[1.6] text-muted">
              {t.cols.map((c) => (
                <li key={c} className={c === "clinic_id" ? "text-accent-text" : undefined}>
                  {c}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <p className="text-center font-mono text-[9.5px] uppercase tracking-[0.06em] text-muted">
        every row scoped by <span className="text-accent-text">clinic_id</span>
      </p>
    </div>
  );
}

const STEPS = ["Camera Frame", "Seatbelt Detection", "OCR Plate Read", "Challan Dispatch"];

function EChallanPipeline() {
  return (
    <div className="grid h-full content-center p-4 sm:p-5">
      <ol aria-label="Pipeline: Camera Frame, Seatbelt Detection, OCR Plate Read, Challan Dispatch" className="grid gap-1">
        {STEPS.map((step, i) => (
          <Fragment key={step}>
            <li className="flex items-center gap-3">
              <span aria-hidden className="grid size-6 shrink-0 place-items-center rounded-full bg-accent/10 font-mono text-[10px] font-semibold text-accent-text">
                {i + 1}
              </span>
              <Node hot={i === STEPS.length - 1}>{step}</Node>
            </li>
            {i < STEPS.length - 1 && <li aria-hidden className="ml-3 h-1.5 w-px bg-line" />}
          </Fragment>
        ))}
      </ol>
    </div>
  );
}

const DIAGRAMS: Record<ProjectVisual, () => ReactNode> = {
  autotwin: AutoTwinDiagram,
  dentalos: DentalOSSchema,
  echallan: EChallanPipeline,
};

function MediaFrame({ p }: { p: Project }) {
  const Diagram = DIAGRAMS[p.visual];
  return (
    <figure className="overflow-hidden rounded-[14px] border border-line bg-bg-alt">
      <div className="flex items-center justify-between border-b border-line px-3 py-2">
        <span className="flex gap-1" aria-hidden>
          <span className="size-2 rounded-full bg-fg/15" />
          <span className="size-2 rounded-full bg-fg/15" />
          <span className="size-2 rounded-full bg-fg/15" />
        </span>
        <figcaption className="font-mono text-[10.5px] uppercase tracking-[0.08em] text-muted">{p.visualLabel}</figcaption>
      </div>
      <div className="grid-bg relative aspect-[16/11]">
        {p.image ? (
          <Image
            src={p.image}
            alt={`${p.title}: ${p.visualLabel.toLowerCase()}`}
            fill
            sizes="(min-width: 1024px) 340px, (min-width: 768px) 50vw, 100vw"
            className="object-cover"
          />
        ) : (
          <Diagram />
        )}
      </div>
    </figure>
  );
}

/** Repo/demo links when they're public; otherwise a direct line to Ask Amar, so no card is a dead end. */
function ProjectLinks({ p }: { p: Project }) {
  const { setOpen, send } = useChat();
  if (p.links.length > 0) {
    return (
      <div className="flex flex-wrap gap-x-5 gap-y-2 text-[15px]">
        {p.links.map((l) => (
          <a key={l.href} href={l.href} target="_blank" rel="noopener noreferrer" className="link-arrow">
            {l.label} <ArrowUpRight className="size-3.5" />
          </a>
        ))}
      </div>
    );
  }
  return (
    <button
      type="button"
      onClick={() => {
        setOpen(true);
        void send(`How did Amar build ${p.title}?`);
      }}
      className="link-arrow text-[15px]"
    >
      <Sparkles className="mr-1 size-3.5" /> Ask how it was built
    </button>
  );
}

function RecruitAIFrame({ children }: { children: ReactNode }) {
  const hl = useProjectHighlight("recruitai");
  return <div className={cn("bezel", highlightClass(hl))}>{children}</div>;
}

function ProjectCard({ p, i }: { p: Project; i: number }) {
  const hl = useProjectHighlight(p.visual);
  return (
    <Reveal delay={i * 0.08} className="h-full">
      <div className={cn("bezel h-full", highlightClass(hl))}>
        <SpotlightCard className="bezel-core flex h-full flex-col p-5 sm:p-6">
          <MediaFrame p={p} />
          <div className="mt-6 flex flex-wrap items-center gap-2">
            <span className="eyebrow">{p.kicker}</span>
            {p.badge && (
              <span className="rounded-full bg-accent/10 px-2.5 py-0.5 font-mono text-[11px] font-semibold uppercase tracking-[0.06em] text-link">{p.badge}</span>
            )}
          </div>
          <h3 className="mt-3 text-[24px] font-semibold tracking-[-0.03em]">{p.title}</h3>
          <p className="mt-2 flex-1 text-[15px] leading-relaxed text-muted">{p.body}</p>
          <p className="mt-6 border-t border-line pt-4 font-mono text-[12px] text-muted">{p.tech}</p>
          <div className="mt-4">
            <ProjectLinks p={p} />
          </div>
        </SpotlightCard>
      </div>
    </Reveal>
  );
}

export function SelectedWork() {
  return (
    <section id="work" className="section-y scroll-mt-24 border-t border-line">
      <div className="container-apple">
        <SectionHeader
          id="work"
          meta={`${projects.length + 1} systems`}
          title={
            <>
              Systems I’ve engineered. <span className="text-muted">Beyond ToffeeOS.</span>
            </>
          }
          summary="An NLP ranking engine, a 3D security simulation, multi-tenant clinic software and a computer-vision pipeline: Python, AI and full-stack work, end to end."
        />

        {/* RecruitAI feature */}
        <Reveal>
          <RecruitAIFrame>
          <SpotlightCard className="bezel-core grid items-center gap-10 overflow-hidden bg-bg-alt p-8 sm:p-12 md:grid-cols-2">
            <div>
              <p className="eyebrow">{recruitAI.kicker}</p>
              <h3 className="headline-md mt-2">{recruitAI.title}</h3>
              <p className="mt-4 text-[17px] leading-relaxed text-muted">{recruitAI.body}</p>
              <p className="mt-6 font-mono text-[12px] text-muted">{recruitAI.tech}</p>
              <a href={recruitAI.demo} target="_blank" rel="noopener noreferrer" className="btn-primary group mt-7">
                Live demo
                <span className="btn-icon">
                  <ArrowUpRight className="size-4" />
                </span>
              </a>
            </div>
            <Ranking />
          </SpotlightCard>
          </RecruitAIFrame>
        </Reveal>

        <ul className="mt-3 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((p, i) => (
            <li key={p.title} className={i === projects.length - 1 ? "md:col-span-2 lg:col-span-1" : undefined}>
              <ProjectCard p={p} i={i} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

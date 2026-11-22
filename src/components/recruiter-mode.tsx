"use client";

import Link from "next/link";
import { ArrowDownToLine, ArrowUpRight, ChevronRight, GraduationCap, MapPin } from "lucide-react";
import { useEffect, type ReactNode } from "react";
import { trackEvent } from "./site-analytics";
import { profile, recruitAI, stats } from "@/lib/content";
import { useApp } from "./app-state";
import { CopyEmailButton } from "./copy-email";
import { TestFitButton } from "./test-fit-button";

const PROOFS = [
  {
    name: "ToffeeOS",
    line: "Multi-tenant, offline-first café POS: 2 cafés live, ~5,000 real orders, 561 tests gate every release.",
    href: "/work/toffeeos",
    cta: "Case study",
    internal: true,
  },
  {
    name: "RecruitAI",
    line: "Ranks 1,000 resumes in one batch with TF-IDF + cosine similarity; every score explainable.",
    href: recruitAI.demo,
    cta: "Live demo",
    internal: false,
  },
  {
    name: "Meow Meow AI Front Desk",
    line: "1st Runner-Up, AI Agents Arena 2.0: an n8n + Gemini vet-clinic receptionist that books on Google Calendar and rolls back failed writes.",
    href: "/work/meow-meow-ai-front-desk",
    cta: "Case study",
    internal: true,
  },
];

/** Renders either the full story or the one-screen briefing; the full page stays mounted (state preserved). */
export function ModeSwitch({ children, footer }: { children: ReactNode; footer: ReactNode }) {
  const { recruiter } = useApp();
  useEffect(() => {
    if (recruiter) trackEvent("Recruiter mode");
  }, [recruiter]);
  return (
    <>
      <main id="main">
        {recruiter && <RecruiterBrief />}
        <div hidden={recruiter} className={recruiter ? undefined : "view-in"}>
          {children}
        </div>
      </main>
      {!recruiter && footer}
    </>
  );
}

function RecruiterBrief() {
  const { setRecruiter, goTo } = useApp();
  return (
    <div className="view-in">
      <section aria-labelledby="brief-title" className="container-apple flex min-h-dvh flex-col justify-center pt-24 pb-8">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line pb-3 font-mono text-[11.5px] uppercase tracking-[0.1em] text-muted">
          <span>15-second briefing</span>
          <button type="button" onClick={() => setRecruiter(false)} className="text-link hover:underline">
            Read the full story →
          </button>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1.15fr_1fr] lg:gap-10 [&>*]:min-w-0">
          {/* who + availability */}
          <div>
            <h1 id="brief-title" className="text-[clamp(1.9rem,3.6vw,2.9rem)] font-[650] leading-[1.05] tracking-[-0.04em] text-balance">
              {profile.name}. <span className="text-muted">{profile.role}, shipping production software.</span>
            </h1>
            <ul className="mt-5 grid gap-2 text-[14px]">
              <li className="flex items-center gap-2">
                <span aria-hidden className="size-1.5 shrink-0 rounded-full bg-emerald-500" />
                <span>
                  Remote · <span className="font-mono">{profile.hours}</span> · <span className="font-mono">UTC+5</span>
                </span>
              </li>
              <li className="flex items-center gap-2 text-muted">
                <MapPin aria-hidden className="size-3.5 shrink-0" />
                {profile.timezone}
              </li>
              <li className="flex items-center gap-2 text-muted">
                <GraduationCap aria-hidden className="size-3.5 shrink-0" />
                <span>
                  BS Computer Science, COMSATS · graduating <span className="font-mono text-fg">{profile.graduation}</span>
                </span>
              </li>
            </ul>

            <ul aria-label="Headline numbers" className="mt-6 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-4">
              {stats.map((s) => (
                <li key={s.label} className="flex flex-col bg-card p-4">
                  <span className="font-mono text-[26px] font-semibold leading-none tracking-[-0.03em] tabular-nums">{s.value}</span>{" "}
                  <span className="mt-2 text-[12px] leading-snug text-muted">{s.label}</span>
                </li>
              ))}
            </ul>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <CopyEmailButton className="max-w-full" />
              <a href={profile.cv} download className="btn-secondary">
                <ArrowDownToLine className="size-4" /> Download CV
              </a>
              <TestFitButton label="Match a role" className="px-2 text-[15px] font-medium text-link hover:underline" />
            </div>
          </div>

          {/* proof */}
          <div>
            <p className="eyebrow">Proof, one line each</p>
            <ol className="mt-3 grid gap-2">
              {PROOFS.map((p, i) => (
                <li key={p.name} className="bezel">
                  <div className="bezel-core flex items-start gap-3 p-4">
                    <span className="font-mono text-[12px] text-accent-text">0{i + 1}</span>
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold">{p.name}</p>
                      <p className="mt-0.5 text-[14px] leading-snug text-muted">{p.line}</p>
                    </div>
                    {p.href.startsWith("#") ? (
                      <button type="button" onClick={() => goTo(p.href.slice(1))} className="link-arrow shrink-0 text-[13px]">
                        {p.cta} <ChevronRight className="size-3.5" />
                      </button>
                    ) : p.internal ? (
                      <Link href={p.href} className="link-arrow shrink-0 text-[13px]">
                        {p.cta} <ChevronRight className="size-3.5" />
                      </Link>
                    ) : (
                      <a href={p.href} target="_blank" rel="noopener noreferrer" className="link-arrow shrink-0 text-[13px]">
                        {p.cta} <ArrowUpRight className="size-3.5" />
                      </a>
                    )}
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>
    </div>
  );
}

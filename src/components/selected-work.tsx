"use client";

import { motion, useReducedMotion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { moreProjects, projects, recruitAI } from "@/lib/content";
import { cn } from "@/lib/utils";
import { EASE, Reveal } from "./motion";
import { SectionHeader } from "./section-header";
import { SpotlightCard } from "./ui/spotlight-card";

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

// 5 projects → 3 + 3 on the first row, then 2 + 2 + 2
const SPANS = ["lg:col-span-3", "lg:col-span-3", "lg:col-span-2", "lg:col-span-2", "lg:col-span-2"];

export function SelectedWork() {
  return (
    <section id="projects" className="section-y border-t border-line">
      <div className="container-apple">
        <SectionHeader
          id="projects"
          meta={`${projects.length + 1} featured · ${moreProjects.length} more`}
          title={
            <>
              Production software first. <span className="text-muted">Then the range.</span>
            </>
          }
          summary="Language, vision, simulation and systems work, from internships, coursework and my own time."
        />

        {/* RecruitAI feature */}
        <Reveal className="bezel">
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
        </Reveal>

        <ul className="mt-3 grid gap-3 md:grid-cols-2 lg:grid-cols-6">
          {projects.map((p, i) => (
            <li key={p.title} className={cn(SPANS[i], i === projects.length - 1 && "md:col-span-2 lg:col-span-2")}>
              <Reveal delay={(i % 3) * 0.08} className="bezel h-full">
                <SpotlightCard tilt className="bezel-core flex h-full flex-col p-8">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="eyebrow">{p.kicker}</span>
                    {p.badge && (
                      <span className="rounded-full bg-accent/10 px-2.5 py-0.5 text-[12px] font-semibold text-link">{p.badge}</span>
                    )}
                  </div>
                  <h3 className="mt-4 text-[24px] font-semibold tracking-[-0.03em]">{p.title}</h3>
                  <p className="mt-2 flex-1 text-[15px] leading-relaxed text-muted">{p.body}</p>
                  <p className="mt-6 border-t border-line pt-4 font-mono text-[12px] text-muted">{p.tech}</p>
                </SpotlightCard>
              </Reveal>
            </li>
          ))}
        </ul>

        <Reveal className="mt-20">
          <h3 className="eyebrow">More projects</h3>
          <p className="mt-2 text-[15px] text-muted">Machine learning, mobile and security work from coursework and my own time.</p>
          <ul className="mt-6 grid border-t border-line sm:grid-cols-2">
            {moreProjects.map((p) => (
              <li key={p.title} className="border-b border-line py-5 sm:odd:pr-8 sm:even:pl-8">
                <p className="font-semibold">{p.title}</p>
                <p className="mt-1 text-[15px] text-muted">{p.body}</p>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}

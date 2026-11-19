"use client";

import { motion, useReducedMotion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { moreProjects, projects, recruitAI } from "@/lib/content";
import { EASE, Reveal } from "./motion";

function Ranking() {
  const reduce = useReducedMotion();
  return (
    <div className="rounded-[22px] border border-line bg-bg p-6 shadow-[var(--shadow)]">
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
                  className="h-full rounded-full bg-gradient-to-r from-[#0071e3] to-[#5e5ce6]"
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

export function SelectedWork() {
  return (
    <section aria-labelledby="work-title" className="py-28 sm:py-36">
      <div className="container-apple">
        <Reveal className="max-w-3xl">
          <p className="eyebrow">Selected work</p>
          <h2 id="work-title" className="headline-lg mt-3 text-balance">
            Production software first. <span className="text-muted">Then the range: language, vision, simulation and systems.</span>
          </h2>
        </Reveal>

        {/* RecruitAI feature */}
        <Reveal className="mt-16 grid items-center gap-10 overflow-hidden rounded-[32px] bg-bg-alt p-8 sm:p-12 md:grid-cols-2">
          <div>
            <p className="eyebrow">{recruitAI.kicker}</p>
            <h3 className="headline-md mt-2">{recruitAI.title}</h3>
            <p className="mt-4 text-[17px] leading-relaxed text-muted">{recruitAI.body}</p>
            <p className="mt-6 text-[13px] font-medium">{recruitAI.tech}</p>
            <a href={recruitAI.demo} target="_blank" rel="noopener noreferrer" className="btn-primary mt-6 h-10 text-[15px]">
              Live demo <ArrowUpRight className="size-4" />
            </a>
          </div>
          <Ranking />
        </Reveal>

        <ul className="mt-5 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((p, i) => (
            <li key={p.title}>
              <Reveal
                delay={(i % 3) * 0.08}
                className="flex h-full flex-col rounded-[28px] border border-line p-8 transition-all duration-500 ease-apple hover:-translate-y-1 hover:shadow-[var(--shadow)]"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <span className="eyebrow">{p.kicker}</span>
                  {p.badge && (
                    <span className="rounded-full bg-accent/10 px-2.5 py-0.5 text-[12px] font-semibold text-link">{p.badge}</span>
                  )}
                </div>
                <h3 className="mt-3 text-[22px] font-semibold tracking-tight">{p.title}</h3>
                <p className="mt-2 flex-1 text-[15px] leading-relaxed text-muted">{p.body}</p>
                <p className="mt-6 text-[13px] font-medium">{p.tech}</p>
              </Reveal>
            </li>
          ))}
        </ul>

        <Reveal className="mt-16">
          <h3 className="text-[22px] font-semibold tracking-tight">More projects</h3>
          <p className="mt-1 text-[15px] text-muted">Machine learning, mobile and security work from coursework and my own time.</p>
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

import { ArrowDownToLine, ArrowUpRight, Mail, Sparkles } from "lucide-react";
import { experience, profile, stack } from "@/lib/content";
import { AskButton } from "./chat/ask-amar";
import { Reveal } from "./motion";
import { SectionHeader } from "./section-header";
import { SpotlightCard } from "./ui/spotlight-card";

export function Experience() {
  return (
    <section id="experience" className="section-y border-t border-line bg-bg-alt">
      <div className="container-apple">
        <SectionHeader
          id="experience"
          meta="2023 — now"
          title={
            <>
              Shipping for clients <span className="text-muted">while finishing a CS degree.</span>
            </>
          }
        />
        <ol className="border-t border-line">
          {experience.map((e, i) => (
            <li key={e.role + e.org} className="border-b border-line">
              <Reveal delay={i * 0.04} className="grid gap-2 py-7 md:grid-cols-[11rem_1fr_1.4fr] md:gap-8">
                <p className="font-mono text-[12px] uppercase tracking-[0.08em] text-muted tabular-nums md:pt-1.5">{e.period}</p>
                <div>
                  <h3 className="text-[20px] font-semibold tracking-[-0.02em]">{e.role}</h3>
                  <p className="mt-0.5 text-[15px] font-medium text-accent-text">{e.org}</p>
                </div>
                <p className="max-w-xl text-[15px] leading-relaxed text-muted md:pt-1">{e.body}</p>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export function Skills() {
  return (
    <section id="skills" className="section-y border-t border-line">
      <div className="container-apple">
        <SectionHeader
          id="skills"
          meta={`${stack.reduce((n, s) => n + s.items.length, 0)} tools`}
          title={
            <>
              What I use <span className="text-muted">day to day.</span>
            </>
          }
        />
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {stack.map((s, i) => (
            <Reveal key={s.group} delay={(i % 4) * 0.06} className="bezel">
              <SpotlightCard tilt className="bezel-core h-full p-6">
                <div className="flex items-center justify-between">
                  <h3 className="eyebrow">{s.group}</h3>
                  <span className="font-mono text-[11px] text-muted/70">{String(i + 1).padStart(2, "0")}</span>
                </div>
                <ul className="mt-5 grid gap-1.5">
                  {s.items.map((it) => (
                    <li key={it} className="text-[17px] font-semibold tracking-[-0.02em]">{it}</li>
                  ))}
                </ul>
              </SpotlightCard>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

const LINKS = [
  { label: "Email", value: profile.email, href: `mailto:${profile.email}` },
  { label: "LinkedIn", value: "in/amarabdurrehman", href: profile.linkedin },
  { label: "GitHub", value: "amarabdulrehman", href: profile.github },
  { label: "Based", value: profile.location },
];

export function Contact() {
  return (
    <section id="contact" className="section-y border-t border-line">
      <div className="container-apple">
        <SectionHeader id="contact" meta="Open to remote roles" title="Hiring a remote engineer?" summary="Send me the role and I’ll send back the projects and code that fit it." />

        <Reveal className="bezel">
          <div className="bezel-core relative isolate grid overflow-hidden md:grid-cols-[1.2fr_1fr] [&>*]:min-w-0">
            <div aria-hidden className="grid-bg pointer-events-none absolute inset-0 -z-10 [mask-image:radial-gradient(80%_80%_at_0%_100%,#000,transparent)]" />
            <div
              aria-hidden
              className="pointer-events-none absolute -bottom-40 -left-20 -z-10 size-[420px] rounded-full opacity-60"
              style={{ background: "radial-gradient(closest-side, color-mix(in srgb, var(--accent) 30%, transparent), transparent)" }}
            />
            <div className="flex flex-col justify-between gap-10 p-8 sm:p-12">
              <p className="text-[28px] font-semibold leading-tight tracking-[-0.03em] sm:text-[34px]">
                Let’s talk about <span className="text-accent">what you’re building.</span>
              </p>
              <div className="flex flex-wrap items-center gap-3">
                  <a href={`mailto:${profile.email}?subject=Role%20for%20Amar`} className="btn-primary group">
                    Email me
                    <span className="btn-icon">
                      <Mail className="size-4" />
                    </span>
                  </a>
                  <AskButton className="ai-glow rounded-full [--glow-opacity:0.45]">
                    <span className="btn-secondary bg-card hover:bg-bg-alt">
                      <Sparkles className="size-4 text-accent" /> Ask my AI
                    </span>
                  </AskButton>
                  <a href={profile.cv} download className="btn-secondary">
                    <ArrowDownToLine className="size-4" /> CV
                  </a>
              </div>
            </div>

            <dl className="border-t border-line md:border-l md:border-t-0">
              {LINKS.map((l) => (
                <div key={l.label} className="flex items-center justify-between gap-4 border-b border-line px-6 py-5 last:border-b-0 sm:px-10">
                  <dt className="eyebrow">{l.label}</dt>
                  <dd className="min-w-0 truncate text-right text-[15px] font-medium">
                    {l.href ? (
                      <a
                        href={l.href}
                        target={l.href.startsWith("http") ? "_blank" : undefined}
                        rel="noopener noreferrer"
                        className="group inline-flex items-center gap-1 hover:text-accent-text"
                      >
                        {l.value}
                        <ArrowUpRight className="size-3.5 text-muted transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent-text" />
                      </a>
                    ) : (
                      l.value
                    )}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-line py-10 font-mono text-[12px] text-muted">
      <div className="container-apple flex flex-col items-center justify-between gap-4 sm:flex-row">
        <p>
          © 2026 {profile.name} · {profile.location}
        </p>
        <div className="flex items-center gap-6 uppercase tracking-[0.08em]">
          <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 hover:text-fg">
            LinkedIn <ArrowUpRight className="size-3" />
          </a>
          <a href={profile.github} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 hover:text-fg">
            GitHub <ArrowUpRight className="size-3" />
          </a>
          <a href="#top" className="hover:text-fg">Top ↑</a>
        </div>
      </div>
    </footer>
  );
}

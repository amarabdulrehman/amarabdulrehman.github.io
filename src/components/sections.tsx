import { ArrowDownToLine, ArrowUpRight, Mail, Sparkles } from "lucide-react";
import { experience, profile, stack } from "@/lib/content";
import { AskButton } from "./chat/ask-amar";
import { CopyEmail } from "./copy-email";
import { Reveal } from "./motion";
import { SpotlightCard } from "./ui/spotlight-card";

export function Experience() {
  return (
    <section id="experience" aria-labelledby="exp-title" className="section-y">
      <div className="container-apple grid gap-12 md:grid-cols-[0.8fr_1.2fr]">
        <Reveal className="md:sticky md:top-28 md:self-start">
          <span className="pill-tag">Experience</span>
          <h2 id="exp-title" className="headline-lg mt-4 text-balance">Shipping for clients while finishing a CS degree.</h2>
        </Reveal>
        <ol className="relative border-l border-line">
          {experience.map((e, i) => (
            <li key={e.role + e.org} className="relative pb-12 pl-8 last:pb-0">
              <span aria-hidden className="absolute -left-[5px] top-2 size-[9px] rounded-full bg-accent ring-4 ring-bg" />
              <Reveal delay={i * 0.05}>
                <p className="text-[13px] font-medium tabular-nums text-muted">{e.period}</p>
                <h3 className="mt-1 text-[22px] font-semibold tracking-[-0.02em]">{e.role}</h3>
                <p className="text-[15px] font-medium text-link">{e.org}</p>
                <p className="mt-2 max-w-xl text-[15px] leading-relaxed text-muted">{e.body}</p>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>

      {/* stack, same section */}
      <div id="stack" className="container-apple mt-28 scroll-mt-24">
        <Reveal className="flex flex-col items-center text-center">
          <span className="pill-tag">Stack</span>
          <h2 className="headline-md mt-4">What I use day to day.</h2>
        </Reveal>
        <div className="mt-12 grid grid-cols-2 gap-3 md:grid-cols-4">
          {stack.map((s, i) => (
            <Reveal key={s.group} delay={(i % 4) * 0.06} className="bezel">
              <SpotlightCard tilt className="bezel-core h-full p-6">
                <h3 className="eyebrow">{s.group}</h3>
                <ul className="mt-4 grid gap-1.5">
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

export function Contact() {
  return (
    <section id="contact" aria-labelledby="contact-title" className="theme-dark relative isolate overflow-hidden bg-bg py-32 text-center text-fg sm:py-44">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{ background: "radial-gradient(45% 55% at 35% 100%, rgb(8 148 255 / 0.32), transparent 70%), radial-gradient(40% 50% at 70% 100%, rgb(201 89 221 / 0.26), transparent 70%)" }}
      />
      <Reveal className="container-apple relative">
        <h2 id="contact-title" className="headline-xl text-balance">Hiring a remote engineer?</h2>
        <p className="lede mx-auto mt-5 max-w-xl">Send me the role and I’ll send back the projects and code that fit it.</p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <a href={`mailto:${profile.email}?subject=Role%20for%20Amar`} className="btn-primary group">
            Email me
            <span className="btn-icon">
              <Mail className="size-4" />
            </span>
          </a>
          <AskButton className="ai-glow rounded-full [--glow-opacity:0.6]">
            <span className="btn-secondary bg-bg hover:bg-bg-alt">
              <Sparkles className="size-4" /> Ask my AI
            </span>
          </AskButton>
          <a href={profile.cv} download className="btn-secondary">
            <ArrowDownToLine className="size-4" /> Download CV
          </a>
        </div>
        <CopyEmail email={profile.email} />
      </Reveal>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-line bg-bg-alt py-10 text-[13px] text-muted">
      <div className="container-apple flex flex-col items-center justify-between gap-4 sm:flex-row">
        <p>
          © 2026 {profile.name}. {profile.location}.
        </p>
        <div className="flex items-center gap-6">
          <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 hover:text-fg">
            LinkedIn <ArrowUpRight className="size-3" />
          </a>
          <a href={profile.github} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 hover:text-fg">
            GitHub <ArrowUpRight className="size-3" />
          </a>
          <a href="#top" className="hover:text-fg">Back to top ↑</a>
        </div>
      </div>
    </footer>
  );
}

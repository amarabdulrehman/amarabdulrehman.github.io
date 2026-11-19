import { ArrowDownToLine, ArrowUpRight, Mail } from "lucide-react";
import { experience, profile, stack } from "@/lib/content";
import { CopyEmail } from "./copy-email";
import { Reveal } from "./motion";

export function Experience() {
  return (
    <section id="experience" aria-labelledby="exp-title" className="py-28 sm:py-36">
      <div className="container-apple grid gap-12 md:grid-cols-[0.8fr_1.2fr]">
        <Reveal className="md:sticky md:top-28 md:self-start">
          <p className="eyebrow">Experience</p>
          <h2 id="exp-title" className="headline-lg mt-3 text-balance">Shipping for clients while finishing a CS degree.</h2>
        </Reveal>
        <ol className="relative border-l border-line">
          {experience.map((e, i) => (
            <li key={e.role + e.org} className="relative pb-12 pl-8 last:pb-0">
              <span aria-hidden className="absolute -left-[5px] top-2 size-[9px] rounded-full bg-accent ring-4 ring-bg" />
              <Reveal delay={i * 0.05}>
                <p className="text-[13px] font-medium tabular-nums text-muted">{e.period}</p>
                <h3 className="mt-1 text-[22px] font-semibold tracking-tight">{e.role}</h3>
                <p className="text-[15px] font-medium text-link">{e.org}</p>
                <p className="mt-2 max-w-xl text-[15px] leading-relaxed text-muted">{e.body}</p>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export function Stack() {
  return (
    <section id="stack" aria-labelledby="stack-title" className="bg-bg-alt py-28 sm:py-36">
      <div className="container-apple">
        <Reveal className="text-center">
          <p className="eyebrow">Stack</p>
          <h2 id="stack-title" className="headline-lg mt-3">What I use day to day.</h2>
        </Reveal>
        <div className="mt-14 grid grid-cols-2 gap-4 md:grid-cols-4">
          {stack.map((s, i) => (
            <Reveal key={s.group} delay={(i % 4) * 0.06} className="rounded-[24px] bg-card p-6 transition-transform duration-500 ease-apple hover:-translate-y-1">
              <h3 className="eyebrow">{s.group}</h3>
              <ul className="mt-4 grid gap-1.5">
                {s.items.map((it) => (
                  <li key={it} className="text-[17px] font-semibold tracking-tight">{it}</li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Contact() {
  return (
    <section id="contact" aria-labelledby="contact-title" className="theme-dark relative overflow-hidden bg-bg py-32 text-center text-fg sm:py-44">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{ background: "radial-gradient(50% 60% at 50% 100%, rgb(0 113 227 / 0.35), transparent 70%)" }}
      />
      <Reveal className="container-apple relative">
        <h2 id="contact-title" className="headline-xl text-balance">Hiring a remote engineer?</h2>
        <p className="lede mx-auto mt-5 max-w-xl">Send me the role and I’ll send back the projects and code that fit it.</p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <a href={`mailto:${profile.email}?subject=Role%20for%20Amar`} className="btn-primary">
            <Mail className="size-4" /> Email me
          </a>
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

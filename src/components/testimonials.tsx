import { ArrowUpRight } from "lucide-react";
import { testimonials } from "@/lib/content";
import { Reveal } from "./motion";
import { SectionHeader } from "./section-header";

/** Verbatim quotes from real clients. Renders nothing until `testimonials` has entries. */
export function Testimonials() {
  if (testimonials.length === 0) return null;
  return (
    <section id="kind-words" className="section-y scroll-mt-24 border-t border-line">
      <div className="container-apple">
        <SectionHeader
          id="kind-words"
          meta="In their words"
          title={
            <>
              What clients say <span className="text-muted">after launch.</span>
            </>
          }
          summary="Unedited, from the people who run their business on what I built."
        />
        <ul className={`grid gap-4 ${testimonials.length > 1 ? "md:grid-cols-2" : ""} ${testimonials.length > 2 ? "lg:grid-cols-3" : ""}`}>
          {testimonials.map((t, i) => (
            <li key={t.name}>
              <Reveal delay={i * 0.06} className="bezel h-full">
                <figure className="bezel-core flex h-full flex-col p-8">
                  <span aria-hidden className="font-mono text-[40px] leading-none text-accent-text">
                    “
                  </span>
                  <blockquote className="mt-2 flex-1 text-[17px] leading-relaxed text-fg text-pretty">{t.quote}</blockquote>
                  <figcaption className="mt-8 border-t border-line pt-5">
                    <p className="text-[15px] font-semibold">{t.name}</p>
                    <p className="mt-0.5 text-[14px] text-muted">
                      {t.role}, {t.org}
                    </p>
                    <p className="mt-3 flex flex-wrap items-center justify-between gap-2 font-mono text-[11px] uppercase tracking-[0.08em] text-muted">
                      <span>{t.context}</span>
                      {t.source && (
                        <a href={t.source} target="_blank" rel="noopener noreferrer" className="link-arrow normal-case tracking-normal">
                          Source <ArrowUpRight className="size-3.5" />
                        </a>
                      )}
                    </p>
                  </figcaption>
                </figure>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

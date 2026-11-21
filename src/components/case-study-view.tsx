/** Renders a data-driven case study from lib/case-studies.ts. Each one has its own route folder under app/work. */
import type { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";
import { Block, CaseCta, CaseHeader, Chapter, ChapterIndex, FactRow, MoreCaseStudies, Rich } from "@/components/case-study";
import { Footer } from "@/components/sections";
import { caseStudyBySlug } from "@/lib/case-studies";
import { profile } from "@/lib/content";

export function caseStudyMetadata(slug: string): Metadata {
  const cs = caseStudyBySlug(slug)!;
  const title = `${cs.name} case study | ${profile.name}`;
  const path = `/work/${cs.slug}`;
  return {
    title,
    description: cs.description,
    alternates: { canonical: path },
    openGraph: { type: "article", url: `${profile.site}${path}`, title, description: cs.description },
    twitter: { card: "summary_large_image" },
  };
}

export function CaseStudyView({ slug }: { slug: string }) {
  const cs = caseStudyBySlug(slug);
  if (!cs) throw new Error(`Unknown case study: ${slug}`);

  const cut = cs.title.lastIndexOf("|");
  const [lead, accent] = cut >= 0 ? [cs.title.slice(0, cut), cs.title.slice(cut + 1)] : [cs.title, ""];
  const primary = cs.links[0];

  return (
    <>
      <CaseHeader back="/#hackathons" />
      <main id="main">
        <article className="container-apple pt-16 pb-24 sm:pt-24">
          <p className="font-mono text-[12px] uppercase tracking-[0.12em] text-muted">
            <span className="text-accent-text">Case study</span> · {cs.name} · {cs.kicker}
          </p>
          <h1 className="mt-6 max-w-3xl text-[clamp(2.25rem,5vw,3.75rem)] font-[650] leading-[1.04] tracking-[-0.045em] text-balance">
            {lead}
            {accent && <span className="text-accent">{accent}</span>}
          </h1>
          <p className="lede mt-6 max-w-2xl text-pretty">{cs.lede}</p>

          <FactRow facts={cs.facts} />

          {cs.links.length > 0 && (
            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-[15px]">
              {cs.links.map((l) => (
                <a key={l.href} href={l.href} target="_blank" rel="noopener noreferrer" className="link-arrow">
                  {l.label} <ArrowUpRight className="size-3.5" />
                </a>
              ))}
            </div>
          )}

          <ChapterIndex chapters={cs.chapters} />

          <div className="mt-14">
            {cs.chapters.map((ch, i) => (
              <Chapter key={ch.id} n={i + 1} id={ch.id} label={ch.label} title={ch.title}>
                {ch.paragraphs.map((p) => (
                  <p key={p}>
                    <Rich text={p} />
                  </p>
                ))}
                {ch.block && <Block block={ch.block} />}
                {ch.after?.map((p) => (
                  <p key={p}>
                    <Rich text={p} />
                  </p>
                ))}
              </Chapter>
            ))}
          </div>

          <CaseCta
            secondary={
              primary && (
                <a href={primary.href} target="_blank" rel="noopener noreferrer" className="btn-secondary">
                  {primary.label} <ArrowUpRight className="size-4" />
                </a>
              )
            }
          />
          <MoreCaseStudies current={cs.slug} />
        </article>
      </main>
      <Footer />
    </>
  );
}

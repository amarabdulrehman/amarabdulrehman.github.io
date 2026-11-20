import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, FileDown } from "lucide-react";
import { CopyEmailButton } from "@/components/copy-email";
import { ThemeToggle } from "@/components/nav";
import { Footer } from "@/components/sections";
import { flagship, productionStats, profile } from "@/lib/content";

const title = "ToffeeOS case study";
const description =
  "How Amar Abdur Rehman designed, built, tested and shipped ToffeeOS, a multi-tenant, offline-first café POS that SPILL and Loom run on every day.";

export const metadata: Metadata = {
  title: `${title} | ${profile.name}`,
  description,
  alternates: { canonical: flagship.caseStudy },
  openGraph: {
    type: "article",
    url: `${profile.site}${flagship.caseStudy}`,
    title: `${title} | ${profile.name}`,
    description,
    images: [{ url: "/og.png", width: 1200, height: 630 }],
  },
};

const CHAPTERS = [
  { id: "problem", label: "Operational problem" },
  { id: "offline", label: "Offline-first sync" },
  { id: "tax", label: "Automated tax engine" },
  { id: "reliability", label: "CI/CD reliability" },
  { id: "production", label: "Live in production" },
] as const;

const MODULES = [
  ["POS", "Takes orders and cash payments, even while offline."],
  ["Kitchen display", "Orders reach the kitchen screen as they’re placed."],
  ["Inventory", "Stock tracked against what’s actually sold."],
  ["Delivery riders", "Delivery orders assigned and tracked."],
  ["QR table ordering", "Guests order from their table."],
  ["Tax & reports", "Punjab’s 16% cash / 8% card split, built in."],
] as const;

const ARCHITECTURE = [
  ["Frontend", "Next.js App Router, TypeScript"],
  ["Data", "Prisma on Supabase Postgres"],
  ["Live updates", "Supabase Realtime"],
  ["Hosting", "Vercel"],
  ["Resilience", "Offline order & cash capture"],
] as const;

function Chapter({ n, id, title, children }: { n: number; id: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="scroll-mt-24 border-t border-line py-16 sm:py-20">
      <div className="grid gap-6 md:grid-cols-[12rem_1fr] md:gap-10">
        <p className="font-mono text-[12px] uppercase tracking-[0.12em] text-muted">
          <span className="text-accent-text">{String(n).padStart(2, "0")}</span>
          <span className="mx-2" aria-hidden>
            ·
          </span>
          {CHAPTERS[n - 1].label}
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

export default function ToffeeOSCaseStudy() {
  const [cafes, orders, payments] = productionStats;
  return (
    <>
      <header id="top" className="sticky top-0 z-50 border-b border-line bg-glass backdrop-blur-2xl backdrop-saturate-[1.8]">
        <div className="container-apple flex h-14 items-center justify-between">
          <Link href="/#toffeeos" className="inline-flex items-center gap-2 text-[14px] font-medium text-muted hover:text-fg">
            <ArrowLeft className="size-4" /> Back to portfolio
          </Link>
          <div className="flex items-center gap-2">
            <span className="hidden font-mono text-[11px] uppercase tracking-[0.1em] text-muted sm:inline">Case study</span>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main id="main">
        <article className="container-apple pt-16 pb-24 sm:pt-24">
          {/* intro */}
          <p className="font-mono text-[12px] uppercase tracking-[0.12em] text-muted">
            <span className="text-accent-text">Case study</span> · {flagship.name} · Multi-tenant café POS
          </p>
          <h1 className="mt-6 max-w-3xl text-[clamp(2.25rem,5vw,3.75rem)] font-[650] leading-[1.04] tracking-[-0.045em] text-balance">
            Restaurant software two cafés run on <span className="text-accent">every day.</span>
          </h1>
          <p className="lede mt-6 max-w-2xl text-pretty">
            How I designed, built, tested and shipped a multi-tenant point-of-sale system while finishing my CS degree, and why it
            keeps selling when the internet doesn’t.
          </p>

          <dl className="mt-10 grid max-w-2xl grid-cols-2 gap-y-5 border-y border-line py-6 sm:grid-cols-4">
            {[
              ["Role", "Sole engineer, end to end"],
              ["Clients", "SPILL & Loom, Bahawalpur"],
              ["Stack", "Next.js · Prisma · Supabase"],
              ["Status", "In production"],
            ].map(([k, v]) => (
              <div key={k} className="pr-4">
                <dt className="eyebrow">{k}</dt>
                <dd className="mt-1.5 text-[14px] font-medium">{v}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-12 rounded-[22px] border border-line bg-[#1c1c1e] p-2 shadow-[0_40px_120px_-30px_color-mix(in_srgb,var(--accent)_35%,transparent)]">
            <div className="mb-2 flex gap-1.5 px-2 pt-1" aria-hidden>
              <span className="size-2.5 rounded-full bg-[#ff5f57]" />
              <span className="size-2.5 rounded-full bg-[#febc2e]" />
              <span className="size-2.5 rounded-full bg-[#28c840]" />
            </div>
            <Image
              src={flagship.image}
              alt="The ToffeeOS point-of-sale screen"
              width={1440}
              height={900}
              priority
              sizes="(min-width: 1080px) 1016px, 100vw"
              className="w-full rounded-[14px]"
            />
          </div>

          {/* chapter index */}
          <nav aria-label="Chapters" className="mt-14">
            <ol className="flex flex-wrap gap-2">
              {CHAPTERS.map((c, i) => (
                <li key={c.id}>
                  <a href={`#${c.id}`} className="pill-tag hover:text-fg">
                    <span className="text-accent-text">{String(i + 1).padStart(2, "0")}</span> {c.label}
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          <div className="mt-14">
            <Chapter n={1} id="problem" title="The internet drops. The till can’t.">
              <p>
                Cafés in Pakistan take orders through a rush hour where the connection can go at any moment, and they still have to
                charge the right tax on every bill. Most of the local businesses I worked with were running orders on paper and
                WhatsApp.
              </p>
              <p>
                A till that stops when the Wi-Fi does means lost orders and a queue at the counter. So the brief was simple:{" "}
                <strong>keep selling, always, and get the numbers right.</strong>
              </p>
              <p>
                The answer became one system from order to report, built <strong>multi-tenant from day one</strong>: every café is
                its own tenant on one codebase, so a new client is a setup, not a fork.
              </p>
              <ul className="mt-2 grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2">
                {MODULES.map(([name, body]) => (
                  <li key={name} className="bg-card p-5">
                    <p className="text-[15px] font-semibold text-fg">{name}</p>
                    <p className="mt-1 text-[14px] leading-relaxed">{body}</p>
                  </li>
                ))}
              </ul>
            </Chapter>

            <Chapter n={2} id="offline" title="Offline-first, so the counter never waits on the network.">
              <p>
                The POS treats the connection as optional. When the internet drops, it <strong>keeps taking orders and cash
                payments</strong>, the things a counter can settle without a network, and holds them on the device.
              </p>
              <p>
                The moment the connection is back, those orders <strong>sync to the shared Postgres database</strong>, and Supabase
                Realtime pushes the changes out to the kitchen display and every other screen in the café. Staff don’t switch modes or
                re-enter anything; the till just carries on.
              </p>
              <dl className="mt-2 overflow-hidden rounded-2xl border border-line">
                {ARCHITECTURE.map(([k, v]) => (
                  <div key={k} className="grid grid-cols-[8.5rem_1fr] gap-4 border-b border-line px-5 py-3.5 last:border-b-0">
                    <dt className="font-mono text-[12px] uppercase tracking-[0.08em]">{k}</dt>
                    <dd className="text-[15px] text-fg">{v}</dd>
                  </div>
                ))}
              </dl>
            </Chapter>

            <Chapter n={3} id="tax" title="A tax engine that gets every bill right.">
              <p>
                Punjab’s sales tax on restaurant services depends on how the customer pays:{" "}
                <strong>16% when they pay cash, 8% when they pay by card.</strong> Getting that wrong on a busy shift means wrong
                receipts and wrong reports at the end of the month.
              </p>
              <p>
                ToffeeOS applies the split automatically on every single bill, based on the payment method recorded at the till, and
                carries it through to the reports. Nobody at the counter has to remember a rate.
              </p>
              <div className="mt-2 grid gap-3 sm:grid-cols-2">
                {[
                  ["Paid in cash", "16%", "Rs 160 tax on a Rs 1,000 order"],
                  ["Paid by card", "8%", "Rs 80 tax on a Rs 1,000 order"],
                ].map(([k, rate, ex]) => (
                  <div key={k} className="rounded-2xl border border-line bg-card p-6">
                    <p className="eyebrow">{k}</p>
                    <p className="mt-3 text-[40px] font-semibold leading-none tracking-[-0.04em] text-fg tabular-nums">{rate}</p>
                    <p className="mt-3 text-[14px]">{ex}</p>
                  </div>
                ))}
              </div>
            </Chapter>

            <Chapter n={4} id="reliability" title="Live cafés don’t get a beta.">
              <p>
                People are ringing up sales on this system right now, so every change has to prove itself first.{" "}
                <strong>333 Playwright end-to-end tests and 228 Vitest unit tests</strong> run before every release: 561 checks
                between a commit and the counter.
              </p>
              <p>
                That suite is what lets one engineer ship safely. It caught a <strong>Prisma transaction timeout</strong> before it
                reached production, a bug that would only have shown up under real load, at the till, mid-service.
              </p>
              <div className="mt-2 grid grid-cols-3 overflow-hidden rounded-2xl border border-line">
                {[
                  ["333", "Playwright E2E"],
                  ["228", "Vitest unit"],
                  ["561", "checks per release"],
                ].map(([v, l], i) => (
                  <p key={l} className={`flex flex-col p-5 ${i > 0 ? "border-l border-line" : ""}`}>
                    <span className="text-[30px] font-semibold leading-none tracking-[-0.04em] text-fg tabular-nums">{v}</span>{" "}
                    <span className="mt-2 font-mono text-[11px] uppercase tracking-[0.08em]">{l}</span>
                  </p>
                ))}
              </div>
            </Chapter>

            <Chapter n={5} id="production" title="Live at SPILL and Loom.">
              <p>
                ToffeeOS runs <strong>SPILL and Loom</strong>, two cafés in Bahawalpur, every day: the till, the kitchen screen,
                inventory, delivery riders, QR table ordering and reports. SPILL’s website also connects to it through a QR
                scan-to-join loyalty card.
              </p>
              <ul className="mt-2 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-line bg-line">
                {[
                  { value: "200+", label: "orders a day across both cafés" },
                  { value: orders.value, label: orders.label },
                  { value: payments.value, label: payments.label },
                  { value: cafes.value, label: "cafés live, one codebase" },
                ].map((m) => (
                  <li key={m.label} className="flex flex-col bg-card p-6">
                    <span className="text-[34px] font-semibold leading-none tracking-[-0.04em] text-fg tabular-nums">{m.value}</span>{" "}
                    <span className="mt-2 font-mono text-[11px] uppercase leading-relaxed tracking-[0.08em]">{m.label}</span>
                  </li>
                ))}
              </ul>
              <p>
                ToffeeOS is one of the products I’ve shipped through Krimsols, alongside software for 20+ paying clients since 2024.
              </p>
            </Chapter>
          </div>

          {/* CTA */}
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
                <a href={flagship.url} target="_blank" rel="noopener noreferrer" className="btn-secondary">
                  toffeeos.com <ArrowUpRight className="size-4" />
                </a>
              </div>
            </div>
          </div>
          <p className="mt-6 text-[14px] text-muted">
            <a href={flagship.caseStudyPdf} download className="inline-flex items-center gap-1.5 underline underline-offset-4 hover:text-fg">
              <FileDown className="size-4" /> Download the one-page PDF version
            </a>
          </p>
        </article>
      </main>
      <Footer />
    </>
  );
}

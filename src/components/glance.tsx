"use client";

import Image from "next/image";
import { MapPin } from "lucide-react";
import { profile, proof, stats } from "@/lib/content";
import { cn } from "@/lib/utils";
import { AskTile } from "./chat/ask-amar";
import { CountUp, Reveal } from "./motion";
import { SectionHeader } from "./section-header";
import { SpotlightCard } from "./ui/spotlight-card";

/** One bento cell: a bezel tray holding a spotlight plate. */
function Cell({ className, delay = 0, children, core }: { className?: string; delay?: number; children: React.ReactNode; core?: string }) {
  return (
    <Reveal delay={delay} className={cn("bezel", className)}>
      <SpotlightCard tilt max={4} className={cn("bezel-core h-full overflow-hidden", core)}>
        {children}
      </SpotlightCard>
    </Reveal>
  );
}

function Stat({ i }: { i: number }) {
  const s = stats[i];
  const hot = i === 0 || i === 3;
  return (
    <div className="flex h-full flex-col justify-between p-8 sm:p-9">
      <p className={cn("headline-lg", hot ? "text-accent" : "text-fg")}>
        <CountUp to={s.value} suffix={s.suffix} />
      </p>
      <p className="mt-6 max-w-[15rem] font-mono text-[12px] uppercase leading-relaxed tracking-[0.08em] text-muted">{s.label}</p>
    </div>
  );
}

export function Glance() {
  return (
    <section id="about" className="section-y">
      <div className="container-apple">
        <SectionHeader
          id="about"
          meta="Islamabad · UTC+5"
          title={
            <>
              Engineer, founder, <span className="text-muted">final-year student.</span>
            </>
          }
          summary="I founded Krimsols, which builds websites, restaurant software and AI tools for cafés, restaurants and small businesses, and I’m finishing my CS degree at COMSATS."
        />

        <div className="grid gap-3 md:auto-rows-[minmax(15rem,auto)] md:grid-cols-6">
          {/* portrait */}
          <Cell
            className="md:col-span-2 md:row-span-2"
            core="relative isolate min-h-[30rem] bg-[radial-gradient(90%_70%_at_50%_100%,color-mix(in_srgb,var(--accent)_38%,transparent),transparent_75%)]"
          >
            <div aria-hidden className="grid-bg absolute inset-0 -z-10 [mask-image:linear-gradient(to_bottom,#000,transparent_85%)]" />
            <Image
              src={profile.portrait}
              alt={`Portrait of ${profile.name}`}
              fill
              sizes="(min-width: 768px) 360px, 100vw"
              className="object-contain object-bottom pt-6"
            />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent p-7 pt-24 text-white">
              <p className="text-[26px] font-semibold leading-tight tracking-[-0.03em]">{profile.name}</p>
              <p className="mt-1 text-[15px] text-white/75">{profile.role}</p>
              <p className="mt-3 inline-flex items-center gap-1.5 text-[13px] text-white/70">
                <MapPin className="size-3.5" /> {profile.location}
              </p>
            </div>
          </Cell>

          <Cell className="md:col-span-2" delay={0.05}><Stat i={0} /></Cell>
          <Cell className="md:col-span-2" delay={0.1}><Stat i={1} /></Cell>
          <Cell className="md:col-span-2" delay={0.15}><Stat i={3} /></Cell>
          <Cell className="md:col-span-2" delay={0.2}><Stat i={2} /></Cell>

          {/* proof points */}
          <Cell className="md:col-span-4" delay={0.05}>
            <ul className="grid h-full content-center gap-0 p-8 sm:grid-cols-3 sm:gap-8 sm:p-9">
              {proof.map((p, i) => (
                <li key={p.strong} className={cn("py-4 sm:py-0", i > 0 && "border-t border-line sm:border-l sm:border-t-0 sm:pl-8")}>
                  <p className="text-[19px] font-semibold leading-snug tracking-[-0.02em]">{p.strong}</p>
                  <p className="mt-2 text-[15px] leading-relaxed text-muted">{p.rest}</p>
                </li>
              ))}
            </ul>
          </Cell>

          {/* ask */}
          <Reveal delay={0.12} className="bezel md:col-span-2">
            <AskTile />
          </Reveal>
        </div>
      </div>
    </section>
  );
}

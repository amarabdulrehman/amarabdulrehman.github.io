import { stats } from "@/lib/content";
import { cn } from "@/lib/utils";
import { CountUp, Reveal } from "./motion";

const SPANS = ["md:col-span-2", "md:col-span-1", "md:col-span-1", "md:col-span-2"];

export function Stats() {
  return (
    <section aria-label="At a glance" className="pb-28">
      <div className="container-apple grid gap-4 md:grid-cols-3">
        {stats.map((s, i) => (
          <Reveal
            key={s.label}
            delay={i * 0.08}
            className={cn(
              "group relative overflow-hidden rounded-[28px] bg-bg-alt p-8 transition-transform duration-500 ease-apple hover:-translate-y-1 sm:p-10",
              SPANS[i],
            )}
          >
            <p
              className={cn(
                "headline-lg bg-clip-text text-transparent",
                i === 0 || i === 3
                  ? "bg-gradient-to-br from-[#0071e3] via-[#5e5ce6] to-[#bf5af2]"
                  : "bg-gradient-to-br from-fg to-fg/60",
              )}
            >
              <CountUp to={s.value} suffix={s.suffix} />
            </p>
            <p className="mt-3 max-w-[16rem] text-[17px] font-medium leading-snug text-muted">{s.label}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

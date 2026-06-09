"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Check, ArrowRight, GitBranch, Cpu, Globe } from "lucide-react";
import { cn } from "../lib/cn";

export interface FeatureAlternatingRow {
  eyebrow: string;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  body: string;
  bullets: string[];
  gradient: string;
}

export interface FeatureAlternatingRowsProps {
  className?: string;
  title?: string;
  subtitle?: string;
  rows?: FeatureAlternatingRow[];
}

const DEFAULT_ROWS: FeatureAlternatingRow[] = [
  {
    eyebrow: "Versioning",
    icon: GitBranch,
    title: "Branch your data like code.",
    body: "Every preview deploy gets a zero-copy database branch. Merge to production when you ship.",
    bullets: ["Instant branching, no copy", "Schema diffs on every PR", "Production-safe migrations"],
    gradient: "from-rose-400 via-amber-300 to-orange-200",
  },
  {
    eyebrow: "Compute",
    icon: Cpu,
    title: "Auto-scaling that vanishes.",
    body: "Compute spins up in milliseconds, scales down to zero between requests, and bills by the second.",
    bullets: ["Cold start under 200ms", "Scale-to-zero between bursts", "Per-second billing"],
    gradient: "from-sky-400 via-violet-400 to-fuchsia-300",
  },
  {
    eyebrow: "Edge",
    icon: Globe,
    title: "Read replicas in 14 regions.",
    body: "Push your data close to users with one click. Your app gets local latency, you get a single connection string.",
    bullets: ["14 regions, expanding", "Single connection string", "Automatic failover"],
    gradient: "from-emerald-400 via-teal-300 to-cyan-200",
  },
];

/** Three alternating feature rows: image-text-image-text-image pattern. */
export function FeatureAlternatingRows({
  className,
  title = "Built on three boring, brilliant ideas.",
  subtitle = "Each layer designed to disappear when it works — and tell you exactly what happened when it doesn't.",
  rows = DEFAULT_ROWS,
}: FeatureAlternatingRowsProps) {
  const reduced = useReducedMotion();
  const headingId = React.useId();

  return (
    <section
      aria-labelledby={headingId}
      className={cn(
        "relative isolate w-full overflow-hidden rounded-3xl border border-border/50 bg-background px-6 py-16 sm:px-12 md:py-24",
        className,
      )}
    >
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-2xl text-center">
          <h2
            id={headingId}
            className="text-3xl font-semibold tracking-tight text-balance text-foreground sm:text-4xl md:text-5xl"
          >
            {title}
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground md:text-lg">
            {subtitle}
          </p>
        </div>

        <div className="mt-14 space-y-16 md:space-y-24">
          {rows.map((row, i) => {
            const reverse = i % 2 === 1;
            const Icon = row.icon;
            return (
              <motion.div
                key={row.title}
                initial={reduced ? false : { opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.6 }}
                className={cn(
                  "grid items-center gap-10 lg:grid-cols-2 lg:gap-16",
                )}
              >
                <div className={cn(reverse && "lg:order-2")}>
                  <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
                    <Icon className="h-3.5 w-3.5" aria-hidden />
                    {row.eyebrow}
                  </span>
                  <h3 className="mt-4 text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
                    {row.title}
                  </h3>
                  <p className="mt-3 text-base leading-relaxed text-muted-foreground">{row.body}</p>
                  <ul className="mt-5 space-y-2 text-sm text-foreground/90">
                    {row.bullets.map((b) => (
                      <li key={b} className="flex items-start gap-2">
                        <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" aria-hidden />
                        {b}
                      </li>
                    ))}
                  </ul>
                  <a
                    href="/"
                    className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
                  >
                    Learn more <ArrowRight className="h-4 w-4" aria-hidden />
                  </a>
                </div>
                <div className={cn("rounded-2xl border bg-card p-3 shadow-sm transition-shadow hover:shadow-md", reverse && "lg:order-1")} aria-hidden>
                  <div className={cn("aspect-[4/3] w-full rounded-xl bg-gradient-to-br", row.gradient)} />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default FeatureAlternatingRows;

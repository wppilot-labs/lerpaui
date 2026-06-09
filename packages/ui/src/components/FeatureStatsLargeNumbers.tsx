"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "../lib/cn";

export interface FeatureStatsLargeNumbersProps {
  className?: string;
}

interface Stat {
  value: string;
  label: string;
  detail: string;
}

const STATS: Stat[] = [
  { value: "99.99%", label: "Uptime SLA", detail: "Across the last 24 months, measured globally." },
  { value: "1.4B+", label: "Events / day", detail: "Ingested, transformed, and queried in real time." },
  { value: "9ms", label: "Median latency", detail: "From the closest edge region to the user." },
  { value: "312%", label: "Year-one ROI", detail: "Per a 2026 Forrester Total Economic Impact study." },
];

/** Four oversized statistic numbers in a horizontal row with supporting details. */
export function FeatureStatsLargeNumbers({ className }: FeatureStatsLargeNumbersProps) {
  const reduced = useReducedMotion();
  const headingId = React.useId();

  return (
    <section
      aria-labelledby={headingId}
      className={cn(
        "relative isolate w-full overflow-hidden rounded-3xl border border-border/50 bg-card/30 px-6 py-16 backdrop-blur-xl sm:px-12 md:py-24",
        className,
      )}
    >
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-0 h-72 w-[36rem] -translate-x-1/2 rounded-full bg-primary/12 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-6xl">
        <div className="mx-auto max-w-2xl text-center">
          <h2
            id={headingId}
            className="text-3xl font-semibold tracking-tight text-balance text-foreground sm:text-4xl md:text-5xl"
          >
            Numbers that matter to the people who matter.
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground md:text-lg">
            The metrics we obsess over — and the ones our customers send us in their quarterly
            reviews.
          </p>
        </div>

        <dl className="mt-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          {STATS.map((s, i) => (
            <motion.div
              key={s.label}
              initial={reduced ? false : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.55, delay: i * 0.08 }}
              className="border-t border-border/60 pt-6 lg:border-l lg:border-t-0 lg:pl-6 lg:pt-0 lg:first:border-l-0 lg:first:pl-0"
            >
              <dt className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {s.label}
              </dt>
              <dd className="mt-3">
                <span className="block text-5xl font-semibold tracking-tight text-foreground md:text-6xl lg:text-7xl">
                  <span className="bg-gradient-to-br from-primary via-primary to-accent bg-clip-text text-transparent">
                    {s.value}
                  </span>
                </span>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{s.detail}</p>
              </dd>
            </motion.div>
          ))}
        </dl>
      </div>
    </section>
  );
}

export default FeatureStatsLargeNumbers;

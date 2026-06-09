"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Check, Layers } from "lucide-react";
import { cn } from "../lib/cn";

export interface FeatureSplitImageLeftProps {
  className?: string;
  eyebrow?: string;
  title?: string;
  description?: string;
  bullets?: string[];
  ctaLabel?: string;
  ctaHref?: string;
}

const DEFAULT_BULLETS = [
  "150ms median query latency at p99",
  "Auto-scaling read replicas in 14 regions",
  "Point-in-time recovery up to 30 days",
  "No connection limits, ever",
];

const POINTS = [12, 22, 18, 30, 24, 38, 32, 46, 38, 54, 48, 62];

/** Split feature section: mock visual on the left, text content on the right. */
export function FeatureSplitImageLeft({
  className,
  eyebrow = "Edge database",
  title = "A serverless Postgres that feels instant, anywhere.",
  description = "Branch your database like git, replicate to the edge in one click, and pay only for the queries you run.",
  bullets = DEFAULT_BULLETS,
  ctaLabel = "Read the docs",
  ctaHref = "#docs",
}: FeatureSplitImageLeftProps) {
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
      <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2">
        <motion.div
          initial={reduced ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="order-2 rounded-2xl border bg-card p-5 shadow-sm transition-shadow hover:shadow-md lg:order-1"
        >
          <div className="flex items-center justify-between text-xs">
            <span className="font-mono text-foreground">SELECT p99 FROM latency</span>
            <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 font-semibold text-emerald-500">
              healthy
            </span>
          </div>
          <svg viewBox="0 0 240 100" className="mt-5 h-32 w-full" role="img" aria-label="Latency over time chart">
            <defs>
              <linearGradient id="fil-grad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.5" />
                <stop offset="100%" stopColor="var(--primary)" stopOpacity="0" />
              </linearGradient>
            </defs>
            <motion.path
              initial={reduced ? false : { pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.2, delay: 0.3 }}
              d={`M0 ${100 - POINTS[0]} ${POINTS.map((p, i) => `L${(i / (POINTS.length - 1)) * 240} ${100 - p}`).join(" ")}`}
              stroke="var(--primary)"
              strokeWidth="2"
              fill="none"
            />
            <path
              d={`M0 ${100 - POINTS[0]} ${POINTS.map((p, i) => `L${(i / (POINTS.length - 1)) * 240} ${100 - p}`).join(" ")} L240 100 L0 100 Z`}
              fill="url(#fil-grad)"
            />
          </svg>
          <div className="mt-3 grid grid-cols-3 gap-3 text-center">
            {[
              { label: "Median", value: "8ms" },
              { label: "p95", value: "42ms" },
              { label: "p99", value: "150ms" },
            ].map((s) => (
              <div key={s.label} className="rounded-lg border border-border/40 bg-background/40 p-2">
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{s.label}</p>
                <p className="text-base font-semibold text-foreground">{s.value}</p>
              </div>
            ))}
          </div>
        </motion.div>

        <div className="order-1 lg:order-2">
          <motion.span
            initial={reduced ? false : { opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-primary"
          >
            <Layers className="h-3.5 w-3.5" aria-hidden />
            {eyebrow}
          </motion.span>

          <motion.h2
            id={headingId}
            initial={reduced ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.06 }}
            className="mt-5 text-3xl font-semibold tracking-tight text-balance text-foreground sm:text-4xl md:text-5xl"
          >
            {title}
          </motion.h2>

          <motion.p
            initial={reduced ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.14 }}
            className="mt-4 max-w-md text-base leading-relaxed text-muted-foreground md:text-lg"
          >
            {description}
          </motion.p>

          <ul className="mt-7 space-y-3">
            {bullets.map((b, i) => (
              <motion.li
                key={b}
                initial={reduced ? false : { opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.45, delay: 0.22 + i * 0.06 }}
                className="flex items-start gap-3 text-sm text-foreground/90"
              >
                <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" aria-hidden />
                {b}
              </motion.li>
            ))}
          </ul>

          <a
            href={ctaHref}
            className="group mt-8 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
          >
            {ctaLabel}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none" aria-hidden />
          </a>
        </div>
      </div>
    </section>
  );
}

export default FeatureSplitImageLeft;

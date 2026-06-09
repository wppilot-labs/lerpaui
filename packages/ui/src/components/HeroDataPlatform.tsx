"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, BarChart3, Database, Zap } from "lucide-react";
import { cn } from "../lib/cn";

export interface HeroDataPlatformProps {
  className?: string;
}

const STATS = [
  { label: "Events / sec", value: "1.4M" },
  { label: "p99 latency", value: "12ms" },
  { label: "Sources", value: "120+" },
  { label: "Uptime", value: "99.99%" },
];

const BARS = [42, 68, 55, 80, 63, 91, 74, 88, 72, 96, 84, 100];

/** Data platform hero with stat strip and animated chart preview. */
export function HeroDataPlatform({ className }: HeroDataPlatformProps) {
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
        <div className="absolute -left-32 top-0 h-80 w-80 rounded-full bg-primary/15 blur-3xl" />
        <div className="absolute -right-24 bottom-0 h-72 w-72 rounded-full bg-accent/10 blur-3xl" />
      </div>

      <div className="relative mx-auto grid max-w-6xl gap-12 lg:grid-cols-2 lg:items-center">
        <div>
          <motion.span
            initial={reduced ? false : { opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-primary"
          >
            <Database className="h-3.5 w-3.5" aria-hidden />
            Realtime data
          </motion.span>

          <motion.h1
            id={headingId}
            initial={reduced ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.06 }}
            className="mt-5 text-balance text-3xl font-semibold tracking-tight text-foreground sm:text-4xl md:text-5xl"
          >
            Every event. Every column.{" "}
            <span className="bg-gradient-to-br from-primary via-primary to-accent bg-clip-text text-transparent">
              Queryable in seconds.
            </span>
          </motion.h1>

          <motion.p
            initial={reduced ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.14 }}
            className="mt-5 max-w-md text-base leading-relaxed text-muted-foreground md:text-lg"
          >
            The streaming warehouse that ingests, transforms, and serves analytical workloads at
            wire speed.
          </motion.p>

          <div className="mt-7 flex flex-wrap gap-3">
            <a
              href="#start"
              className="group inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
            >
              <Zap className="h-4 w-4" aria-hidden />
              Start ingesting
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none" aria-hidden />
            </a>
            <a
              href="#docs"
              className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-5 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
            >
              Read the docs
            </a>
          </div>

          <dl className="mt-10 grid grid-cols-2 gap-4 border-t border-border/40 pt-6 sm:grid-cols-4">
            {STATS.map((s) => (
              <div key={s.label}>
                <dt className="text-[11px] uppercase tracking-wider text-muted-foreground">{s.label}</dt>
                <dd className="mt-1 text-xl font-semibold text-foreground">{s.value}</dd>
              </div>
            ))}
          </dl>
        </div>

        <motion.div
          initial={reduced ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="rounded-2xl border bg-card p-5 shadow-sm transition-shadow hover:shadow-md"
        >
          <div className="flex items-center justify-between border-b border-border/40 pb-3">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-primary" aria-hidden />
              <span className="text-sm font-semibold text-foreground">events.live</span>
            </div>
            <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-500">
              LIVE
            </span>
          </div>
          <div className="mt-5 flex h-44 items-end gap-2">
            {BARS.map((h, i) => (
              <motion.div
                key={i}
                initial={reduced ? false : { height: 0 }}
                animate={{ height: `${h}%` }}
                transition={{ duration: 0.6, delay: 0.3 + i * 0.04 }}
                style={{ height: `${h}%` }}
                className="flex-1 rounded-t-sm bg-gradient-to-t from-primary/30 to-primary"
                aria-hidden
              />
            ))}
          </div>
          <div className="mt-3 flex justify-between text-[11px] text-muted-foreground">
            <span>00:00</span>
            <span>06:00</span>
            <span>12:00</span>
            <span>18:00</span>
            <span>now</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default HeroDataPlatform;

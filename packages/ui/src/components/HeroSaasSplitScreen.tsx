"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  CheckCircle2,
  PlayCircle,
  Activity,
  Users,
  TrendingUp,
} from "lucide-react";
import { cn } from "../lib/cn";

export interface HeroSaasSplitScreenProps {
  className?: string;
}

const BULLETS = [
  "Real-time sync across every workspace",
  "AI-assisted reviews on every change",
  "Built-in observability and rollback",
];

const METRICS = [
  { label: "Deploys/wk", value: "412", trend: "+34%", icon: Activity },
  { label: "Active devs", value: "1.2k", trend: "+12%", icon: Users },
  { label: "p95 latency", value: "82ms", trend: "−18%", icon: TrendingUp },
];

export function HeroSaasSplitScreen({ className }: HeroSaasSplitScreenProps) {
  const reduced = useReducedMotion();
  const headingId = React.useId();

  return (
    <section
      aria-labelledby={headingId}
      className={cn(
        "relative isolate w-full overflow-hidden rounded-3xl border border-border/50 bg-card/20 px-6 py-16 backdrop-blur-xl sm:px-10 sm:py-20",
        className
      )}
    >
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -left-32 top-1/3 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-accent/10 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 lg:grid-cols-2">
        <div>
          <motion.span
            initial={reduced ? false : { opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-primary"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            Live • v4.2 just shipped
          </motion.span>

          <motion.h1
            id={headingId}
            initial={reduced ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.08 }}
            className="mt-5 text-balance text-4xl font-black leading-[1.05] tracking-tight text-foreground sm:text-5xl lg:text-6xl"
          >
            Engineer the{" "}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              tightest feedback loop
            </span>{" "}
            of your career.
          </motion.h1>

          <motion.p
            initial={reduced ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.16 }}
            className="mt-5 max-w-lg text-pretty text-base leading-relaxed text-muted-foreground"
          >
            From commit to canary in under 60 seconds. The dev platform high-output teams replace
            their entire pipeline with.
          </motion.p>

          <ul className="mt-7 space-y-3">
            {BULLETS.map((b, i) => (
              <motion.li
                key={b}
                initial={reduced ? false : { opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.22 + i * 0.06 }}
                className="flex items-start gap-3 text-sm text-foreground/90"
              >
                <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" aria-hidden />
                <span>{b}</span>
              </motion.li>
            ))}
          </ul>

          <motion.div
            initial={reduced ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.45 }}
            className="mt-9 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center"
          >
            <a
              href="#start"
              className="group inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:-translate-y-0.5 hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 motion-reduce:hover:translate-y-0"
            >
              Get started
              <ArrowRight
                className="h-4 w-4 transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none"
                aria-hidden
              />
            </a>
            <a
              href="#demo"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-card/60 px-5 py-3 text-sm font-semibold text-foreground backdrop-blur-sm transition-colors hover:bg-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
            >
              <PlayCircle className="h-4 w-4" aria-hidden />
              Book a demo
            </a>
          </motion.div>
        </div>

        <motion.div
          initial={reduced ? false : { opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative"
        >
          <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-card/60 p-5 shadow-2xl shadow-black/40 backdrop-blur-xl">
            <div className="absolute inset-0 -z-10 bg-gradient-to-br from-primary/10 via-transparent to-accent/10" />
            <div className="flex items-center justify-between border-b border-border/40 pb-4">
              <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                <span className="flex gap-1">
                  <span className="h-2.5 w-2.5 rounded-full bg-red-500/70" />
                  <span className="h-2.5 w-2.5 rounded-full bg-amber-400/70" />
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/70" />
                </span>
                <span>production · us-east-1</span>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                ● Healthy
              </span>
            </div>

            <div className="mt-5 grid grid-cols-3 gap-3">
              {METRICS.map((m, i) => (
                <motion.div
                  key={m.label}
                  initial={reduced ? false : { opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.4 + i * 0.08 }}
                  className="rounded-xl border border-border/40 bg-background/60 p-3"
                >
                  <m.icon className="h-3.5 w-3.5 text-primary" aria-hidden />
                  <div className="mt-2 text-lg font-bold text-foreground">{m.value}</div>
                  <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                    <span>{m.label}</span>
                    <span className="text-emerald-400">{m.trend}</span>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="mt-5 space-y-2">
              {[
                { t: "feat/checkout-v2", b: "merged", ok: true },
                { t: "fix/race-condition", b: "deploying", ok: true },
                { t: "exp/onboarding-ai", b: "canary 5%", ok: true },
              ].map((row, i) => (
                <motion.div
                  key={row.t}
                  initial={reduced ? false : { opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.35, delay: 0.55 + i * 0.07 }}
                  className="flex items-center justify-between rounded-lg border border-border/30 bg-background/40 px-3 py-2 text-xs"
                >
                  <span className="font-mono text-foreground/80">{row.t}</span>
                  <span className="rounded-full bg-primary/15 px-2 py-0.5 text-[10px] font-semibold text-primary">
                    {row.b}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default HeroSaasSplitScreen;

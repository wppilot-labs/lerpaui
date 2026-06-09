"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Lock, Sparkles, Check, ArrowRight, Zap, Users, BarChart3 } from "lucide-react";
import { cn } from "../lib/cn";

export interface EmptyStateUpgradeRequiredProps {
  className?: string;
  featureName?: string;
  planName?: string;
  priceMonthly?: string;
}

const PERKS = [
  { icon: Users, label: "Unlimited team seats" },
  { icon: Zap, label: "Priority support · 1-hr SLA" },
  { icon: BarChart3, label: "Advanced analytics & exports" },
  { icon: Sparkles, label: "Early access to new features" },
];

export function EmptyStateUpgradeRequired({
  className,
  featureName = "Custom Workflows",
  planName = "Team",
  priceMonthly = "$24",
}: EmptyStateUpgradeRequiredProps) {
  const reduced = useReducedMotion();
  const headingId = React.useId();

  return (
    <section
      aria-labelledby={headingId}
      className={cn("relative w-full overflow-hidden bg-background px-6 py-16 md:py-24", className)}
    >
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,oklch(0.75_0.22_290/0.2),transparent_55%)]" />

      <motion.div
        initial={reduced ? false : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 mx-auto max-w-2xl overflow-hidden rounded-3xl border border-border bg-card shadow-sm transition-shadow hover:shadow-md"
      >
        <div className="relative px-8 pb-2 pt-10 text-center sm:px-12 sm:pt-14">
          <div aria-hidden className="pointer-events-none absolute inset-0 -z-0 bg-gradient-to-b from-primary/8 to-transparent" />

          <div className="relative mx-auto flex h-20 w-20 items-center justify-center">
            <motion.div
              animate={reduced ? undefined : { scale: [1, 1.15, 1], opacity: [0.3, 0.6, 0.3] }}
              transition={reduced ? undefined : { duration: 2.4, ease: "easeInOut", repeat: Infinity }}
              className="absolute inset-0 rounded-full bg-primary/30 blur-2xl"
            />
            <div className="relative flex h-20 w-20 items-center justify-center rounded-2xl border border-primary/30 bg-primary/10 text-primary">
              <Lock className="h-9 w-9" aria-hidden />
            </div>
          </div>

          <div className="relative mt-5 inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
            <Sparkles className="h-3.5 w-3.5" aria-hidden />
            {planName} feature
          </div>
          <h2 id={headingId} className="relative mt-4 text-balance text-3xl font-black tracking-tight text-foreground sm:text-4xl">
            {featureName} is on {planName}
          </h2>
          <p className="relative mx-auto mt-3 max-w-md text-sm text-muted-foreground sm:text-base">
            Upgrade your workspace to unlock {featureName.toLowerCase()} and everything else in {planName}.
          </p>
        </div>

        <div className="border-t border-border bg-background/30 px-8 py-8 sm:px-12">
          <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {PERKS.map((p) => (
              <li key={p.label} className="flex items-center gap-3 text-sm">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-500">
                  <Check className="h-4 w-4" aria-hidden />
                </span>
                <span className="text-foreground">{p.label}</span>
              </li>
            ))}
          </ul>

          <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
            <div>
              <div className="text-3xl font-black tracking-tight text-foreground">
                {priceMonthly}
                <span className="ml-1 text-sm font-medium text-muted-foreground">/ user / mo</span>
              </div>
              <div className="text-xs text-muted-foreground">Billed annually · 14-day free trial</div>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <a
                href="/"
                className="group inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-lg transition-all hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
              >
                Upgrade to {planName}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none" aria-hidden />
              </a>
              <a
                href="/"
                className="text-center text-sm font-semibold text-muted-foreground hover:text-foreground"
              >
                Compare plans
              </a>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

export default EmptyStateUpgradeRequired;

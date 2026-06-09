"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Sparkles, Check, ArrowRight, Clock } from "lucide-react";
import { cn } from "../lib/cn";

export interface PricingLifetimeDealStripProps {
  className?: string;
  hoursLeft?: number;
}

const PERKS = [
  "Lifetime access · pay once",
  "All future updates included",
  "Use on unlimited projects",
  "30-day no-questions refund",
];

export function PricingLifetimeDealStrip({ className, hoursLeft = 36 }: PricingLifetimeDealStripProps) {
  const reduced = useReducedMotion() ?? false;

  return (
    <section
      aria-label="Lifetime deal"
      className={cn(
        "relative isolate w-full overflow-hidden rounded-3xl border bg-card shadow-sm transition-shadow hover:shadow-md",
        className
      )}
    >
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(70%_60%_at_15%_50%,oklch(0.65_0.2_280/0.12),transparent_55%),radial-gradient(60%_60%_at_85%_50%,oklch(0.7_0.18_200/0.12),transparent_55%)]" />

      <div className="grid items-center gap-6 px-6 py-12 md:grid-cols-[1fr_auto] md:px-10 md:py-14">
        <motion.div
          initial={reduced ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-primary-foreground shadow-sm shadow-primary/25">
              <Sparkles className="h-3 w-3" aria-hidden /> Lifetime deal
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border bg-muted/30 px-3 py-1 text-[11px] font-medium text-muted-foreground">
              <Clock className="h-3 w-3 text-rose-500" aria-hidden /> Closes in {hoursLeft}h
            </span>
          </div>

          <h2 className="mt-4 text-balance text-3xl font-black leading-tight tracking-tight text-foreground sm:text-4xl">
            Pay once. Own it forever.
          </h2>
          <p className="mt-2 max-w-lg text-pretty text-sm text-muted-foreground">
            One-time payment. No subscriptions, no renewals, no surprises. The deal ends Friday.
          </p>

          <ul className="mt-5 grid grid-cols-1 gap-2 text-sm sm:grid-cols-2">
            {PERKS.map((p) => (
              <li key={p} className="flex items-start gap-2 text-foreground">
                <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-500" aria-hidden /> {p}
              </li>
            ))}
          </ul>
        </motion.div>

        <motion.div
          initial={reduced ? false : { opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.45, delay: 0.1 }}
          className="rounded-2xl border bg-muted/20 p-6 text-center md:min-w-[240px]"
        >
          <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Today only</p>
          <div className="mt-1 flex items-baseline justify-center gap-2">
            <span className="text-4xl font-black tabular-nums text-foreground">$189</span>
            <span className="text-sm text-muted-foreground line-through">$399</span>
          </div>
          <p className="mt-1 text-[11px] font-semibold text-emerald-500">Save 52%</p>

          <a
            href="#claim-ltd"
            className="group mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:brightness-110"
          >
            Claim lifetime deal
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none" aria-hidden />
          </a>
          <p className="mt-2 text-[10px] text-muted-foreground">2,148 already claimed</p>
        </motion.div>
      </div>
    </section>
  );
}

export default PricingLifetimeDealStrip;

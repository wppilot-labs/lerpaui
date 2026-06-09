"use client";

import React, { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Check, Sparkles, Zap } from "lucide-react";
import { cn } from "../lib/cn";

export interface PricingMonthlyYearlyToggleProps {
  className?: string;
}

type Billing = "monthly" | "annual";

const PLANS = [
  {
    name: "Basic",
    monthly: 12,
    annual: 9,
    features: ["5 projects", "20 GB storage", "Email support"],
    cta: "Get Basic",
  },
  {
    name: "Studio",
    monthly: 32,
    annual: 26,
    features: [
      "Unlimited projects",
      "200 GB storage",
      "Priority chat",
      "Custom domains",
    ],
    cta: "Choose Studio",
    featured: true,
  },
];

export function PricingMonthlyYearlyToggle({
  className,
}: PricingMonthlyYearlyToggleProps) {
  const reduced = useReducedMotion();
  const [billing, setBilling] = useState<Billing>("annual");
  const headingId = React.useId();
  const savings = billing === "annual" ? "Save 20%" : "Free for 14 days";

  return (
    <section
      aria-labelledby={headingId}
      className={cn(
        "relative isolate w-full overflow-hidden rounded-3xl border border-border/50 bg-gradient-to-b from-background to-muted/30 px-6 py-16 sm:px-10 sm:py-20",
        className,
      )}
    >
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,oklch(0.75_0.18_280/0.16),transparent_55%)]" />
      </div>

      <div className="relative mx-auto max-w-3xl">
        <div className="text-center">
          <motion.span
            initial={reduced ? false : { opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-primary"
          >
            <Zap className="h-3.5 w-3.5" aria-hidden />
            {savings}
          </motion.span>

          <motion.h2
            id={headingId}
            initial={reduced ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.06 }}
            className="mt-5 text-balance text-3xl font-semibold leading-tight tracking-tight text-foreground sm:text-4xl md:text-5xl"
          >
            Pay monthly or annually
          </motion.h2>

          <motion.p
            initial={reduced ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.14 }}
            className="mx-auto mt-4 max-w-md text-pretty text-base leading-relaxed text-muted-foreground"
          >
            Switch any time. Annual saves you two months and unlocks priority
            onboarding.
          </motion.p>

          <motion.div
            initial={reduced ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.22 }}
            className="mt-7 inline-flex items-center gap-1 rounded-full border border-border/60 bg-background/60 p-1 shadow-sm"
            role="tablist"
            aria-label="Billing cycle"
          >
            {(["monthly", "annual"] as const).map((t) => (
              <button
                key={t}
                type="button"
                role="tab"
                aria-selected={billing === t}
                onClick={() => setBilling(t)}
                className={cn(
                  "rounded-full px-5 py-1.5 text-sm font-semibold capitalize transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40",
                  billing === t
                    ? "bg-primary text-primary-foreground shadow"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {t}
                {t === "annual" && (
                  <span className="ml-2 rounded-full bg-emerald-400/15 px-1.5 py-0.5 text-[10px] font-bold text-emerald-400">
                    −20%
                  </span>
                )}
              </button>
            ))}
          </motion.div>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2">
          {PLANS.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={reduced ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 + i * 0.08 }}
              className={cn(
                "group relative flex flex-col rounded-2xl border bg-card p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md md:p-8",
                plan.featured
                  ? "border-primary/40 bg-gradient-to-b from-primary/5 to-card shadow-lg shadow-primary/10"
                  : "border-border/60",
              )}
            >
              {plan.featured && (
                <span className="absolute -top-3 left-6 inline-flex items-center gap-1 rounded-full bg-primary px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-primary-foreground shadow">
                  <Sparkles className="h-3 w-3" aria-hidden />
                  Best value
                </span>
              )}

              <div>
                <h3 className="text-base font-bold uppercase tracking-wider text-foreground">
                  {plan.name}
                </h3>
                <div className="mt-4 flex items-baseline gap-1.5">
                  <span className="text-5xl font-semibold tracking-tight text-foreground">
                    ${billing === "annual" ? plan.annual : plan.monthly}
                  </span>
                  <span className="text-sm text-muted-foreground">/month</span>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  {billing === "annual"
                    ? `Billed annually at $${plan.annual * 12}`
                    : "Billed month-to-month"}
                </p>
              </div>

              <ul className="mt-6 flex-1 space-y-3 text-sm text-foreground/90">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5">
                    <Check
                      className={cn(
                        "mt-0.5 h-4 w-4 flex-shrink-0",
                        plan.featured ? "text-primary" : "text-foreground/70",
                      )}
                      aria-hidden
                    />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>

              <button
                type="button"
                className={cn(
                  "mt-8 inline-flex w-full items-center justify-center rounded-xl px-5 py-3 text-sm font-semibold transition-all focus:outline-none focus-visible:ring-2",
                  plan.featured
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25 hover:brightness-110 focus-visible:ring-primary/50"
                    : "border border-border bg-background text-foreground hover:bg-accent focus-visible:ring-primary/40",
                )}
              >
                {plan.cta}
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default PricingMonthlyYearlyToggle;

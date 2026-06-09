"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Sparkles, Check, ArrowRight, Zap } from "lucide-react";
import { cn } from "../lib/cn";

export interface TrialTier {
  id: string;
  label: string;
  price: string;
  sub: string;
  perks: string[];
  popular?: boolean;
}

export interface CtaFreeTrialMultiTierProps {
  className?: string;
  defaultTier?: string;
  eyebrow?: string;
  title?: string;
  description?: string;
  tiers?: TrialTier[];
}

const DEFAULT_TIERS: TrialTier[] = [
  { id: "starter", label: "Starter", price: "$0", sub: "Free forever", perks: ["Up to 3 projects", "Community support"] },
  { id: "pro", label: "Pro", price: "$24", sub: "/month", perks: ["Unlimited projects", "Priority email", "Team roles"], popular: true },
  { id: "scale", label: "Scale", price: "$84", sub: "/month", perks: ["SSO + audit logs", "99.99% SLA", "Dedicated CSM"] },
];

export function CtaFreeTrialMultiTier({
  className,
  defaultTier = "pro",
  eyebrow = "14-day free trial · no card needed",
  title = "Start the plan that fits today",
  description = "Switch or cancel any time. Every trial includes the full Pro feature set.",
  tiers = DEFAULT_TIERS,
}: CtaFreeTrialMultiTierProps) {
  const reduced = useReducedMotion() ?? false;
  const [active, setActive] = React.useState(defaultTier);
  const tier = tiers.find((t) => t.id === active) ?? tiers[0];

  return (
    <section
      aria-label="Start a free trial"
      className={cn(
        "relative isolate w-full overflow-hidden rounded-3xl border bg-card px-6 py-16 text-center shadow-sm transition-shadow hover:shadow-md md:py-24",
        className
      )}
    >
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(90%_60%_at_50%_0%,oklch(0.65_0.2_280/0.15),transparent_60%)]" />

      <motion.div
        initial={reduced ? false : { opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mx-auto flex max-w-2xl flex-col items-center"
      >
        <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-primary">
          <Zap className="h-3 w-3" aria-hidden /> {eyebrow}
        </span>

        <h2 className="mt-5 text-balance text-4xl font-black leading-tight tracking-tight text-foreground sm:text-5xl">
          {title}
        </h2>
        <p className="mt-3 max-w-lg text-pretty text-base text-muted-foreground">
          {description}
        </p>

        <div className="mt-8 grid w-full max-w-2xl grid-cols-3 gap-2 rounded-2xl border bg-muted/30 p-1.5">
          {tiers.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setActive(t.id)}
              aria-pressed={active === t.id}
              className={cn(
                "relative rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                active === t.id ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
              )}
            >
              {t.popular && (
                <span className="absolute -top-2 right-2 inline-flex items-center gap-0.5 rounded-full bg-primary px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wider text-primary-foreground">
                  <Sparkles className="h-2 w-2" /> Popular
                </span>
              )}
              {t.label}
            </button>
          ))}
        </div>

        <motion.div
          key={tier.id}
          initial={reduced ? false : { opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mt-6 w-full max-w-md rounded-2xl border bg-muted/20 p-6 text-left"
        >
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-black tabular-nums text-foreground">{tier.price}</span>
            <span className="text-sm text-muted-foreground">{tier.sub}</span>
          </div>
          <ul className="mt-4 space-y-2 text-sm text-foreground">
            {tier.perks.map((p) => (
              <li key={p} className="flex items-start gap-2">
                <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-500" aria-hidden /> {p}
              </li>
            ))}
          </ul>
        </motion.div>

        <a
          href={`#trial-${tier.id}`}
          className="group mt-6 inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-xl shadow-primary/25 transition-all hover:brightness-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
        >
          Start {tier.label} trial
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none" aria-hidden />
        </a>
      </motion.div>
    </section>
  );
}

export default CtaFreeTrialMultiTier;

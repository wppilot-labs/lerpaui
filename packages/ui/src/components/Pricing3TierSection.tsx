"use client";

import React, { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Check, Sparkles } from "lucide-react";
import { cn } from "../lib/cn";

export interface Pricing3TierSectionProps {
  className?: string;
}

type Billing = "monthly" | "annual";

interface Tier {
  name: string;
  tagline: string;
  monthly: number;
  annual: number;
  features: string[];
  cta: string;
  highlighted?: boolean;
}

const TIERS: Tier[] = [
  {
    name: "Starter",
    tagline: "For indie builders",
    monthly: 19,
    annual: 15,
    features: ["3 active projects", "10 GB storage", "Community support"],
    cta: "Start free",
  },
  {
    name: "Pro",
    tagline: "For growing teams",
    monthly: 49,
    annual: 39,
    features: [
      "Unlimited projects",
      "100 GB storage",
      "Priority support",
      "Advanced analytics",
    ],
    cta: "Start 14-day trial",
    highlighted: true,
  },
  {
    name: "Enterprise",
    tagline: "For scaling orgs",
    monthly: 99,
    annual: 79,
    features: [
      "Everything in Pro",
      "SSO + SCIM",
      "Dedicated CSM",
      "99.99% uptime SLA",
    ],
    cta: "Contact sales",
  },
];

export function Pricing3TierSection({ className }: Pricing3TierSectionProps) {
  const reduced = useReducedMotion();
  const [billing, setBilling] = useState<Billing>("annual");
  const headingId = React.useId();

  return (
    <section
      aria-labelledby={headingId}
      className={cn(
        "relative isolate w-full overflow-hidden rounded-3xl border border-border/50 bg-card/30 px-6 py-16 backdrop-blur-xl sm:px-10 sm:py-20",
        className,
      )}
    >
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-0 h-72 w-[36rem] -translate-x-1/2 rounded-full bg-primary/15 blur-3xl" />
        <div className="absolute -right-32 bottom-0 h-72 w-72 rounded-full bg-accent/10 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-5xl">
        <div className="mx-auto max-w-2xl text-center">
          <motion.span
            initial={reduced ? false : { opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-primary"
          >
            <Sparkles className="h-3.5 w-3.5" aria-hidden />
            Simple pricing
          </motion.span>

          <motion.h2
            id={headingId}
            initial={reduced ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.06 }}
            className="mt-5 text-balance text-3xl font-semibold leading-[1.05] tracking-tight text-foreground sm:text-4xl md:text-5xl"
          >
            Plans that scale{" "}
            <span className="bg-gradient-to-br from-primary via-primary to-accent bg-clip-text text-transparent">
              with you
            </span>
          </motion.h2>

          <motion.p
            initial={reduced ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.14 }}
            className="mx-auto mt-4 max-w-md text-pretty text-base leading-relaxed text-muted-foreground"
          >
            Start free, upgrade when you outgrow the limits. Cancel anytime.
          </motion.p>

          <motion.div
            initial={reduced ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.22 }}
            className="mt-7 inline-flex items-center gap-1 rounded-full border border-border/60 bg-background/50 p-1"
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
                  "rounded-full px-4 py-1.5 text-xs font-semibold capitalize transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40",
                  billing === t
                    ? "bg-primary text-primary-foreground shadow"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {t}
                {t === "annual" && (
                  <span className="ml-1.5 rounded-full bg-emerald-400/15 px-1.5 py-0.5 text-[10px] font-bold text-emerald-400">
                    −20%
                  </span>
                )}
              </button>
            ))}
          </motion.div>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
          {TIERS.map((tier, i) => (
            <motion.div
              key={tier.name}
              initial={reduced ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 + i * 0.08 }}
              className={cn(
                "group relative flex flex-col rounded-2xl border bg-card p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md md:p-8",
                tier.highlighted
                  ? "border-primary/40 bg-gradient-to-b from-primary/5 to-card shadow-lg shadow-primary/10"
                  : "border-border/60",
              )}
            >
              {tier.highlighted && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-primary-foreground shadow-lg shadow-primary/30">
                  Most popular
                </span>
              )}

              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-foreground">
                  {tier.name}
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">{tier.tagline}</p>
                <div className="mt-5 flex items-baseline gap-1.5">
                  <span className="text-4xl font-semibold tracking-tight text-foreground md:text-5xl">
                    ${billing === "annual" ? tier.annual : tier.monthly}
                  </span>
                  <span className="text-sm text-muted-foreground">/mo</span>
                </div>
                {billing === "annual" && (
                  <p className="mt-1 text-xs text-muted-foreground">
                    Billed annually
                  </p>
                )}
              </div>

              <ul className="mt-6 flex-1 space-y-3 text-sm text-foreground/90">
                {tier.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5">
                    <Check
                      className={cn(
                        "mt-0.5 h-4 w-4 flex-shrink-0",
                        tier.highlighted ? "text-primary" : "text-foreground/70",
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
                  "mt-8 inline-flex w-full items-center justify-center gap-1.5 rounded-xl px-5 py-3 text-sm font-semibold transition-all focus:outline-none focus-visible:ring-2",
                  tier.highlighted
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25 hover:brightness-110 focus-visible:ring-primary/50"
                    : "border border-border bg-background text-foreground hover:bg-accent focus-visible:ring-primary/40",
                )}
              >
                {tier.cta}
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Pricing3TierSection;

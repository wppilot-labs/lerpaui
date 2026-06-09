"use client";

import * as React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Check, Sparkles } from "lucide-react";
import { usePrefersReducedMotion } from "../animation/hooks";
import { cn } from "../lib/cn";

export interface ScrollRevealPricingTier {
  id: string;
  name: string;
  tagline: string;
  monthlyPrice: number;
  features: string[];
  ctaLabel: string;
  ctaHref?: string;
  highlighted?: boolean;
}

export interface PricingScrollRevealTiersProps
  extends React.HTMLAttributes<HTMLElement> {
  eyebrow?: string;
  title?: string;
  description?: string;
  tiers?: ScrollRevealPricingTier[];
  className?: string;
}

const DEFAULT_TIERS: ScrollRevealPricingTier[] = [
  {
    id: "starter",
    name: "Starter",
    tagline: "For solo builders shipping their first product.",
    monthlyPrice: 0,
    features: [
      "Full component registry",
      "MIT license, fork freely",
      "Community Discord access",
      "Theme studio (basic)",
    ],
    ctaLabel: "Start free",
    ctaHref: "#starter",
  },
  {
    id: "team",
    name: "Team",
    tagline: "For product teams scaling design velocity.",
    monthlyPrice: 49,
    features: [
      "Everything in Starter",
      "Priority issue triage",
      "Private theme presets",
      "Block composer (premium)",
      "Team review workflows",
    ],
    ctaLabel: "Start 14-day trial",
    ctaHref: "#team",
    highlighted: true,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    tagline: "For platforms with custom design systems.",
    monthlyPrice: 199,
    features: [
      "Everything in Team",
      "Dedicated solutions engineer",
      "Custom token pipeline",
      "SLA & SAML SSO",
      "On-prem registry mirror",
    ],
    ctaLabel: "Contact sales",
    ctaHref: "#enterprise",
  },
];

interface TierCardProps {
  tier: ScrollRevealPricingTier;
  index: number;
  reduced: boolean;
}

function TierCard({ tier, index, reduced }: TierCardProps) {
  return (
    <motion.article
      initial={reduced ? false : { opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{
        duration: 0.55,
        delay: reduced ? 0 : index * 0.12,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={cn(
        "relative flex flex-col rounded-2xl border bg-card p-8 text-card-foreground shadow-sm transition-shadow hover:shadow-lg",
        tier.highlighted
          ? "border-primary/60 shadow-lg shadow-primary/10"
          : "border-border"
      )}
    >
      {tier.highlighted ? (
        <span className="absolute -top-3 left-1/2 inline-flex -translate-x-1/2 items-center gap-1.5 rounded-full bg-primary px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary-foreground shadow-md">
          <Sparkles className="h-3 w-3" aria-hidden />
          Most popular
        </span>
      ) : null}

      <header>
        <h3 className="text-lg font-semibold text-foreground">{tier.name}</h3>
        <p className="mt-1 text-sm text-muted-foreground">{tier.tagline}</p>
      </header>

      <div className="mt-6 flex items-baseline gap-1.5">
        <span className="text-5xl font-bold tracking-tight text-foreground">
          {tier.monthlyPrice === 0 ? "$0" : `$${tier.monthlyPrice}`}
        </span>
        <span className="text-sm text-muted-foreground">/month</span>
      </div>

      <ul className="mt-7 flex-1 space-y-3">
        {tier.features.map((feat) => (
          <li
            key={feat}
            className="flex items-start gap-2.5 text-sm text-foreground/90"
          >
            <span
              className={cn(
                "mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full",
                tier.highlighted
                  ? "bg-primary text-primary-foreground"
                  : "bg-primary/15 text-primary"
              )}
            >
              <Check className="h-3 w-3" aria-hidden />
            </span>
            <span>{feat}</span>
          </li>
        ))}
      </ul>

      <a
        href={tier.ctaHref ?? "#"}
        className={cn(
          "mt-8 inline-flex w-full items-center justify-center rounded-lg px-5 py-2.5 text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background motion-reduce:transition-none",
          tier.highlighted
            ? "bg-primary text-primary-foreground shadow-md shadow-primary/25 hover:brightness-110"
            : "border border-border bg-background text-foreground hover:bg-accent hover:text-accent-foreground"
        )}
      >
        {tier.ctaLabel}
      </a>
    </motion.article>
  );
}

export function PricingScrollRevealTiers({
  eyebrow = "Pricing",
  title = "Pay for outcomes, not seats.",
  description = "Transparent pricing for every stage. Cancel anytime — no surprises.",
  tiers = DEFAULT_TIERS,
  className,
  ...rest
}: PricingScrollRevealTiersProps) {
  const prefersHook = usePrefersReducedMotion();
  const fmReduced = useReducedMotion();
  const reduced = prefersHook || Boolean(fmReduced);
  const headingId = React.useId();
  const safe = tiers.length ? tiers : DEFAULT_TIERS;

  return (
    <section
      {...rest}
      aria-labelledby={headingId}
      className={cn(
        "relative w-full bg-background py-20 sm:py-28 lg:py-32",
        className
      )}
    >
      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          {eyebrow ? (
            <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              {eyebrow}
            </p>
          ) : null}
          <h2
            id={headingId}
            className="text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl"
          >
            {title}
          </h2>
          {description ? (
            <p className="mt-4 text-pretty text-base text-muted-foreground">
              {description}
            </p>
          ) : null}
        </div>

        <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-3 md:items-stretch">
          {safe.map((tier, i) => (
            <TierCard key={tier.id} tier={tier} index={i} reduced={reduced} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default PricingScrollRevealTiers;

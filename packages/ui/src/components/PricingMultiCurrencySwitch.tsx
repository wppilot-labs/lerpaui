"use client";

import React, { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Check, Globe } from "lucide-react";
import { cn } from "../lib/cn";

export interface PricingMultiCurrencySwitchProps {
  className?: string;
}

interface CurrencyInfo {
  code: string;
  symbol: string;
  rate: number;
}

const CURRENCIES: CurrencyInfo[] = [
  { code: "USD", symbol: "$", rate: 1 },
  { code: "EUR", symbol: "€", rate: 0.92 },
  { code: "GBP", symbol: "£", rate: 0.79 },
  { code: "JPY", symbol: "¥", rate: 153 },
];

interface Tier {
  name: string;
  baseUsd: number;
  features: string[];
  highlight?: boolean;
}

const TIERS: Tier[] = [
  {
    name: "Basic",
    baseUsd: 12,
    features: ["3 seats", "5 GB storage", "Email support"],
  },
  {
    name: "Pro",
    baseUsd: 39,
    features: ["10 seats", "100 GB storage", "Priority support", "Integrations"],
    highlight: true,
  },
  {
    name: "Business",
    baseUsd: 99,
    features: ["Unlimited seats", "1 TB storage", "SSO", "Dedicated CSM"],
  },
];

export function PricingMultiCurrencySwitch({
  className,
}: PricingMultiCurrencySwitchProps) {
  const reduced = useReducedMotion();
  const headingId = React.useId();
  const [currency, setCurrency] = useState<CurrencyInfo>(CURRENCIES[0]);

  const format = (usd: number) => {
    const v = usd * currency.rate;
    if (currency.code === "JPY") return `${currency.symbol}${Math.round(v)}`;
    return `${currency.symbol}${v.toFixed(0)}`;
  };

  return (
    <section
      aria-labelledby={headingId}
      className={cn(
        "relative w-full overflow-hidden rounded-3xl border border-border/50 bg-card/30 px-6 py-16 backdrop-blur-xl sm:px-10 sm:py-24",
        className,
      )}
    >
      <div className="relative mx-auto max-w-5xl">
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
            <Globe className="h-3.5 w-3.5" aria-hidden />
            Global pricing
          </span>
          <h2
            id={headingId}
            className="mt-5 text-balance text-3xl font-semibold tracking-tight sm:text-4xl md:text-5xl"
          >
            Pricing in your currency
          </h2>

          <div
            role="tablist"
            aria-label="Currency"
            className="mt-7 inline-flex items-center gap-1 rounded-full border border-border/60 bg-background/50 p-1"
          >
            {CURRENCIES.map((c) => (
              <button
                key={c.code}
                type="button"
                role="tab"
                aria-selected={currency.code === c.code}
                onClick={() => setCurrency(c)}
                className={cn(
                  "rounded-full px-3 py-1.5 text-xs font-semibold transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]",
                  currency.code === c.code
                    ? "bg-primary text-primary-foreground shadow"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {c.code}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
          {TIERS.map((tier, i) => (
            <motion.div
              key={tier.name}
              initial={reduced ? false : { opacity: 0, y: 16 }}
              whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: i * 0.08 }}
              className={cn(
                "rounded-2xl border bg-card p-6 shadow-sm transition-shadow hover:shadow-md md:p-8",
                tier.highlight && "border-primary/40 shadow-lg shadow-primary/10",
              )}
            >
              <h3 className="text-sm font-bold uppercase tracking-wider">{tier.name}</h3>
              <div className="mt-4 text-4xl font-semibold tracking-tight text-foreground">
                {format(tier.baseUsd)}
                <span className="ml-1 text-sm text-muted-foreground">/mo</span>
              </div>
              <ul className="mt-6 space-y-3 text-sm text-foreground/90">
                {tier.features.map((f) => (
                  <li key={f} className="flex items-start gap-2">
                    <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" aria-hidden />
                    {f}
                  </li>
                ))}
              </ul>
              <button
                type="button"
                className={cn(
                  "mt-7 inline-flex w-full items-center justify-center rounded-xl px-5 py-2.5 text-sm font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]",
                  tier.highlight
                    ? "bg-primary text-primary-foreground hover:brightness-110"
                    : "border bg-background text-foreground hover:bg-accent",
                )}
              >
                Choose {tier.name}
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default PricingMultiCurrencySwitch;

"use client";

import React, { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Coins, Sparkles } from "lucide-react";
import { cn } from "../lib/cn";

export interface PricingCreditPackSelectorProps {
  className?: string;
}

interface Pack {
  id: string;
  credits: number;
  price: number;
  discount?: number;
  label?: string;
}

const PACKS: Pack[] = [
  { id: "starter", credits: 1000, price: 10 },
  { id: "popular", credits: 5500, price: 49, discount: 11, label: "Best value" },
  { id: "growth", credits: 12000, price: 99, discount: 18 },
  { id: "scale", credits: 30000, price: 229, discount: 24 },
];

export function PricingCreditPackSelector({
  className,
}: PricingCreditPackSelectorProps) {
  const reduced = useReducedMotion();
  const headingId = React.useId();
  const [selected, setSelected] = useState<string>("popular");

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
            <Coins className="h-3.5 w-3.5" aria-hidden />
            Credit packs
          </span>
          <h2
            id={headingId}
            className="mt-5 text-balance text-3xl font-semibold tracking-tight sm:text-4xl md:text-5xl"
          >
            Stock up. Save more.
          </h2>
          <p className="mx-auto mt-3 max-w-md text-pretty text-muted-foreground">
            Credits never expire. Larger packs save up to 24%.
          </p>
        </div>

        <div
          role="radiogroup"
          aria-label="Credit pack"
          className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
        >
          {PACKS.map((p, i) => {
            const active = selected === p.id;
            const pricePerCredit = (p.price / p.credits) * 1000;
            return (
              <motion.button
                key={p.id}
                role="radio"
                aria-checked={active}
                type="button"
                onClick={() => setSelected(p.id)}
                initial={reduced ? false : { opacity: 0, y: 12 }}
                whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
                className={cn(
                  "relative flex flex-col items-start rounded-2xl border bg-card p-6 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]",
                  active
                    ? "border-primary ring-2 ring-primary/30"
                    : "border-border/60",
                )}
              >
                {p.label && (
                  <span className="absolute -top-3 left-6 inline-flex items-center gap-1 rounded-full bg-primary px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary-foreground shadow">
                    <Sparkles className="h-3 w-3" aria-hidden />
                    {p.label}
                  </span>
                )}
                {p.discount && (
                  <span className="absolute right-4 top-4 rounded-full bg-emerald-400/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                    Save {p.discount}%
                  </span>
                )}
                <div className="font-mono text-3xl font-semibold tracking-tight text-foreground">
                  {p.credits.toLocaleString()}
                </div>
                <div className="text-xs uppercase tracking-wider text-muted-foreground">
                  credits
                </div>
                <div className="mt-4 text-2xl font-semibold text-foreground">
                  ${p.price}
                </div>
                <div className="mt-1 text-xs text-muted-foreground">
                  ${pricePerCredit.toFixed(2)} / 1k credits
                </div>
                <div
                  aria-hidden
                  className={cn(
                    "mt-5 inline-flex w-full items-center justify-center rounded-lg px-3 py-2 text-xs font-semibold transition",
                    active
                      ? "bg-primary text-primary-foreground"
                      : "border bg-background text-foreground",
                  )}
                >
                  {active ? "Selected" : "Select"}
                </div>
              </motion.button>
            );
          })}
        </div>

        <div className="mt-8 flex flex-col items-center gap-3 text-center sm:flex-row sm:justify-center">
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow transition hover:brightness-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
          >
            Checkout
          </button>
          <span className="text-xs text-muted-foreground">
            Volume discounts available above 100k credits.
          </span>
        </div>
      </div>
    </section>
  );
}

export default PricingCreditPackSelector;

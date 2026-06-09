"use client";

import React, { useState, useMemo } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Check, Sliders } from "lucide-react";
import { cn } from "../lib/cn";

export interface PricingSliderInteractiveProps {
  className?: string;
}

interface Bracket {
  threshold: number;
  name: string;
  price: number;
  features: string[];
}

const BRACKETS: Bracket[] = [
  {
    threshold: 10,
    name: "Hobby",
    price: 0,
    features: ["10k events / mo", "1 project", "Community support"],
  },
  {
    threshold: 50,
    name: "Indie",
    price: 19,
    features: ["100k events / mo", "5 projects", "Email support"],
  },
  {
    threshold: 200,
    name: "Studio",
    price: 79,
    features: ["1M events / mo", "Unlimited projects", "Priority support"],
  },
  {
    threshold: 500,
    name: "Scale",
    price: 249,
    features: ["10M events / mo", "SSO", "Dedicated manager"],
  },
  {
    threshold: 1000,
    name: "Enterprise",
    price: 599,
    features: ["Unlimited events", "Custom SLA", "On-call response"],
  },
];

export function PricingSliderInteractive({
  className,
}: PricingSliderInteractiveProps) {
  const reduced = useReducedMotion();
  const headingId = React.useId();
  const [value, setValue] = useState(50);

  const tier = useMemo(() => {
    return (
      BRACKETS.find((b) => value <= b.threshold) ?? BRACKETS[BRACKETS.length - 1]
    );
  }, [value]);

  return (
    <section
      aria-labelledby={headingId}
      className={cn(
        "relative w-full overflow-hidden rounded-3xl border border-border/50 bg-card/30 px-6 py-16 backdrop-blur-xl sm:px-10 sm:py-24",
        className,
      )}
    >
      <div className="relative mx-auto max-w-3xl">
        <div className="text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
            <Sliders className="h-3.5 w-3.5" aria-hidden />
            Pick your scale
          </span>
          <h2
            id={headingId}
            className="mt-5 text-balance text-3xl font-semibold tracking-tight sm:text-4xl md:text-5xl"
          >
            One plan, slide to fit
          </h2>
          <p className="mx-auto mt-3 max-w-md text-pretty text-muted-foreground">
            We scale every feature with you — slide to see your tier.
          </p>
        </div>

        <motion.div
          initial={reduced ? false : { opacity: 0, y: 20 }}
          whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mt-10 rounded-2xl border bg-card p-6 shadow-sm sm:p-10"
        >
          <div className="flex items-baseline justify-between">
            <div>
              <div className="text-sm uppercase tracking-wider text-muted-foreground">
                {tier.name}
              </div>
              <div className="mt-1 text-5xl font-semibold tracking-tight text-foreground">
                ${tier.price}
                <span className="text-base text-muted-foreground">/mo</span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs uppercase tracking-wider text-muted-foreground">
                Active users
              </div>
              <div className="font-mono text-2xl font-semibold text-foreground">
                {value}k
              </div>
            </div>
          </div>

          <input
            type="range"
            min={1}
            max={1000}
            step={1}
            value={value}
            aria-label="Monthly active users in thousands"
            onChange={(e) => setValue(Number(e.target.value))}
            className="mt-6 h-2 w-full cursor-pointer appearance-none rounded-full bg-muted accent-[var(--accent)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
          />
          <div className="mt-2 flex justify-between text-xs text-muted-foreground">
            <span>1k</span>
            <span>250k</span>
            <span>500k</span>
            <span>1M</span>
          </div>

          <ul className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-3">
            {tier.features.map((f) => (
              <li
                key={f}
                className="flex items-start gap-2 rounded-xl border border-border/60 bg-background/40 p-3 text-sm text-foreground/90"
              >
                <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" aria-hidden />
                {f}
              </li>
            ))}
          </ul>
        </motion.div>
      </div>
    </section>
  );
}

export default PricingSliderInteractive;

"use client";

import React, { useState, useMemo } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Calculator, Zap, Database, Users } from "lucide-react";
import { cn } from "../lib/cn";

export interface PricingUsageBasedCalculatorProps {
  className?: string;
  basePrice?: number;
  pricePerRequest?: number;
  pricePerGB?: number;
  pricePerSeat?: number;
}

export function PricingUsageBasedCalculator({
  className,
  basePrice = 29,
  pricePerRequest = 0.0008,
  pricePerGB = 0.12,
  pricePerSeat = 12,
}: PricingUsageBasedCalculatorProps) {
  const reduced = useReducedMotion();
  const headingId = React.useId();
  const [requests, setRequests] = useState(50000);
  const [storage, setStorage] = useState(50);
  const [seats, setSeats] = useState(5);

  const total = useMemo(
    () =>
      basePrice +
      requests * pricePerRequest +
      storage * pricePerGB +
      seats * pricePerSeat,
    [basePrice, requests, storage, seats, pricePerRequest, pricePerGB, pricePerSeat],
  );

  const sliders = [
    {
      id: "requests",
      label: "API Requests / mo",
      icon: Zap,
      value: requests,
      onChange: setRequests,
      min: 1000,
      max: 1000000,
      step: 1000,
      display: requests.toLocaleString(),
      cost: requests * pricePerRequest,
    },
    {
      id: "storage",
      label: "Storage",
      icon: Database,
      value: storage,
      onChange: setStorage,
      min: 5,
      max: 500,
      step: 5,
      display: `${storage} GB`,
      cost: storage * pricePerGB,
    },
    {
      id: "seats",
      label: "Team seats",
      icon: Users,
      value: seats,
      onChange: setSeats,
      min: 1,
      max: 50,
      step: 1,
      display: `${seats}`,
      cost: seats * pricePerSeat,
    },
  ];

  return (
    <section
      aria-labelledby={headingId}
      className={cn(
        "relative w-full overflow-hidden rounded-3xl border border-border/50 bg-card/30 px-6 py-16 backdrop-blur-xl sm:px-10 sm:py-24",
        className,
      )}
    >
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-0 h-72 w-[36rem] -translate-x-1/2 rounded-full bg-primary/15 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-3xl">
        <div className="text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
            <Calculator className="h-3.5 w-3.5" aria-hidden />
            Usage calculator
          </span>
          <h2
            id={headingId}
            className="mt-5 text-balance text-3xl font-semibold tracking-tight sm:text-4xl md:text-5xl"
          >
            Only pay for what you use
          </h2>
          <p className="mx-auto mt-3 max-w-md text-pretty text-base text-muted-foreground">
            Move the sliders to estimate your monthly bill.
          </p>
        </div>

        <motion.div
          initial={reduced ? false : { opacity: 0, y: 20 }}
          whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mt-10 rounded-2xl border bg-card p-6 shadow-sm sm:p-8"
        >
          <div className="space-y-6">
            {sliders.map((s) => (
              <div key={s.id}>
                <div className="flex items-center justify-between text-sm">
                  <label
                    htmlFor={s.id}
                    className="flex items-center gap-2 font-medium text-foreground"
                  >
                    <s.icon className="h-4 w-4 text-primary" aria-hidden />
                    {s.label}
                  </label>
                  <span className="font-mono text-foreground">{s.display}</span>
                </div>
                <input
                  id={s.id}
                  type="range"
                  min={s.min}
                  max={s.max}
                  step={s.step}
                  value={s.value}
                  onChange={(e) => s.onChange(Number(e.target.value))}
                  className="mt-2 h-2 w-full cursor-pointer appearance-none rounded-full bg-muted accent-[var(--accent)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
                />
                <div className="mt-1 text-right text-xs text-muted-foreground">
                  +${s.cost.toFixed(2)}/mo
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 flex items-center justify-between rounded-xl border border-primary/30 bg-primary/5 p-5">
            <div>
              <div className="text-xs uppercase tracking-wider text-muted-foreground">
                Estimated monthly
              </div>
              <div className="mt-1 text-xs text-muted-foreground">
                Base ${basePrice} + usage
              </div>
            </div>
            <div className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              ${total.toFixed(2)}
            </div>
          </div>

          <button
            type="button"
            className="mt-6 inline-flex w-full items-center justify-center rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow transition hover:brightness-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
          >
            Start with this plan
          </button>
        </motion.div>
      </div>
    </section>
  );
}

export default PricingUsageBasedCalculator;

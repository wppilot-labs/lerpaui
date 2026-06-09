"use client";

import React, { useState, useMemo } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Users, Minus, Plus, Check } from "lucide-react";
import { cn } from "../lib/cn";

export interface PricingTeamSeatScalerProps {
  className?: string;
  pricePerSeat?: number;
  minSeats?: number;
  maxSeats?: number;
  basePrice?: number;
  annualDiscount?: number;
}

type Cycle = "monthly" | "annual";

export function PricingTeamSeatScaler({
  className,
  pricePerSeat = 9,
  minSeats = 1,
  maxSeats = 200,
  basePrice = 0,
  annualDiscount = 0.2,
}: PricingTeamSeatScalerProps) {
  const reduced = useReducedMotion();
  const headingId = React.useId();
  const [seats, setSeats] = useState(5);
  const [cycle, setCycle] = useState<Cycle>("monthly");

  const { perSeat, total, savings } = useMemo(() => {
    const effectivePerSeat =
      cycle === "annual" ? pricePerSeat * (1 - annualDiscount) : pricePerSeat;
    const monthly = basePrice + seats * effectivePerSeat;
    const yearly = monthly * 12;
    const fullYear = (basePrice + seats * pricePerSeat) * 12;
    return {
      perSeat: effectivePerSeat,
      total: cycle === "annual" ? yearly : monthly,
      savings: cycle === "annual" ? fullYear - yearly : 0,
    };
  }, [seats, cycle, pricePerSeat, basePrice, annualDiscount]);

  const inc = () => setSeats((s) => Math.min(maxSeats, s + 1));
  const dec = () => setSeats((s) => Math.max(minSeats, s - 1));

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
            <Users className="h-3.5 w-3.5" aria-hidden />
            Team seats
          </span>
          <h2
            id={headingId}
            className="mt-5 text-balance text-3xl font-semibold tracking-tight sm:text-4xl md:text-5xl"
          >
            Scale your team in real time
          </h2>
        </div>

        <motion.div
          initial={reduced ? false : { opacity: 0, y: 20 }}
          whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mt-10 rounded-2xl border bg-card p-6 shadow-sm sm:p-10"
        >
          <div
            role="tablist"
            aria-label="Billing cycle"
            className="mx-auto inline-flex w-full items-center justify-center gap-1 rounded-full border border-border/60 bg-background/50 p-1 sm:w-auto"
          >
            {(["monthly", "annual"] as const).map((c) => (
              <button
                key={c}
                role="tab"
                type="button"
                aria-selected={cycle === c}
                onClick={() => setCycle(c)}
                className={cn(
                  "flex-1 rounded-full px-4 py-1.5 text-xs font-semibold capitalize transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] sm:flex-none",
                  cycle === c
                    ? "bg-primary text-primary-foreground shadow"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {c}
              </button>
            ))}
          </div>

          <div className="mt-8 flex flex-col items-center gap-6 sm:flex-row sm:justify-between">
            <div>
              <div className="text-xs uppercase tracking-wider text-muted-foreground">
                Team size
              </div>
              <div className="mt-2 flex items-center gap-2">
                <button
                  type="button"
                  onClick={dec}
                  aria-label="Decrease seats"
                  className="grid h-10 w-10 place-items-center rounded-lg border border-border bg-background text-foreground transition hover:bg-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
                >
                  <Minus className="h-4 w-4" aria-hidden />
                </button>
                <input
                  type="number"
                  min={minSeats}
                  max={maxSeats}
                  value={seats}
                  aria-label="Number of seats"
                  onChange={(e) =>
                    setSeats(
                      Math.min(
                        maxSeats,
                        Math.max(minSeats, Number(e.target.value) || minSeats),
                      ),
                    )
                  }
                  className="h-10 w-16 rounded-lg border border-border bg-background text-center font-mono text-lg font-semibold text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
                />
                <button
                  type="button"
                  onClick={inc}
                  aria-label="Increase seats"
                  className="grid h-10 w-10 place-items-center rounded-lg border border-border bg-background text-foreground transition hover:bg-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
                >
                  <Plus className="h-4 w-4" aria-hidden />
                </button>
              </div>
              <div className="mt-2 text-xs text-muted-foreground">
                ${perSeat.toFixed(2)} per seat / month
              </div>
            </div>
            <div className="text-center sm:text-right">
              <div className="text-xs uppercase tracking-wider text-muted-foreground">
                Total {cycle === "annual" ? "/ year" : "/ month"}
              </div>
              <div className="mt-1 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
                ${total.toFixed(0)}
              </div>
              {savings > 0 && (
                <div className="mt-1 inline-flex items-center gap-1 rounded-full bg-emerald-400/15 px-2 py-0.5 text-[11px] font-semibold text-emerald-400">
                  <Check className="h-3 w-3" aria-hidden />
                  Save ${savings.toFixed(0)} vs monthly
                </div>
              )}
            </div>
          </div>

          <button
            type="button"
            className="mt-8 inline-flex w-full items-center justify-center rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow transition hover:brightness-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
          >
            Start with {seats} {seats === 1 ? "seat" : "seats"}
          </button>
        </motion.div>
      </div>
    </section>
  );
}

export default PricingTeamSeatScaler;

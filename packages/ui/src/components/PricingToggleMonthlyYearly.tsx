"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check } from "lucide-react";
import { cn } from "../lib/cn";
import { usePrefersReducedMotion } from "../animation/hooks";

const FEATURES = ["Unlimited projects", "Priority support", "Advanced analytics"];

const MONTHLY = 29;
const YEARLY_PER_MONTH = 23; // billed annually

export interface PricingToggleMonthlyYearlyProps {
  className?: string;
}

export function PricingToggleMonthlyYearly({
  className,
}: PricingToggleMonthlyYearlyProps) {
  const [yearly, setYearly] = useState(true);
  const reduced = usePrefersReducedMotion();
  const price = yearly ? YEARLY_PER_MONTH : MONTHLY;
  const saved = (MONTHLY - YEARLY_PER_MONTH) * 12;

  return (
    <div
      className={cn(
        "w-full max-w-xs bg-card border border-border p-5 rounded-2xl shadow-sm font-sans text-foreground",
        className,
      )}
    >
      {/* toggle */}
      <div className="flex items-center justify-center gap-3 mb-5">
        <span
          className={cn(
            "text-sm font-semibold transition-colors",
            !yearly ? "text-foreground" : "text-muted-foreground",
          )}
        >
          Monthly
        </span>
        <button
          type="button"
          role="switch"
          aria-checked={yearly}
          aria-label="Bill yearly"
          onClick={() => setYearly((v) => !v)}
          className={cn(
            "relative h-6 w-11 rounded-full transition-colors",
            yearly ? "bg-primary" : "bg-muted-foreground/25",
          )}
        >
          <motion.span
            layout={!reduced}
            transition={{ type: "spring", damping: 28, stiffness: 400 }}
            className={cn(
              "absolute top-0.5 h-5 w-5 rounded-full bg-background shadow",
              yearly ? "left-[22px]" : "left-0.5",
            )}
          />
        </button>
        <span
          className={cn(
            "text-sm font-semibold transition-colors",
            yearly ? "text-foreground" : "text-muted-foreground",
          )}
        >
          Yearly
        </span>
      </div>

      {/* price card */}
      <div className="text-center">
        <div className="flex items-baseline justify-center gap-1">
          <span className="text-xl font-bold">$</span>
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.span
              key={price}
              initial={reduced ? false : { y: 8, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={reduced ? undefined : { y: -8, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="text-5xl font-black tabular-nums"
            >
              {price}
            </motion.span>
          </AnimatePresence>
          <span className="text-sm text-muted-foreground">/mo</span>
        </div>

        <div className="h-5 mt-1.5">
          {yearly && (
            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              Save ${saved}/year · billed annually
            </span>
          )}
        </div>
      </div>

      <ul className="mt-4 space-y-2">
        {FEATURES.map((f) => (
          <li key={f} className="flex items-center gap-2 text-sm">
            <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span className="text-muted-foreground">{f}</span>
          </li>
        ))}
      </ul>

      <button
        type="button"
        className="mt-5 w-full h-11 rounded-xl bg-primary text-primary-foreground text-sm font-bold hover:opacity-90 transition-opacity"
      >
        Start 14-day trial
      </button>
    </div>
  );
}

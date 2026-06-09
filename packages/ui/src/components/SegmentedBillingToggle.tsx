"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "../lib/cn";
import { usePrefersReducedMotion } from "../animation/hooks";

export interface SegmentedBillingToggleProps {
  monthly?: number;
  /** annual price per month (already discounted) */
  annual?: number;
  saveLabel?: string;
  className?: string;
}

/**
 * Signature billing switch — sliding pill (shared-layout) + rolling price.
 * Production scale, theme-aware, reduced-motion safe.
 */
export function SegmentedBillingToggle({
  monthly = 29,
  annual = 23,
  saveLabel = "Save 20%",
  className,
}: SegmentedBillingToggleProps) {
  const [annualOn, setAnnualOn] = useState(true);
  const reduced = usePrefersReducedMotion();
  const price = annualOn ? annual : monthly;

  return (
    <div className={cn("w-full max-w-sm rounded-2xl border border-border bg-card text-card-foreground p-6 shadow-sm", className)}>
      <div
        role="tablist"
        aria-label="Billing period"
        className="relative mx-auto flex w-full max-w-[16rem] rounded-full bg-muted p-1"
      >
        {(["monthly", "annual"] as const).map((k) => {
          const on = (k === "annual") === annualOn;
          return (
            <button
              key={k}
              role="tab"
              aria-selected={on}
              onClick={() => setAnnualOn(k === "annual")}
              className="relative z-10 flex-1 rounded-full px-3 py-1.5 text-sm font-medium capitalize text-muted-foreground transition-colors aria-selected:text-foreground"
            >
              {on && (
                <motion.span
                  layoutId="billing-pill"
                  transition={reduced ? { duration: 0 } : { type: "spring", stiffness: 380, damping: 32 }}
                  className="absolute inset-0 -z-10 rounded-full bg-background shadow-sm"
                />
              )}
              {k}
            </button>
          );
        })}
      </div>

      <div className="mt-6 flex items-end justify-center gap-1">
        <span className="text-2xl font-semibold text-muted-foreground">$</span>
        <span className="text-5xl font-bold tabular-nums tracking-tight">{price}</span>
        <span className="mb-1 text-sm text-muted-foreground">/mo</span>
      </div>

      <p className="mt-2 h-5 text-center text-xs font-medium text-emerald-600 dark:text-emerald-400">
        {annualOn ? `${saveLabel} · billed yearly` : " "}
      </p>
    </div>
  );
}

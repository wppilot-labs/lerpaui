"use client";

import React, { useState } from "react";
import { Check } from "lucide-react";
import { cn } from "../lib/cn";

export interface StepProgressTrackerProps {
  steps?: string[];
  initialStep?: number;
  className?: string;
}

/**
 * Signature horizontal stepper with an animated progress rail.
 * Production scale, theme-aware, keyboard + ARIA driven.
 */
export function StepProgressTracker({
  steps = ["Cart", "Address", "Payment", "Review"],
  initialStep = 1,
  className,
}: StepProgressTrackerProps) {
  const [active, setActive] = useState(Math.min(initialStep, steps.length - 1));
  const pct = steps.length > 1 ? (active / (steps.length - 1)) * 100 : 0;

  return (
    <div className={cn("w-full max-w-md rounded-2xl border border-border bg-card p-6 text-card-foreground shadow-sm", className)}>
      <ol className="relative flex items-center justify-between">
        <div className="absolute left-0 right-0 top-4 h-0.5 -translate-y-1/2 bg-muted" aria-hidden="true" />
        <div
          className="absolute left-0 top-4 h-0.5 -translate-y-1/2 bg-primary transition-all duration-500"
          style={{ width: `${pct}%` }}
          aria-hidden="true"
        />
        {steps.map((label, i) => {
          const done = i < active;
          const current = i === active;
          return (
            <li key={label} className="relative z-10 flex flex-col items-center gap-2">
              <button
                type="button"
                onClick={() => setActive(i)}
                aria-current={current ? "step" : undefined}
                aria-label={`Step ${i + 1}: ${label}`}
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full border-2 text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                  done && "border-primary bg-primary text-primary-foreground",
                  current && "border-primary bg-background text-primary",
                  !done && !current && "border-border bg-background text-muted-foreground",
                )}
              >
                {done ? <Check className="h-4 w-4" /> : i + 1}
              </button>
              <span className={cn("text-xs font-medium", current ? "text-foreground" : "text-muted-foreground")}>{label}</span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

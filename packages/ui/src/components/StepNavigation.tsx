"use client";

import React, { useState } from "react";
import { Check } from "lucide-react";
import { cn } from "../lib/cn";

type Step = { label: string; sub: string };

const STEPS: Step[] = [
  { label: "Account", sub: "Your details" },
  { label: "Workspace", sub: "Team setup" },
  { label: "Billing", sub: "Choose a plan" },
  { label: "Confirm", sub: "Review & finish" },
];

export interface StepNavigationProps {
  className?: string;
}

export function StepNavigation({ className }: StepNavigationProps) {
  const [current, setCurrent] = useState(1);

  return (
    <nav
      aria-label="Progress"
      className={cn(
        "w-full max-w-xl rounded-2xl border border-border/50 bg-card/60 p-5 font-sans text-foreground shadow-xl backdrop-blur-xl",
        className,
      )}
    >
      <ol className="flex items-start">
        {STEPS.map((step, i) => {
          const isComplete = i < current;
          const isCurrent = i === current;
          const isLast = i === STEPS.length - 1;
          return (
            <li key={step.label} className={cn("flex items-start", !isLast && "flex-1")}>
              <button
                type="button"
                onClick={() => setCurrent(i)}
                aria-current={isCurrent ? "step" : undefined}
                className="flex flex-col items-center gap-1.5 text-center"
              >
                <span
                  className={cn(
                    "flex h-9 w-9 items-center justify-center rounded-full border text-sm font-bold transition-colors",
                    isComplete && "border-primary bg-primary text-primary-foreground",
                    isCurrent && "border-primary bg-primary/10 text-primary",
                    !isComplete && !isCurrent && "border-foreground/15 text-muted-foreground/50",
                  )}
                >
                  {isComplete ? <Check className="h-4 w-4" /> : i + 1}
                </span>
                <span className="w-20">
                  <span
                    className={cn(
                      "block text-sm font-semibold leading-tight",
                      isCurrent ? "text-foreground" : "text-muted-foreground/70",
                    )}
                  >
                    {step.label}
                  </span>
                  <span className="block text-xs text-muted-foreground/45">{step.sub}</span>
                </span>
              </button>
              {!isLast && (
                <span
                  className={cn(
                    "mx-1 mt-[18px] h-0.5 flex-1 rounded-full transition-colors",
                    isComplete ? "bg-primary" : "bg-foreground/10",
                  )}
                />
              )}
            </li>
          );
        })}
      </ol>

      <div className="mt-5 flex items-center justify-between border-t border-foreground/[0.06] pt-4">
        <button
          type="button"
          onClick={() => setCurrent((c) => Math.max(0, c - 1))}
          disabled={current === 0}
          className="rounded-xl border border-border/50 px-4 py-2 text-sm font-semibold text-muted-foreground transition-colors hover:bg-foreground/[0.04] disabled:cursor-not-allowed disabled:opacity-40"
        >
          Back
        </button>
        <span className="text-xs font-medium text-muted-foreground/50">
          Step {current + 1} of {STEPS.length}
        </span>
        <button
          type="button"
          onClick={() => setCurrent((c) => Math.min(STEPS.length - 1, c + 1))}
          disabled={current === STEPS.length - 1}
          className="rounded-xl bg-primary px-4 py-2 text-sm font-bold text-primary-foreground transition-colors hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Continue
        </button>
      </div>
    </nav>
  );
}

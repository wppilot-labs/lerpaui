"use client";

import { Check } from "lucide-react";
import { cn } from "../lib/cn";

const STEPS = ["Cart", "Shipping", "Payment", "Review"];

export interface CheckoutProgressStepsProps {
  className?: string;
}

export function CheckoutProgressSteps({ className }: CheckoutProgressStepsProps) {
  const current = 2; // 0-indexed: Payment is active

  return (
    <nav
      aria-label="Checkout progress"
      className={cn("w-full max-w-lg bg-card backdrop-blur-xl border border-border p-5 rounded-2xl shadow-sm font-sans text-foreground", className)}
    >
      <ol className="flex items-center">
        {STEPS.map((label, i) => {
          const done = i < current;
          const active = i === current;
          const isLast = i === STEPS.length - 1;
          return (
            <li key={label} className={cn("flex items-center", !isLast && "flex-1")}>
              <div className="flex flex-col items-center gap-1.5">
                <span
                  aria-current={active ? "step" : undefined}
                  className={cn(
                    "grid h-9 w-9 place-items-center rounded-full border text-xs font-bold transition-colors",
                    done && "border-primary bg-primary text-primary-foreground",
                    active && "border-primary bg-primary/15 text-primary",
                    !done && !active && "border-foreground/15 bg-foreground/[0.02] text-muted-foreground"
                  )}
                >
                  {done ? <Check className="h-4 w-4" /> : i + 1}
                </span>
                <span
                  className={cn(
                    "text-xs font-medium",
                    active ? "text-foreground" : "text-muted-foreground"
                  )}
                >
                  {label}
                </span>
              </div>
              {!isLast && (
                <span
                  className={cn(
                    "mx-2 mb-6 h-0.5 flex-1 rounded-full",
                    i < current ? "bg-primary" : "bg-foreground/[0.08]"
                  )}
                />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

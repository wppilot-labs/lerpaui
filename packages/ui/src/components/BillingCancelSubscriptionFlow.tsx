"use client";

import { useState } from "react";
import { AlertTriangle, Check } from "lucide-react";
import { cn } from "../lib/cn";

const REASONS = [
  "Too expensive",
  "Missing features I need",
  "Switching to another tool",
  "Not using it enough",
  "Other",
];

export interface BillingCancelSubscriptionFlowProps {
  className?: string;
}

export function BillingCancelSubscriptionFlow({ className }: BillingCancelSubscriptionFlowProps) {
  const [reason, setReason] = useState<string | null>(null);

  return (
    <div className={cn("w-full max-w-md bg-card backdrop-blur-xl border border-border p-5 rounded-2xl shadow-sm font-sans text-foreground", className)}>
      <div className="mb-4 flex items-start gap-3">
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-rose-500/15 text-rose-600 dark:text-rose-400">
          <AlertTriangle className="w-5 h-5" />
        </span>
        <div>
          <h3 className="text-base font-bold">Cancel your subscription?</h3>
          <p className="text-sm text-muted-foreground">
            Your Pro plan stays active until <span className="font-semibold text-foreground">Jul 1, 2026</span>. After that you&apos;ll move to the free tier.
          </p>
        </div>
      </div>

      <fieldset className="mb-4">
        <legend className="mb-2 text-xs font-bold uppercase tracking-wide text-muted-foreground">
          Help us improve — why are you leaving?
        </legend>
        <div className="space-y-1.5">
          {REASONS.map((r) => {
            const active = reason === r;
            return (
              <button
                key={r}
                type="button"
                onClick={() => setReason(r)}
                aria-pressed={active}
                className={cn(
                  "flex w-full items-center gap-2.5 rounded-xl border px-3 py-2.5 text-left text-sm transition-colors",
                  active
                    ? "border-primary/40 bg-primary/10 text-foreground"
                    : "border-border bg-foreground/[0.02] text-muted-foreground hover:bg-foreground/[0.04]"
                )}
              >
                <span
                  className={cn(
                    "grid h-4 w-4 shrink-0 place-items-center rounded-full border",
                    active ? "border-primary bg-primary text-primary-foreground" : "border-foreground/15"
                  )}
                >
                  {active && <Check className="h-2.5 w-2.5" />}
                </span>
                {r}
              </button>
            );
          })}
        </div>
      </fieldset>

      <div className="flex gap-2">
        <button
          type="button"
          className="flex-1 rounded-xl bg-secondary/50 border border-border py-2.5 text-sm font-bold text-muted-foreground transition-colors hover:text-foreground"
        >
          Keep my plan
        </button>
        <button
          type="button"
          disabled={!reason}
          className="flex-1 rounded-xl bg-rose-500 py-2.5 text-sm font-bold text-white transition-all hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Confirm cancellation
        </button>
      </div>
    </div>
  );
}

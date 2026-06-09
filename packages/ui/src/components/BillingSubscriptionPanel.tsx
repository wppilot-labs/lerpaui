"use client";

import { Zap, Check, CalendarClock } from "lucide-react";
import { cn } from "../lib/cn";

const INCLUDED = ["25 team seats", "Unlimited projects", "Priority support", "99.9% uptime SLA"];

export interface BillingSubscriptionPanelProps {
  className?: string;
}

export function BillingSubscriptionPanel({ className }: BillingSubscriptionPanelProps) {
  return (
    <div className={cn("w-full max-w-md bg-card backdrop-blur-xl border border-border p-5 rounded-2xl shadow-sm font-sans text-foreground", className)}>
      <div className="mb-4 flex items-start justify-between">
        <div>
          <h3 className="text-base font-bold">Current plan</h3>
          <p className="text-sm text-muted-foreground">You&apos;re on the Pro plan</p>
        </div>
        <span className="rounded-full border border-emerald-500/25 bg-emerald-500/15 px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide text-emerald-600 dark:text-emerald-400">
          Active
        </span>
      </div>

      <div className="mb-4 rounded-xl border border-primary/15 bg-gradient-to-br from-primary/10 to-transparent p-4">
        <div className="flex items-end justify-between">
          <div className="flex items-center gap-1.5 text-primary">
            <Zap className="h-5 w-5" />
            <span className="text-base font-bold">Pro</span>
          </div>
          <div className="text-right">
            <span className="text-3xl font-black">$29</span>
            <span className="text-xs text-muted-foreground">/mo</span>
          </div>
        </div>
      </div>

      <ul className="mb-4 space-y-2">
        {INCLUDED.map((f) => (
          <li key={f} className="flex items-center gap-2 text-sm text-muted-foreground">
            <Check className="h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
            {f}
          </li>
        ))}
      </ul>

      <div className="mb-4 flex items-center gap-2 rounded-xl border border-border bg-foreground/[0.02] p-3 text-sm">
        <CalendarClock className="h-4 w-4 shrink-0 text-muted-foreground" />
        <span className="text-muted-foreground">
          Renews on <span className="font-semibold text-foreground">Jul 1, 2026</span>
        </span>
      </div>

      <div className="flex gap-2">
        <button
          type="button"
          className="flex-1 rounded-xl border border-border bg-secondary/50 py-2.5 text-sm font-bold text-muted-foreground transition-colors hover:text-foreground"
        >
          Change plan
        </button>
        <button
          type="button"
          className="flex-1 rounded-xl bg-primary py-2.5 text-sm font-bold text-primary-foreground transition-all hover:brightness-110"
        >
          Manage billing
        </button>
      </div>
    </div>
  );
}

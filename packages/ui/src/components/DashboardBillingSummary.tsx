"use client";

import React from "react";
import { CreditCard, ArrowRight } from "lucide-react";
import { cn } from "../lib/cn";

export interface DashboardBillingSummaryProps {
  className?: string;
}

const SEATS_USED = 17;
const SEATS_TOTAL = 25;

export function DashboardBillingSummary({ className }: DashboardBillingSummaryProps) {
  const pct = Math.round((SEATS_USED / SEATS_TOTAL) * 100);

  return (
    <div
      className={cn(
        "w-full max-w-md rounded-2xl border border-border bg-card p-6 text-card-foreground shadow-sm",
        className,
      )}
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <CreditCard className="h-5 w-5" />
          </span>
          <div>
            <h3 className="text-base font-semibold leading-tight text-foreground">Billing</h3>
            <p className="text-sm text-muted-foreground">Manage your subscription</p>
          </div>
        </div>
        <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
          Team plan
        </span>
      </div>

      <div className="mt-5">
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium text-foreground">Seats used</span>
          <span className="tabular-nums text-muted-foreground">
            {SEATS_USED} / {SEATS_TOTAL}
          </span>
        </div>
        <div
          className="mt-2 h-2 w-full overflow-hidden rounded-full bg-muted"
          role="progressbar"
          aria-valuenow={pct}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Seats used"
        >
          <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${pct}%` }} />
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between rounded-xl border border-border bg-muted/50 px-4 py-3">
        <div>
          <p className="text-xs text-muted-foreground">Next invoice</p>
          <p className="text-sm font-medium text-foreground">July 1, 2026</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-muted-foreground">Amount due</p>
          <p className="text-lg font-bold tabular-nums text-foreground">$425.00</p>
        </div>
      </div>

      <button
        type="button"
        className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-lg border border-border bg-background px-4 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      >
        Manage billing
        <ArrowRight className="h-4 w-4" />
      </button>
    </div>
  );
}

export default DashboardBillingSummary;

"use client";

import React from "react";
import { Zap } from "lucide-react";
import { cn } from "../lib/cn";

export interface DashboardApiUsageSummaryProps {
  className?: string;
}

const USED = 184_200;
const QUOTA = 250_000;
const DAILY = [42, 58, 36, 71, 64, 88, 95, 79, 52, 67, 90, 74];

function formatCompact(n: number): string {
  return n >= 1000 ? `${(n / 1000).toFixed(n % 1000 === 0 ? 0 : 1)}k` : `${n}`;
}

export function DashboardApiUsageSummary({ className }: DashboardApiUsageSummaryProps) {
  const pct = Math.min(Math.round((USED / QUOTA) * 100), 100);
  const max = Math.max(...DAILY);

  return (
    <div
      className={cn(
        "w-full max-w-md rounded-2xl border border-border bg-card p-6 text-card-foreground shadow-sm",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Zap className="h-5 w-5" />
          </span>
          <div>
            <h3 className="text-base font-semibold leading-tight text-foreground">API Usage</h3>
            <p className="text-sm text-muted-foreground">Billing period: Jun 1 – Jun 30</p>
          </div>
        </div>
        <span className="rounded-full bg-muted px-2.5 py-1 text-xs font-semibold text-muted-foreground">
          {pct}%
        </span>
      </div>

      <div className="mt-5">
        <div className="flex items-end justify-between">
          <span className="text-2xl font-bold tabular-nums text-foreground">{formatCompact(USED)}</span>
          <span className="text-sm text-muted-foreground">of {formatCompact(QUOTA)} calls</span>
        </div>
        <div
          className="mt-2 h-2 w-full overflow-hidden rounded-full bg-muted"
          role="progressbar"
          aria-valuenow={pct}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="API quota used"
        >
          <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${pct}%` }} />
        </div>
      </div>

      <div className="mt-6">
        <div className="mb-2 flex items-center justify-between text-xs text-muted-foreground">
          <span>Calls per day</span>
          <span>last 12 days</span>
        </div>
        <div className="flex h-20 items-end gap-1.5" aria-hidden="true">
          {DAILY.map((value, i) => (
            <div
              key={i}
              className="flex-1 rounded-t-sm bg-primary/30 transition-colors hover:bg-primary/50"
              style={{ height: `${Math.max((value / max) * 100, 8)}%` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default DashboardApiUsageSummary;

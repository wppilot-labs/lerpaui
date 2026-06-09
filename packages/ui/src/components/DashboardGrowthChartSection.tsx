"use client";

import React from "react";
import { TrendingUp, ArrowUpRight } from "lucide-react";
import { cn } from "../lib/cn";

export interface DashboardGrowthChartSectionProps {
  className?: string;
}

interface Bar {
  month: string;
  revenue: number;
  active: number;
}

const DATA: Bar[] = [
  { month: "Jan", revenue: 52, active: 34 },
  { month: "Feb", revenue: 61, active: 40 },
  { month: "Mar", revenue: 58, active: 44 },
  { month: "Apr", revenue: 73, active: 51 },
  { month: "May", revenue: 80, active: 60 },
  { month: "Jun", revenue: 94, active: 72 },
];

export function DashboardGrowthChartSection({ className }: DashboardGrowthChartSectionProps) {
  const max = Math.max(...DATA.map((d) => d.revenue));

  return (
    <div
      className={cn(
        "w-full max-w-lg rounded-2xl border border-border bg-card p-6 text-card-foreground shadow-sm",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <TrendingUp className="h-5 w-5" />
          </span>
          <div>
            <h3 className="text-base font-semibold leading-tight text-foreground">Growth overview</h3>
            <p className="text-sm text-muted-foreground">Last 6 months</p>
          </div>
        </div>
        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
          <ArrowUpRight className="h-3.5 w-3.5" />
          +24.6%
        </span>
      </div>

      <div className="mt-6 flex h-44 items-end gap-3" aria-hidden="true">
        {DATA.map((bar) => (
          <div key={bar.month} className="flex flex-1 flex-col items-center gap-2">
            <div className="flex w-full flex-1 items-end justify-center gap-1">
              <div
                className="w-1/2 rounded-t-md bg-primary transition-all"
                style={{ height: `${(bar.revenue / max) * 100}%` }}
              />
              <div
                className="w-1/2 rounded-t-md bg-primary/25 transition-all"
                style={{ height: `${(bar.active / max) * 100}%` }}
              />
            </div>
            <span className="text-xs text-muted-foreground">{bar.month}</span>
          </div>
        ))}
      </div>

      <div className="mt-5 flex items-center gap-6 border-t border-border pt-4">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-sm bg-primary" aria-hidden="true" />
          <span className="text-xs text-muted-foreground">Revenue</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-sm bg-primary/25" aria-hidden="true" />
          <span className="text-xs text-muted-foreground">Active users</span>
        </div>
      </div>
    </div>
  );
}

export default DashboardGrowthChartSection;

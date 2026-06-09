"use client";

import React from "react";
import { Gauge } from "lucide-react";
import { cn } from "../lib/cn";

const QUOTAS = [
  { label: "Compute hours", used: 320, limit: 500, unit: "hrs" },
  { label: "Build minutes", used: 1840, limit: 2000, unit: "min" },
  { label: "Team seats", used: 17, limit: 25, unit: "" },
];

export interface DashboardUsageOverviewProps {
  className?: string;
}

export function DashboardUsageOverview({ className }: DashboardUsageOverviewProps) {
  return (
    <div className={cn("w-full max-w-md bg-card/45 backdrop-blur-xl border border-border/50 p-5 rounded-2xl shadow-xl font-sans text-foreground", className)}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-bold flex items-center gap-1.5"><Gauge className="w-4 h-4 text-primary" /> Usage</h3>
        <span className="text-[11px] uppercase font-bold tracking-wide px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">Pro plan</span>
      </div>

      <ul className="space-y-3.5">
        {QUOTAS.map((q) => {
          const pct = Math.round((q.used / q.limit) * 100);
          const warn = pct >= 85;
          return (
            <li key={q.label}>
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="font-medium">{q.label}</span>
                <span className="text-muted-foreground/55 tabular-nums">{q.used.toLocaleString()} / {q.limit.toLocaleString()} {q.unit}</span>
              </div>
              <div className="h-1.5 rounded-full bg-foreground/[0.06] overflow-hidden">
                <div className={cn("h-full rounded-full", warn ? "bg-amber-400" : "bg-primary")} style={{ width: `${pct}%` }} />
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

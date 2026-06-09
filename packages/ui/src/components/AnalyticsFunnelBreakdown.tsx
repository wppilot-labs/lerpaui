"use client";

import React from "react";
import { Filter } from "lucide-react";
import { cn } from "../lib/cn";

type Stage = { label: string; value: number; tone: string };

const STAGES: Stage[] = [
  { label: "Visited site", value: 24000, tone: "bg-sky-500" },
  { label: "Signed up", value: 9600, tone: "bg-indigo-500" },
  { label: "Activated", value: 5200, tone: "bg-violet-500" },
  { label: "Subscribed", value: 2100, tone: "bg-emerald-500" },
];

export interface AnalyticsFunnelBreakdownProps {
  className?: string;
}

export function AnalyticsFunnelBreakdown({ className }: AnalyticsFunnelBreakdownProps) {
  const top = STAGES[0].value;

  return (
    <div
      className={cn(
        "w-full max-w-md bg-card border border-border p-5 rounded-2xl shadow-sm font-sans text-foreground",
        className,
      )}
    >
      <div className="flex items-center gap-2 mb-5">
        <Filter className="w-4 h-4 text-primary" />
        <h3 className="text-base font-bold">Funnel breakdown</h3>
        <span className="ml-auto text-xs text-muted-foreground">signup → paid</span>
      </div>

      <div className="space-y-3.5">
        {STAGES.map((s, i) => {
          const pctOfTop = (s.value / top) * 100;
          const conv = i === 0 ? 100 : Math.round((s.value / STAGES[i - 1].value) * 100);
          return (
            <div key={s.label}>
              <div className="flex items-baseline justify-between mb-1">
                <span className="text-xs font-semibold">{s.label}</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-sm font-bold tabular-nums">
                    {s.value.toLocaleString()}
                  </span>
                  <span className="text-[11px] text-muted-foreground tabular-nums w-9 text-right">
                    {i === 0 ? "" : `${conv}%`}
                  </span>
                </div>
              </div>
              <div className="h-7 rounded-lg bg-foreground/[0.04] overflow-hidden">
                <div
                  className={cn("h-full rounded-lg flex items-center px-2", s.tone)}
                  style={{ width: `${Math.max(pctOfTop, 6)}%` }}
                >
                  <span className="text-[11px] font-bold text-white/90 tabular-nums">
                    {pctOfTop.toFixed(0)}%
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 pt-4 border-t border-border flex items-center justify-between text-xs">
        <span className="text-muted-foreground">Overall conversion</span>
        <span className="font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">
          {((STAGES[STAGES.length - 1].value / top) * 100).toFixed(1)}%
        </span>
      </div>
    </div>
  );
}

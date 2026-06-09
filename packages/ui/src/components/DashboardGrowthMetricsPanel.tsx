"use client";

import React from "react";
import { TrendingUp, ArrowUp, ArrowDown } from "lucide-react";
import { cn } from "../lib/cn";

type Metric = { label: string; value: string; delta: number; spark: number[] };

const METRICS: Metric[] = [
  { label: "MRR", value: "$48.2k", delta: 12.4, spark: [4, 6, 5, 7, 8, 7, 9] },
  { label: "Active users", value: "9,310", delta: 8.1, spark: [5, 5, 6, 6, 7, 8, 9] },
  { label: "Churn", value: "1.8%", delta: -0.6, spark: [4, 3, 4, 3, 3, 2, 2] },
];

function Spark({ data, up }: { data: number[]; up: boolean }) {
  const max = Math.max(...data);
  return (
    <div className="flex items-end gap-0.5 h-7" aria-hidden="true">
      {data.map((d, i) => (
        <span
          key={i}
          className={cn("w-1 rounded-sm", up ? "bg-emerald-400/70" : "bg-red-400/70")}
          style={{ height: `${(d / max) * 100}%` }}
        />
      ))}
    </div>
  );
}

export interface DashboardGrowthMetricsPanelProps {
  className?: string;
}

export function DashboardGrowthMetricsPanel({ className }: DashboardGrowthMetricsPanelProps) {
  return (
    <div className={cn("w-full max-w-md bg-card/45 backdrop-blur-xl border border-border/50 p-5 rounded-2xl shadow-xl font-sans text-foreground", className)}>
      <h3 className="text-base font-bold flex items-center gap-1.5 mb-4">
        <TrendingUp className="w-4 h-4 text-primary" /> Growth
      </h3>
      <ul className="space-y-3">
        {METRICS.map((m) => {
          const up = m.delta >= 0;
          return (
            <li key={m.label} className="flex items-center gap-3">
              <div className="min-w-0 flex-1">
                <div className="text-xs uppercase tracking-wide text-muted-foreground/50">{m.label}</div>
                <div className="text-2xl font-black leading-tight">{m.value}</div>
              </div>
              <Spark data={m.spark} up={up} />
              <span className={cn("inline-flex items-center gap-0.5 text-xs font-bold w-14 justify-end", up ? "text-emerald-400" : "text-red-400")}>
                {up ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
                {Math.abs(m.delta)}%
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

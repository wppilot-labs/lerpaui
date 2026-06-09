"use client";

import React from "react";
import { ArrowUp, ArrowDown } from "lucide-react";
import { cn } from "../lib/cn";

type Kpi = { label: string; value: string; delta: number };

const KPIS: Kpi[] = [
  { label: "Revenue", value: "$48.2k", delta: 12.4 },
  { label: "New users", value: "1,204", delta: 8.1 },
  { label: "Conversion", value: "3.6%", delta: -1.2 },
  { label: "Avg. order", value: "$72", delta: 4.5 },
];

export interface DashboardKpiRowProps {
  className?: string;
}

export function DashboardKpiRow({ className }: DashboardKpiRowProps) {
  return (
    <div className={cn("w-full max-w-xl bg-card/45 backdrop-blur-xl border border-border/50 rounded-2xl shadow-xl font-sans text-foreground", className)}>
      <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-y sm:divide-y-0 divide-foreground/[0.05]">
        {KPIS.map((k) => {
          const up = k.delta >= 0;
          return (
            <div key={k.label} className="p-5">
              <div className="text-xs uppercase tracking-wide text-muted-foreground/50">{k.label}</div>
              <div className="text-2xl font-black leading-tight mt-0.5">{k.value}</div>
              <span className={cn("inline-flex items-center gap-0.5 text-xs font-bold mt-1", up ? "text-emerald-400" : "text-red-400")}>
                {up ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
                {Math.abs(k.delta)}%
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

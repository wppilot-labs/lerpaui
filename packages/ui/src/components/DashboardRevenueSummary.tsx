"use client";

import React from "react";
import { ArrowUp } from "lucide-react";
import { cn } from "../lib/cn";

const BARS = [
  { m: "Jan", v: 38 }, { m: "Feb", v: 45 }, { m: "Mar", v: 42 },
  { m: "Apr", v: 56 }, { m: "May", v: 61 }, { m: "Jun", v: 72 },
];

export interface DashboardRevenueSummaryProps {
  className?: string;
}

export function DashboardRevenueSummary({ className }: DashboardRevenueSummaryProps) {
  const max = Math.max(...BARS.map((b) => b.v));

  return (
    <div className={cn("w-full max-w-md bg-card/45 backdrop-blur-xl border border-border/50 p-5 rounded-2xl shadow-xl font-sans text-foreground", className)}>
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-xs uppercase tracking-wide text-muted-foreground/50">Revenue · last 6 months</h3>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-3xl font-black">$314k</span>
            <span className="inline-flex items-center gap-0.5 text-xs font-bold text-emerald-400">
              <ArrowUp className="w-4 h-4" /> 18.2%
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-end justify-between gap-2 h-28">
        {BARS.map((b) => (
          <div key={b.m} className="flex-1 flex flex-col items-center gap-1.5 group">
            <div className="w-full flex items-end justify-center h-full">
              <div
                className="w-full max-w-[26px] rounded-t-md bg-primary/30 group-hover:bg-primary/60 transition-colors"
                style={{ height: `${(b.v / max) * 100}%` }}
              />
            </div>
            <span className="text-[11px] text-muted-foreground/50">{b.m}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { TrendingDown, ArrowDown } from "lucide-react";
import { cn } from "../lib/cn";

export interface DashboardConversionFunnelProps {
  className?: string;
}

const STAGES = [
  { label: "Visitors", value: 48000, color: "bg-primary/90" },
  { label: "Signups", value: 12400, color: "bg-primary/75" },
  { label: "Activated", value: 6420, color: "bg-primary/60" },
  { label: "Subscribed", value: 2180, color: "bg-primary/50" },
  { label: "Paying", value: 1240, color: "bg-primary/40" },
];

function fmt(n: number) {
  return n >= 1000 ? `${(n / 1000).toFixed(1)}k` : `${n}`;
}

export function DashboardConversionFunnel({ className }: DashboardConversionFunnelProps) {
  const reduced = useReducedMotion() ?? false;
  const top = STAGES[0].value;

  return (
    <section
      aria-label="Conversion funnel"
      className={cn(
        "w-full max-w-2xl rounded-2xl border bg-card p-6 shadow-sm transition-shadow hover:shadow-md",
        className
      )}
    >
      <header className="mb-5 flex items-start justify-between">
        <div>
          <h3 className="text-base font-semibold tracking-tight text-foreground">Conversion funnel</h3>
          <p className="mt-0.5 text-xs text-muted-foreground">Stage-by-stage drop-off · last 30 days</p>
        </div>
        <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2 py-0.5 text-[10px] font-medium text-amber-500">
          <TrendingDown className="h-3 w-3" /> 2.58% overall
        </span>
      </header>

      <div className="space-y-2">
        {STAGES.map((s, i) => {
          const width = (s.value / top) * 100;
          const dropoff = i === 0 ? null : Math.round(((STAGES[i - 1].value - s.value) / STAGES[i - 1].value) * 100);
          return (
            <div key={s.label} className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-foreground">{s.label}</span>
                <span className="tabular-nums text-muted-foreground">{fmt(s.value)} · {Math.round((s.value / top) * 100)}%</span>
              </div>
              <div className="h-9 w-full rounded-lg bg-muted/30 overflow-hidden">
                <motion.div
                  initial={reduced ? false : { width: 0 }}
                  animate={{ width: `${width}%` }}
                  transition={{ duration: 0.7, delay: i * 0.08 }}
                  className={cn("h-full rounded-lg", s.color)}
                />
              </div>
              {dropoff !== null && (
                <div className="ml-2 flex items-center gap-1 text-[10px] text-muted-foreground">
                  <ArrowDown className="h-2.5 w-2.5" /> −{dropoff}% to next stage
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-5 grid grid-cols-3 gap-3 border-t pt-4">
        <div>
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Top of funnel</p>
          <p className="mt-0.5 text-sm font-semibold text-foreground">{fmt(STAGES[0].value)}</p>
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Activation</p>
          <p className="mt-0.5 text-sm font-semibold text-foreground">13.4%</p>
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Revenue</p>
          <p className="mt-0.5 text-sm font-semibold text-foreground">2.58%</p>
        </div>
      </div>
    </section>
  );
}

export default DashboardConversionFunnel;

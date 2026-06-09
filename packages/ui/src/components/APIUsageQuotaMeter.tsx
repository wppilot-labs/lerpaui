"use client";

import React from "react";
import { Gauge } from "lucide-react";
import { cn } from "../lib/cn";

type Quota = { label: string; used: number; limit: number; unit: string };

const QUOTAS: Quota[] = [
  { label: "API requests", used: 84200, limit: 100000, unit: "" },
  { label: "Compute hours", used: 312, limit: 500, unit: "h" },
  { label: "Bandwidth", used: 940, limit: 1000, unit: "GB" },
  { label: "Webhook events", used: 1280, limit: 10000, unit: "" },
];

function tone(pct: number) {
  if (pct >= 90) return { bar: "bg-red-500", text: "text-red-600 dark:text-red-400" };
  if (pct >= 70) return { bar: "bg-amber-500", text: "text-amber-600 dark:text-amber-400" };
  return { bar: "bg-emerald-500", text: "text-emerald-600 dark:text-emerald-400" };
}

function fmt(n: number) {
  return n >= 1000 ? `${(n / 1000).toFixed(n % 1000 === 0 ? 0 : 1)}k` : `${n}`;
}

export interface APIUsageQuotaMeterProps {
  className?: string;
}

export function APIUsageQuotaMeter({ className }: APIUsageQuotaMeterProps) {
  return (
    <div
      className={cn(
        "w-full max-w-md bg-card border border-border p-5 rounded-2xl shadow-sm font-sans text-foreground",
        className,
      )}
    >
      <div className="flex items-center gap-2 mb-4">
        <Gauge className="w-4 h-4 text-primary" />
        <h3 className="text-base font-bold">Usage this month</h3>
        <span className="ml-auto text-xs text-muted-foreground">resets Jul 1</span>
      </div>

      <div className="space-y-4">
        {QUOTAS.map((q) => {
          const pct = Math.min(100, Math.round((q.used / q.limit) * 100));
          const t = tone(pct);
          return (
            <div key={q.label}>
              <div className="flex items-baseline justify-between mb-1.5">
                <span className="text-xs font-semibold">{q.label}</span>
                <span className="text-xs text-muted-foreground tabular-nums">
                  {fmt(q.used)}
                  {q.unit} / {fmt(q.limit)}
                  {q.unit}
                  <span className={cn("ml-1.5 font-bold", t.text)}>{pct}%</span>
                </span>
              </div>
              <div className="h-2 rounded-full bg-foreground/[0.06] overflow-hidden">
                <div
                  className={cn("h-full rounded-full transition-all", t.bar)}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 pt-4 border-t border-border flex items-center justify-between text-xs">
        <span className="text-muted-foreground">Plan</span>
        <span className="font-semibold">Scale · $299/mo</span>
      </div>
    </div>
  );
}

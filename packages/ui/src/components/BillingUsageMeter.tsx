"use client";

import { Gauge } from "lucide-react";
import { cn } from "../lib/cn";

type Meter = {
  label: string;
  used: number;
  limit: number;
  unit: string;
};

const METERS: Meter[] = [
  { label: "API requests", used: 842000, limit: 1000000, unit: "" },
  { label: "Bandwidth", used: 318, limit: 500, unit: "GB" },
  { label: "Team seats", used: 22, limit: 25, unit: "" },
  { label: "Storage", used: 47, limit: 100, unit: "GB" },
];

function fmt(n: number) {
  return n >= 1000 ? `${(n / 1000).toLocaleString()}k` : `${n}`;
}

function barColor(pct: number) {
  if (pct >= 90) return "bg-rose-500";
  if (pct >= 75) return "bg-amber-500";
  return "bg-primary";
}

export interface BillingUsageMeterProps {
  className?: string;
}

export function BillingUsageMeter({ className }: BillingUsageMeterProps) {
  return (
    <div className={cn("w-full max-w-md bg-card backdrop-blur-xl border border-border p-5 rounded-2xl shadow-sm font-sans text-foreground", className)}>
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Gauge className="w-4 h-4 text-primary" />
          <h3 className="text-sm font-bold">Usage this cycle</h3>
        </div>
        <span className="text-xs text-muted-foreground">Resets Jul 1</span>
      </div>

      <ul className="space-y-4">
        {METERS.map((m) => {
          const pct = Math.min(100, Math.round((m.used / m.limit) * 100));
          return (
            <li key={m.label}>
              <div className="mb-1.5 flex items-baseline justify-between text-sm">
                <span className="font-medium text-muted-foreground">{m.label}</span>
                <span className="font-semibold tabular-nums">
                  {fmt(m.used)}
                  {m.unit} <span className="text-muted-foreground">/ {fmt(m.limit)}{m.unit}</span>
                </span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-foreground/[0.06]">
                <div className={cn("h-full rounded-full transition-all", barColor(pct))} style={{ width: `${pct}%` }} />
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

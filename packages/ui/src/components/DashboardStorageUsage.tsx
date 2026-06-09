"use client";

import React from "react";
import { HardDrive } from "lucide-react";
import { cn } from "../lib/cn";

const SEGMENTS = [
  { label: "Documents", pct: 32, color: "bg-violet-400" },
  { label: "Images", pct: 24, color: "bg-sky-400" },
  { label: "Backups", pct: 18, color: "bg-emerald-400" },
  { label: "Other", pct: 14, color: "bg-amber-400" },
];

export interface DashboardStorageUsageProps {
  className?: string;
}

export function DashboardStorageUsage({ className }: DashboardStorageUsageProps) {
  const used = SEGMENTS.reduce((s, x) => s + x.pct, 0);

  return (
    <div className={cn("w-full max-w-md bg-card/45 backdrop-blur-xl border border-border/50 p-5 rounded-2xl shadow-xl font-sans text-foreground", className)}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-base font-bold flex items-center gap-1.5"><HardDrive className="w-4 h-4 text-primary" /> Storage</h3>
        <span className="text-xs text-muted-foreground/60"><span className="font-bold text-foreground">{(used / 100 * 500).toFixed(0)} GB</span> / 500 GB</span>
      </div>

      <div className="flex h-2.5 rounded-full overflow-hidden bg-foreground/[0.06] mb-4">
        {SEGMENTS.map((s) => (
          <div key={s.label} className={s.color} style={{ width: `${s.pct}%` }} title={`${s.label} ${s.pct}%`} />
        ))}
      </div>

      <ul className="grid grid-cols-2 gap-2">
        {SEGMENTS.map((s) => (
          <li key={s.label} className="flex items-center gap-2 text-xs">
            <span className={cn("h-2 w-2 rounded-sm", s.color)} />
            <span className="text-muted-foreground/70">{s.label}</span>
            <span className="ml-auto font-semibold tabular-nums">{s.pct}%</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

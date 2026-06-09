"use client";

import React from "react";
import { Activity } from "lucide-react";
import { cn } from "../lib/cn";

const METRICS = [
  { label: "Uptime", value: "99.98%", tone: "text-emerald-400" },
  { label: "Latency", value: "42ms", tone: "text-foreground" },
  { label: "Error rate", value: "0.04%", tone: "text-emerald-400" },
];

export interface DashboardSystemHealthProps {
  className?: string;
}

export function DashboardSystemHealth({ className }: DashboardSystemHealthProps) {
  return (
    <div className={cn("w-full max-w-md bg-card/45 backdrop-blur-xl border border-border/50 p-5 rounded-2xl shadow-xl font-sans text-foreground", className)}>
      <div className="flex items-center gap-2 mb-4">
        <div className="h-10 w-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
          <Activity className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-base font-bold leading-tight">All systems operational</h3>
          <span className="text-xs text-muted-foreground/55">Updated 30s ago</span>
        </div>
      </div>

      <div className="grid grid-cols-3 divide-x divide-foreground/[0.06]">
        {METRICS.map((m) => (
          <div key={m.label} className="px-2 text-center first:pl-0 last:pr-0">
            <div className={cn("text-2xl font-black leading-tight", m.tone)}>{m.value}</div>
            <div className="text-[11px] uppercase tracking-wide text-muted-foreground/50 mt-0.5">{m.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

"use client";

import React from "react";
import { Cpu, MemoryStick, HardDrive, Wifi } from "lucide-react";
import { cn } from "../lib/cn";

type Resource = { label: string; icon: React.ComponentType<{ className?: string }>; pct: number; detail: string };

const RESOURCES: Resource[] = [
  { label: "CPU", icon: Cpu, pct: 42, detail: "4 / 8 cores" },
  { label: "Memory", icon: MemoryStick, pct: 71, detail: "11.4 / 16 GB" },
  { label: "Disk", icon: HardDrive, pct: 88, detail: "440 / 500 GB" },
  { label: "Network", icon: Wifi, pct: 24, detail: "240 Mbps" },
];

function barColor(pct: number) {
  return pct >= 85 ? "bg-red-400" : pct >= 65 ? "bg-amber-400" : "bg-emerald-400";
}

export interface DashboardResourceMonitorProps {
  className?: string;
}

export function DashboardResourceMonitor({ className }: DashboardResourceMonitorProps) {
  return (
    <div className={cn("w-full max-w-md bg-card/45 backdrop-blur-xl border border-border/50 p-5 rounded-2xl shadow-xl font-sans text-foreground", className)}>
      <h3 className="text-base font-bold mb-4">Resource monitor</h3>
      <ul className="space-y-3.5">
        {RESOURCES.map((r) => {
          const Icon = r.icon;
          return (
            <li key={r.label}>
              <div className="flex items-center justify-between mb-1.5 text-xs">
                <span className="flex items-center gap-1.5 font-medium">
                  <Icon className="w-4 h-4 text-muted-foreground/60" /> {r.label}
                </span>
                <span className="text-muted-foreground/50 tabular-nums">{r.detail}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-1.5 rounded-full bg-foreground/[0.06] overflow-hidden">
                  <div className={cn("h-full rounded-full transition-all", barColor(r.pct))} style={{ width: `${r.pct}%` }} />
                </div>
                <span className="text-xs font-bold tabular-nums w-8 text-right">{r.pct}%</span>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

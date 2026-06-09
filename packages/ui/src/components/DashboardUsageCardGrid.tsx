"use client";

import React from "react";
import { Zap, HardDrive, Wifi, Users } from "lucide-react";
import { cn } from "../lib/cn";

type Card = { label: string; icon: React.ComponentType<{ className?: string }>; used: string; pct: number };

const CARDS: Card[] = [
  { label: "API calls", icon: Zap, used: "82k / 100k", pct: 82 },
  { label: "Storage", icon: HardDrive, used: "44 / 50 GB", pct: 88 },
  { label: "Bandwidth", icon: Wifi, used: "1.2 / 5 TB", pct: 24 },
  { label: "Seats", icon: Users, used: "17 / 25", pct: 68 },
];

export interface DashboardUsageCardGridProps {
  className?: string;
}

export function DashboardUsageCardGrid({ className }: DashboardUsageCardGridProps) {
  return (
    <div className={cn("w-full max-w-md grid grid-cols-2 gap-3 font-sans text-foreground", className)}>
      {CARDS.map((c) => {
        const Icon = c.icon;
        const warn = c.pct >= 85;
        return (
          <div key={c.label} className="bg-card/45 backdrop-blur-xl border border-border/50 p-5 rounded-2xl shadow-xl">
            <div className="flex items-center gap-1.5 text-muted-foreground/60 mb-2">
              <Icon className="w-4 h-4" />
              <span className="text-xs uppercase tracking-wide font-bold">{c.label}</span>
            </div>
            <div className="text-base font-bold tabular-nums mb-2">{c.used}</div>
            <div className="h-1.5 rounded-full bg-foreground/[0.06] overflow-hidden">
              <div className={cn("h-full rounded-full", warn ? "bg-amber-400" : "bg-primary")} style={{ width: `${c.pct}%` }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

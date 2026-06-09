"use client";

import React from "react";
import { cn } from "../lib/cn";

type Status = "operational" | "degraded" | "down";

type Service = { name: string; status: Status; latency: string };

const DOT: Record<Status, string> = {
  operational: "bg-emerald-400",
  degraded: "bg-amber-400",
  down: "bg-red-400",
};

const SERVICES: Service[] = [
  { name: "API Gateway", status: "operational", latency: "42ms" },
  { name: "Database", status: "operational", latency: "8ms" },
  { name: "Auth service", status: "degraded", latency: "310ms" },
  { name: "CDN", status: "operational", latency: "19ms" },
  { name: "Webhooks", status: "down", latency: "—" },
];

export interface DashboardLiveStatusFeedProps {
  className?: string;
}

export function DashboardLiveStatusFeed({ className }: DashboardLiveStatusFeedProps) {
  return (
    <div className={cn("w-full max-w-md bg-card/45 backdrop-blur-xl border border-border/50 p-5 rounded-2xl shadow-xl font-sans text-foreground", className)}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-bold">System status</h3>
        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground/60">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400/60 animate-ping" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
          </span>
          Live
        </span>
      </div>

      <ul className="space-y-1">
        {SERVICES.map((s) => (
          <li key={s.name} className="flex items-center gap-3 py-2 border-b border-foreground/[0.04] last:border-0">
            <span className={cn("h-2 w-2 rounded-full shrink-0", DOT[s.status])} />
            <span className="text-sm font-medium flex-1">{s.name}</span>
            <span className="text-xs capitalize text-muted-foreground/60">{s.status}</span>
            <span className="text-xs tabular-nums text-muted-foreground/40 w-12 text-right">{s.latency}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

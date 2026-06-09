"use client";

import React from "react";
import { Server, CheckCircle2, AlertTriangle } from "lucide-react";
import { cn } from "../lib/cn";

type Svc = { name: string; ok: boolean; rt: string; load: number };

const SERVICES: Svc[] = [
  { name: "Web app", ok: true, rt: "38ms", load: 42 },
  { name: "API gateway", ok: true, rt: "51ms", load: 61 },
  { name: "Worker queue", ok: false, rt: "—", load: 0 },
  { name: "Database", ok: true, rt: "9ms", load: 73 },
];

export interface DashboardSystemHealthPanelProps {
  className?: string;
}

export function DashboardSystemHealthPanel({ className }: DashboardSystemHealthPanelProps) {
  return (
    <div className={cn("w-full max-w-md bg-card/45 backdrop-blur-xl border border-border/50 p-5 rounded-2xl shadow-xl font-sans text-foreground", className)}>
      <h3 className="text-base font-bold flex items-center gap-1.5 mb-4">
        <Server className="w-4 h-4 text-primary" /> Service health
      </h3>
      <ul className="space-y-2">
        {SERVICES.map((s) => (
          <li key={s.name} className="flex items-center gap-3 p-3 rounded-xl bg-foreground/[0.02] border border-foreground/[0.04]">
            {s.ok ? <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> : <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />}
            <span className="text-sm font-semibold flex-1">{s.name}</span>
            <div className="w-16 h-1.5 rounded-full bg-foreground/[0.06] overflow-hidden">
              <div className={cn("h-full rounded-full", s.ok ? "bg-emerald-400" : "bg-red-400")} style={{ width: `${s.load}%` }} />
            </div>
            <span className="text-xs tabular-nums text-muted-foreground/55 w-10 text-right">{s.rt}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

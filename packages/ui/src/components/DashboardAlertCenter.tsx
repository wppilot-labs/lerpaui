"use client";

import React, { useState } from "react";
import { AlertOctagon, AlertTriangle, Info, Bell } from "lucide-react";
import { cn } from "../lib/cn";

type Severity = "critical" | "warning" | "info";

type Alert = { id: string; severity: Severity; title: string; detail: string; time: string };

const STYLES: Record<Severity, { icon: React.ComponentType<{ className?: string }>; cls: string }> = {
  critical: { icon: AlertOctagon, cls: "text-red-400 bg-red-500/10 border-red-500/20" },
  warning: { icon: AlertTriangle, cls: "text-amber-400 bg-amber-500/10 border-amber-500/20" },
  info: { icon: Info, cls: "text-sky-400 bg-sky-500/10 border-sky-500/20" },
};

const ALERTS: Alert[] = [
  { id: "1", severity: "critical", title: "API error rate spiking", detail: "5xx errors at 4.2% on api-gateway", time: "1m" },
  { id: "2", severity: "warning", title: "Database CPU high", detail: "primary-db at 88% for 10 min", time: "12m" },
  { id: "3", severity: "info", title: "Deploy completed", detail: "v2.4.0 live in production", time: "1h" },
];

export interface DashboardAlertCenterProps {
  className?: string;
}

export function DashboardAlertCenter({ className }: DashboardAlertCenterProps) {
  const [acked, setAcked] = useState<string[]>([]);
  const open = ALERTS.filter((a) => !acked.includes(a.id));

  return (
    <div className={cn("w-full max-w-md bg-card/45 backdrop-blur-xl border border-border/50 p-5 rounded-2xl shadow-xl font-sans text-foreground", className)}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-bold flex items-center gap-1.5">
          <Bell className="w-4 h-4 text-primary" /> Alerts
        </h3>
        <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-red-500/15 text-red-400">{open.length} open</span>
      </div>

      <ul className="space-y-2">
        {open.map((a) => {
          const { icon: Icon, cls } = STYLES[a.severity];
          return (
            <li key={a.id} className={cn("flex items-start gap-2.5 p-3 rounded-xl border", cls)}>
              <Icon className="w-4 h-4 mt-0.5 shrink-0" />
              <div className="min-w-0 flex-1">
                <div className="text-sm font-semibold text-foreground">{a.title}</div>
                <div className="text-xs text-muted-foreground/60">{a.detail}</div>
              </div>
              <div className="flex flex-col items-end gap-1 shrink-0">
                <span className="text-[11px] text-muted-foreground/40">{a.time}</span>
                <button
                  type="button"
                  onClick={() => setAcked((s) => [...s, a.id])}
                  className="text-[11px] font-bold text-muted-foreground/70 hover:text-foreground"
                >
                  Ack
                </button>
              </div>
            </li>
          );
        })}
        {open.length === 0 && (
          <li className="text-center text-sm text-muted-foreground/50 py-6">All clear — no active alerts</li>
        )}
      </ul>
    </div>
  );
}

"use client";

import React from "react";
import { Activity } from "lucide-react";
import { cn } from "../lib/cn";

type State = "operational" | "degraded" | "outage";
type Service = { name: string; state: State; uptime: string };

const SERVICES: Service[] = [
  { name: "API", state: "operational", uptime: "99.99%" },
  { name: "Dashboard", state: "operational", uptime: "99.98%" },
  { name: "Webhooks", state: "degraded", uptime: "99.41%" },
  { name: "Background jobs", state: "operational", uptime: "99.95%" },
  { name: "Email delivery", state: "outage", uptime: "97.20%" },
];

const STATE: Record<State, { label: string; dot: string; text: string }> = {
  operational: { label: "Operational", dot: "bg-emerald-500", text: "text-emerald-600 dark:text-emerald-400" },
  degraded: { label: "Degraded", dot: "bg-amber-500", text: "text-amber-600 dark:text-amber-400" },
  outage: { label: "Outage", dot: "bg-red-500", text: "text-red-600 dark:text-red-400" },
};

export interface AdminServiceStatusPageProps {
  className?: string;
}

export function AdminServiceStatusPage({ className }: AdminServiceStatusPageProps) {
  const allUp = SERVICES.every((s) => s.state === "operational");
  const hasOutage = SERVICES.some((s) => s.state === "outage");
  const banner = allUp
    ? { text: "All systems operational", cls: "bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400" }
    : hasOutage
      ? { text: "Some systems are down", cls: "bg-red-500/10 border-red-500/20 text-red-600 dark:text-red-400" }
      : { text: "Some systems are degraded", cls: "bg-amber-500/10 border-amber-500/20 text-amber-600 dark:text-amber-400" };

  return (
    <div
      className={cn(
        "w-full max-w-md bg-card border border-border p-5 rounded-2xl shadow-sm font-sans text-foreground",
        className,
      )}
    >
      <div className="flex items-center gap-2 mb-4">
        <Activity className="w-4 h-4 text-primary" />
        <h3 className="text-base font-bold">System status</h3>
      </div>

      <div className={cn("flex items-center gap-2 px-3 py-3 rounded-xl border text-sm font-semibold mb-4", banner.cls)}>
        <span className={cn("h-2 w-2 rounded-full", allUp ? "bg-emerald-500 animate-pulse" : hasOutage ? "bg-red-500" : "bg-amber-500")} />
        {banner.text}
      </div>

      <ul className="space-y-1.5">
        {SERVICES.map((s) => {
          const st = STATE[s.state];
          return (
            <li
              key={s.name}
              className="flex items-center gap-3 px-3 py-3 rounded-xl bg-muted border border-border"
            >
              <span className={cn("h-2 w-2 rounded-full shrink-0", st.dot)} />
              <span className="text-sm font-medium flex-1">{s.name}</span>
              <span className="text-xs tabular-nums text-muted-foreground">{s.uptime}</span>
              <span className={cn("text-xs font-semibold w-20 text-right", st.text)}>
                {st.label}
              </span>
            </li>
          );
        })}
      </ul>

      <p className="text-[11px] text-muted-foreground mt-3 text-center">
        Uptime over the last 90 days
      </p>
    </div>
  );
}

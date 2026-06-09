"use client";

import React from "react";
import { Activity, RefreshCw } from "lucide-react";
import { cn } from "../lib/cn";

export interface AdminApiHealthMonitorProps {
  className?: string;
}

type ServiceStatus = "operational" | "degraded" | "down";

interface ServiceRow {
  name: string;
  endpoint: string;
  uptime: number;
  latency: number;
  status: ServiceStatus;
}

const SERVICES: ServiceRow[] = [
  { name: "Authentication", endpoint: "/v1/auth", uptime: 99.99, latency: 84, status: "operational" },
  { name: "Payments", endpoint: "/v1/payments", uptime: 99.96, latency: 142, status: "operational" },
  { name: "Search Index", endpoint: "/v1/search", uptime: 98.41, latency: 386, status: "degraded" },
  { name: "Media Pipeline", endpoint: "/v1/media", uptime: 99.92, latency: 211, status: "operational" },
  { name: "Webhooks", endpoint: "/v1/webhooks", uptime: 94.18, latency: 0, status: "down" },
];

const STATUS_META: Record<ServiceStatus, { dot: string; label: string; text: string }> = {
  operational: { dot: "bg-emerald-500", label: "Operational", text: "text-emerald-600 dark:text-emerald-400" },
  degraded: { dot: "bg-amber-500", label: "Degraded", text: "text-amber-600 dark:text-amber-400" },
  down: { dot: "bg-red-500", label: "Down", text: "text-red-600 dark:text-red-400" },
};

export function AdminApiHealthMonitor({ className }: AdminApiHealthMonitorProps) {
  const healthy = SERVICES.filter((s) => s.status === "operational").length;

  return (
    <div
      className={cn(
        "w-full max-w-md rounded-2xl border border-border bg-card p-6 text-card-foreground shadow-sm",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Activity className="h-5 w-5" />
          </span>
          <div>
            <h3 className="text-base font-semibold leading-tight text-foreground">API Health</h3>
            <p className="text-sm text-muted-foreground">
              {healthy} of {SERVICES.length} services operational
            </p>
          </div>
        </div>
        <button
          type="button"
          aria-label="Refresh service status"
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-background text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          <RefreshCw className="h-4 w-4" />
        </button>
      </div>

      <ul className="mt-5 space-y-1">
        {SERVICES.map((service) => {
          const meta = STATUS_META[service.status];
          return (
            <li
              key={service.endpoint}
              className="flex items-center justify-between gap-4 rounded-lg px-2 py-2.5 transition-colors hover:bg-muted/60"
            >
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className={cn("h-2.5 w-2.5 shrink-0 rounded-full", meta.dot)} aria-hidden="true" />
                  <span className="truncate text-sm font-medium text-foreground">{service.name}</span>
                </div>
                <code className="mt-0.5 block truncate pl-[18px] font-mono text-xs text-muted-foreground">
                  {service.endpoint}
                </code>
              </div>
              <div className="flex shrink-0 items-center gap-5 text-right">
                <div>
                  <div className="text-sm font-semibold tabular-nums text-foreground">{service.uptime}%</div>
                  <div className="text-xs text-muted-foreground">uptime</div>
                </div>
                <div className="w-14">
                  <div className={cn("text-sm font-semibold tabular-nums", meta.text)}>
                    {service.status === "down" ? "—" : `${service.latency}ms`}
                  </div>
                  <div className="text-xs text-muted-foreground">latency</div>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default AdminApiHealthMonitor;

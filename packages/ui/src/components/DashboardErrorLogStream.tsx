"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { AlertOctagon, AlertTriangle, Info, Filter, Search } from "lucide-react";
import { cn } from "../lib/cn";

export interface DashboardErrorLogStreamProps {
  className?: string;
}

type Level = "error" | "warn" | "info";

const LOGS: Array<{ time: string; level: Level; service: string; message: string; trace: string }> = [
  { time: "14:42:08", level: "error", service: "api-gateway", message: "Upstream timeout calling /v1/checkout", trace: "trace_8f3a" },
  { time: "14:41:52", level: "warn", service: "auth-service", message: "Rate limit exceeded for ip 192.168.1.42", trace: "trace_2b9d" },
  { time: "14:41:30", level: "error", service: "payments", message: "Stripe webhook signature mismatch", trace: "trace_e1c4" },
  { time: "14:40:15", level: "info", service: "worker", message: "Job queue drained – 1248 processed", trace: "trace_a72f" },
  { time: "14:39:48", level: "warn", service: "db-primary", message: "Slow query detected: 1.2s SELECT users", trace: "trace_b5d8" },
  { time: "14:39:02", level: "error", service: "image-cdn", message: "Asset upload failed: ENOSPC on /tmp", trace: "trace_4c91" },
  { time: "14:38:41", level: "info", service: "scheduler", message: "Cron job nightly-backup started", trace: "trace_d61a" },
];

const LEVEL_META: Record<Level, { label: string; class: string; icon: React.ElementType }> = {
  error: { label: "ERROR", class: "text-rose-500 bg-rose-500/10 border-rose-500/20", icon: AlertOctagon },
  warn: { label: "WARN", class: "text-amber-500 bg-amber-500/10 border-amber-500/20", icon: AlertTriangle },
  info: { label: "INFO", class: "text-sky-500 bg-sky-500/10 border-sky-500/20", icon: Info },
};

export function DashboardErrorLogStream({ className }: DashboardErrorLogStreamProps) {
  const reduced = useReducedMotion() ?? false;
  const [filter, setFilter] = React.useState<"all" | Level>("all");
  const filtered = filter === "all" ? LOGS : LOGS.filter((l) => l.level === filter);

  return (
    <section
      aria-label="Error log stream"
      className={cn(
        "w-full max-w-3xl rounded-2xl border bg-card p-6 shadow-sm transition-shadow hover:shadow-md",
        className
      )}
    >
      <header className="mb-4 flex items-start justify-between">
        <div>
          <h3 className="text-base font-semibold tracking-tight text-foreground">Error log stream</h3>
          <p className="mt-0.5 text-xs text-muted-foreground">Last 5 minutes · live tail</p>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-500/10 px-2 py-0.5 text-[10px] font-medium text-rose-500">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-rose-500" /> Live
        </span>
      </header>

      <div className="mb-4 flex items-center gap-2">
        <div className="flex flex-1 items-center gap-1.5 rounded-lg border bg-muted/20 px-2.5 py-1.5">
          <Search className="h-3.5 w-3.5 text-muted-foreground" aria-hidden />
          <input
            type="text"
            placeholder="Search service or message…"
            className="flex-1 bg-transparent text-xs text-foreground placeholder:text-muted-foreground focus:outline-none"
          />
        </div>
        <div className="flex items-center gap-1 rounded-lg border bg-muted/20 p-0.5">
          <Filter className="ml-1.5 h-3 w-3 text-muted-foreground" aria-hidden />
          {(["all", "error", "warn", "info"] as const).map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              className={cn(
                "rounded-md px-2 py-1 text-[10px] font-medium uppercase transition-colors",
                filter === f ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
              )}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <ol className="space-y-1.5 font-mono">
        {filtered.map((l, i) => {
          const meta = LEVEL_META[l.level];
          const Icon = meta.icon;
          return (
            <motion.li
              key={`${l.time}-${i}`}
              initial={reduced ? false : { opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: i * 0.04 }}
              className="grid grid-cols-[auto_auto_auto_1fr] items-center gap-2 rounded-md border bg-muted/10 px-2.5 py-2 text-[11px]"
            >
              <span className="text-muted-foreground tabular-nums">{l.time}</span>
              <span className={cn("inline-flex items-center gap-1 rounded border px-1.5 py-0.5 text-[9px] font-semibold tracking-wide", meta.class)}>
                <Icon className="h-2.5 w-2.5" /> {meta.label}
              </span>
              <span className="rounded bg-muted/40 px-1.5 py-0.5 text-[10px] text-foreground">{l.service}</span>
              <span className="truncate text-muted-foreground">{l.message}</span>
            </motion.li>
          );
        })}
      </ol>
    </section>
  );
}

export default DashboardErrorLogStream;

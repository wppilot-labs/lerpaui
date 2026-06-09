"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Users, UserPlus, UserCheck, Globe, Clock, MousePointerClick } from "lucide-react";
import { cn } from "../lib/cn";

export interface DashboardUserAnalyticsGridProps {
  className?: string;
}

const METRICS = [
  { label: "Total users", value: "84,210", delta: "+12.3%", icon: Users, accent: "primary" },
  { label: "New signups", value: "1,284", delta: "+8.7%", icon: UserPlus, accent: "emerald" },
  { label: "Active today", value: "12,440", delta: "+4.2%", icon: UserCheck, accent: "cyan" },
  { label: "Avg session", value: "6m 42s", delta: "+0.8%", icon: Clock, accent: "violet" },
  { label: "Countries", value: "108", delta: "+3", icon: Globe, accent: "amber" },
  { label: "Click rate", value: "3.84%", delta: "+0.6%", icon: MousePointerClick, accent: "pink" },
];

const ACCENT: Record<string, string> = {
  primary: "text-primary bg-primary/10",
  emerald: "text-emerald-500 bg-emerald-500/10",
  cyan: "text-cyan-500 bg-cyan-500/10",
  violet: "text-violet-500 bg-violet-500/10",
  amber: "text-amber-500 bg-amber-500/10",
  pink: "text-pink-500 bg-pink-500/10",
};

export function DashboardUserAnalyticsGrid({ className }: DashboardUserAnalyticsGridProps) {
  const reduced = useReducedMotion() ?? false;

  return (
    <section
      aria-label="User analytics"
      className={cn(
        "w-full max-w-4xl rounded-2xl border bg-card p-6 shadow-sm transition-shadow hover:shadow-md",
        className
      )}
    >
      <header className="mb-5 flex items-start justify-between">
        <div>
          <h3 className="text-base font-semibold tracking-tight text-foreground">User analytics</h3>
          <p className="mt-0.5 text-xs text-muted-foreground">Real-time engagement signals</p>
        </div>
        <button
          type="button"
          className="rounded-md border bg-muted/40 px-2.5 py-1 text-[11px] font-medium text-muted-foreground hover:text-foreground"
        >
          Last 30d
        </button>
      </header>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
        {METRICS.map((m, i) => {
          const Icon = m.icon;
          return (
            <motion.div
              key={m.label}
              initial={reduced ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="rounded-xl border bg-muted/20 p-4 transition-colors hover:bg-muted/30"
            >
              <div className="mb-3 flex items-center justify-between">
                <div className={cn("grid h-8 w-8 place-items-center rounded-lg", ACCENT[m.accent])}>
                  <Icon className="h-4 w-4" aria-hidden />
                </div>
                <span className="text-[10px] font-medium text-emerald-500">{m.delta}</span>
              </div>
              <p className="text-2xl font-semibold tabular-nums text-foreground">{m.value}</p>
              <p className="mt-0.5 text-[11px] text-muted-foreground">{m.label}</p>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}

export default DashboardUserAnalyticsGrid;

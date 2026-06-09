"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Activity, ArrowUpRight, ArrowDownRight, Calendar, Filter, Download, RefreshCw } from "lucide-react";
import { cn } from "../lib/cn";

const STATS = [
  { label: "Active users", value: "12,840", delta: "+8.4%", trend: "up" as const, color: "primary" },
  { label: "MRR", value: "$84,210", delta: "+12.1%", trend: "up" as const, color: "cyan" },
  { label: "Churn", value: "1.4%", delta: "−0.3%", trend: "down" as const, color: "mint" },
];

export function DashboardOverviewHeader({ className }: { className?: string }) {
  const reduced = useReducedMotion();
  return (
    <section
      aria-label="Dashboard overview"
      className={cn(
        "w-full max-w-2xl mx-auto rounded-2xl border border-white/[0.07] bg-bg-2/80 backdrop-blur-xl p-5 font-sans text-foreground",
        "shadow-[0_20px_50px_-25px_rgba(0,0,0,0.6)]",
        className,
      )}
    >
      {/* top: title + actions */}
      <header className="flex items-start justify-between gap-4 mb-5">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-mint/10 px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider text-mint">
              <span className="h-1.5 w-1.5 rounded-full bg-mint shadow-[0_0_8px_var(--mint)]" /> Live
            </span>
            <span className="text-[10px] font-mono text-muted-foreground/60">Updated 12s ago</span>
          </div>
          <h2 className="text-xl font-semibold tracking-tight">Overview</h2>
          <p className="text-[12px] text-muted-foreground/70 mt-0.5">Welcome back, Aisha — here&apos;s how acme-prod is doing.</p>
        </div>

        <div className="flex items-center gap-1.5 flex-shrink-0">
          <button type="button" className="hidden sm:inline-flex h-8 items-center gap-1.5 rounded-md border border-white/10 bg-white/[0.03] px-2.5 text-[11px] text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50">
            <Calendar className="h-3.5 w-3.5" aria-hidden="true" /> Last 7d
          </button>
          <button type="button" aria-label="Filter" className="grid h-8 w-8 place-items-center rounded-md border border-white/10 bg-white/[0.03] text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50">
            <Filter className="h-3.5 w-3.5" aria-hidden="true" />
          </button>
          <button type="button" aria-label="Refresh" className="grid h-8 w-8 place-items-center rounded-md border border-white/10 bg-white/[0.03] text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50">
            <RefreshCw className="h-3.5 w-3.5" aria-hidden="true" />
          </button>
          <button type="button" aria-label="Export" className="grid h-8 w-8 place-items-center rounded-md border border-white/10 bg-white/[0.03] text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50">
            <Download className="h-3.5 w-3.5" aria-hidden="true" />
          </button>
        </div>
      </header>

      {/* stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-px bg-white/[0.06] rounded-xl overflow-hidden">
        {STATS.map((s, i) => {
          const TrendIcon = s.trend === "up" ? ArrowUpRight : ArrowDownRight;
          const trendColor = s.trend === "up" ? "text-mint" : "text-pink";
          return (
            <motion.div
              key={s.label}
              initial={reduced ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: i * 0.06 }}
              className="bg-bg-2 p-4"
            >
              <div className="flex items-start justify-between mb-2">
                <span className="text-[10px] font-mono uppercase tracking-[0.16em] text-muted-foreground/70">{s.label}</span>
                <Activity className={cn("h-3 w-3", s.color === "primary" && "text-primary", s.color === "cyan" && "text-cyan", s.color === "mint" && "text-mint")} />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-xl font-semibold tabular-nums text-foreground">{s.value}</span>
                <span className={cn("inline-flex items-center gap-0.5 text-[10px] font-mono", trendColor)}>
                  <TrendIcon className="h-2.5 w-2.5" /> {s.delta}
                </span>
              </div>
              {/* mini-sparkline as deterministic bar */}
              <div className="mt-3 flex items-end gap-0.5 h-5" aria-hidden>
                {[3, 5, 4, 6, 5, 7, 6, 8].map((h, j) => (
                  <span
                    key={j}
                    className={cn(
                      "flex-1 rounded-sm",
                      j > 5
                        ? s.color === "primary" ? "bg-primary" : s.color === "cyan" ? "bg-cyan" : "bg-mint"
                        : "bg-white/[0.08]",
                    )}
                    style={{ height: `${h * 12}%` }}
                  />
                ))}
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}

"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { TrendingUp, TrendingDown, DollarSign, UserMinus, Repeat, Heart } from "lucide-react";
import { cn } from "../lib/cn";

export interface DashboardSubscriptionMetricsProps {
  className?: string;
}

const METRICS = [
  {
    label: "MRR",
    value: "$84,210",
    delta: "+12.4%",
    trend: "up" as const,
    icon: DollarSign,
    sub: "Recurring revenue",
    spark: [40, 48, 52, 50, 58, 62, 68, 72, 78, 84],
  },
  {
    label: "Churn",
    value: "1.4%",
    delta: "−0.3%",
    trend: "down" as const,
    icon: UserMinus,
    sub: "Monthly churn rate",
    spark: [22, 20, 18, 18, 17, 16, 15, 15, 14, 14],
  },
  {
    label: "LTV",
    value: "$2,418",
    delta: "+8.7%",
    trend: "up" as const,
    icon: Heart,
    sub: "Lifetime value",
    spark: [60, 64, 66, 68, 72, 74, 78, 80, 82, 86],
  },
  {
    label: "ARPU",
    value: "$68.42",
    delta: "+4.2%",
    trend: "up" as const,
    icon: Repeat,
    sub: "Avg revenue / user",
    spark: [50, 52, 54, 55, 58, 60, 62, 64, 66, 68],
  },
];

export function DashboardSubscriptionMetrics({ className }: DashboardSubscriptionMetricsProps) {
  const reduced = useReducedMotion() ?? false;

  return (
    <section
      aria-label="Subscription metrics"
      className={cn(
        "w-full max-w-4xl rounded-2xl border bg-card p-6 shadow-sm transition-shadow hover:shadow-md",
        className
      )}
    >
      <header className="mb-5 flex items-start justify-between">
        <div>
          <h3 className="text-base font-semibold tracking-tight text-foreground">Subscription metrics</h3>
          <p className="mt-0.5 text-xs text-muted-foreground">Compared to previous 30-day window</p>
        </div>
        <span className="rounded-md border bg-muted/40 px-2.5 py-1 text-[11px] font-medium text-muted-foreground">USD</span>
      </header>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {METRICS.map((m, i) => {
          const Icon = m.icon;
          const TrendIcon = m.trend === "up" ? TrendingUp : TrendingDown;
          const trendClass = m.trend === "up" ? "text-emerald-500" : "text-emerald-500"; // both directions positive for churn down
          const max = Math.max(...m.spark);
          return (
            <motion.article
              key={m.label}
              initial={reduced ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.06 }}
              className="rounded-xl border bg-muted/20 p-4"
            >
              <div className="mb-2 flex items-center justify-between">
                <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">{m.label}</span>
                <Icon className="h-3.5 w-3.5 text-primary" aria-hidden />
              </div>
              <p className="text-2xl font-semibold tabular-nums text-foreground">{m.value}</p>
              <div className="mt-1 flex items-center gap-1.5">
                <span className={cn("inline-flex items-center gap-0.5 text-[11px] font-medium", trendClass)}>
                  <TrendIcon className="h-3 w-3" /> {m.delta}
                </span>
                <span className="text-[10px] text-muted-foreground">{m.sub}</span>
              </div>
              <div className="mt-3 flex h-8 items-end gap-0.5" aria-hidden>
                {m.spark.map((v, j) => (
                  <span
                    key={j}
                    className={cn(
                      "flex-1 rounded-sm",
                      j === m.spark.length - 1 ? "bg-primary" : "bg-primary/30"
                    )}
                    style={{ height: `${(v / max) * 100}%` }}
                  />
                ))}
              </div>
            </motion.article>
          );
        })}
      </div>
    </section>
  );
}

export default DashboardSubscriptionMetrics;

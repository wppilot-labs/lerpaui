"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { TrendingUp, ArrowUpRight, DollarSign, Users, ShoppingCart } from "lucide-react";
import { cn } from "../lib/cn";

export interface DashboardRevenueOverviewProps {
  className?: string;
}

const KPIS = [
  { label: "Revenue", value: "$284,930", delta: "+18.2%", icon: DollarSign },
  { label: "Customers", value: "4,128", delta: "+6.4%", icon: Users },
  { label: "Orders", value: "12,840", delta: "+11.5%", icon: ShoppingCart },
  { label: "AOV", value: "$68.20", delta: "+4.1%", icon: TrendingUp },
];

const BARS = [40, 55, 48, 70, 65, 82, 78, 90, 85, 95, 88, 100];
const LABELS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export function DashboardRevenueOverview({ className }: DashboardRevenueOverviewProps) {
  const reduced = useReducedMotion() ?? false;

  return (
    <section
      aria-label="Revenue overview"
      className={cn(
        "w-full max-w-4xl rounded-2xl border bg-card p-6 shadow-sm transition-shadow hover:shadow-md",
        className
      )}
    >
      <header className="mb-5 flex items-start justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold tracking-tight text-foreground">Revenue overview</h3>
          <p className="mt-0.5 text-xs text-muted-foreground">Last 12 months · Updated 4 min ago</p>
        </div>
        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-500">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Trending up
        </span>
      </header>

      <div className="mb-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {KPIS.map((k, i) => {
          const Icon = k.icon;
          return (
            <motion.div
              key={k.label}
              initial={reduced ? false : { opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: i * 0.05 }}
              className="rounded-xl border bg-muted/30 p-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">{k.label}</span>
                <Icon className="h-3.5 w-3.5 text-primary" aria-hidden />
              </div>
              <p className="mt-1.5 text-xl font-semibold tabular-nums text-foreground">{k.value}</p>
              <span className="mt-0.5 inline-flex items-center gap-0.5 text-[10px] font-medium text-emerald-500">
                <ArrowUpRight className="h-2.5 w-2.5" /> {k.delta}
              </span>
            </motion.div>
          );
        })}
      </div>

      <div className="rounded-xl border bg-muted/20 p-4">
        <div className="mb-3 flex items-end justify-between gap-1 h-32" aria-hidden>
          {BARS.map((h, i) => (
            <motion.span
              key={i}
              initial={reduced ? false : { height: 0 }}
              animate={{ height: `${h}%` }}
              transition={{ duration: 0.45, delay: i * 0.04 }}
              className={cn(
                "flex-1 rounded-t-md",
                i === BARS.length - 1 ? "bg-primary" : "bg-primary/30"
              )}
            />
          ))}
        </div>
        <div className="flex justify-between text-[9px] text-muted-foreground">
          {LABELS.map((l) => <span key={l}>{l}</span>)}
        </div>
      </div>
    </section>
  );
}

export default DashboardRevenueOverview;

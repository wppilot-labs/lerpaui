"use client";

import React from "react";
import { ArrowUpRight, ArrowDownRight, Users, DollarSign, ShoppingCart, Activity } from "lucide-react";
import { cn } from "../lib/cn";

export interface DashboardKpiGridProps {
  className?: string;
}

interface Kpi {
  label: string;
  value: string;
  delta: string;
  positive: boolean;
  icon: React.ComponentType<{ className?: string }>;
}

const KPIS: Kpi[] = [
  { label: "Total revenue", value: "$48,290", delta: "12.4%", positive: true, icon: DollarSign },
  { label: "Active users", value: "8,412", delta: "5.1%", positive: true, icon: Users },
  { label: "Orders", value: "1,938", delta: "2.3%", positive: false, icon: ShoppingCart },
  { label: "Conversion", value: "3.84%", delta: "0.6%", positive: true, icon: Activity },
];

export function DashboardKpiGrid({ className }: DashboardKpiGridProps) {
  return (
    <div className={cn("grid w-full max-w-lg grid-cols-2 gap-4", className)}>
      {KPIS.map((kpi) => {
        const Icon = kpi.icon;
        return (
          <div
            key={kpi.label}
            className="rounded-2xl border border-border bg-card p-5 text-card-foreground shadow-sm"
          >
            <div className="flex items-center justify-between">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                <Icon className="h-4 w-4" />
              </span>
              <span
                className={cn(
                  "inline-flex items-center gap-0.5 text-xs font-semibold",
                  kpi.positive
                    ? "text-emerald-600 dark:text-emerald-400"
                    : "text-red-600 dark:text-red-400",
                )}
              >
                {kpi.positive ? (
                  <ArrowUpRight className="h-3.5 w-3.5" />
                ) : (
                  <ArrowDownRight className="h-3.5 w-3.5" />
                )}
                {kpi.delta}
              </span>
            </div>
            <p className="mt-4 text-2xl font-bold tracking-tight tabular-nums text-foreground">
              {kpi.value}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">{kpi.label}</p>
          </div>
        );
      })}
    </div>
  );
}

export default DashboardKpiGrid;

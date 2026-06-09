"use client";

import React from "react";
import { DollarSign, Users, ShoppingCart, Activity, ArrowUp, ArrowDown } from "lucide-react";
import { cn } from "../lib/cn";

type Kpi = { label: string; value: string; delta: number; icon: React.ComponentType<{ className?: string }> };

const KPIS: Kpi[] = [
  { label: "Revenue", value: "$48.2k", delta: 12.4, icon: DollarSign },
  { label: "Users", value: "9,310", delta: 8.1, icon: Users },
  { label: "Orders", value: "1,284", delta: -3.2, icon: ShoppingCart },
  { label: "Uptime", value: "99.98%", delta: 0.1, icon: Activity },
];

export interface DashboardKpiGridBlockProps {
  className?: string;
}

export function DashboardKpiGridBlock({ className }: DashboardKpiGridBlockProps) {
  return (
    <div className={cn("w-full max-w-md grid grid-cols-2 gap-3 font-sans text-foreground", className)}>
      {KPIS.map((k) => {
        const Icon = k.icon;
        const up = k.delta >= 0;
        return (
          <div key={k.label} className="bg-card/45 backdrop-blur-xl border border-border/50 p-5 rounded-2xl shadow-xl">
            <div className="flex items-center justify-between mb-2">
              <div className="h-9 w-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                <Icon className="w-5 h-5" />
              </div>
              <span className={cn("inline-flex items-center gap-0.5 text-xs font-bold", up ? "text-emerald-400" : "text-red-400")}>
                {up ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
                {Math.abs(k.delta)}%
              </span>
            </div>
            <div className="text-2xl font-black leading-tight">{k.value}</div>
            <div className="text-xs uppercase tracking-wide text-muted-foreground/50">{k.label}</div>
          </div>
        );
      })}
    </div>
  );
}

"use client";

import React from "react";
import { Building2, Globe, CreditCard, Users } from "lucide-react";
import { cn } from "../lib/cn";

type Item = { icon: React.ComponentType<{ className?: string }>; label: string; value: string };

const ITEMS: Item[] = [
  { icon: Building2, label: "Workspace", value: "Acme Inc" },
  { icon: CreditCard, label: "Plan", value: "Pro · $29/mo" },
  { icon: Globe, label: "Region", value: "US East" },
  { icon: Users, label: "Members", value: "17 of 25" },
];

export interface DashboardSettingsSummaryProps {
  className?: string;
}

export function DashboardSettingsSummary({ className }: DashboardSettingsSummaryProps) {
  return (
    <div className={cn("w-full max-w-md bg-card/45 backdrop-blur-xl border border-border/50 p-5 rounded-2xl shadow-xl font-sans text-foreground", className)}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-bold">Workspace settings</h3>
        <button type="button" className="text-xs font-bold text-primary hover:underline">Edit</button>
      </div>
      <ul className="grid grid-cols-2 gap-3">
        {ITEMS.map((it) => {
          const Icon = it.icon;
          return (
            <li key={it.label} className="p-3 rounded-xl bg-foreground/[0.02] border border-foreground/[0.04]">
              <div className="flex items-center gap-1.5 text-muted-foreground/50 mb-1.5">
                <Icon className="w-4 h-4" />
                <span className="text-[11px] uppercase tracking-wide font-bold">{it.label}</span>
              </div>
              <div className="text-sm font-bold">{it.value}</div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

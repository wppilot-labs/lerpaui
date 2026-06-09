"use client";

import React from "react";
import { Building2, Users, CreditCard, HardDrive, TrendingUp } from "lucide-react";
import { cn } from "../lib/cn";

type Stat = {
  label: string;
  value: string;
  delta?: string;
  Icon: typeof Users;
  tone: string;
};

const STATS: Stat[] = [
  { label: "Members", value: "1,284", delta: "+42", Icon: Users, tone: "text-sky-600 dark:text-sky-400" },
  { label: "Active seats", value: "1,150", delta: "+18", Icon: CreditCard, tone: "text-emerald-600 dark:text-emerald-400" },
  { label: "Storage used", value: "412 GB", Icon: HardDrive, tone: "text-amber-600 dark:text-amber-400" },
  { label: "MRR", value: "$48.2k", delta: "+6.4%", Icon: TrendingUp, tone: "text-primary" },
];

export interface AdminOrganizationOverviewProps {
  className?: string;
}

export function AdminOrganizationOverview({ className }: AdminOrganizationOverviewProps) {
  return (
    <div
      className={cn(
        "w-full max-w-md bg-card border border-border p-5 rounded-2xl shadow-sm font-sans text-foreground",
        className,
      )}
    >
      <div className="flex items-center gap-3 mb-5">
        <div className="w-11 h-11 rounded-xl bg-primary/15 grid place-items-center shrink-0">
          <Building2 className="w-5 h-5 text-primary" />
        </div>
        <div className="min-w-0">
          <h3 className="text-base font-bold truncate">Acme Corporation</h3>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <span className="px-1.5 py-0.5 rounded bg-primary/10 text-primary font-semibold">
              Enterprise
            </span>
            <span>·</span>
            <span>org_a1b2c3</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2.5">
        {STATS.map((s) => (
          <div
            key={s.label}
            className="p-4 rounded-xl bg-muted border border-border"
          >
            <div className="flex items-center justify-between">
              <s.Icon className={cn("w-4 h-4", s.tone)} />
              {s.delta && (
                <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 tabular-nums">
                  {s.delta}
                </span>
              )}
            </div>
            <div className="text-2xl font-bold tabular-nums mt-2 leading-none">{s.value}</div>
            <div className="text-xs text-muted-foreground mt-1.5">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="mt-3 flex items-center justify-between px-4 py-3 rounded-xl bg-muted border border-border text-xs">
        <span className="text-muted-foreground">Plan renews</span>
        <span className="font-semibold tabular-nums">Jul 1, 2026</span>
      </div>
    </div>
  );
}

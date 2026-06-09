"use client";

import React from "react";
import { Plus, TrendingUp } from "lucide-react";
import { cn } from "../lib/cn";

const QUICK = [
  { label: "Revenue today", value: "$4.2k" },
  { label: "New signups", value: "38" },
  { label: "Open tickets", value: "5" },
];

export interface DashboardWelcomeHeaderBlockProps {
  className?: string;
}

export function DashboardWelcomeHeaderBlock({ className }: DashboardWelcomeHeaderBlockProps) {
  return (
    <div className={cn("w-full max-w-xl bg-card/45 backdrop-blur-xl border border-border/50 p-6 rounded-2xl shadow-xl font-sans text-foreground relative overflow-hidden", className)}>
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent pointer-events-none" />
      <div className="relative flex items-start justify-between gap-4 flex-wrap">
        <div>
          <p className="text-xs text-muted-foreground/60">Tuesday, June 3</p>
          <h2 className="text-2xl font-black mt-0.5">Welcome back, Jane 👋</h2>
          <p className="text-xs text-muted-foreground/65 mt-1 flex items-center gap-1">
            <TrendingUp className="w-4 h-4 text-emerald-400" /> Revenue is up 18% this week
          </p>
        </div>
        <button type="button" className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-xl bg-primary text-primary-foreground hover:brightness-110 transition-all shrink-0">
          <Plus className="w-4 h-4" /> New project
        </button>
      </div>

      <div className="relative grid grid-cols-3 gap-3 mt-5">
        {QUICK.map((q) => (
          <div key={q.label} className="rounded-xl bg-foreground/[0.03] border border-foreground/[0.05] p-3">
            <div className="text-2xl font-black leading-tight">{q.value}</div>
            <div className="text-[11px] uppercase tracking-wide text-muted-foreground/50">{q.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

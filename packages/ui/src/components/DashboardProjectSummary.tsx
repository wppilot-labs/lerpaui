"use client";

import React from "react";
import { Folder, Calendar, CheckSquare } from "lucide-react";
import { cn } from "../lib/cn";

export interface DashboardProjectSummaryProps {
  className?: string;
}

export function DashboardProjectSummary({ className }: DashboardProjectSummaryProps) {
  const progress = 64;
  const members = ["JD", "ML", "PP", "AK"];

  return (
    <div className={cn("w-full max-w-md bg-card/45 backdrop-blur-xl border border-border/50 p-5 rounded-2xl shadow-xl font-sans text-foreground", className)}>
      <div className="flex items-center gap-2.5 mb-4">
        <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
          <Folder className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-base font-bold leading-tight">Website redesign</h3>
          <span className="text-xs text-muted-foreground/55">Design · 12 tasks</span>
        </div>
      </div>

      <div className="flex items-center gap-2 mb-4">
        <div className="flex-1 h-2 rounded-full bg-foreground/[0.06] overflow-hidden">
          <div className="h-full rounded-full bg-primary" style={{ width: `${progress}%` }} />
        </div>
        <span className="text-xs font-bold tabular-nums">{progress}%</span>
      </div>

      <div className="grid grid-cols-2 gap-2 mb-4">
        <div className="flex items-center gap-2 p-2.5 rounded-xl bg-foreground/[0.02] border border-foreground/[0.04]">
          <CheckSquare className="w-4 h-4 text-emerald-400" />
          <div className="text-xs"><span className="font-bold">8</span> done</div>
        </div>
        <div className="flex items-center gap-2 p-2.5 rounded-xl bg-foreground/[0.02] border border-foreground/[0.04]">
          <Calendar className="w-4 h-4 text-amber-400" />
          <div className="text-xs">Due <span className="font-bold">Jul 12</span></div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex -space-x-2">
          {members.map((m) => (
            <div key={m} className="h-8 w-8 rounded-full bg-secondary/60 border border-card flex items-center justify-center text-[11px] font-bold">{m}</div>
          ))}
        </div>
        <button type="button" className="text-xs font-bold text-primary hover:underline">Open</button>
      </div>
    </div>
  );
}

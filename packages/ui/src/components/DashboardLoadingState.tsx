"use client";

import React from "react";
import { cn } from "../lib/cn";

export interface DashboardLoadingStateProps {
  className?: string;
}

/** Skeleton placeholder shown while dashboard data loads. */
export function DashboardLoadingState({ className }: DashboardLoadingStateProps) {
  return (
    <div
      className={cn("w-full max-w-xl bg-card/45 backdrop-blur-xl border border-border/50 p-5 rounded-2xl shadow-xl font-sans", className)}
      role="status"
      aria-busy="true"
      aria-label="Loading dashboard"
    >
      <div className="flex items-center justify-between mb-5">
        <div className="space-y-2">
          <div className="h-3 w-28 rounded bg-foreground/[0.07] animate-pulse" />
          <div className="h-2 w-40 rounded bg-foreground/[0.05] animate-pulse" />
        </div>
        <div className="h-8 w-20 rounded-lg bg-foreground/[0.06] animate-pulse" />
      </div>

      <div className="grid grid-cols-3 gap-3 mb-5">
        {[0, 1, 2].map((i) => (
          <div key={i} className="p-4 rounded-xl border border-foreground/[0.04] bg-foreground/[0.01]">
            <div className="h-6 w-6 rounded-lg bg-foreground/[0.07] animate-pulse mb-3" />
            <div className="h-4 w-16 rounded bg-foreground/[0.07] animate-pulse mb-2" />
            <div className="h-2 w-12 rounded bg-foreground/[0.05] animate-pulse" />
          </div>
        ))}
      </div>

      <div className="space-y-3">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-foreground/[0.06] animate-pulse shrink-0" />
            <div className="h-2.5 rounded bg-foreground/[0.06] animate-pulse" style={{ width: `${70 - i * 12}%` }} />
            <div className="h-2.5 w-10 rounded bg-foreground/[0.05] animate-pulse ml-auto" />
          </div>
        ))}
      </div>

      <span className="sr-only">Loading…</span>
    </div>
  );
}

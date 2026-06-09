"use client";

import React, { useState } from "react";
import { Calendar, ChevronDown } from "lucide-react";
import { cn } from "../lib/cn";

const PRESETS = ["Today", "7d", "30d", "90d", "YTD"];

export interface DashboardDateRangeToolbarProps {
  className?: string;
}

export function DashboardDateRangeToolbar({ className }: DashboardDateRangeToolbarProps) {
  const [preset, setPreset] = useState("7d");
  const [compare, setCompare] = useState(true);

  return (
    <div className={cn("w-full max-w-md bg-card/45 backdrop-blur-xl border border-border/50 p-5 rounded-2xl shadow-xl font-sans text-foreground", className)}>
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-0.5 bg-secondary/30 p-0.5 rounded-xl border border-foreground/[0.04]">
          {PRESETS.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setPreset(p)}
              aria-pressed={preset === p}
              className={cn(
                "px-2.5 py-1 rounded-lg text-xs font-semibold transition-all",
                preset === p ? "bg-card text-foreground shadow-sm" : "text-muted-foreground/60 hover:text-foreground",
              )}
            >
              {p}
            </button>
          ))}
        </div>

        <button type="button" className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-foreground/[0.03] border border-foreground/[0.06] text-xs font-medium hover:bg-foreground/[0.05] transition-colors">
          <Calendar className="w-4 h-4 text-muted-foreground/60" />
          Jan 1 – Jan 7
          <ChevronDown className="w-4 h-4 text-muted-foreground/40" />
        </button>
      </div>

      <div className="flex items-center justify-between mt-3 pt-3 border-t border-foreground/[0.05]">
        <label htmlFor="dr-compare" className="text-xs text-muted-foreground/70">Compare to previous period</label>
        <button
          id="dr-compare"
          type="button"
          role="switch"
          aria-checked={compare}
          onClick={() => setCompare((c) => !c)}
          className={cn("relative h-5 w-9 rounded-full transition-colors", compare ? "bg-primary" : "bg-foreground/10")}
        >
          <span className={cn("absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform", compare && "translate-x-4")} />
        </button>
      </div>
    </div>
  );
}

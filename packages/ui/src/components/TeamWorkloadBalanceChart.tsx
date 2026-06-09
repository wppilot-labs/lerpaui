"use client";

import React from "react";
import { cn } from "../lib/cn";

type Load = {
  name: string;
  initials: string;
  tint: string;
  tasks: number;
  capacity: number;
};

const TEAM: Load[] = [
  { name: "Jane Doe", initials: "JD", tint: "bg-violet-500/15 text-violet-300", tasks: 6, capacity: 10 },
  { name: "Marcus Lee", initials: "ML", tint: "bg-sky-500/15 text-sky-300", tasks: 11, capacity: 10 },
  { name: "Priya Patel", initials: "PP", tint: "bg-emerald-500/15 text-emerald-300", tasks: 8, capacity: 10 },
  { name: "Alex Kim", initials: "AK", tint: "bg-amber-500/15 text-amber-300", tasks: 3, capacity: 10 },
  { name: "Sofia Reyes", initials: "SR", tint: "bg-rose-500/15 text-rose-300", tasks: 9, capacity: 10 },
];

function barColor(pct: number) {
  if (pct > 100) return "bg-rose-500";
  if (pct >= 85) return "bg-amber-400";
  if (pct < 45) return "bg-sky-400";
  return "bg-emerald-400";
}

export interface TeamWorkloadBalanceChartProps {
  className?: string;
}

export function TeamWorkloadBalanceChart({
  className,
}: TeamWorkloadBalanceChartProps) {
  const total = TEAM.reduce((s, m) => s + m.tasks, 0);
  const avg = Math.round(total / TEAM.length);

  return (
    <div
      className={cn(
        "w-full max-w-md bg-card/45 backdrop-blur-xl border border-border/50 p-6 rounded-2xl shadow-xl font-sans text-foreground",
        className,
      )}
    >
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-base font-bold">Workload balance</h3>
        <span className="text-xs text-muted-foreground/50">
          avg {avg} / person
        </span>
      </div>

      <ul className="space-y-3.5">
        {TEAM.map((m) => {
          const pct = Math.round((m.tasks / m.capacity) * 100);
          const over = pct > 100;
          return (
            <li key={m.name}>
              <div className="mb-1.5 flex items-center gap-2.5">
                <span
                  className={cn(
                    "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[11px] font-bold",
                    m.tint,
                  )}
                >
                  {m.initials}
                </span>
                <span className="min-w-0 flex-1 truncate text-sm font-medium">
                  {m.name}
                </span>
                <span
                  className={cn(
                    "text-xs font-semibold tabular-nums",
                    over ? "text-rose-400" : "text-muted-foreground",
                  )}
                >
                  {m.tasks}/{m.capacity}
                </span>
              </div>
              <div className="ml-[42px] h-2 overflow-hidden rounded-full bg-secondary/50">
                <div
                  className={cn("h-full rounded-full", barColor(pct))}
                  style={{ width: `${Math.min(pct, 100)}%` }}
                />
              </div>
            </li>
          );
        })}
      </ul>

      <div className="mt-4 flex items-center gap-4 border-t border-border/50 pt-3">
        <span className="flex items-center gap-1.5 text-xs text-muted-foreground/70">
          <span className="h-2 w-2 rounded-full bg-emerald-400" /> Balanced
        </span>
        <span className="flex items-center gap-1.5 text-xs text-muted-foreground/70">
          <span className="h-2 w-2 rounded-full bg-amber-400" /> Near cap
        </span>
        <span className="flex items-center gap-1.5 text-xs text-muted-foreground/70">
          <span className="h-2 w-2 rounded-full bg-rose-500" /> Over
        </span>
      </div>
    </div>
  );
}

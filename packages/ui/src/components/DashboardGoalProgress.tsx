"use client";

import React from "react";
import { Target } from "lucide-react";
import { cn } from "../lib/cn";

export interface DashboardGoalProgressProps {
  className?: string;
}

interface Goal {
  label: string;
  current: number;
  target: number;
  unit: string;
  tone: string;
}

const GOALS: Goal[] = [
  { label: "New signups", current: 1840, target: 2500, unit: "", tone: "bg-primary" },
  { label: "Monthly revenue", current: 38_400, target: 50_000, unit: "$", tone: "bg-emerald-500" },
  { label: "Support CSAT", current: 92, target: 95, unit: "%", tone: "bg-violet-500" },
  { label: "Active workspaces", current: 612, target: 1000, unit: "", tone: "bg-amber-500" },
];

function format(value: number, unit: string): string {
  const num = value >= 1000 ? value.toLocaleString() : `${value}`;
  return unit === "$" ? `$${num}` : `${num}${unit}`;
}

export function DashboardGoalProgress({ className }: DashboardGoalProgressProps) {
  return (
    <div
      className={cn(
        "w-full max-w-md rounded-2xl border border-border bg-card p-6 text-card-foreground shadow-sm",
        className,
      )}
    >
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Target className="h-5 w-5" />
        </span>
        <div>
          <h3 className="text-base font-semibold leading-tight text-foreground">Quarterly goals</h3>
          <p className="text-sm text-muted-foreground">Q2 2026 progress</p>
        </div>
      </div>

      <ul className="mt-6 space-y-5">
        {GOALS.map((goal) => {
          const pct = Math.min(Math.round((goal.current / goal.target) * 100), 100);
          return (
            <li key={goal.label}>
              <div className="flex items-baseline justify-between gap-3">
                <span className="text-sm font-medium text-foreground">{goal.label}</span>
                <span className="text-sm font-semibold tabular-nums text-foreground">{pct}%</span>
              </div>
              <div
                className="mt-2 h-2 w-full overflow-hidden rounded-full bg-muted"
                role="progressbar"
                aria-valuenow={pct}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={goal.label}
              >
                <div
                  className={cn("h-full rounded-full transition-all", goal.tone)}
                  style={{ width: `${pct}%` }}
                />
              </div>
              <p className="mt-1.5 text-xs text-muted-foreground">
                {format(goal.current, goal.unit)} of {format(goal.target, goal.unit)} target
              </p>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default DashboardGoalProgress;

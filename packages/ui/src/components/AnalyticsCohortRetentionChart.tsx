"use client";

import React from "react";
import { Grid3x3 } from "lucide-react";
import { cn } from "../lib/cn";

type Cohort = { label: string; size: number; values: (number | null)[] };

const WEEKS = ["W0", "W1", "W2", "W3", "W4", "W5"];

const COHORTS: Cohort[] = [
  { label: "Jan", size: 1240, values: [100, 62, 48, 41, 37, 34] },
  { label: "Feb", size: 1580, values: [100, 58, 45, 39, 33, null] },
  { label: "Mar", size: 1390, values: [100, 64, 51, 44, null, null] },
  { label: "Apr", size: 1720, values: [100, 60, 47, null, null, null] },
  { label: "May", size: 1610, values: [100, 66, null, null, null, null] },
  { label: "Jun", size: 1845, values: [100, null, null, null, null, null] },
];

function cellStyle(v: number | null) {
  if (v === null) return "bg-foreground/[0.015] text-transparent";
  return "text-foreground/90";
}

export interface AnalyticsCohortRetentionChartProps {
  className?: string;
}

export function AnalyticsCohortRetentionChart({ className }: AnalyticsCohortRetentionChartProps) {
  return (
    <div
      className={cn(
        "w-full max-w-lg bg-card border border-border p-5 rounded-2xl shadow-sm font-sans text-foreground",
        className,
      )}
    >
      <div className="flex items-center gap-2 mb-4">
        <Grid3x3 className="w-4 h-4 text-primary" />
        <h3 className="text-base font-bold">Cohort retention</h3>
        <span className="ml-auto text-xs text-muted-foreground">% returning by week</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-separate border-spacing-1 text-center">
          <thead>
            <tr className="text-[11px] uppercase font-bold text-muted-foreground tracking-wider">
              <th className="text-left font-bold pl-1 pb-1">Cohort</th>
              {WEEKS.map((w) => (
                <th key={w} className="pb-1 font-bold">
                  {w}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {COHORTS.map((c) => (
              <tr key={c.label}>
                <td className="text-left pr-2">
                  <div className="text-xs font-semibold leading-none">{c.label}</div>
                  <div className="text-[10px] text-muted-foreground tabular-nums">
                    {c.size.toLocaleString()}
                  </div>
                </td>
                {c.values.map((v, i) => (
                  <td key={i}>
                    <div
                      className={cn(
                        "h-9 rounded-md grid place-items-center text-xs font-semibold tabular-nums",
                        cellStyle(v),
                      )}
                      style={
                        v === null
                          ? undefined
                          : { backgroundColor: `color-mix(in oklab, var(--primary) ${Math.max(8, v)}%, transparent)` }
                      }
                    >
                      {v === null ? "" : `${v}%`}
                    </div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

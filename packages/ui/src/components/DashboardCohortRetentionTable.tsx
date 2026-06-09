"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Layers } from "lucide-react";
import { cn } from "../lib/cn";

export interface DashboardCohortRetentionTableProps {
  className?: string;
}

type Row = { cohort: string; size: number; weeks: number[] };

const ROWS: Row[] = [
  { cohort: "Wk 1", size: 1248, weeks: [100, 72, 58, 49, 42, 38, 35, 33] },
  { cohort: "Wk 2", size: 1102, weeks: [100, 68, 55, 48, 41, 36, 34] },
  { cohort: "Wk 3", size: 1340, weeks: [100, 74, 61, 52, 45, 40] },
  { cohort: "Wk 4", size: 1421, weeks: [100, 78, 64, 56, 48] },
  { cohort: "Wk 5", size: 1198, weeks: [100, 71, 59, 51] },
  { cohort: "Wk 6", size: 1502, weeks: [100, 76, 62] },
  { cohort: "Wk 7", size: 1389, weeks: [100, 73] },
  { cohort: "Wk 8", size: 1610, weeks: [100] },
];

function shade(pct: number) {
  if (pct >= 80) return "bg-primary text-primary-foreground";
  if (pct >= 60) return "bg-primary/70 text-primary-foreground";
  if (pct >= 45) return "bg-primary/50 text-foreground";
  if (pct >= 30) return "bg-primary/30 text-foreground";
  if (pct >= 15) return "bg-primary/15 text-muted-foreground";
  return "bg-muted/40 text-muted-foreground";
}

export function DashboardCohortRetentionTable({ className }: DashboardCohortRetentionTableProps) {
  const reduced = useReducedMotion() ?? false;

  return (
    <section
      aria-label="Cohort retention"
      className={cn(
        "w-full max-w-4xl rounded-2xl border bg-card p-6 shadow-sm transition-shadow hover:shadow-md",
        className
      )}
    >
      <header className="mb-5 flex items-start justify-between">
        <div className="flex items-center gap-2">
          <Layers className="h-4 w-4 text-primary" aria-hidden />
          <div>
            <h3 className="text-base font-semibold tracking-tight text-foreground">Cohort retention</h3>
            <p className="mt-0.5 text-xs text-muted-foreground">Weekly retention by signup cohort</p>
          </div>
        </div>
        <span className="text-[10px] text-muted-foreground">% retained</span>
      </header>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] border-separate border-spacing-1 text-[11px]">
          <thead>
            <tr className="text-muted-foreground">
              <th className="text-left font-medium pl-1">Cohort</th>
              <th className="text-right pr-2 font-medium">Size</th>
              {[0, 1, 2, 3, 4, 5, 6, 7].map((w) => (
                <th key={w} className="text-center font-medium">W{w}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ROWS.map((r, i) => (
              <tr key={r.cohort}>
                <td className="pl-1 text-foreground font-medium">{r.cohort}</td>
                <td className="pr-2 text-right tabular-nums text-muted-foreground">{r.size}</td>
                {Array.from({ length: 8 }).map((_, j) => {
                  const v = r.weeks[j];
                  if (v === undefined) return <td key={j} className="h-8 rounded bg-muted/10" />;
                  return (
                    <motion.td
                      key={j}
                      initial={reduced ? false : { opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, delay: (i + j) * 0.02 }}
                      className={cn(
                        "h-8 rounded text-center font-medium tabular-nums",
                        shade(v)
                      )}
                    >
                      {v}%
                    </motion.td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default DashboardCohortRetentionTable;

"use client";

import React, { useState } from "react";
import { LayoutDashboard, BarChart3, LineChart, PieChart, Table2, Hash, Activity, Plus, Check } from "lucide-react";
import { cn } from "../lib/cn";

type Widget = { id: string; label: string; Icon: typeof BarChart3 };

const WIDGETS: Widget[] = [
  { id: "kpi", label: "KPI tile", Icon: Hash },
  { id: "bar", label: "Bar chart", Icon: BarChart3 },
  { id: "line", label: "Line chart", Icon: LineChart },
  { id: "pie", label: "Pie chart", Icon: PieChart },
  { id: "table", label: "Data table", Icon: Table2 },
  { id: "live", label: "Live metric", Icon: Activity },
];

export interface AnalyticsCustomDashboardBuilderProps {
  className?: string;
}

export function AnalyticsCustomDashboardBuilder({ className }: AnalyticsCustomDashboardBuilderProps) {
  const [added, setAdded] = useState<string[]>(["kpi", "line"]);

  const toggle = (id: string) =>
    setAdded((a) => (a.includes(id) ? a.filter((x) => x !== id) : [...a, id]));

  return (
    <div
      className={cn(
        "w-full max-w-md bg-card border border-border p-5 rounded-2xl shadow-sm font-sans text-foreground",
        className,
      )}
    >
      <div className="flex items-center gap-2 mb-1">
        <LayoutDashboard className="w-4 h-4 text-primary" />
        <h3 className="text-base font-bold">Build dashboard</h3>
        <span className="ml-auto text-xs text-muted-foreground tabular-nums">
          {added.length} added
        </span>
      </div>
      <p className="text-xs text-muted-foreground mb-4">Pick widgets to add to your layout.</p>

      <div className="grid grid-cols-2 gap-2">
        {WIDGETS.map((w) => {
          const on = added.includes(w.id);
          return (
            <button
              key={w.id}
              type="button"
              aria-pressed={on}
              onClick={() => toggle(w.id)}
              className={cn(
                "flex items-center gap-2.5 p-3 rounded-xl border text-left transition-colors",
                on
                  ? "bg-primary/10 border-primary/40"
                  : "bg-muted border-border hover:bg-muted/70",
              )}
            >
              <span
                className={cn(
                  "w-9 h-9 rounded-lg grid place-items-center shrink-0",
                  on ? "bg-primary/15 text-primary" : "bg-foreground/[0.06] text-muted-foreground",
                )}
              >
                <w.Icon className="w-4 h-4" />
              </span>
              <span className="text-xs font-semibold flex-1">{w.label}</span>
              <span
                className={cn(
                  "w-4 h-4 rounded-full grid place-items-center shrink-0",
                  on ? "bg-primary text-primary-foreground" : "text-muted-foreground",
                )}
                aria-hidden="true"
              >
                {on ? <Check className="w-3 h-3" /> : <Plus className="w-3.5 h-3.5" />}
              </span>
            </button>
          );
        })}
      </div>

      <button
        type="button"
        disabled={added.length === 0}
        className="mt-5 w-full rounded-xl bg-primary text-primary-foreground py-2.5 text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-40"
      >
        Save layout
      </button>
    </div>
  );
}

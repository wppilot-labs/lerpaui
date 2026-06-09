"use client";

import React, { useState } from "react";
import { X } from "lucide-react";
import { cn } from "../lib/cn";

type Row = { id: string; name: string; plan: "Free" | "Pro" | "Enterprise"; region: string };

const ROWS: Row[] = [
  { id: "1", name: "Northwind", plan: "Enterprise", region: "US" },
  { id: "2", name: "Vertex", plan: "Pro", region: "EU" },
  { id: "3", name: "Lumen", plan: "Free", region: "US" },
  { id: "4", name: "Orbit", plan: "Pro", region: "APAC" },
  { id: "5", name: "Quill", plan: "Enterprise", region: "EU" },
];

const PLANS = ["Free", "Pro", "Enterprise"] as const;

export interface DataTableWithFiltersProps {
  className?: string;
}

export function DataTableWithFilters({ className }: DataTableWithFiltersProps) {
  const [active, setActive] = useState<Set<string>>(new Set(["Pro", "Enterprise"]));

  const togglePlan = (p: string) =>
    setActive((prev) => {
      const next = new Set(prev);
      next.has(p) ? next.delete(p) : next.add(p);
      return next;
    });

  const rows = active.size === 0 ? ROWS : ROWS.filter((r) => active.has(r.plan));

  return (
    <div className={cn("w-full max-w-md bg-card/45 backdrop-blur-xl border border-border/50 p-5 rounded-2xl shadow-xl font-sans text-foreground", className)}>
      <h3 className="text-base font-bold mb-3">Accounts</h3>

      <div className="flex flex-wrap items-center gap-1.5 mb-4">
        <span className="text-[11px] uppercase font-bold text-muted-foreground/40 tracking-wider mr-1">Plan</span>
        {PLANS.map((p) => {
          const on = active.has(p);
          return (
            <button
              key={p}
              type="button"
              aria-pressed={on}
              onClick={() => togglePlan(p)}
              className={cn(
                "inline-flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-full border transition-colors",
                on ? "bg-primary/15 border-primary/30 text-primary" : "border-foreground/[0.08] text-muted-foreground/60 hover:bg-foreground/[0.04]",
              )}
            >
              {p}
              {on && <X className="w-3 h-3" />}
            </button>
          );
        })}
      </div>

      <div className="overflow-hidden rounded-xl border border-foreground/[0.05]">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-foreground/[0.02] text-[11px] uppercase font-bold text-muted-foreground/50 tracking-wider">
              <th scope="col" className="px-4 py-2.5">Account</th>
              <th scope="col" className="px-4 py-2.5">Plan</th>
              <th scope="col" className="px-4 py-2.5 text-right">Region</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-foreground/[0.04] text-sm">
            {rows.map((r) => (
              <tr key={r.id} className="hover:bg-foreground/[0.02] transition-colors">
                <td className="px-4 py-3 font-semibold">{r.name}</td>
                <td className="px-4 py-3 text-muted-foreground/70">{r.plan}</td>
                <td className="px-4 py-3 text-right text-muted-foreground/55">{r.region}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

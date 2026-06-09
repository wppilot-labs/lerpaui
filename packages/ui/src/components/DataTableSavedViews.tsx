"use client";

import React, { useState } from "react";
import { Star, Plus } from "lucide-react";
import { cn } from "../lib/cn";

type Status = "active" | "trial" | "churned";
type Row = { id: string; name: string; status: Status };

const ROWS: Row[] = [
  { id: "1", name: "Northwind", status: "active" },
  { id: "2", name: "Vertex", status: "trial" },
  { id: "3", name: "Lumen", status: "active" },
  { id: "4", name: "Delta", status: "churned" },
  { id: "5", name: "Orbit", status: "trial" },
];

const VIEWS: { id: string; label: string; filter: (r: Row) => boolean }[] = [
  { id: "all", label: "All accounts", filter: () => true },
  { id: "active", label: "Active", filter: (r) => r.status === "active" },
  { id: "trials", label: "Trials", filter: (r) => r.status === "trial" },
];

const STATUS_LABEL: Record<Status, string> = { active: "Active", trial: "Trial", churned: "Churned" };

export interface DataTableSavedViewsProps {
  className?: string;
}

export function DataTableSavedViews({ className }: DataTableSavedViewsProps) {
  const [view, setView] = useState("active");
  const current = VIEWS.find((v) => v.id === view) ?? VIEWS[0];
  const rows = ROWS.filter(current.filter);

  return (
    <div className={cn("w-full max-w-md bg-card/45 backdrop-blur-xl border border-border/50 p-5 rounded-2xl shadow-xl font-sans text-foreground", className)}>
      <h3 className="text-base font-bold mb-3">Accounts</h3>

      <div role="tablist" aria-label="Saved views" className="flex items-center gap-1 mb-4 border-b border-foreground/[0.06]">
        {VIEWS.map((v) => {
          const on = v.id === view;
          return (
            <button
              key={v.id}
              type="button"
              role="tab"
              aria-selected={on}
              onClick={() => setView(v.id)}
              className={cn(
                "inline-flex items-center gap-1 text-xs font-semibold px-3 py-2.5 -mb-px border-b-2 transition-colors",
                on ? "border-primary text-foreground" : "border-transparent text-muted-foreground/55 hover:text-foreground",
              )}
            >
              {on && <Star className="w-3.5 h-3.5 fill-primary text-primary" />}
              {v.label}
            </button>
          );
        })}
        <button type="button" aria-label="Save new view" className="ml-auto p-1.5 text-muted-foreground/40 hover:text-foreground transition-colors">
          <Plus className="w-4 h-4" />
        </button>
      </div>

      <div className="overflow-hidden rounded-xl border border-foreground/[0.05]">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-foreground/[0.02] text-[11px] uppercase font-bold text-muted-foreground/50 tracking-wider">
              <th scope="col" className="px-4 py-2.5">Account</th>
              <th scope="col" className="px-4 py-2.5 text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-foreground/[0.04] text-sm">
            {rows.map((r) => (
              <tr key={r.id} className="hover:bg-foreground/[0.02] transition-colors">
                <td className="px-4 py-3 font-semibold">{r.name}</td>
                <td className="px-4 py-3 text-right text-muted-foreground/70">{STATUS_LABEL[r.status]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

"use client";

import React, { useState } from "react";
import { Check } from "lucide-react";
import { cn } from "../lib/cn";

type Row = { id: string; name: string; email: string; role: string };

const ROWS: Row[] = [
  { id: "u1", name: "Jane Doe", email: "jane@acme.co", role: "Owner" },
  { id: "u2", name: "Marcus Lee", email: "marcus@acme.co", role: "Admin" },
  { id: "u3", name: "Priya Patel", email: "priya@acme.co", role: "Member" },
  { id: "u4", name: "Alex Kim", email: "alex@acme.co", role: "Member" },
];

export interface DataTableRowSelectionProps {
  className?: string;
}

export function DataTableRowSelection({ className }: DataTableRowSelectionProps) {
  const [selected, setSelected] = useState<Set<string>>(new Set(["u2"]));

  const allChecked = selected.size === ROWS.length;
  const toggle = (id: string) =>
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  const toggleAll = () =>
    setSelected(allChecked ? new Set() : new Set(ROWS.map((r) => r.id)));

  return (
    <div className={cn("w-full max-w-md bg-card/45 backdrop-blur-xl border border-border/50 p-5 rounded-2xl shadow-xl font-sans text-foreground", className)}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-bold">Members</h3>
        <span className="text-xs font-semibold text-muted-foreground/60 tabular-nums">{selected.size} selected</span>
      </div>

      <div className="overflow-hidden rounded-xl border border-foreground/[0.05]">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-foreground/[0.02] text-[11px] uppercase font-bold text-muted-foreground/50 tracking-wider">
              <th scope="col" className="px-4 py-2.5 w-10">
                <button
                  type="button"
                  role="checkbox"
                  aria-checked={allChecked}
                  aria-label="Select all rows"
                  onClick={toggleAll}
                  className={cn(
                    "h-4 w-4 rounded border flex items-center justify-center transition-colors",
                    allChecked ? "bg-primary border-primary text-primary-foreground" : "border-foreground/20 hover:border-foreground/40",
                  )}
                >
                  {allChecked && <Check className="w-3.5 h-3.5" />}
                </button>
              </th>
              <th scope="col" className="px-4 py-2.5">User</th>
              <th scope="col" className="px-4 py-2.5">Role</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-foreground/[0.04] text-sm">
            {ROWS.map((r) => {
              const checked = selected.has(r.id);
              return (
                <tr key={r.id} className={cn("transition-colors", checked ? "bg-primary/[0.06]" : "hover:bg-foreground/[0.02]")}>
                  <td className="px-4 py-3">
                    <button
                      type="button"
                      role="checkbox"
                      aria-checked={checked}
                      aria-label={`Select ${r.name}`}
                      onClick={() => toggle(r.id)}
                      className={cn(
                        "h-4 w-4 rounded border flex items-center justify-center transition-colors",
                        checked ? "bg-primary border-primary text-primary-foreground" : "border-foreground/20 hover:border-foreground/40",
                      )}
                    >
                      {checked && <Check className="w-3.5 h-3.5" />}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-semibold">{r.name}</div>
                    <div className="text-xs text-muted-foreground/45">{r.email}</div>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground/70">{r.role}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

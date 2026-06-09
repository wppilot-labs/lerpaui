"use client";

import React, { useState } from "react";
import { Check, Trash2, Download, X } from "lucide-react";
import { cn } from "../lib/cn";

type Row = { id: string; name: string; status: string };

const ROWS: Row[] = [
  { id: "o1", name: "Order #4821", status: "Paid" },
  { id: "o2", name: "Order #4822", status: "Pending" },
  { id: "o3", name: "Order #4823", status: "Paid" },
  { id: "o4", name: "Order #4824", status: "Refunded" },
];

export interface DataTableWithBulkActionsProps {
  className?: string;
}

export function DataTableWithBulkActions({ className }: DataTableWithBulkActionsProps) {
  const [selected, setSelected] = useState<Set<string>>(new Set(["o1", "o3"]));

  const toggle = (id: string) =>
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  const clear = () => setSelected(new Set());
  const count = selected.size;

  return (
    <div className={cn("w-full max-w-md bg-card/45 backdrop-blur-xl border border-border/50 p-5 rounded-2xl shadow-xl font-sans text-foreground", className)}>
      <h3 className="text-base font-bold mb-4">Orders</h3>

      {count > 0 && (
        <div className="flex items-center justify-between gap-2 mb-3 px-4 py-2.5 rounded-xl bg-primary/10 border border-primary/20">
          <div className="flex items-center gap-2">
            <button type="button" aria-label="Clear selection" onClick={clear} className="text-primary/70 hover:text-primary transition-colors">
              <X className="w-4 h-4" />
            </button>
            <span className="text-xs font-semibold text-primary tabular-nums">{count} selected</span>
          </div>
          <div className="flex items-center gap-1.5">
            <button type="button" className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 rounded-md bg-foreground/[0.05] hover:bg-foreground/[0.1] transition-colors">
              <Download className="w-3.5 h-3.5" /> Export
            </button>
            <button type="button" className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 rounded-md bg-rose-500/15 text-rose-600 dark:text-rose-400 hover:bg-rose-500/25 transition-colors">
              <Trash2 className="w-3.5 h-3.5" /> Delete
            </button>
          </div>
        </div>
      )}

      <div className="overflow-hidden rounded-xl border border-foreground/[0.05]">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-foreground/[0.02] text-[11px] uppercase font-bold text-muted-foreground/50 tracking-wider">
              <th scope="col" className="px-4 py-2.5 w-10" />
              <th scope="col" className="px-4 py-2.5">Order</th>
              <th scope="col" className="px-4 py-2.5 text-right">Status</th>
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
                  <td className="px-4 py-3 font-semibold tabular-nums">{r.name}</td>
                  <td className="px-4 py-3 text-right text-muted-foreground/70">{r.status}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

"use client";

import React from "react";
import { Check, Minus, Star } from "lucide-react";
import { cn } from "../lib/cn";

type Col = { id: string; name: string; price: string; best?: boolean };

const COLS: Col[] = [
  { id: "air", name: "Aero Air", price: "$129" },
  { id: "pro", name: "Aero Pro", price: "$189", best: true },
  { id: "max", name: "Aero Max", price: "$249" },
];

type Row = {
  label: string;
  values: (string | boolean)[];
};

const ROWS: Row[] = [
  { label: "Weight", values: ["310 g", "265 g", "240 g"] },
  { label: "Waterproof", values: [false, true, true] },
  { label: "Battery", values: ["8 h", "14 h", "22 h"] },
  { label: "Noise cancel", values: [false, true, true] },
  { label: "Wireless charge", values: [false, false, true] },
];

function Cell({ value }: { value: string | boolean }) {
  if (typeof value === "boolean") {
    return value ? (
      <Check className="w-4 h-4 text-emerald-400 mx-auto" />
    ) : (
      <Minus className="w-4 h-4 text-muted-foreground/30 mx-auto" />
    );
  }
  return <span className="text-xs text-foreground">{value}</span>;
}

export interface ProductComparisonTableProps {
  className?: string;
}

export function ProductComparisonTable({ className }: ProductComparisonTableProps) {
  return (
    <div
      className={cn(
        "w-full max-w-md bg-card/45 backdrop-blur-xl border border-border/50 rounded-2xl shadow-xl font-sans text-foreground overflow-hidden",
        className,
      )}
    >
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th className="p-3 text-left text-xs uppercase tracking-wider text-muted-foreground/55 font-bold">
              Compare
            </th>
            {COLS.map((c) => (
              <th
                key={c.id}
                className={cn(
                  "p-3 text-center align-bottom",
                  c.best && "bg-primary/10",
                )}
              >
                {c.best && (
                  <span className="inline-flex items-center gap-0.5 text-[11px] font-black uppercase text-primary mb-1">
                    <Star className="w-3 h-3 fill-primary" /> Popular
                  </span>
                )}
                <div className="text-sm font-bold">{c.name}</div>
                <div className="text-xs text-muted-foreground/60">{c.price}</div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {ROWS.map((r, ri) => (
            <tr key={r.label} className={cn(ri % 2 === 1 && "bg-foreground/[0.015]")}>
              <td className="p-3 text-sm font-medium text-muted-foreground/80">
                {r.label}
              </td>
              {r.values.map((v, vi) => (
                <td
                  key={vi}
                  className={cn(
                    "p-3 text-center",
                    COLS[vi].best && "bg-primary/[0.06]",
                  )}
                >
                  <Cell value={v} />
                </td>
              ))}
            </tr>
          ))}
          <tr>
            <td className="p-3" />
            {COLS.map((c) => (
              <td
                key={c.id}
                className={cn("p-3 text-center", c.best && "bg-primary/[0.06]")}
              >
                <button
                  type="button"
                  className={cn(
                    "w-full py-1.5 rounded-lg text-xs font-bold transition-all",
                    c.best
                      ? "bg-primary text-primary-foreground hover:opacity-90"
                      : "bg-secondary text-foreground hover:bg-secondary/70",
                  )}
                >
                  Choose
                </button>
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
}

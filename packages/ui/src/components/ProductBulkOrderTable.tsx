"use client";

import React, { useState } from "react";
import { Minus, Plus } from "lucide-react";
import { cn } from "../lib/cn";

type Sku = {
  sku: string;
  variant: string;
  unit: number;
  stock: number;
};

const ROWS: Sku[] = [
  { sku: "TS-BLK-S", variant: "Tee · Black · S", unit: 18, stock: 120 },
  { sku: "TS-BLK-M", variant: "Tee · Black · M", unit: 18, stock: 86 },
  { sku: "TS-WHT-M", variant: "Tee · White · M", unit: 18, stock: 54 },
  { sku: "TS-WHT-L", variant: "Tee · White · L", unit: 18, stock: 9 },
];

export interface ProductBulkOrderTableProps {
  className?: string;
}

export function ProductBulkOrderTable({ className }: ProductBulkOrderTableProps) {
  const [qty, setQty] = useState<Record<string, number>>({
    "TS-BLK-S": 12,
    "TS-BLK-M": 24,
    "TS-WHT-M": 0,
    "TS-WHT-L": 0,
  });

  const setVal = (sku: string, next: number, max: number) =>
    setQty((q) => ({ ...q, [sku]: Math.max(0, Math.min(max, next)) }));

  const units = ROWS.reduce((s, r) => s + (qty[r.sku] || 0), 0);
  const total = ROWS.reduce((s, r) => s + (qty[r.sku] || 0) * r.unit, 0);

  return (
    <div
      className={cn(
        "w-full max-w-md bg-card/45 backdrop-blur-xl border border-border/50 rounded-2xl shadow-xl font-sans text-foreground overflow-hidden",
        className,
      )}
    >
      <div className="px-4 py-3 border-b border-border/40">
        <h3 className="text-base font-bold">Bulk order</h3>
        <p className="text-xs text-muted-foreground/60">
          Set quantity per SKU · 10% off over 50 units
        </p>
      </div>

      <table className="w-full border-collapse">
        <thead>
          <tr className="text-[11px] uppercase tracking-wider text-muted-foreground/50 font-bold">
            <th className="px-4 py-2 text-left">Variant</th>
            <th className="px-2 py-2 text-center">Qty</th>
            <th className="px-4 py-2 text-right">Subtotal</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border/30">
          {ROWS.map((r) => {
            const v = qty[r.sku] || 0;
            const low = r.stock <= 10;
            return (
              <tr key={r.sku}>
                <td className="px-4 py-2.5">
                  <div className="text-sm font-semibold">{r.variant}</div>
                  <div className="text-xs text-muted-foreground/50 font-mono">
                    {r.sku} ·{" "}
                    <span className={cn(low && "text-amber-400")}>
                      {r.stock} in stock
                    </span>
                  </div>
                </td>
                <td className="px-2 py-2.5">
                  <div className="flex items-center justify-center gap-1">
                    <button
                      type="button"
                      aria-label={`Decrease ${r.variant}`}
                      onClick={() => setVal(r.sku, v - 1, r.stock)}
                      disabled={v <= 0}
                      className="h-7 w-7 rounded-lg bg-secondary flex items-center justify-center hover:bg-secondary/70 disabled:opacity-30 transition-colors"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <input
                      type="text"
                      inputMode="numeric"
                      aria-label={`Quantity for ${r.variant}`}
                      value={v}
                      onChange={(e) =>
                        setVal(r.sku, parseInt(e.target.value) || 0, r.stock)
                      }
                      className="w-10 h-7 text-center text-sm font-bold bg-foreground/[0.03] border border-foreground/[0.06] rounded-lg focus:outline-none focus:border-primary/40"
                    />
                    <button
                      type="button"
                      aria-label={`Increase ${r.variant}`}
                      onClick={() => setVal(r.sku, v + 1, r.stock)}
                      disabled={v >= r.stock}
                      className="h-7 w-7 rounded-lg bg-secondary flex items-center justify-center hover:bg-secondary/70 disabled:opacity-30 transition-colors"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </td>
                <td className="px-4 py-2.5 text-right text-sm font-bold tabular-nums">
                  ${(v * r.unit).toLocaleString()}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <div className="flex items-center justify-between px-4 py-3 border-t border-border/40 bg-foreground/[0.02]">
        <span className="text-xs text-muted-foreground/65">
          {units} units
        </span>
        <span className="text-lg font-black tabular-nums">
          ${total.toLocaleString()}
        </span>
      </div>
    </div>
  );
}

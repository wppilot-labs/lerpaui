"use client";

import React, { useState } from "react";
import { ChevronRight } from "lucide-react";
import { cn } from "../lib/cn";

type Row = {
  id: string;
  name: string;
  total: string;
  items: { label: string; qty: number; price: string }[];
};

const ROWS: Row[] = [
  {
    id: "o1",
    name: "Order #4821",
    total: "$129.00",
    items: [
      { label: "Wireless Mouse", qty: 1, price: "$49.00" },
      { label: "USB-C Hub", qty: 2, price: "$40.00" },
    ],
  },
  {
    id: "o2",
    name: "Order #4822",
    total: "$79.00",
    items: [{ label: "Desk Mat", qty: 1, price: "$79.00" }],
  },
  {
    id: "o3",
    name: "Order #4823",
    total: "$320.00",
    items: [
      { label: "Monitor Arm", qty: 1, price: "$120.00" },
      { label: "Webcam Pro", qty: 2, price: "$200.00" },
    ],
  },
];

export interface DataTableRowExpansionProps {
  className?: string;
}

export function DataTableRowExpansion({ className }: DataTableRowExpansionProps) {
  const [expanded, setExpanded] = useState<string | null>("o1");

  return (
    <div className={cn("w-full max-w-md bg-card/45 backdrop-blur-xl border border-border/50 p-5 rounded-2xl shadow-xl font-sans text-foreground", className)}>
      <h3 className="text-base font-bold mb-4">Orders</h3>
      <div className="overflow-hidden rounded-xl border border-foreground/[0.05]">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-foreground/[0.02] text-[11px] uppercase font-bold text-muted-foreground/50 tracking-wider">
              <th scope="col" className="px-4 py-2.5 w-10" />
              <th scope="col" className="px-4 py-2.5">Order</th>
              <th scope="col" className="px-4 py-2.5 text-right">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-foreground/[0.04] text-sm">
            {ROWS.map((r) => {
              const open = expanded === r.id;
              return (
                <React.Fragment key={r.id}>
                  <tr className="hover:bg-foreground/[0.02] transition-colors">
                    <td className="px-4 py-3">
                      <button
                        type="button"
                        aria-expanded={open}
                        aria-label={open ? `Collapse ${r.name}` : `Expand ${r.name}`}
                        onClick={() => setExpanded(open ? null : r.id)}
                        className="text-muted-foreground/50 hover:text-foreground transition-colors"
                      >
                        <ChevronRight className={cn("w-4 h-4 transition-transform", open && "rotate-90")} />
                      </button>
                    </td>
                    <td className="px-4 py-3 font-semibold tabular-nums">{r.name}</td>
                    <td className="px-4 py-3 text-right tabular-nums">{r.total}</td>
                  </tr>
                  {open && (
                    <tr className="bg-foreground/[0.04]">
                      <td />
                      <td colSpan={2} className="px-4 py-3">
                        <div className="space-y-1.5">
                          {r.items.map((it) => (
                            <div key={it.label} className="flex items-center justify-between text-xs">
                              <span className="text-muted-foreground/70">
                                {it.label} <span className="text-muted-foreground/40">× {it.qty}</span>
                              </span>
                              <span className="tabular-nums text-muted-foreground/60">{it.price}</span>
                            </div>
                          ))}
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

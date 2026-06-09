"use client";

import React from "react";
import { Check } from "lucide-react";
import { cn } from "../lib/cn";

const PLANS = [
  { id: "free", name: "Free", price: "$0" },
  { id: "team", name: "Team", price: "$24", featured: true },
  { id: "ent", name: "Enterprise", price: "Custom" },
];

type Row = { label: string; values: (string | boolean)[] };

const ROWS: Row[] = [
  { label: "Seats included", values: ["1", "10", "Unlimited"] },
  { label: "Projects", values: ["3", "Unlimited", "Unlimited"] },
  { label: "Storage", values: ["1 GB", "100 GB", "1 TB"] },
  { label: "Priority support", values: [false, true, true] },
  { label: "SSO / SAML", values: [false, false, true] },
];

export interface PricingComparisonTableProps {
  className?: string;
}

export function PricingComparisonTable({ className }: PricingComparisonTableProps) {
  return (
    <div
      className={cn(
        "w-full max-w-lg bg-card border border-border rounded-2xl shadow-sm font-sans text-foreground overflow-hidden",
        className,
      )}
    >
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th className="p-4 text-left text-[11px] uppercase tracking-wider text-muted-foreground font-bold">
              Plans
            </th>
            {PLANS.map((p) => (
              <th
                key={p.id}
                className={cn(
                  "p-4 text-center",
                  p.featured && "bg-primary/10",
                )}
              >
                <div className="text-sm font-bold">{p.name}</div>
                <div className="text-lg font-black mt-0.5">{p.price}</div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {ROWS.map((r) => (
            <tr key={r.label}>
              <td className="p-4 text-sm font-medium text-muted-foreground">
                {r.label}
              </td>
              {r.values.map((v, i) => (
                <td
                  key={i}
                  className={cn(
                    "p-4 text-center text-sm",
                    PLANS[i].featured && "bg-primary/[0.06]",
                  )}
                >
                  {typeof v === "boolean" ? (
                    v ? (
                      <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 mx-auto" />
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )
                  ) : (
                    <span className="font-semibold">{v}</span>
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

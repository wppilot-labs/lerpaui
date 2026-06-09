"use client";

import React from "react";
import { Check, X } from "lucide-react";
import { cn } from "../lib/cn";

const PLANS = ["Basic", "Plus", "Pro", "Max"];

type Feature = { label: string; cells: boolean[] };

const FEATURES: Feature[] = [
  { label: "Custom domain", cells: [true, true, true, true] },
  { label: "Email support", cells: [true, true, true, true] },
  { label: "Advanced analytics", cells: [false, true, true, true] },
  { label: "A/B testing", cells: [false, false, true, true] },
  { label: "Team roles", cells: [false, true, true, true] },
  { label: "API access", cells: [false, false, true, true] },
  { label: "Dedicated manager", cells: [false, false, false, true] },
  { label: "Custom SLA", cells: [false, false, false, true] },
];

export interface PricingFeatureMatrixProps {
  className?: string;
}

export function PricingFeatureMatrix({ className }: PricingFeatureMatrixProps) {
  return (
    <div
      className={cn(
        "w-full max-w-xl bg-card border border-border rounded-2xl shadow-sm font-sans text-foreground overflow-hidden",
        className,
      )}
    >
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-border">
            <th className="p-3.5 text-left text-[11px] uppercase tracking-wider text-muted-foreground font-bold">
              Feature
            </th>
            {PLANS.map((p) => (
              <th
                key={p}
                className="p-3.5 text-center text-sm font-bold w-16"
              >
                {p}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {FEATURES.map((f, ri) => (
            <tr
              key={f.label}
              className={cn(ri % 2 === 1 && "bg-foreground/[0.02]")}
            >
              <td className="p-3.5 text-sm font-medium text-muted-foreground">
                {f.label}
              </td>
              {f.cells.map((on, ci) => (
                <td key={ci} className="p-3.5 text-center">
                  {on ? (
                    <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/15 mx-auto">
                      <Check className="w-3 h-3 text-emerald-600 dark:text-emerald-400" strokeWidth={3} />
                    </span>
                  ) : (
                    <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-foreground/[0.05] mx-auto">
                      <X className="w-3 h-3 text-muted-foreground" strokeWidth={3} />
                    </span>
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

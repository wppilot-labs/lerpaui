"use client";

import React from "react";
import { Check, Minus } from "lucide-react";
import { cn } from "../lib/cn";

type Row = {
  feature: string;
  us: boolean;
  them: boolean;
};

const ROWS: Row[] = [
  { feature: "Unlimited projects", us: true, them: false },
  { feature: "Real-time collaboration", us: true, them: true },
  { feature: "Advanced analytics", us: true, them: false },
  { feature: "24/7 priority support", us: true, them: false },
  { feature: "Single sign-on (SSO)", us: true, them: true },
  { feature: "No per-seat pricing", us: true, them: false },
];

function Cell({ on, highlight }: { on: boolean; highlight?: boolean }) {
  return (
    <div className="flex justify-center">
      {on ? (
        <span
          className={cn(
            "flex h-6 w-6 items-center justify-center rounded-full",
            highlight ? "bg-primary/20 text-primary" : "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
          )}
        >
          <Check className="h-3.5 w-3.5" />
        </span>
      ) : (
        <Minus className="h-4 w-4 text-muted-foreground/30" />
      )}
    </div>
  );
}

export interface ComparisonCompetitorTableProps {
  className?: string;
}

export function ComparisonCompetitorTable({ className }: ComparisonCompetitorTableProps) {
  return (
    <div
      className={cn(
        "w-full max-w-lg bg-card/45 backdrop-blur-xl border border-border/50 rounded-2xl shadow-xl font-sans text-foreground overflow-hidden",
        className,
      )}
    >
      <table className="w-full border-collapse text-left">
        <thead>
          <tr className="border-b border-foreground/[0.06]">
            <th className="px-4 py-3 text-xs font-semibold text-muted-foreground/60">Feature</th>
            <th className="px-4 py-3 text-center text-xs font-bold text-primary">Us</th>
            <th className="px-4 py-3 text-center text-xs font-semibold text-muted-foreground/60">
              Others
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-foreground/[0.04]">
          {ROWS.map((row) => (
            <tr key={row.feature} className="transition-colors hover:bg-foreground/[0.02]">
              <td className="px-4 py-3 text-sm text-foreground/90">{row.feature}</td>
              <td className="px-4 py-3 bg-primary/[0.04]">
                <Cell on={row.us} highlight />
              </td>
              <td className="px-4 py-3">
                <Cell on={row.them} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

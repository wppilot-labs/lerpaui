"use client";

import React from "react";
import { Route, ArrowDown, MousePointerClick, FileText, ShoppingCart, CreditCard, CheckCircle2 } from "lucide-react";
import { cn } from "../lib/cn";

type Step = {
  label: string;
  Icon: typeof FileText;
  users: number;
};

const STEPS: Step[] = [
  { label: "Landing page", Icon: MousePointerClick, users: 12400 },
  { label: "Product viewed", Icon: FileText, users: 7820 },
  { label: "Added to cart", Icon: ShoppingCart, users: 3140 },
  { label: "Checkout started", Icon: CreditCard, users: 1680 },
  { label: "Purchase", Icon: CheckCircle2, users: 1024 },
];

export interface AnalyticsConversionPathViewerProps {
  className?: string;
}

export function AnalyticsConversionPathViewer({ className }: AnalyticsConversionPathViewerProps) {
  const first = STEPS[0].users;

  return (
    <div
      className={cn(
        "w-full max-w-md bg-card border border-border p-5 rounded-2xl shadow-sm font-sans text-foreground",
        className,
      )}
    >
      <div className="flex items-center gap-2 mb-4">
        <Route className="w-4 h-4 text-primary" />
        <h3 className="text-base font-bold">Conversion path</h3>
        <span className="ml-auto text-xs text-emerald-600 dark:text-emerald-400 font-semibold tabular-nums">
          {((STEPS[STEPS.length - 1].users / first) * 100).toFixed(1)}% end-to-end
        </span>
      </div>

      <ol>
        {STEPS.map((s, i) => {
          const pct = (s.users / first) * 100;
          const prev = i === 0 ? null : STEPS[i - 1].users;
          const drop = prev ? Math.round((1 - s.users / prev) * 100) : 0;
          return (
            <li key={s.label}>
              <div className="flex items-center gap-3 p-3 rounded-xl bg-muted border border-border">
                <span className="w-9 h-9 rounded-lg bg-primary/10 text-primary grid place-items-center shrink-0">
                  <s.Icon className="w-4 h-4" />
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline justify-between gap-2">
                    <span className="text-xs font-semibold truncate">{s.label}</span>
                    <span className="text-sm font-bold tabular-nums">
                      {s.users.toLocaleString()}
                    </span>
                  </div>
                  <div className="mt-1.5 h-1.5 rounded-full bg-foreground/[0.06] overflow-hidden">
                    <div
                      className="h-full rounded-full bg-primary"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              </div>
              {i < STEPS.length - 1 && (
                <div className="flex items-center justify-center gap-1 py-1 text-[11px] text-muted-foreground">
                  <ArrowDown className="w-3 h-3" />
                  <span className="text-amber-600 dark:text-amber-400 font-semibold tabular-nums">
                    -{drop}% drop-off
                  </span>
                </div>
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
}

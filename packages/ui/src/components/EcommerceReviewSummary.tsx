"use client";

import React from "react";
import { Star } from "lucide-react";
import { cn } from "../lib/cn";

const DIST = [
  { stars: 5, count: 982 },
  { stars: 4, count: 341 },
  { stars: 3, count: 96 },
  { stars: 2, count: 28 },
  { stars: 1, count: 41 },
];

export interface EcommerceReviewSummaryProps {
  className?: string;
}

export function EcommerceReviewSummary({ className }: EcommerceReviewSummaryProps) {
  const total = DIST.reduce((a, d) => a + d.count, 0);
  const avg = DIST.reduce((a, d) => a + d.stars * d.count, 0) / total;

  return (
    <div className={cn("w-full max-w-md bg-card/45 backdrop-blur-xl border border-border/50 p-5 rounded-2xl shadow-xl font-sans text-foreground", className)}>
      <h3 className="text-base font-bold">Customer reviews</h3>

      <div className="flex items-center gap-4 mt-3">
        <div className="text-center shrink-0">
          <div className="text-4xl font-bold leading-none">{avg.toFixed(1)}</div>
          <div className="inline-flex items-center gap-0.5 mt-1.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={cn("w-4 h-4", i < Math.round(avg) ? "fill-amber-400 text-amber-400" : "fill-none text-muted-foreground/30")}
              />
            ))}
          </div>
          <div className="text-xs text-muted-foreground/55 mt-1.5">{total.toLocaleString()} ratings</div>
        </div>

        <div className="flex-1 space-y-1.5">
          {DIST.map((d) => {
            const pct = Math.round((d.count / total) * 100);
            return (
              <div key={d.stars} className="flex items-center gap-2">
                <span className="w-7 text-xs text-muted-foreground/70 tabular-nums shrink-0">{d.stars}★</span>
                <div className="flex-1 h-2 rounded-full bg-foreground/[0.05] overflow-hidden">
                  <div className="h-full rounded-full bg-amber-400" style={{ width: `${pct}%` }} />
                </div>
                <span className="w-8 text-right text-xs text-muted-foreground/50 tabular-nums shrink-0">{pct}%</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

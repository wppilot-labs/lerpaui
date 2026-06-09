"use client";

import React from "react";
import { Star } from "lucide-react";
import { cn } from "../lib/cn";

type Bucket = { stars: number; count: number };

const BUCKETS: Bucket[] = [
  { stars: 5, count: 824 },
  { stars: 4, count: 311 },
  { stars: 3, count: 92 },
  { stars: 2, count: 28 },
  { stars: 1, count: 19 },
];

export interface SellerRatingBreakdownProps {
  className?: string;
}

export function SellerRatingBreakdown({ className }: SellerRatingBreakdownProps) {
  const total = BUCKETS.reduce((sum, b) => sum + b.count, 0);
  const average =
    BUCKETS.reduce((sum, b) => sum + b.stars * b.count, 0) / Math.max(total, 1);

  return (
    <div
      className={cn(
        "w-full max-w-md bg-card/45 backdrop-blur-xl border border-border/50 p-5 rounded-2xl shadow-xl font-sans text-foreground",
        className,
      )}
    >
      <h3 className="text-base font-bold mb-4">Customer ratings</h3>

      <div className="flex items-center gap-4 mb-5">
        <div className="text-center">
          <div className="text-3xl font-black leading-none">{average.toFixed(1)}</div>
          <div className="mt-1 flex justify-center gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={cn(
                  "w-4 h-4",
                  i < Math.round(average)
                    ? "fill-amber-400 text-amber-400"
                    : "text-muted-foreground/30",
                )}
              />
            ))}
          </div>
          <div className="mt-1 text-[11px] text-muted-foreground/55">
            {total.toLocaleString()} reviews
          </div>
        </div>

        <div className="flex-1 space-y-1.5">
          {BUCKETS.map((b) => {
            const pct = total ? Math.round((b.count / total) * 100) : 0;
            return (
              <div key={b.stars} className="flex items-center gap-2">
                <span className="flex w-6 shrink-0 items-center gap-0.5 text-xs text-muted-foreground/70">
                  {b.stars}
                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                </span>
                <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-foreground/[0.06]">
                  <div
                    className="h-full rounded-full bg-amber-400"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <span className="w-8 shrink-0 text-right text-[11px] tabular-nums text-muted-foreground/55">
                  {pct}%
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

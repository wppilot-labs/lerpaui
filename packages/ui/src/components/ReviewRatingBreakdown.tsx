"use client";

import React from "react";
import { Star } from "lucide-react";
import { cn } from "../lib/cn";

type Row = { stars: number; count: number };

const ROWS: Row[] = [
  { stars: 5, count: 902 },
  { stars: 4, count: 241 },
  { stars: 3, count: 88 },
  { stars: 2, count: 33 },
  { stars: 1, count: 20 },
];

export interface ReviewRatingBreakdownProps {
  className?: string;
}

export function ReviewRatingBreakdown({ className }: ReviewRatingBreakdownProps) {
  const total = ROWS.reduce((sum, r) => sum + r.count, 0);
  const avg = ROWS.reduce((sum, r) => sum + r.stars * r.count, 0) / total;

  return (
    <div
      className={cn(
        "w-full max-w-sm rounded-2xl border border-border/50 bg-card/60 p-5 font-sans text-foreground shadow-xl backdrop-blur-xl",
        className,
      )}
    >
      <div className="mb-4 flex items-center gap-4">
        <div className="text-center">
          <div className="text-4xl font-black leading-none">{avg.toFixed(1)}</div>
          <div className="mt-1.5 flex justify-center gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={cn(
                  "h-4 w-4",
                  i < Math.round(avg) ? "fill-amber-400 text-amber-400" : "fill-foreground/15 text-foreground/15",
                )}
              />
            ))}
          </div>
          <div className="mt-1.5 text-xs text-muted-foreground/50">{total.toLocaleString()} reviews</div>
        </div>

        <div className="flex-1 space-y-1.5">
          {ROWS.map((r) => {
            const pct = Math.round((r.count / total) * 100);
            return (
              <div key={r.stars} className="flex items-center gap-2">
                <span className="flex w-6 items-center gap-0.5 text-xs font-medium text-muted-foreground/70">
                  {r.stars}
                  <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                </span>
                <div
                  className="h-2.5 flex-1 overflow-hidden rounded-full bg-foreground/[0.06]"
                  role="progressbar"
                  aria-valuenow={pct}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label={`${r.stars} star reviews`}
                >
                  <div className="h-full rounded-full bg-amber-400" style={{ width: `${pct}%` }} />
                </div>
                <span className="w-8 text-right text-xs tabular-nums text-muted-foreground/50">{pct}%</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

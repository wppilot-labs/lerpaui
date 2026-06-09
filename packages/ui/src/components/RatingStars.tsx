"use client";

import React, { useState } from "react";
import { Star } from "lucide-react";
import { cn } from "../lib/cn";

export interface RatingStarsProps {
  max?: number;
  defaultValue?: number;
  onChange?: (value: number) => void;
  className?: string;
}

/**
 * Accessible interactive star rating — hover preview, click/keyboard select.
 * Production scale, theme-aware. Radiogroup semantics.
 */
export function RatingStars({ max = 5, defaultValue = 0, onChange, className }: RatingStarsProps) {
  const [value, setValue] = useState(defaultValue);
  const [hover, setHover] = useState(0);
  const shown = hover || value;

  const set = (v: number) => {
    setValue(v);
    onChange?.(v);
  };

  return (
    <div className={cn("inline-flex flex-col gap-1.5", className)}>
      <div role="radiogroup" aria-label="Rating" tabIndex={-1} className="flex items-center gap-1" onMouseLeave={() => setHover(0)}>
        {Array.from({ length: max }, (_, i) => i + 1).map((v) => {
          const filled = v <= shown;
          return (
            <button
              key={v}
              type="button"
              role="radio"
              aria-checked={value === v}
              aria-label={`${v} star${v > 1 ? "s" : ""}`}
              onMouseEnter={() => setHover(v)}
              onClick={() => set(v)}
              onKeyDown={(e) => {
                if (e.key === "ArrowRight") { e.preventDefault(); set(Math.min(max, value + 1)); }
                if (e.key === "ArrowLeft") { e.preventDefault(); set(Math.max(1, value - 1)); }
              }}
              className="rounded-md p-0.5 transition-transform hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <Star
                className={cn(
                  "h-6 w-6 transition-colors",
                  filled ? "fill-amber-400 text-amber-400" : "fill-transparent text-muted-foreground/40",
                )}
              />
            </button>
          );
        })}
      </div>
      <span className="text-xs text-muted-foreground">{value ? `${value} of ${max}` : "Tap to rate"}</span>
    </div>
  );
}

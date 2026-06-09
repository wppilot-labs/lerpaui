"use client";

import React, { useState } from "react";
import { Star } from "lucide-react";
import { cn } from "../lib/cn";

type Filter = { id: string; label: string; count: number };

const FILTERS: Filter[] = [
  { id: "all", label: "All", count: 1284 },
  { id: "5", label: "5", count: 902 },
  { id: "4", label: "4", count: 241 },
  { id: "3", label: "3", count: 88 },
  { id: "2", label: "2", count: 33 },
  { id: "1", label: "1", count: 20 },
];

export interface ReviewFilterTabsProps {
  className?: string;
}

export function ReviewFilterTabs({ className }: ReviewFilterTabsProps) {
  const [active, setActive] = useState("all");

  return (
    <div
      className={cn(
        "w-full max-w-md rounded-2xl border border-border/50 bg-card/60 p-4 font-sans text-foreground shadow-xl backdrop-blur-xl",
        className,
      )}
    >
      <div className="mb-2.5 text-xs font-bold uppercase tracking-wider text-muted-foreground/50">
        Filter reviews
      </div>
      <div role="tablist" aria-label="Filter reviews by rating" className="flex flex-wrap gap-1.5">
        {FILTERS.map((f) => {
          const isActive = active === f.id;
          return (
            <button
              key={f.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => setActive(f.id)}
              className={cn(
                "flex items-center gap-1 rounded-full border px-3 py-1.5 text-sm font-semibold transition-colors",
                isActive
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-foreground/[0.06] text-muted-foreground/70 hover:bg-foreground/[0.04] hover:text-foreground",
              )}
            >
              {f.id !== "all" && <Star className={cn("h-3.5 w-3.5", isActive ? "fill-primary" : "fill-amber-400/70 text-amber-400/70")} />}
              <span>{f.label}</span>
              <span className={cn("text-xs", isActive ? "text-primary/70" : "text-muted-foreground/40")}>
                ({f.count})
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

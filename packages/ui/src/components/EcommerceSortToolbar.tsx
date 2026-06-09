"use client";

import React, { useState } from "react";
import { ArrowDownWideNarrow, Check } from "lucide-react";
import { cn } from "../lib/cn";

const SORTS = [
  { id: "relevance", label: "Relevance" },
  { id: "newest", label: "Newest" },
  { id: "rating", label: "Rating" },
  { id: "price-asc", label: "Price ↑" },
  { id: "price-desc", label: "Price ↓" },
];

const PER_PAGE = [24, 48, 96];

export interface EcommerceSortToolbarProps {
  className?: string;
}

export function EcommerceSortToolbar({ className }: EcommerceSortToolbarProps) {
  const [sort, setSort] = useState("relevance");
  const [perPage, setPerPage] = useState(24);

  return (
    <div className={cn("w-full max-w-2xl bg-card/45 backdrop-blur-xl border border-border/50 p-3 rounded-2xl shadow-xl font-sans text-foreground", className)}>
      <div className="flex flex-wrap items-center gap-3">
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground/70">
          <ArrowDownWideNarrow className="w-4 h-4" /> Sort by
        </span>

        <div className="flex flex-wrap items-center gap-1.5">
          {SORTS.map((s) => (
            <button
              key={s.id}
              type="button"
              aria-pressed={sort === s.id}
              onClick={() => setSort(s.id)}
              className={cn(
                "inline-flex items-center gap-1 text-xs font-medium rounded-full px-3 py-1.5 border transition",
                sort === s.id ? "bg-primary text-primary-foreground border-primary" : "border-foreground/[0.1] bg-foreground/[0.03] text-muted-foreground hover:text-foreground hover:border-foreground/25",
              )}
            >
              {sort === s.id && <Check className="w-3.5 h-3.5" />}
              {s.label}
            </button>
          ))}
        </div>

        <div className="ml-auto flex items-center gap-2">
          <label htmlFor="per-page" className="text-xs text-muted-foreground/55">Per page</label>
          <select
            id="per-page"
            value={perPage}
            onChange={(e) => setPerPage(Number(e.target.value))}
            className="text-xs font-medium rounded-lg border border-foreground/[0.1] bg-foreground/[0.03] px-2 py-1.5 focus:ring-1 focus:ring-primary/50 focus:outline-none"
          >
            {PER_PAGE.map((n) => (
              <option key={n} value={n} className="bg-card text-foreground">{n}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}

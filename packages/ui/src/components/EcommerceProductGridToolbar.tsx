"use client";

import React, { useState } from "react";
import { LayoutGrid, Rows3, ChevronDown, SlidersHorizontal } from "lucide-react";
import { cn } from "../lib/cn";

const SORTS = ["Featured", "Newest", "Price: low to high", "Price: high to low", "Top rated"];

export interface EcommerceProductGridToolbarProps {
  className?: string;
}

export function EcommerceProductGridToolbar({ className }: EcommerceProductGridToolbarProps) {
  const [view, setView] = useState<"grid" | "rows">("grid");
  const [open, setOpen] = useState(false);
  const [sort, setSort] = useState(SORTS[0]);

  return (
    <div className={cn("w-full max-w-2xl bg-card/45 backdrop-blur-xl border border-border/50 p-3 rounded-2xl shadow-xl font-sans text-foreground", className)}>
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="inline-flex items-center gap-1.5 text-xs font-medium rounded-lg border border-foreground/[0.1] bg-foreground/[0.03] px-2.5 py-1.5 hover:border-foreground/25 transition sm:hidden"
          >
            <SlidersHorizontal className="w-4 h-4" /> Filters
          </button>
          <span className="text-xs text-muted-foreground/60">
            Showing <span className="text-foreground font-semibold">1–24</span> of 312
          </span>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <button
              type="button"
              aria-haspopup="listbox"
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
              className="inline-flex items-center gap-1.5 text-xs font-medium rounded-lg border border-foreground/[0.1] bg-foreground/[0.03] px-2.5 py-1.5 hover:border-foreground/25 transition"
            >
              <span className="text-muted-foreground/55">Sort:</span> {sort}
              <ChevronDown className={cn("w-4 h-4 transition", open && "rotate-180")} />
            </button>
            {open && (
              <ul
                role="listbox"
                className="absolute right-0 z-10 mt-1 w-48 rounded-lg border border-foreground/[0.08] bg-card/95 backdrop-blur-xl shadow-xl p-1"
              >
                {SORTS.map((s) => (
                  <li key={s}>
                    <button
                      type="button"
                      role="option"
                      aria-selected={s === sort}
                      onClick={() => {
                        setSort(s);
                        setOpen(false);
                      }}
                      className={cn(
                        "w-full text-left text-xs rounded-md px-2.5 py-1.5 transition",
                        s === sort ? "bg-primary/15 text-primary" : "text-muted-foreground/80 hover:bg-foreground/[0.04] hover:text-foreground",
                      )}
                    >
                      {s}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="inline-flex rounded-lg border border-foreground/[0.1] bg-foreground/[0.03] p-0.5" role="group" aria-label="View layout">
            <button
              type="button"
              aria-label="Grid view"
              aria-pressed={view === "grid"}
              onClick={() => setView("grid")}
              className={cn("h-8 w-8 rounded-md flex items-center justify-center transition", view === "grid" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground")}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              type="button"
              aria-label="List view"
              aria-pressed={view === "rows"}
              onClick={() => setView("rows")}
              className={cn("h-8 w-8 rounded-md flex items-center justify-center transition", view === "rows" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground")}
            >
              <Rows3 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

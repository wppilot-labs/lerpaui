"use client";

import React from "react";
import { ChevronRight, SlidersHorizontal } from "lucide-react";
import { cn } from "../lib/cn";

const CRUMBS = ["Home", "Men", "Outerwear"];
const PILLS = ["Jackets", "Coats", "Vests", "Parkas", "Windbreakers"];

export interface EcommerceCategoryHeaderProps {
  className?: string;
}

export function EcommerceCategoryHeader({ className }: EcommerceCategoryHeaderProps) {
  return (
    <div className={cn("w-full max-w-2xl bg-card/45 backdrop-blur-xl border border-border/50 p-5 rounded-2xl shadow-xl font-sans text-foreground overflow-hidden", className)}>
      <nav aria-label="Breadcrumb">
        <ol className="flex items-center gap-1 text-xs text-muted-foreground/55">
          {CRUMBS.map((c, i) => (
            <li key={c} className="flex items-center gap-1">
              {i > 0 && <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/30" />}
              <span className={cn(i === CRUMBS.length - 1 && "text-foreground font-medium")}>{c}</span>
            </li>
          ))}
        </ol>
      </nav>

      <div className="relative mt-3 rounded-xl border border-foreground/[0.06] bg-gradient-to-r from-indigo-500/20 via-violet-500/10 to-transparent p-5">
        <h1 className="text-2xl font-bold">Men&apos;s Outerwear</h1>
        <p className="text-sm text-muted-foreground/70 mt-1 max-w-sm">
          Weatherproof shells, insulated parkas, and everyday jackets built for the commute and the trail.
        </p>
        <span className="inline-block mt-3 text-xs text-muted-foreground/60">128 products</span>
      </div>

      <div className="flex items-center gap-2 mt-4 overflow-x-auto pb-1">
        <button
          type="button"
          className="inline-flex items-center gap-1.5 shrink-0 text-xs font-medium rounded-full border border-foreground/[0.1] bg-foreground/[0.03] px-3 py-1.5 hover:border-foreground/25 transition"
        >
          <SlidersHorizontal className="w-3.5 h-3.5" /> Filters
        </button>
        {PILLS.map((p, i) => (
          <button
            key={p}
            type="button"
            aria-pressed={i === 0}
            className={cn(
              "shrink-0 text-xs font-medium rounded-full px-3 py-1.5 border transition",
              i === 0 ? "bg-primary text-primary-foreground border-primary" : "border-foreground/[0.1] bg-foreground/[0.03] text-muted-foreground hover:text-foreground hover:border-foreground/25",
            )}
          >
            {p}
          </button>
        ))}
      </div>
    </div>
  );
}

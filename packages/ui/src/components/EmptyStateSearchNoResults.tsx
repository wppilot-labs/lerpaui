"use client";

import React, { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Search, X, Filter, Sparkles, ArrowRight } from "lucide-react";
import { cn } from "../lib/cn";

export interface EmptyStateSearchNoResultsProps {
  className?: string;
  query?: string;
  suggestions?: string[];
  appliedFilters?: string[];
}

export function EmptyStateSearchNoResults({
  className,
  query = "macbook pro m4 max 16inch space black",
  suggestions = ["MacBook Pro 16", "M4 Max", "Apple laptops", "16-inch displays"],
  appliedFilters = ["In stock", "Under $4,000", "Released 2024+"],
}: EmptyStateSearchNoResultsProps) {
  const reduced = useReducedMotion();
  const [activeQuery, setActiveQuery] = useState(query);
  const [filters, setFilters] = useState(appliedFilters);
  const headingId = React.useId();

  return (
    <section
      aria-labelledby={headingId}
      className={cn("relative w-full bg-background px-6 py-16 md:py-24", className)}
    >
      <motion.div
        initial={reduced ? false : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mx-auto max-w-2xl"
      >
        <div className="relative">
          <Search aria-hidden className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            value={activeQuery}
            onChange={(e) => setActiveQuery(e.target.value)}
            aria-label="Search query"
            className="w-full rounded-2xl border border-border bg-card py-4 pl-12 pr-12 text-base text-foreground shadow-sm focus:border-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
          />
          {activeQuery && (
            <button
              type="button"
              onClick={() => setActiveQuery("")}
              aria-label="Clear search"
              className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-muted-foreground hover:bg-foreground/5 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {filters.length > 0 && (
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span className="text-xs uppercase tracking-wider text-muted-foreground">Filters:</span>
            {filters.map((f) => (
              <span key={f} className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-2.5 py-1 text-xs font-medium text-foreground">
                <Filter className="h-3 w-3 text-muted-foreground" aria-hidden />
                {f}
                <button
                  type="button"
                  onClick={() => setFilters((prev) => prev.filter((x) => x !== f))}
                  aria-label={`Remove ${f} filter`}
                  className="ml-0.5 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-3 w-3" aria-hidden />
                </button>
              </span>
            ))}
            <button
              type="button"
              onClick={() => setFilters([])}
              className="text-xs font-semibold text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 rounded"
            >
              Clear all
            </button>
          </div>
        )}

        <div className="mt-10 rounded-2xl border border-border bg-card p-10 text-center shadow-sm transition-shadow hover:shadow-md">
          <motion.div
            animate={reduced ? undefined : { y: [0, -6, 0] }}
            transition={reduced ? undefined : { duration: 3, ease: "easeInOut", repeat: Infinity }}
            className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl border border-border bg-background"
          >
            <Search className="h-9 w-9 text-muted-foreground" aria-hidden />
          </motion.div>

          <h2 id={headingId} className="mt-6 text-2xl font-black tracking-tight text-foreground">
            No results for &ldquo;{activeQuery || "your search"}&rdquo;
          </h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
            Try removing some filters, checking your spelling, or searching for a more general term.
          </p>

          <div className="mt-8">
            <div className="mb-3 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <Sparkles className="h-3.5 w-3.5" aria-hidden />
              Try these instead
            </div>
            <div className="flex flex-wrap justify-center gap-2">
              {suggestions.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setActiveQuery(s)}
                  className="group inline-flex items-center gap-1.5 rounded-xl border border-border bg-background px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                >
                  {s}
                  <ArrowRight className="h-3.5 w-3.5 text-muted-foreground transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none" aria-hidden />
                </button>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

export default EmptyStateSearchNoResults;

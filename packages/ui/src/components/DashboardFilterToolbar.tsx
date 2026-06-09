"use client";

import React, { useState } from "react";
import { Search, Calendar, X } from "lucide-react";
import { cn } from "../lib/cn";

export interface DashboardFilterToolbarProps {
  className?: string;
}

const FILTERS = ["Active", "Trialing", "Past due", "Canceled"];

export function DashboardFilterToolbar({ className }: DashboardFilterToolbarProps) {
  const [query, setQuery] = useState("");
  const [active, setActive] = useState<string[]>(["Active"]);
  const [sort, setSort] = useState("recent");

  const toggle = (filter: string) =>
    setActive((prev) => (prev.includes(filter) ? prev.filter((f) => f !== filter) : [...prev, filter]));

  return (
    <div
      className={cn(
        "w-full rounded-2xl border border-border bg-card p-4 text-card-foreground shadow-sm",
        className,
      )}
    >
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="relative flex-1">
          <label htmlFor="dashboard-filter-search" className="sr-only">
            Search customers
          </label>
          <Search
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <input
            id="dashboard-filter-search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search customers…"
            className="h-10 w-full rounded-lg border border-border bg-background pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          />
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            className="inline-flex h-10 items-center gap-2 rounded-lg border border-border bg-background px-3 text-sm font-medium text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            <Calendar className="h-4 w-4 text-muted-foreground" />
            Last 30 days
          </button>

          <label htmlFor="dashboard-filter-sort" className="sr-only">
            Sort by
          </label>
          <select
            id="dashboard-filter-sort"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="h-10 rounded-lg border border-border bg-background px-3 text-sm font-medium text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            <option value="recent">Most recent</option>
            <option value="name">Name A–Z</option>
            <option value="revenue">Highest revenue</option>
          </select>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        {FILTERS.map((filter) => {
          const isActive = active.includes(filter);
          return (
            <button
              key={filter}
              type="button"
              aria-pressed={isActive}
              onClick={() => toggle(filter)}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "border border-border bg-background text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              {filter}
              {isActive && <X className="h-3 w-3" />}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default DashboardFilterToolbar;

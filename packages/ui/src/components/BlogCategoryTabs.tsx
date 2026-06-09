"use client";

import React, { useState } from "react";
import { cn } from "../lib/cn";

type Category = { key: string; label: string; count: number };

const CATEGORIES: Category[] = [
  { key: "all", label: "All posts", count: 48 },
  { key: "engineering", label: "Engineering", count: 17 },
  { key: "design", label: "Design", count: 12 },
  { key: "product", label: "Product", count: 9 },
  { key: "growth", label: "Growth", count: 6 },
  { key: "culture", label: "Culture", count: 4 },
];

export interface BlogCategoryTabsProps {
  className?: string;
}

export function BlogCategoryTabs({ className }: BlogCategoryTabsProps) {
  const [active, setActive] = useState("all");

  return (
    <div
      className={cn(
        "w-full max-w-xl bg-card/45 backdrop-blur-xl border border-border/50 p-2 rounded-2xl shadow-xl font-sans text-foreground",
        className,
      )}
    >
      <nav aria-label="Blog categories">
        <ul className="flex flex-wrap gap-1.5">
          {CATEGORIES.map((c) => {
            const isActive = active === c.key;
            return (
              <li key={c.key}>
                <button
                  type="button"
                  aria-current={isActive ? "page" : undefined}
                  onClick={() => setActive(c.key)}
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-sm font-semibold transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground",
                  )}
                >
                  {c.label}
                  <span
                    className={cn(
                      "rounded-full px-1.5 text-xs font-bold tabular-nums",
                      isActive
                        ? "bg-primary-foreground/20 text-primary-foreground"
                        : "bg-secondary/60 text-muted-foreground/70",
                    )}
                  >
                    {c.count}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}

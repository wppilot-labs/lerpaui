"use client";

import React from "react";
import { cn } from "../lib/cn";

export interface AvatarStackPerson {
  name: string;
  initials: string;
}

export interface AvatarStackProps {
  people?: AvatarStackPerson[];
  max?: number;
  className?: string;
}

const DEFAULT: AvatarStackPerson[] = [
  { name: "Jane Doe", initials: "JD" },
  { name: "Marcus Lee", initials: "ML" },
  { name: "Priya Patel", initials: "PP" },
  { name: "Alex Kim", initials: "AK" },
  { name: "Sofia Ramos", initials: "SR" },
  { name: "Noah Park", initials: "NP" },
];

const TINTS = ["bg-indigo-500", "bg-emerald-500", "bg-rose-500", "bg-amber-500", "bg-sky-500", "bg-violet-500"];

/**
 * Signature overlapping avatar group with hover spread + overflow count.
 * Production scale, theme-aware, each avatar focusable + labelled.
 */
export function AvatarStack({ people = DEFAULT, max = 4, className }: AvatarStackProps) {
  const shown = people.slice(0, max);
  const extra = people.length - shown.length;

  return (
    <div className={cn("flex items-center", className)}>
      <ul className="flex -space-x-3">
        {shown.map((p, i) => (
          <li key={p.name}>
            <button
              type="button"
              aria-label={p.name}
              title={p.name}
              className={cn(
                "flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold text-white ring-2 ring-background transition-transform hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                TINTS[i % TINTS.length],
              )}
            >
              {p.initials}
            </button>
          </li>
        ))}
        {extra > 0 && (
          <li>
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-sm font-semibold text-muted-foreground ring-2 ring-background">
              +{extra}
            </span>
          </li>
        )}
      </ul>
      <span className="ml-3 text-sm text-muted-foreground">{people.length} collaborators</span>
    </div>
  );
}

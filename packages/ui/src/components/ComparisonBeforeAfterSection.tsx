"use client";

import React from "react";
import { X, Check, ArrowRight } from "lucide-react";
import { cn } from "../lib/cn";

const BEFORE = [
  "Manual spreadsheets across 6 tools",
  "Reports took days to compile",
  "No single source of truth",
  "Constant context switching",
];

const AFTER = [
  "One unified dashboard",
  "Live reports in seconds",
  "Everyone sees the same data",
  "Focused, automated workflows",
];

export interface ComparisonBeforeAfterSectionProps {
  className?: string;
}

export function ComparisonBeforeAfterSection({ className }: ComparisonBeforeAfterSectionProps) {
  return (
    <section
      className={cn(
        "w-full max-w-2xl bg-card/45 backdrop-blur-xl border border-border/50 p-6 rounded-2xl shadow-xl font-sans text-foreground",
        className,
      )}
    >
      <div className="text-center mb-6">
        <h2 className="text-base font-bold">From chaos to clarity</h2>
        <p className="mt-1 text-sm text-muted-foreground/65">See what changes after you switch.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto_1fr] gap-4 items-stretch">
        <div className="rounded-xl border border-red-500/20 bg-red-500/[0.04] p-4">
          <div className="mb-3 text-xs font-bold uppercase tracking-wide text-red-600 dark:text-red-400">Before</div>
          <ul className="space-y-2.5">
            {BEFORE.map((item) => (
              <li key={item} className="flex items-start gap-2 text-sm text-muted-foreground/75">
                <X className="mt-0.5 w-4 h-4 shrink-0 text-red-600 dark:text-red-400" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="hidden sm:flex items-center justify-center">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/15 text-primary">
            <ArrowRight className="w-4 h-4" />
          </span>
        </div>

        <div className="rounded-xl border border-emerald-500/25 bg-emerald-500/[0.05] p-4">
          <div className="mb-3 text-xs font-bold uppercase tracking-wide text-emerald-600 dark:text-emerald-400">After</div>
          <ul className="space-y-2.5">
            {AFTER.map((item) => (
              <li key={item} className="flex items-start gap-2 text-sm text-foreground/90">
                <Check className="mt-0.5 w-4 h-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

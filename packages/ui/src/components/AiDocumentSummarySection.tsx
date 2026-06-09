"use client";

import React from "react";
import { FileText, Sparkles, Clock, ListChecks, Copy } from "lucide-react";
import { cn } from "../lib/cn";

const KEY_POINTS = [
  "Revenue grew 28% YoY, driven by enterprise expansion.",
  "Net retention improved to 114% after the new pricing tiers.",
  "Support volume dropped 19% following the self-serve launch.",
];

const TAGS = ["Finance", "Q3 2024", "Board deck"];

export interface AiDocumentSummarySectionProps {
  className?: string;
}

export function AiDocumentSummarySection({ className }: AiDocumentSummarySectionProps) {
  return (
    <div
      className={cn(
        "w-full max-w-md bg-card/45 backdrop-blur-xl border border-border/50 rounded-2xl shadow-xl p-5 font-sans text-foreground",
        className,
      )}
    >
      <div className="flex items-start gap-3 mb-4">
        <div className="h-10 w-10 shrink-0 grid place-items-center rounded-xl bg-rose-500/15 text-rose-300">
          <FileText className="w-5 h-5" />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="text-base font-bold truncate">Q3-financial-review.pdf</h3>
          <p className="text-xs text-muted-foreground/50 flex items-center gap-2 mt-0.5">
            <span>24 pages</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" /> 6 min read
            </span>
          </p>
        </div>
        <button
          type="button"
          aria-label="Copy summary"
          className="h-8 w-8 grid place-items-center rounded-lg text-muted-foreground/60 hover:bg-foreground/[0.05] transition shrink-0"
        >
          <Copy className="w-4 h-4" />
        </button>
      </div>

      <div className="rounded-xl bg-primary/[0.06] border border-primary/15 p-3 mb-4">
        <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-primary mb-1.5">
          <Sparkles className="w-3.5 h-3.5" /> AI summary
        </div>
        <p className="text-sm leading-relaxed text-foreground/85">
          The quarter beat plan on the back of enterprise growth and improved retention. Margins held steady while
          support costs fell after the self-serve rollout. The team recommends doubling down on upmarket motion in Q4.
        </p>
      </div>

      <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-muted-foreground/45 mb-2">
        <ListChecks className="w-4 h-4" /> Key points
      </div>
      <ul className="space-y-1.5 mb-4">
        {KEY_POINTS.map((p, i) => (
          <li key={i} className="flex gap-2 text-sm leading-relaxed text-foreground/85">
            <span className="mt-0.5 h-5 w-5 shrink-0 grid place-items-center rounded bg-foreground/[0.05] text-[11px] font-bold tabular-nums text-muted-foreground/70">
              {i + 1}
            </span>
            <span>{p}</span>
          </li>
        ))}
      </ul>

      <div className="flex flex-wrap gap-1.5">
        {TAGS.map((t) => (
          <span
            key={t}
            className="text-xs font-medium px-2 py-0.5 rounded-full bg-secondary text-muted-foreground/70"
          >
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}

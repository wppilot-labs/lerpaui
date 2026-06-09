"use client";

import React from "react";
import { Quote, ExternalLink } from "lucide-react";
import { cn } from "../lib/cn";

type Citation = { n: number; title: string; source: string; quote: string };

const CITATIONS: Citation[] = [
  {
    n: 1,
    title: "State of SaaS Retention 2024",
    source: "openviewpartners.com",
    quote: "Median net revenue retention for top-quartile SaaS sits at 120%.",
  },
  {
    n: 2,
    title: "Onboarding & Activation Benchmarks",
    source: "amplitude.com",
    quote: "Products with a guided setup see 2x higher week-1 activation.",
  },
  {
    n: 3,
    title: "Churn Prediction Models",
    source: "arxiv.org",
    quote: "Early engagement signals predict 60% of eventual churn.",
  },
];

export interface AiCitationPanelProps {
  className?: string;
}

export function AiCitationPanel({ className }: AiCitationPanelProps) {
  return (
    <div
      className={cn(
        "w-full max-w-md bg-card/45 backdrop-blur-xl border border-border/50 rounded-2xl shadow-xl p-5 font-sans text-foreground",
        className,
      )}
    >
      <h3 className="text-sm font-bold flex items-center gap-1.5 mb-3">
        <Quote className="w-4 h-4 text-primary" /> Citations
        <span className="ml-auto text-xs font-normal text-muted-foreground/45">{CITATIONS.length} sources</span>
      </h3>

      <ol className="space-y-2">
        {CITATIONS.map((c) => (
          <li
            key={c.n}
            className="flex gap-3 rounded-xl border border-foreground/[0.06] bg-foreground/[0.02] p-3"
          >
            <span className="h-6 w-6 shrink-0 grid place-items-center rounded-md bg-primary/15 text-primary text-xs font-bold tabular-nums">
              {c.n}
            </span>
            <div className="min-w-0 flex-1">
              <a
                href="/"
                className="group flex items-center gap-1 text-sm font-semibold hover:text-primary transition-colors"
              >
                <span className="truncate">{c.title}</span>
                <ExternalLink className="w-3.5 h-3.5 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
              </a>
              <p className="text-xs text-muted-foreground/70 italic leading-snug mt-1 border-l-2 border-foreground/[0.08] pl-2">
                “{c.quote}”
              </p>
              <div className="text-xs text-muted-foreground/45 mt-1.5">{c.source}</div>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

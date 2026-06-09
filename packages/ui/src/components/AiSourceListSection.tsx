"use client";

import React from "react";
import { Globe, ChevronRight } from "lucide-react";
import { cn } from "../lib/cn";

type Source = { id: string; title: string; domain: string; snippet: string; initial: string; tone: string };

const SOURCES: Source[] = [
  {
    id: "s1",
    title: "How Stripe scaled developer onboarding",
    domain: "stripe.com/blog",
    snippet: "We cut time-to-first-API-call from days to minutes by…",
    initial: "S",
    tone: "bg-violet-500/20 text-violet-300",
  },
  {
    id: "s2",
    title: "Activation metrics that actually matter",
    domain: "lennysnewsletter.com",
    snippet: "The single best leading indicator of retention is…",
    initial: "L",
    tone: "bg-sky-500/20 text-sky-300",
  },
  {
    id: "s3",
    title: "Reducing churn with lifecycle emails",
    domain: "customer.io",
    snippet: "Behavioral triggers outperform time-based sends 3 to 1…",
    initial: "C",
    tone: "bg-emerald-500/20 text-emerald-300",
  },
];

export interface AiSourceListSectionProps {
  className?: string;
}

export function AiSourceListSection({ className }: AiSourceListSectionProps) {
  return (
    <div
      className={cn(
        "w-full max-w-md bg-card/45 backdrop-blur-xl border border-border/50 rounded-2xl shadow-xl p-5 font-sans text-foreground",
        className,
      )}
    >
      <h3 className="text-sm font-bold flex items-center gap-1.5 mb-3">
        <Globe className="w-4 h-4 text-primary" /> Sources from the web
      </h3>

      <ul className="space-y-1">
        {SOURCES.map((s) => (
          <li key={s.id}>
            <a
              href="/"
              className="group flex items-center gap-3 rounded-xl px-2.5 py-2.5 hover:bg-foreground/[0.04] transition-colors"
            >
              <span
                className={cn(
                  "h-8 w-8 shrink-0 grid place-items-center rounded-lg text-xs font-black",
                  s.tone,
                )}
              >
                {s.initial}
              </span>
              <div className="min-w-0 flex-1">
                <div className="text-sm font-semibold truncate">{s.title}</div>
                <div className="text-xs text-muted-foreground/55 truncate">{s.snippet}</div>
                <div className="text-xs text-muted-foreground/40 mt-0.5">{s.domain}</div>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground/30 shrink-0 group-hover:translate-x-0.5 transition-transform" />
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

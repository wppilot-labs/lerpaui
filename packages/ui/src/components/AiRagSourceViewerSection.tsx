"use client";

import React, { useState } from "react";
import { Database, FileText } from "lucide-react";
import { cn } from "../lib/cn";

type Chunk = {
  id: string;
  doc: string;
  page: string;
  score: number;
  text: string;
};

const CHUNKS: Chunk[] = [
  {
    id: "k1",
    doc: "employee-handbook.pdf",
    page: "p. 14",
    score: 0.94,
    text: "Full-time employees accrue 1.5 PTO days per month, capped at 30 days carried into the next year.",
  },
  {
    id: "k2",
    doc: "benefits-2024.pdf",
    page: "p. 7",
    score: 0.88,
    text: "Health coverage begins on the first of the month following the start date, with no waiting period for dental.",
  },
  {
    id: "k3",
    doc: "remote-policy.md",
    page: "§3.2",
    score: 0.71,
    text: "Remote staff may expense a one-time $500 home-office setup within their first 90 days.",
  },
];

function scoreTone(s: number) {
  if (s >= 0.85) return "bg-emerald-500/15 text-emerald-400";
  if (s >= 0.7) return "bg-amber-500/15 text-amber-400";
  return "bg-foreground/[0.06] text-muted-foreground/60";
}

export interface AiRagSourceViewerSectionProps {
  className?: string;
}

export function AiRagSourceViewerSection({ className }: AiRagSourceViewerSectionProps) {
  const [open, setOpen] = useState<string>("k1");

  return (
    <div
      className={cn(
        "w-full max-w-md bg-card/45 backdrop-blur-xl border border-border/50 rounded-2xl shadow-xl p-5 font-sans text-foreground",
        className,
      )}
    >
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-bold flex items-center gap-1.5">
          <Database className="w-4 h-4 text-primary" /> Retrieved context
        </h3>
        <span className="text-xs text-muted-foreground/45">{CHUNKS.length} chunks · top-k</span>
      </div>

      <ul className="space-y-2">
        {CHUNKS.map((c) => {
          const isOpen = open === c.id;
          return (
            <li key={c.id} className="rounded-xl border border-foreground/[0.06] bg-foreground/[0.02] overflow-hidden">
              <button
                type="button"
                onClick={() => setOpen(isOpen ? "" : c.id)}
                aria-expanded={isOpen}
                className="w-full flex items-center gap-2.5 px-3 py-2.5 text-left hover:bg-foreground/[0.03] transition-colors"
              >
                <FileText className="w-4 h-4 text-muted-foreground/50 shrink-0" />
                <span className="min-w-0 flex-1">
                  <span className="text-sm font-semibold truncate block">{c.doc}</span>
                  <span className="text-xs text-muted-foreground/45">{c.page}</span>
                </span>
                <span className={cn("text-xs font-bold px-1.5 py-0.5 rounded tabular-nums shrink-0", scoreTone(c.score))}>
                  {c.score.toFixed(2)}
                </span>
              </button>
              {isOpen && (
                <p className="px-3 pb-3 text-sm leading-relaxed text-muted-foreground/75 border-t border-foreground/[0.05] pt-2.5">
                  {c.text}
                </p>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

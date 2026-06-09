"use client";

import React from "react";
import { Sparkles, ArrowRight } from "lucide-react";
import { cn } from "../lib/cn";

type Pick = {
  id: string;
  name: string;
  price: string;
  match: number;
  reason: string;
  tint: string;
};

const PICKS: Pick[] = [
  {
    id: "1",
    name: "Merino Base Layer",
    price: "$74",
    match: 96,
    reason: "Pairs with your recent jacket",
    tint: "from-sky-500/30 to-indigo-500/10",
  },
  {
    id: "2",
    name: "Trail Gaiters",
    price: "$38",
    match: 91,
    reason: "Popular with hikers like you",
    tint: "from-emerald-500/30 to-teal-500/10",
  },
  {
    id: "3",
    name: "Insulated Flask",
    price: "$32",
    match: 88,
    reason: "Frequently bought together",
    tint: "from-amber-500/30 to-orange-500/10",
  },
];

export interface ProductAIRecommendationStripProps {
  className?: string;
}

export function ProductAIRecommendationStrip({
  className,
}: ProductAIRecommendationStripProps) {
  return (
    <div
      className={cn(
        "w-full max-w-md bg-card/45 backdrop-blur-xl border border-border/50 p-5 rounded-2xl shadow-xl font-sans text-foreground",
        className,
      )}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="inline-flex items-center gap-1.5">
          <span className="h-7 w-7 rounded-lg bg-gradient-to-br from-violet-500/30 to-fuchsia-500/20 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-violet-300" />
          </span>
          <h3 className="text-base font-bold">Picked for you</h3>
        </div>
        <span className="text-xs uppercase tracking-wide text-muted-foreground/50 font-bold">
          AI matched
        </span>
      </div>

      <ul className="space-y-2">
        {PICKS.map((p) => (
          <li key={p.id}>
            <button
              type="button"
              className="w-full flex items-center gap-3 p-2 rounded-xl bg-foreground/[0.02] border border-foreground/[0.05] hover:border-foreground/20 transition-colors text-left group"
            >
              <span
                className={cn(
                  "h-14 w-14 rounded-lg bg-gradient-to-br shrink-0",
                  p.tint,
                )}
              />
              <span className="flex-1 min-w-0">
                <span className="flex items-center gap-2">
                  <span className="text-sm font-semibold truncate">{p.name}</span>
                  <span className="shrink-0 text-[11px] font-black px-1.5 py-0.5 rounded-full bg-violet-500/15 text-violet-300">
                    {p.match}% match
                  </span>
                </span>
                <span className="block text-xs text-muted-foreground/55 mt-0.5 truncate">
                  {p.reason}
                </span>
              </span>
              <span className="flex flex-col items-end shrink-0">
                <span className="text-sm font-bold">{p.price}</span>
                <ArrowRight className="w-4 h-4 text-muted-foreground/30 mt-1 group-hover:translate-x-0.5 transition-transform" />
              </span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

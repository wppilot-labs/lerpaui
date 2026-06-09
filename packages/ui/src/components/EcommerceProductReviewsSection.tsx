"use client";

import React, { useState } from "react";
import { Star, PenLine } from "lucide-react";
import { cn } from "../lib/cn";

const BARS = [
  { stars: 5, pct: 72 },
  { stars: 4, pct: 18 },
  { stars: 3, pct: 6 },
  { stars: 2, pct: 2 },
  { stars: 1, pct: 2 },
];

const SNIPPETS = [
  { id: "s1", name: "Leah M.", rating: 5, text: "Fits true to size and incredibly soft." },
  { id: "s2", name: "Tom W.", rating: 4, text: "Quality is great, shipping took a few days." },
];

export interface EcommerceProductReviewsSectionProps {
  className?: string;
}

export function EcommerceProductReviewsSection({ className }: EcommerceProductReviewsSectionProps) {
  const [hover, setHover] = useState(0);
  const [picked, setPicked] = useState(0);
  const shown = hover || picked;

  return (
    <div className={cn("w-full max-w-lg bg-card/45 backdrop-blur-xl border border-border/50 p-5 rounded-2xl shadow-xl font-sans text-foreground", className)}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-base font-bold">Ratings & reviews</h3>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-3xl font-bold leading-none">4.6</span>
            <div>
              <div className="inline-flex items-center gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className={cn("w-4 h-4", i < 5 ? "fill-amber-400 text-amber-400" : "fill-none text-muted-foreground/30")} />
                ))}
              </div>
              <div className="text-xs text-muted-foreground/55 mt-0.5">based on 1,488 reviews</div>
            </div>
          </div>
        </div>

        <div className="flex-1 max-w-[180px] space-y-1">
          {BARS.map((b) => (
            <div key={b.stars} className="flex items-center gap-1.5">
              <span className="w-3 text-xs text-muted-foreground/60 shrink-0">{b.stars}</span>
              <div className="flex-1 h-1.5 rounded-full bg-foreground/[0.05] overflow-hidden">
                <div className="h-full rounded-full bg-amber-400" style={{ width: `${b.pct}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <ul className="mt-4 space-y-2.5 border-t border-foreground/[0.05] pt-4">
        {SNIPPETS.map((s) => (
          <li key={s.id} className="text-xs">
            <div className="flex items-center gap-2">
              <span className="font-semibold">{s.name}</span>
              <span className="inline-flex items-center gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className={cn("w-3 h-3", i < s.rating ? "fill-amber-400 text-amber-400" : "fill-none text-muted-foreground/30")} />
                ))}
              </span>
            </div>
            <p className="text-muted-foreground/70 mt-0.5">{s.text}</p>
          </li>
        ))}
      </ul>

      <div className="mt-4 rounded-xl border border-foreground/[0.06] bg-foreground/[0.02] p-4">
        <div className="text-sm font-semibold flex items-center gap-1.5">
          <PenLine className="w-4 h-4 text-primary" /> Write a review
        </div>
        <div className="flex items-center gap-1 mt-2" role="radiogroup" aria-label="Your rating">
          {Array.from({ length: 5 }).map((_, i) => {
            const v = i + 1;
            return (
              <button
                key={v}
                type="button"
                role="radio"
                aria-checked={picked === v}
                aria-label={`${v} star${v > 1 ? "s" : ""}`}
                onMouseEnter={() => setHover(v)}
                onMouseLeave={() => setHover(0)}
                onClick={() => setPicked(v)}
                className="p-0.5"
              >
                <Star className={cn("w-5 h-5 transition", v <= shown ? "fill-amber-400 text-amber-400" : "fill-none text-muted-foreground/40")} />
              </button>
            );
          })}
        </div>
        <button
          type="button"
          className="mt-3 w-full text-sm font-semibold rounded-lg px-3 py-2.5 bg-primary text-primary-foreground hover:brightness-110 transition"
        >
          Share your thoughts
        </button>
      </div>
    </div>
  );
}

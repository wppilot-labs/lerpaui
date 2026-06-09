"use client";

import React from "react";
import { Star, BadgeCheck, ThumbsUp } from "lucide-react";
import { cn } from "../lib/cn";

type Review = {
  id: string;
  name: string;
  initials: string;
  rating: number;
  date: string;
  verified: boolean;
  title: string;
  body: string;
  helpful: number;
};

const REVIEWS: Review[] = [
  {
    id: "rv1",
    name: "Dana R.",
    initials: "DR",
    rating: 5,
    date: "2 weeks ago",
    verified: true,
    title: "Exceeded expectations",
    body: "Fabric is heavier than I expected in the best way. Held up perfectly after three washes with no fading.",
    helpful: 24,
  },
  {
    id: "rv2",
    name: "Miguel A.",
    initials: "MA",
    rating: 4,
    date: "1 month ago",
    verified: true,
    title: "Great, runs slightly large",
    body: "Comfortable and well made. I'd size down if you want a closer fit — the shoulders are roomy.",
    helpful: 11,
  },
  {
    id: "rv3",
    name: "Priya K.",
    initials: "PK",
    rating: 5,
    date: "1 month ago",
    verified: false,
    title: "Buying another",
    body: "The color is even better in person. Already ordered a second one in navy.",
    helpful: 6,
  },
];

export interface EcommerceReviewListProps {
  className?: string;
}

export function EcommerceReviewList({ className }: EcommerceReviewListProps) {
  return (
    <div className={cn("w-full max-w-lg bg-card/45 backdrop-blur-xl border border-border/50 p-4 rounded-2xl shadow-xl font-sans text-foreground", className)}>
      <ul className="space-y-3">
        {REVIEWS.map((r) => (
          <li key={r.id} className="rounded-xl border border-foreground/[0.05] bg-foreground/[0.02] p-4">
            <div className="flex items-center gap-2.5">
              <div className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center text-xs font-bold shrink-0">
                {r.initials}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-semibold truncate">{r.name}</span>
                  {r.verified && (
                    <span className="inline-flex items-center gap-0.5 text-[11px] text-emerald-400">
                      <BadgeCheck className="w-3.5 h-3.5" /> Verified
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="inline-flex items-center gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className={cn("w-3.5 h-3.5", i < r.rating ? "fill-amber-400 text-amber-400" : "fill-none text-muted-foreground/30")} />
                    ))}
                  </span>
                  <span className="text-xs text-muted-foreground/45">{r.date}</span>
                </div>
              </div>
            </div>

            <h4 className="text-sm font-semibold mt-2.5">{r.title}</h4>
            <p className="text-xs leading-relaxed text-muted-foreground/70 mt-1">{r.body}</p>

            <button
              type="button"
              className="inline-flex items-center gap-1.5 mt-2.5 text-xs text-muted-foreground/60 hover:text-foreground transition"
            >
              <ThumbsUp className="w-3.5 h-3.5" /> Helpful ({r.helpful})
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

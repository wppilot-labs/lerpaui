"use client";

import React, { useState } from "react";
import { ThumbsUp, ThumbsDown } from "lucide-react";
import { cn } from "../lib/cn";

type Tag = { label: string; count: number; positive: boolean };

const TAGS: Tag[] = [
  { label: "Easy to use", count: 412, positive: true },
  { label: "Great value", count: 388, positive: true },
  { label: "Fast shipping", count: 301, positive: true },
  { label: "High quality", count: 264, positive: true },
  { label: "Helpful support", count: 198, positive: true },
  { label: "Runs small", count: 74, positive: false },
  { label: "Pricey", count: 52, positive: false },
  { label: "Setup confusing", count: 41, positive: false },
];

export interface ReviewSentimentTagsProps {
  className?: string;
}

export function ReviewSentimentTags({ className }: ReviewSentimentTagsProps) {
  const [selected, setSelected] = useState<string[]>([]);

  const toggle = (label: string) =>
    setSelected((cur) => (cur.includes(label) ? cur.filter((l) => l !== label) : [...cur, label]));

  return (
    <div
      className={cn(
        "w-full max-w-md rounded-2xl border border-border/50 bg-card/60 p-4 font-sans text-foreground shadow-xl backdrop-blur-xl",
        className,
      )}
    >
      <h3 className="mb-1 text-base font-bold">What customers mention</h3>
      <p className="mb-3 text-sm text-muted-foreground/55">Tap a tag to filter reviews by topic.</p>

      <div className="flex flex-wrap gap-1.5">
        {TAGS.map((tag) => {
          const isSel = selected.includes(tag.label);
          return (
            <button
              key={tag.label}
              type="button"
              aria-pressed={isSel}
              onClick={() => toggle(tag.label)}
              className={cn(
                "flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-medium transition-colors",
                isSel
                  ? "border-primary bg-primary/10 text-primary"
                  : tag.positive
                    ? "border-emerald-500/20 bg-emerald-500/[0.07] text-emerald-700 hover:bg-emerald-500/15 dark:text-emerald-300"
                    : "border-rose-500/20 bg-rose-500/[0.07] text-rose-700 hover:bg-rose-500/15 dark:text-rose-300",
              )}
            >
              {tag.positive ? <ThumbsUp className="h-3.5 w-3.5" /> : <ThumbsDown className="h-3.5 w-3.5" />}
              <span>{tag.label}</span>
              <span className="opacity-60">{tag.count}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

"use client";

import React, { useState } from "react";
import { Star, MessageSquare, Check } from "lucide-react";
import { cn } from "../lib/cn";

export interface FeedbackFormSectionProps {
  className?: string;
}

export function FeedbackFormSection({ className }: FeedbackFormSectionProps) {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  const shown = hover || rating;

  return (
    <div className={cn("w-full max-w-md bg-card/45 backdrop-blur-xl border border-border/50 p-5 rounded-2xl shadow-xl font-sans text-foreground text-left", className)}>
      <div className="flex items-center gap-2 mb-1">
        <MessageSquare className="w-5 h-5 text-primary" />
        <h3 className="text-base font-bold">Share your feedback</h3>
      </div>
      <p className="text-sm text-muted-foreground/60 mb-4">How was your experience?</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <span className="block text-xs font-semibold text-muted-foreground/70 mb-1.5">Your rating</span>
          <div className="flex items-center gap-1" role="radiogroup" aria-label="Rating">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                type="button"
                role="radio"
                aria-checked={rating === n}
                aria-label={`${n} star${n > 1 ? "s" : ""}`}
                onClick={() => setRating(n)}
                onMouseEnter={() => setHover(n)}
                onMouseLeave={() => setHover(0)}
                className="p-0.5 transition-transform hover:scale-110"
              >
                <Star className={cn("w-7 h-7 transition-colors", n <= shown ? "fill-amber-500 text-amber-500 dark:fill-amber-400 dark:text-amber-400" : "text-muted-foreground/30")} />
              </button>
            ))}
          </div>
        </div>

        <div>
          <label htmlFor="fb-comment" className="block text-xs font-semibold text-muted-foreground/70 mb-1">Comments</label>
          <textarea
            id="fb-comment"
            rows={3}
            placeholder="Tell us what we can improve..."
            className="w-full bg-foreground/[0.03] border border-foreground/[0.08] rounded-lg px-3 py-2.5 text-sm resize-none focus:ring-1 focus:ring-primary/50 focus:outline-none"
          />
        </div>

        <button
          type="submit"
          disabled={sent}
          className="w-full py-2.5 bg-primary hover:brightness-110 disabled:opacity-80 text-primary-foreground text-sm font-bold rounded-lg flex items-center justify-center gap-1.5 transition-all"
        >
          {sent ? (
            <>
              <Check className="w-4 h-4" /> Thanks for your feedback
            </>
          ) : (
            "Submit feedback"
          )}
        </button>
      </form>
    </div>
  );
}

"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Star, BadgeCheck } from "lucide-react";
import { cn } from "../lib/cn";

export interface RatingMetricsBlockProps {
  className?: string;
}

interface RatingSource {
  id: string;
  name: string;
  short: string;
  rating: number;
  reviews: number;
  badge?: string;
}

const SOURCES: RatingSource[] = [
  {
    id: "g2",
    name: "G2",
    short: "G2",
    rating: 4.9,
    reviews: 1240,
    badge: "Leader 2026",
  },
  {
    id: "capterra",
    name: "Capterra",
    short: "Cp",
    rating: 4.8,
    reviews: 832,
    badge: "Top Rated",
  },
  {
    id: "trustpilot",
    name: "Trustpilot",
    short: "Tp",
    rating: 4.9,
    reviews: 2104,
    badge: "Excellent",
  },
  {
    id: "ph",
    name: "Product Hunt",
    short: "PH",
    rating: 4.9,
    reviews: 612,
    badge: "Top 10",
  },
];

export function RatingMetricsBlock({ className }: RatingMetricsBlockProps) {
  const reduced = useReducedMotion();
  const headingId = React.useId();

  return (
    <section
      aria-labelledby={headingId}
      className={cn(
        "relative w-full overflow-hidden rounded-3xl border border-border/50 bg-card/30 px-6 py-16 backdrop-blur-xl sm:px-10 sm:py-24",
        className,
      )}
    >
      <div className="relative mx-auto max-w-6xl">
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
            <Star className="h-3.5 w-3.5" aria-hidden />
            What reviewers say
          </span>
          <h2
            id={headingId}
            className="mt-5 text-balance text-3xl font-semibold tracking-tight sm:text-4xl md:text-5xl"
          >
            4.9 average across the web
          </h2>
        </div>

        <ul className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {SOURCES.map((s, i) => (
            <motion.li
              key={s.id}
              initial={reduced ? false : { opacity: 0, y: 12 }}
              whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="flex flex-col rounded-2xl border bg-card p-6 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <span
                  aria-hidden
                  className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 font-mono text-sm font-bold text-primary"
                >
                  {s.short}
                </span>
                {s.badge && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-400/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                    <BadgeCheck className="h-3 w-3" aria-hidden />
                    {s.badge}
                  </span>
                )}
              </div>
              <div className="mt-4 font-semibold text-foreground">{s.name}</div>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-4xl font-semibold tracking-tight text-foreground">
                  {s.rating.toFixed(1)}
                </span>
                <span className="text-xs text-muted-foreground">/ 5</span>
              </div>
              <div
                className="mt-2 flex items-center gap-0.5"
                aria-label={`${s.rating} out of 5 stars`}
              >
                {Array.from({ length: 5 }).map((_, j) => {
                  const filled = j + 1 <= Math.floor(s.rating);
                  const half = !filled && j + 0.5 <= s.rating;
                  return (
                    <Star
                      key={j}
                      className={cn(
                        "h-4 w-4",
                        filled || half
                          ? "fill-amber-400 text-amber-400"
                          : "text-muted",
                      )}
                      aria-hidden
                    />
                  );
                })}
              </div>
              <div className="mt-3 text-xs text-muted-foreground">
                Based on {s.reviews.toLocaleString()} reviews
              </div>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export default RatingMetricsBlock;

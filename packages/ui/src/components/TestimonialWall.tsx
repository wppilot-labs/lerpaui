"use client";

import React from "react";
import { Quote, Star } from "lucide-react";
import { cn } from "../lib/cn";

type Testimonial = {
  id: string;
  quote: string;
  name: string;
  role: string;
  initials: string;
  tint: string;
};

const TESTIMONIALS: Testimonial[] = [
  {
    id: "1",
    quote: "We cut our release cycle from two weeks to two days. The team actually enjoys shipping now.",
    name: "Sofia Reyes",
    role: "VP Engineering, Lumen",
    initials: "SR",
    tint: "from-primary to-violet-500",
  },
  {
    id: "2",
    quote: "Onboarding took ten minutes. By lunch the whole squad had migrated their workflows.",
    name: "Daniel Okafor",
    role: "Product Lead, Northbeam",
    initials: "DO",
    tint: "from-emerald-500 to-teal-500",
  },
  {
    id: "3",
    quote: "The analytics alone paid for the subscription in the first month. Genuinely indispensable.",
    name: "Mei Tanaka",
    role: "Founder, Kettle",
    initials: "MT",
    tint: "from-amber-500 to-orange-500",
  },
  {
    id: "4",
    quote: "Support replies in minutes, not days. It feels like they're part of our own team.",
    name: "Liam Walsh",
    role: "CTO, Driftwood",
    initials: "LW",
    tint: "from-sky-500 to-indigo-500",
  },
];

export interface TestimonialWallProps {
  className?: string;
}

export function TestimonialWall({ className }: TestimonialWallProps) {
  return (
    <div className={cn("w-full max-w-2xl font-sans text-foreground", className)}>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {TESTIMONIALS.map((t) => (
          <figure
            key={t.id}
            className="flex flex-col rounded-2xl border border-border/50 bg-card/60 p-5 shadow-lg backdrop-blur-xl"
          >
            <Quote className="h-5 w-5 text-primary/40" />
            <blockquote className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
              {t.quote}
            </blockquote>
            <div className="mt-2 flex gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
              ))}
            </div>
            <figcaption className="mt-3 flex items-center gap-2.5 border-t border-foreground/[0.06] pt-3">
              <span
                className={cn(
                  "flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br text-xs font-bold text-white",
                  t.tint,
                )}
              >
                {t.initials}
              </span>
              <span className="min-w-0">
                <span className="block truncate text-sm font-semibold leading-tight">{t.name}</span>
                <span className="block truncate text-xs text-muted-foreground/55">{t.role}</span>
              </span>
            </figcaption>
          </figure>
        ))}
      </div>
    </div>
  );
}

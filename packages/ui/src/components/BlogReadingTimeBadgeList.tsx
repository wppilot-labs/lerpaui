"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Clock, ArrowUpRight, Coffee, Flame } from "lucide-react";
import { cn } from "../lib/cn";

export interface ReadingPost {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  readMin: number;
  date: string;
}

export interface BlogReadingTimeBadgeListProps {
  className?: string;
  eyebrow?: string;
  title?: string;
  posts?: ReadingPost[];
}

const DEFAULT_POSTS: ReadingPost[] = [
  { id: "1", title: "Why we audit our own components weekly", excerpt: "A 90-minute habit that prevents weeks of regression work.", category: "Process", readMin: 3, date: "May 24" },
  { id: "2", title: "The complete guide to accessible motion design", excerpt: "From reduced-motion fallbacks to focus management in transitions.", category: "Accessibility", readMin: 18, date: "May 19" },
  { id: "3", title: "OKLCH for product designers", excerpt: "A short primer on a perceptually uniform color space.", category: "Design", readMin: 7, date: "May 14" },
  { id: "4", title: "What we learned from 4,000 install logs", excerpt: "Patterns in adoption, failures, and the silent majority.", category: "Data", readMin: 12, date: "May 09" },
  { id: "5", title: "Quick note: Next 16 static export gotchas", excerpt: "Two things that surprised us during our latest migration.", category: "Engineering", readMin: 2, date: "May 04" },
  { id: "6", title: "Designing handoffs your engineers want", excerpt: "Tokens, components, and how to write a Figma library that ships.", category: "Design", readMin: 9, date: "Apr 28" },
];

const readingFlavor = (min: number) => {
  if (min <= 3) return { label: "Quick read", Icon: Coffee, tone: "bg-emerald-400/15 text-emerald-400" };
  if (min <= 10) return { label: "Coffee break", Icon: Clock, tone: "bg-blue-400/15 text-blue-400" };
  return { label: "Deep dive", Icon: Flame, tone: "bg-orange-400/15 text-orange-400" };
};

export function BlogReadingTimeBadgeList({
  className,
  eyebrow = "Time well spent",
  title = "Pick something for your break",
  posts = DEFAULT_POSTS,
}: BlogReadingTimeBadgeListProps) {
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
      <div className="relative mx-auto max-w-4xl">
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
            <Clock className="h-3.5 w-3.5" aria-hidden />
            {eyebrow}
          </span>
          <h2
            id={headingId}
            className="mt-5 text-balance text-3xl font-semibold tracking-tight sm:text-4xl md:text-5xl"
          >
            {title}
          </h2>
        </div>

        <ul className="mt-10 grid gap-4">
          {posts.map((p, i) => {
            const flavor = readingFlavor(p.readMin);
            return (
              <motion.li
                key={p.id}
                initial={reduced ? false : { opacity: 0, y: 10 }}
                whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.4, delay: i * 0.04 }}
              >
                <a
                  href="/"
                  className="group flex items-start gap-4 rounded-2xl border bg-card p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
                >
                  <div
                    className={cn(
                      "flex h-14 w-14 flex-shrink-0 flex-col items-center justify-center rounded-xl text-xs font-semibold",
                      flavor.tone,
                    )}
                    aria-hidden
                  >
                    <flavor.Icon className="h-4 w-4" aria-hidden />
                    <span className="mt-1 font-mono text-[11px]">
                      {p.readMin}m
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary">
                        {p.category}
                      </span>
                      <span
                        className={cn(
                          "rounded-full px-2 py-0.5 text-[10px] font-semibold",
                          flavor.tone,
                        )}
                      >
                        {flavor.label}
                      </span>
                    </div>
                    <h3 className="mt-2 text-base font-semibold text-foreground group-hover:text-primary">
                      {p.title}
                    </h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {p.excerpt}
                    </p>
                    <div className="mt-2 font-mono text-[11px] text-muted-foreground">
                      {p.date}
                    </div>
                  </div>
                  <ArrowUpRight
                    className="h-4 w-4 flex-shrink-0 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary"
                    aria-hidden
                  />
                </a>
              </motion.li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

export default BlogReadingTimeBadgeList;

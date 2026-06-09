"use client";

import React, { useState, useMemo } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Hash, Calendar, ArrowUpRight } from "lucide-react";
import { cn } from "../lib/cn";

export interface FilterablePost {
  id: string;
  title: string;
  category: string;
  date: string;
  readTime: string;
  excerpt: string;
}

export interface BlogCategoryFilterRowProps {
  className?: string;
  title?: string;
  categories?: string[];
  posts?: FilterablePost[];
}

const DEFAULT_CATEGORIES = ["All", "Design", "Engineering", "Product", "Research"];

const DEFAULT_POSTS: FilterablePost[] = [
  { id: "1", title: "Designing for AI assistants", category: "Design", date: "May 22", readTime: "8 min", excerpt: "Integrating copilots without breaking your IA." },
  { id: "2", title: "Reduced motion as a state", category: "Engineering", date: "May 18", readTime: "6 min", excerpt: "Honoring user preferences across the stack." },
  { id: "3", title: "Q2 product update", category: "Product", date: "May 02", readTime: "4 min", excerpt: "Twenty-three components, six blocks." },
  { id: "4", title: "Color systems that survive a rebrand", category: "Design", date: "May 11", readTime: "10 min", excerpt: "Tokens and perceptual scales." },
  { id: "5", title: "Tailwind v4 in production", category: "Engineering", date: "Apr 28", readTime: "12 min", excerpt: "Migration patterns and gotchas." },
  { id: "6", title: "Interviewing your power users", category: "Research", date: "Apr 18", readTime: "9 min", excerpt: "How we found our churn drivers." },
  { id: "7", title: "The case for fewer primitives", category: "Product", date: "Apr 10", readTime: "5 min", excerpt: "Why we cut a quarter of our components." },
];

export function BlogCategoryFilterRow({
  className,
  title = "Browse by topic",
  categories = DEFAULT_CATEGORIES,
  posts = DEFAULT_POSTS,
}: BlogCategoryFilterRowProps) {
  const reduced = useReducedMotion();
  const headingId = React.useId();
  const [active, setActive] = useState<string>(categories[0] ?? "All");

  const filtered = useMemo(
    () => (active === categories[0] ? posts : posts.filter((p) => p.category === active)),
    [active, categories, posts],
  );

  return (
    <section
      aria-labelledby={headingId}
      className={cn(
        "relative w-full overflow-hidden rounded-3xl border border-border/50 bg-card/30 px-6 py-16 backdrop-blur-xl sm:px-10 sm:py-24",
        className,
      )}
    >
      <div className="relative mx-auto max-w-5xl">
        <div className="flex flex-col items-start gap-6 md:flex-row md:items-end md:justify-between">
          <h2
            id={headingId}
            className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl md:text-5xl"
          >
            {title}
          </h2>
          <div role="tablist" aria-label="Categories" className="flex flex-wrap gap-2">
            {categories.map((c) => (
              <button
                key={c}
                role="tab"
                type="button"
                aria-selected={active === c}
                onClick={() => setActive(c)}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]",
                  active === c
                    ? "border-primary bg-primary text-primary-foreground shadow"
                    : "border-border bg-background text-muted-foreground hover:bg-accent hover:text-foreground",
                )}
              >
                <Hash className="h-3 w-3" aria-hidden />
                {c}
              </button>
            ))}
          </div>
        </div>

        <ul className="mt-10 divide-y divide-border/60 rounded-2xl border bg-card shadow-sm">
          {filtered.map((p, i) => (
            <motion.li
              key={p.id}
              layout={!reduced}
              initial={reduced ? false : { opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.03 }}
            >
              <a
                href="/"
                className="group flex flex-col gap-2 p-5 transition-colors hover:bg-accent/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary">
                      {p.category}
                    </span>
                    <span className="inline-flex items-center gap-1 font-mono text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3" aria-hidden />
                      {p.date} · {p.readTime}
                    </span>
                  </div>
                  <div className="mt-2 text-base font-semibold text-foreground group-hover:text-primary">
                    {p.title}
                  </div>
                  <div className="mt-1 text-sm text-muted-foreground">
                    {p.excerpt}
                  </div>
                </div>
                <ArrowUpRight
                  className="h-4 w-4 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary"
                  aria-hidden
                />
              </a>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export default BlogCategoryFilterRow;

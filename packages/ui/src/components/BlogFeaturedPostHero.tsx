"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, Calendar, Star } from "lucide-react";
import { cn } from "../lib/cn";

export interface FeaturedPost {
  id: string;
  title: string;
  excerpt?: string;
  category: string;
  date: string;
  readTime: string;
  tone: string;
  author?: string;
}

export interface BlogFeaturedPostHeroProps {
  className?: string;
  featured?: FeaturedPost;
  secondary?: FeaturedPost[];
}

const DEFAULT_FEATURED: FeaturedPost = {
  id: "f",
  title: "Building a design system that earns its keep",
  excerpt:
    "A two-year retrospective on tradeoffs, ship velocity, and where we'd do it differently — written for teams of two and twenty.",
  category: "Editor's pick",
  date: "May 24",
  readTime: "14 min",
  tone: "from-violet-500 via-fuchsia-500 to-rose-500",
  author: "By the Lerpa UI team",
};

const DEFAULT_SECONDARY: FeaturedPost[] = [
  { id: "1", title: "How we ship a component a week", category: "Process", date: "May 20", readTime: "6 min", tone: "from-cyan-500 to-blue-500" },
  { id: "2", title: "A taxonomy of motion patterns", category: "Design", date: "May 16", readTime: "9 min", tone: "from-amber-500 to-orange-500" },
  { id: "3", title: "Reading user signal without analytics", category: "Research", date: "May 09", readTime: "7 min", tone: "from-emerald-500 to-teal-500" },
  { id: "4", title: "Why we still use CSS variables", category: "Engineering", date: "May 02", readTime: "5 min", tone: "from-pink-500 to-rose-500" },
];

export function BlogFeaturedPostHero({
  className,
  featured = DEFAULT_FEATURED,
  secondary = DEFAULT_SECONDARY,
}: BlogFeaturedPostHeroProps) {
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
        <h2 id={headingId} className="sr-only">
          Featured posts
        </h2>

        <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
          <motion.a
            href="/"
            initial={reduced ? false : { opacity: 0, y: 14 }}
            whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="group flex flex-col overflow-hidden rounded-2xl border bg-card shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
          >
            <div
              className={cn(
                "relative aspect-[16/9] w-full bg-gradient-to-br lg:aspect-[16/10]",
                featured.tone,
              )}
              aria-hidden
            >
              <span className="absolute left-5 top-5 inline-flex items-center gap-1.5 rounded-full bg-black/40 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-white backdrop-blur">
                <Star className="h-3 w-3" aria-hidden />
                {featured.category}
              </span>
            </div>
            <div className="flex flex-1 flex-col p-7">
              <h3 className="text-balance text-2xl font-semibold leading-tight tracking-tight text-foreground sm:text-3xl">
                {featured.title}
              </h3>
              <p className="mt-3 text-base text-muted-foreground">
                {featured.excerpt}
              </p>
              <div className="mt-6 flex items-center justify-between border-t border-border/60 pt-4 text-xs text-muted-foreground">
                <span>{featured.author}</span>
                <span className="inline-flex items-center gap-1.5">
                  <Calendar className="h-3 w-3" aria-hidden />
                  {featured.date} · {featured.readTime}
                </span>
              </div>
            </div>
          </motion.a>

          <ul className="grid gap-4">
            {secondary.map((p, i) => (
              <motion.li
                key={p.id}
                initial={reduced ? false : { opacity: 0, y: 10 }}
                whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.4, delay: 0.1 + i * 0.05 }}
              >
                <a
                  href="/"
                  className="group flex items-stretch gap-4 rounded-2xl border bg-card p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
                >
                  <div
                    aria-hidden
                    className={cn(
                      "h-20 w-24 flex-shrink-0 rounded-xl bg-gradient-to-br",
                      p.tone,
                    )}
                  />
                  <div className="flex min-w-0 flex-1 flex-col justify-between">
                    <div>
                      <div className="text-[10px] font-bold uppercase tracking-wider text-primary">
                        {p.category}
                      </div>
                      <div className="mt-1 line-clamp-2 text-sm font-semibold text-foreground group-hover:text-primary">
                        {p.title}
                      </div>
                    </div>
                    <div className="mt-2 flex items-center justify-between text-[11px] text-muted-foreground">
                      <span>
                        {p.date} · {p.readTime}
                      </span>
                      <ArrowUpRight
                        className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                        aria-hidden
                      />
                    </div>
                  </div>
                </a>
              </motion.li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

export default BlogFeaturedPostHero;

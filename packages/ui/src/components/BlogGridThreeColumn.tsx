"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, Calendar } from "lucide-react";
import { cn } from "../lib/cn";

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  readTime: string;
  tone: string;
  author: { name: string; initials: string };
}

export interface BlogGridThreeColumnProps {
  className?: string;
  title?: string;
  subtitle?: string;
  ctaLabel?: string;
  ctaHref?: string;
  posts?: BlogPost[];
}

const DEFAULT_POSTS: BlogPost[] = [
  {
    id: "1",
    title: "Designing for AI assistants in your product",
    excerpt: "How to integrate copilots without breaking your existing IA.",
    category: "Design",
    date: "May 22",
    readTime: "8 min",
    tone: "from-violet-500 to-fuchsia-500",
    author: { name: "Iris Kuznetsova", initials: "IK" },
  },
  {
    id: "2",
    title: "Reduced motion as a first-class state",
    excerpt: "A pragmatic path to honoring user preferences across your stack.",
    category: "Engineering",
    date: "May 18",
    readTime: "6 min",
    tone: "from-emerald-500 to-teal-500",
    author: { name: "Sam Okafor", initials: "SO" },
  },
  {
    id: "3",
    title: "Color systems that survive a rebrand",
    excerpt: "Tokens, perceptual scales, and the case for OKLCH.",
    category: "Design",
    date: "May 11",
    readTime: "10 min",
    tone: "from-amber-500 to-orange-500",
    author: { name: "Maya Rivera", initials: "MR" },
  },
  {
    id: "4",
    title: "What we shipped in Q2",
    excerpt: "23 components, 6 blocks, and a brand-new theme studio.",
    category: "Product",
    date: "May 02",
    readTime: "4 min",
    tone: "from-cyan-500 to-blue-500",
    author: { name: "Jonas Lim", initials: "JL" },
  },
  {
    id: "5",
    title: "Tailwind v4 in a real codebase",
    excerpt: "Migration patterns, gotchas, and what we'd do differently.",
    category: "Engineering",
    date: "Apr 28",
    readTime: "12 min",
    tone: "from-pink-500 to-rose-500",
    author: { name: "Daniela Ferreira", initials: "DF" },
  },
  {
    id: "6",
    title: "The case for fewer, deeper primitives",
    excerpt: "Why we cut a quarter of our components and got faster.",
    category: "Product",
    date: "Apr 20",
    readTime: "5 min",
    tone: "from-indigo-500 to-purple-500",
    author: { name: "Theo Banks", initials: "TB" },
  },
];

export function BlogGridThreeColumn({
  className,
  title = "Latest from the journal",
  subtitle = "Notes from the team building Lerpa UI.",
  ctaLabel = "View all",
  ctaHref = "#",
  posts = DEFAULT_POSTS,
}: BlogGridThreeColumnProps) {
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
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2
              id={headingId}
              className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl md:text-5xl"
            >
              {title}
            </h2>
            <p className="mt-2 text-muted-foreground">
              {subtitle}
            </p>
          </div>
          <a
            href={ctaHref}
            className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
          >
            {ctaLabel} <ArrowUpRight className="h-4 w-4" aria-hidden />
          </a>
        </div>

        <ul className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((p, i) => (
            <motion.li
              key={p.id}
              initial={reduced ? false : { opacity: 0, y: 14 }}
              whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.45, delay: i * 0.05 }}
            >
              <a
                href="/"
                className="group flex h-full flex-col overflow-hidden rounded-2xl border bg-card shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
              >
                <div
                  className={cn(
                    "relative aspect-[16/10] w-full bg-gradient-to-br",
                    p.tone,
                  )}
                  aria-hidden
                >
                  <span className="absolute left-4 top-4 rounded-full bg-black/30 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur">
                    {p.category}
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <h3 className="text-lg font-semibold leading-tight text-foreground group-hover:text-primary">
                    {p.title}
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground">{p.excerpt}</p>
                  <div className="mt-5 flex items-center justify-between border-t border-border/60 pt-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <span
                        aria-hidden
                        className="grid h-6 w-6 place-items-center rounded-full bg-primary/15 text-[10px] font-bold text-primary"
                      >
                        {p.author.initials}
                      </span>
                      {p.author.name}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Calendar className="h-3 w-3" aria-hidden />
                      {p.date} · {p.readTime}
                    </div>
                  </div>
                </div>
              </a>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export default BlogGridThreeColumn;

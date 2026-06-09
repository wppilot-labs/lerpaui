"use client";

import React from "react";
import { Clock } from "lucide-react";
import { cn } from "../lib/cn";

type Post = {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  catCls: string;
  cover: string;
  author: string;
  initials: string;
  read: string;
};

const POSTS: Post[] = [
  {
    id: "1",
    title: "Designing for the first five minutes",
    excerpt: "Why onboarding deserves the same craft as your core product loop.",
    category: "Design",
    catCls: "bg-violet-500/10 text-violet-400",
    cover: "from-violet-500/30 to-fuchsia-500/20",
    author: "Jane Doe",
    initials: "JD",
    read: "6 min",
  },
  {
    id: "2",
    title: "Shipping faster without breaking trust",
    excerpt: "A pragmatic take on feature flags, canaries, and rollback drills.",
    category: "Engineering",
    catCls: "bg-sky-500/10 text-sky-400",
    cover: "from-sky-500/30 to-cyan-500/20",
    author: "Marcus Lee",
    initials: "ML",
    read: "9 min",
  },
  {
    id: "3",
    title: "The quiet power of good defaults",
    excerpt: "How sensible defaults can outperform a wall of configuration.",
    category: "Product",
    catCls: "bg-emerald-500/10 text-emerald-400",
    cover: "from-emerald-500/30 to-teal-500/20",
    author: "Priya Patel",
    initials: "PP",
    read: "4 min",
  },
  {
    id: "4",
    title: "Pricing experiments that actually moved revenue",
    excerpt: "Three tests we ran last quarter and what the data really said.",
    category: "Growth",
    catCls: "bg-amber-500/10 text-amber-400",
    cover: "from-amber-500/30 to-orange-500/20",
    author: "Sofia Reyes",
    initials: "SR",
    read: "7 min",
  },
];

export interface BlogCardGridProps {
  className?: string;
}

export function BlogCardGrid({ className }: BlogCardGridProps) {
  return (
    <div className={cn("w-full max-w-2xl font-sans text-foreground", className)}>
      <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {POSTS.map((p) => (
          <li key={p.id}>
            <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border/50 bg-card/45 shadow-lg backdrop-blur-xl transition-colors hover:border-border">
              <div
                className={cn(
                  "relative h-28 bg-gradient-to-br",
                  p.cover,
                )}
              >
                <span
                  className={cn(
                    "absolute left-3 top-3 rounded-full px-2 py-0.5 text-xs font-bold",
                    p.catCls,
                  )}
                >
                  {p.category}
                </span>
              </div>

              <div className="flex flex-1 flex-col p-5">
                <h3 className="text-base font-bold leading-snug">
                  <a
                    href="/"
                    className="transition-colors group-hover:text-primary"
                  >
                    {p.title}
                  </a>
                </h3>
                <p className="mt-1.5 line-clamp-2 flex-1 text-xs leading-snug text-muted-foreground">
                  {p.excerpt}
                </p>

                <div className="mt-3 flex items-center justify-between border-t border-border/40 pt-3">
                  <div className="flex items-center gap-2">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-secondary/60 text-[11px] font-bold">
                      {p.initials}
                    </span>
                    <span className="text-xs font-medium text-muted-foreground">
                      {p.author}
                    </span>
                  </div>
                  <span className="flex items-center gap-1 text-xs text-muted-foreground/50">
                    <Clock className="h-3.5 w-3.5" /> {p.read}
                  </span>
                </div>
              </div>
            </article>
          </li>
        ))}
      </ul>
    </div>
  );
}

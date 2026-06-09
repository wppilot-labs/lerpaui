"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Clock, Newspaper } from "lucide-react";
import { cn } from "../lib/cn";

interface BlogPostListSectionProps {
  className?: string;
}

interface Post {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  read: number;
  date: string;
  tone: string;
}

const POSTS: Post[] = [
  {
    id: "p1",
    title: "Designing for scale: from 10 to 10,000 components",
    excerpt: "A pragmatic playbook for keeping a component library coherent as your team grows.",
    category: "Design Systems",
    read: 8,
    date: "May 14",
    tone: "from-violet-500/30 to-fuchsia-500/10",
  },
  {
    id: "p2",
    title: "How we shaved 60% off our Largest Contentful Paint",
    excerpt: "Real numbers, real trade-offs, and the boring stuff that actually moves the needle.",
    category: "Performance",
    read: 6,
    date: "May 09",
    tone: "from-cyan-500/30 to-blue-500/10",
  },
  {
    id: "p3",
    title: "Animation that doesn't make people seasick",
    excerpt: "Reduced-motion is a feature. Here is how we design for both modes from day one.",
    category: "Motion",
    read: 5,
    date: "May 02",
    tone: "from-emerald-500/30 to-teal-500/10",
  },
];

export function BlogPostListSection({ className }: BlogPostListSectionProps) {
  const reduced = useReducedMotion();

  return (
    <section
      className={cn(
        "w-full max-w-xl rounded-3xl border border-border/50 bg-card/30 px-6 py-10 backdrop-blur-xl",
        "relative overflow-hidden font-sans text-foreground",
        className,
      )}
      aria-labelledby="blog-post-list-heading"
    >
      <div className="pointer-events-none absolute inset-0 opacity-60">
        <div className="absolute -top-20 right-1/3 h-44 w-56 rounded-full bg-primary/15 blur-3xl" />
      </div>

      <div className="relative space-y-5">
        <div className="flex items-end justify-between gap-2">
          <div className="space-y-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/[0.06] bg-white/[0.03] px-2.5 py-1 text-[9px] font-black uppercase tracking-[0.18em] text-primary">
              <Newspaper className="h-3 w-3" />
              From the journal
            </span>
            <h2 id="blog-post-list-heading" className="text-base font-black tracking-tight">
              Field notes from the <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">build team</span>
            </h2>
          </div>
          <a href="/" className="text-[10px] font-bold uppercase tracking-wider text-primary hover:underline">
            All posts
          </a>
        </div>

        <ul className="space-y-2.5">
          {POSTS.map((p, i) => (
            <motion.li
              key={p.id}
              initial={reduced ? false : { opacity: 0, y: 10 }}
              whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.32, delay: reduced ? 0 : i * 0.06 }}
            >
              <a
                href="/"
                className="group relative flex gap-3 overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02] p-3 transition-colors hover:border-primary/30"
              >
                <div
                  className={cn(
                    "relative aspect-square h-16 shrink-0 overflow-hidden rounded-xl bg-gradient-to-br",
                    p.tone,
                  )}
                  aria-hidden="true"
                >
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Newspaper className="h-6 w-6 text-white/70" />
                  </div>
                </div>
                <div className="min-w-0 flex-1 space-y-1">
                  <div className="flex items-center gap-2 text-[9px] font-bold uppercase tracking-wider text-muted-foreground/60">
                    <span className="text-primary">{p.category}</span>
                    <span aria-hidden="true">·</span>
                    <span>{p.date}</span>
                    <span aria-hidden="true">·</span>
                    <span className="inline-flex items-center gap-1">
                      <Clock className="h-2.5 w-2.5" aria-hidden="true" />
                      {p.read} min
                    </span>
                  </div>
                  <h3 className="text-xs font-extrabold leading-snug text-foreground">{p.title}</h3>
                  <p className="line-clamp-2 text-[10px] leading-relaxed text-muted-foreground/70">
                    {p.excerpt}
                  </p>
                </div>
                <ArrowRight
                  className="mt-1 h-3.5 w-3.5 shrink-0 text-muted-foreground/50 transition-all group-hover:translate-x-0.5 group-hover:text-primary"
                  aria-hidden="true"
                />
              </a>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}

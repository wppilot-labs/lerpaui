"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, Users } from "lucide-react";
import { cn } from "../lib/cn";

export interface BlogAuthor {
  id: string;
  name: string;
  role: string;
  initials: string;
  bio: string;
  posts: number;
  tone: string;
}

export interface BlogAuthorListSectionProps {
  className?: string;
  eyebrow?: string;
  title?: string;
  authors?: BlogAuthor[];
}

const DEFAULT_AUTHORS: BlogAuthor[] = [
  {
    id: "1",
    name: "Iris Kuznetsova",
    role: "Design Director",
    initials: "IK",
    bio: "Writes about systems, color, and how teams ship design at scale.",
    posts: 32,
    tone: "from-violet-500 to-fuchsia-500",
  },
  {
    id: "2",
    name: "Sam Okafor",
    role: "Staff Engineer",
    initials: "SO",
    bio: "Framer Motion, React 19, and the boring side of fast UIs.",
    posts: 28,
    tone: "from-cyan-500 to-blue-500",
  },
  {
    id: "3",
    name: "Maya Rivera",
    role: "Brand Designer",
    initials: "MR",
    bio: "Identity, narrative, and the case for unmistakable typography.",
    posts: 19,
    tone: "from-amber-500 to-orange-500",
  },
  {
    id: "4",
    name: "Jonas Lim",
    role: "Product Manager",
    initials: "JL",
    bio: "Product analytics, roadmaps, and writing about what shipped.",
    posts: 41,
    tone: "from-emerald-500 to-teal-500",
  },
  {
    id: "5",
    name: "Daniela Ferreira",
    role: "Frontend Architect",
    initials: "DF",
    bio: "Tailwind v4, design tokens, and migrations done right.",
    posts: 24,
    tone: "from-pink-500 to-rose-500",
  },
  {
    id: "6",
    name: "Theo Banks",
    role: "Co-founder",
    initials: "TB",
    bio: "Notes from running a small open-source company in public.",
    posts: 16,
    tone: "from-indigo-500 to-purple-500",
  },
];

export function BlogAuthorListSection({
  className,
  eyebrow = "Contributors",
  title = "People behind the writing",
  authors = DEFAULT_AUTHORS,
}: BlogAuthorListSectionProps) {
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
            <Users className="h-3.5 w-3.5" aria-hidden />
            {eyebrow}
          </span>
          <h2
            id={headingId}
            className="mt-5 text-balance text-3xl font-semibold tracking-tight sm:text-4xl md:text-5xl"
          >
            {title}
          </h2>
        </div>

        <ul className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {authors.map((a, i) => (
            <motion.li
              key={a.id}
              initial={reduced ? false : { opacity: 0, y: 12 }}
              whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
            >
              <a
                href="/"
                className="group flex h-full items-start gap-4 rounded-2xl border bg-card p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
              >
                <div
                  aria-hidden
                  className={cn(
                    "grid h-14 w-14 flex-shrink-0 place-items-center rounded-2xl bg-gradient-to-br font-bold text-white",
                    a.tone,
                  )}
                >
                  {a.initials}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline justify-between gap-2">
                    <div className="font-semibold text-foreground group-hover:text-primary">
                      {a.name}
                    </div>
                    <ArrowUpRight
                      className="h-4 w-4 flex-shrink-0 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary"
                      aria-hidden
                    />
                  </div>
                  <div className="text-xs text-muted-foreground">{a.role}</div>
                  <p className="mt-2 line-clamp-2 text-sm text-foreground/80">
                    {a.bio}
                  </p>
                  <div className="mt-3 inline-flex items-center gap-1 rounded-full border border-border/60 bg-background/60 px-2 py-0.5 text-[11px] font-semibold text-foreground">
                    <span className="font-mono">{a.posts}</span> posts
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

export default BlogAuthorListSection;

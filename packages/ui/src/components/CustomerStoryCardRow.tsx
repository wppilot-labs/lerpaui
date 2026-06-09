"use client";

import React, { useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { cn } from "../lib/cn";

export interface CustomerStory {
  id: string;
  company: string;
  industry: string;
  outcome: string;
  metric: string;
  metricLabel: string;
  tone: string;
}

export interface CustomerStoryCardRowProps {
  className?: string;
  eyebrow?: string;
  title?: string;
  stories?: CustomerStory[];
}

const DEFAULT_STORIES: CustomerStory[] = [
  {
    id: "1",
    company: "Orbital",
    industry: "Fintech",
    outcome: "Rebuilt onboarding using Lerpa UI's animation primitives. Sign-up completion shot up overnight.",
    metric: "+62%",
    metricLabel: "Sign-up rate",
    tone: "from-violet-500 to-fuchsia-500",
  },
  {
    id: "2",
    company: "Northshore",
    industry: "Travel",
    outcome: "Replaced a bespoke design system. Two designers now ship pages that took five before.",
    metric: "5→2",
    metricLabel: "Designers per page",
    tone: "from-cyan-500 to-blue-500",
  },
  {
    id: "3",
    company: "Lumen Labs",
    industry: "Healthcare",
    outcome: "HIPAA-friendly components shipped in a week. Zero a11y bugs in the post-launch audit.",
    metric: "0",
    metricLabel: "A11y regressions",
    tone: "from-emerald-500 to-teal-500",
  },
  {
    id: "4",
    company: "Bytemark",
    industry: "Developer tools",
    outcome: "Built the entire docs site with three contributors in under a month. Conversion doubled.",
    metric: "2x",
    metricLabel: "Conversion lift",
    tone: "from-amber-500 to-orange-500",
  },
  {
    id: "5",
    company: "Stellar",
    industry: "E-commerce",
    outcome: "Migrated 12 storefronts to one library. Page weight dropped 38%.",
    metric: "−38%",
    metricLabel: "Page weight",
    tone: "from-pink-500 to-rose-500",
  },
];

export function CustomerStoryCardRow({
  className,
  eyebrow = "Customer stories",
  title = "Teams shipping faster",
  stories = DEFAULT_STORIES,
}: CustomerStoryCardRowProps) {
  const reduced = useReducedMotion();
  const headingId = React.useId();
  const scrollRef = useRef<HTMLUListElement>(null);

  const scroll = (dir: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: dir === "left" ? -360 : 360, behavior: "smooth" });
  };

  return (
    <section
      aria-labelledby={headingId}
      className={cn(
        "relative w-full overflow-hidden rounded-3xl border border-border/50 bg-card/30 px-6 py-16 backdrop-blur-xl sm:px-10 sm:py-24",
        className,
      )}
    >
      <div className="relative mx-auto max-w-6xl">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
              <Sparkles className="h-3.5 w-3.5" aria-hidden />
              {eyebrow}
            </span>
            <h2
              id={headingId}
              className="mt-5 text-balance text-3xl font-semibold tracking-tight sm:text-4xl md:text-5xl"
            >
              {title}
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => scroll("left")}
              aria-label="Scroll left"
              className="grid h-10 w-10 place-items-center rounded-full border border-border bg-background text-foreground transition hover:bg-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
            >
              <ChevronLeft className="h-4 w-4" aria-hidden />
            </button>
            <button
              type="button"
              onClick={() => scroll("right")}
              aria-label="Scroll right"
              className="grid h-10 w-10 place-items-center rounded-full border border-border bg-background text-foreground transition hover:bg-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
            >
              <ChevronRight className="h-4 w-4" aria-hidden />
            </button>
          </div>
        </div>

        <ul
          ref={scrollRef}
          className="mt-10 flex snap-x snap-mandatory gap-5 overflow-x-auto pb-4 [scrollbar-width:thin]"
        >
          {stories.map((s, i) => (
            <motion.li
              key={s.id}
              initial={reduced ? false : { opacity: 0, y: 12 }}
              whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="flex w-[300px] flex-shrink-0 snap-start flex-col rounded-2xl border bg-card p-6 shadow-sm transition-shadow hover:shadow-md sm:w-[340px]"
            >
              <div
                className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br text-sm font-bold text-white",
                  s.tone,
                )}
                aria-hidden
              >
                {s.company[0]}
              </div>
              <div className="mt-4 flex items-baseline justify-between">
                <div className="font-semibold text-foreground">{s.company}</div>
                <div className="text-xs uppercase tracking-wider text-muted-foreground">
                  {s.industry}
                </div>
              </div>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-foreground/90">
                {s.outcome}
              </p>
              <div className="mt-5 flex items-end justify-between border-t border-border/60 pt-4">
                <div>
                  <div className="text-3xl font-semibold tracking-tight text-foreground">
                    {s.metric}
                  </div>
                  <div className="text-xs text-muted-foreground">{s.metricLabel}</div>
                </div>
                <a
                  href="/"
                  className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
                >
                  Read story <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
                </a>
              </div>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export default CustomerStoryCardRow;

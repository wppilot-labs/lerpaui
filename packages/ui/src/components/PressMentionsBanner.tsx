"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Newspaper, ArrowUpRight } from "lucide-react";
import { cn } from "../lib/cn";

export interface PressMention {
  id: string;
  source: string;
  wordmark: string;
  headline: string;
  date: string;
}

export interface PressMentionsBannerProps {
  className?: string;
  eyebrow?: string;
  title?: string;
  mentions?: PressMention[];
}

const DEFAULT_MENTIONS: PressMention[] = [
  {
    id: "tc",
    source: "TechCrunch",
    wordmark: "TC",
    headline: "The fastest-growing React UI library this year",
    date: "May 12",
  },
  {
    id: "verge",
    source: "The Verge",
    wordmark: "V",
    headline: "Designers and engineers finally agree on something",
    date: "Apr 28",
  },
  {
    id: "wired",
    source: "Wired",
    wordmark: "W",
    headline: "Open-source design infrastructure for the AI era",
    date: "Apr 03",
  },
  {
    id: "fc",
    source: "Fast Company",
    wordmark: "FC",
    headline: "Most innovative companies in design tools",
    date: "Mar 19",
  },
  {
    id: "fwd",
    source: "Forbes",
    wordmark: "F",
    headline: "How a tiny team built the UI library powering 4,000 startups",
    date: "Feb 08",
  },
];

export function PressMentionsBanner({
  className,
  eyebrow = "As seen in",
  title = "Press coverage",
  mentions = DEFAULT_MENTIONS,
}: PressMentionsBannerProps) {
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
            <Newspaper className="h-3.5 w-3.5" aria-hidden />
            {eyebrow}
          </span>
          <h2
            id={headingId}
            className="mt-5 text-balance text-3xl font-semibold tracking-tight sm:text-4xl md:text-5xl"
          >
            {title}
          </h2>
        </div>

        <ul className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {mentions.map((m, i) => (
            <motion.li
              key={m.id}
              initial={reduced ? false : { opacity: 0, y: 12 }}
              whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
            >
              <a
                href="/"
                className="group flex items-start gap-4 rounded-2xl border bg-card p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
              >
                <span
                  aria-hidden
                  className="grid h-11 w-11 flex-shrink-0 place-items-center rounded-xl border border-border bg-background/80 font-mono text-sm font-bold tracking-tight text-foreground"
                >
                  {m.wordmark}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      {m.source}
                    </div>
                    <span className="font-mono text-xs text-muted-foreground">
                      {m.date}
                    </span>
                  </div>
                  <div className="mt-1 line-clamp-2 text-sm font-medium text-foreground/90 group-hover:text-foreground">
                    {m.headline}
                  </div>
                </div>
                <ArrowUpRight
                  className="h-4 w-4 flex-shrink-0 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary"
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

export default PressMentionsBanner;

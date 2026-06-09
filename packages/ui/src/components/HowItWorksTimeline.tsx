"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  GitBranch,
  PenTool,
  Beaker,
  Rocket,
  Activity,
} from "lucide-react";
import { cn } from "../lib/cn";

export interface HowItWorksTimelineProps {
  className?: string;
}

type Category = "all" | "design" | "engineering" | "launch";

const EVENTS = [
  {
    id: "discovery",
    date: "Week 1",
    title: "Discovery & research",
    description:
      "Interview users, audit your existing UI, and lock in measurable success criteria.",
    icon: GitBranch,
    category: "design" as const,
  },
  {
    id: "design",
    date: "Week 2",
    title: "Design system kickoff",
    description:
      "Apply your tokens to Lerpa UI primitives, map screens, and lock typographic scale.",
    icon: PenTool,
    category: "design" as const,
  },
  {
    id: "prototype",
    date: "Week 3",
    title: "Interactive prototype",
    description:
      "Compose real components into flows. Validate with stakeholders before writing logic.",
    icon: Beaker,
    category: "engineering" as const,
  },
  {
    id: "ship",
    date: "Week 4",
    title: "Production launch",
    description:
      "Wire data, pass accessibility audits, and deploy with confidence to your users.",
    icon: Rocket,
    category: "launch" as const,
  },
  {
    id: "iterate",
    date: "Week 5+",
    title: "Measure & iterate",
    description:
      "Instrument usage, gather feedback, and ship improvements without touching foundations.",
    icon: Activity,
    category: "launch" as const,
  },
] as const;

const FILTERS: { id: Category; label: string }[] = [
  { id: "all", label: "All" },
  { id: "design", label: "Design" },
  { id: "engineering", label: "Engineering" },
  { id: "launch", label: "Launch" },
];

export function HowItWorksTimeline({ className }: HowItWorksTimelineProps) {
  const headingId = React.useId();
  const reduceMotion = useReducedMotion();
  const [filter, setFilter] = React.useState<Category>("all");

  const visible = EVENTS.filter(
    (event) => filter === "all" || event.category === filter,
  );

  return (
    <section
      aria-labelledby={headingId}
      className={cn(
        "w-full max-w-3xl rounded-3xl border border-border/60 bg-card/40 p-8 text-foreground backdrop-blur-xl sm:p-10",
        className,
      )}
    >
      <header className="mb-8 flex flex-col gap-2">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
          Roadmap
        </p>
        <h2
          id={headingId}
          className="text-2xl font-semibold tracking-tight sm:text-3xl"
        >
          A predictable path from idea to launch
        </h2>
        <p className="max-w-xl text-sm text-muted-foreground">
          Five milestones we recommend for every project. Filter by track to
          focus on what your team owns.
        </p>
      </header>

      <div
        role="group"
        aria-label="Filter timeline by track"
        className="mb-8 flex flex-wrap gap-2"
      >
        {FILTERS.map((option) => {
          const isActive = filter === option.id;
          return (
            <button
              key={option.id}
              type="button"
              onClick={() => setFilter(option.id)}
              aria-pressed={isActive}
              className={cn(
                "rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                isActive
                  ? "border-primary/60 bg-primary/10 text-primary"
                  : "border-border bg-background/60 text-muted-foreground hover:text-foreground",
              )}
            >
              {option.label}
            </button>
          );
        })}
      </div>

      <ol className="relative">
        <span
          aria-hidden="true"
          className="absolute left-[19px] top-1 bottom-1 w-px overflow-hidden bg-border/60"
        >
          <motion.span
            className="block h-full w-full origin-top bg-gradient-to-b from-primary/80 via-primary/40 to-transparent"
            initial={reduceMotion ? false : { scaleY: 0 }}
            whileInView={reduceMotion ? undefined : { scaleY: 1 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={
              reduceMotion ? undefined : { duration: 1.1, ease: "easeOut" }
            }
          />
        </span>

        {visible.map((event, index) => {
          const Icon = event.icon;
          return (
            <motion.li
              key={event.id}
              initial={reduceMotion ? false : { opacity: 0, x: 12 }}
              whileInView={reduceMotion ? undefined : { opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={
                reduceMotion
                  ? undefined
                  : { duration: 0.35, delay: index * 0.08, ease: "easeOut" }
              }
              className="relative pl-14 pb-8 last:pb-0"
            >
              <span
                aria-hidden="true"
                className="absolute left-0 top-0 inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background text-primary shadow-sm"
              >
                <Icon className="h-4 w-4" />
              </span>

              <article>
                <div className="flex flex-wrap items-baseline gap-2">
                  <time className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    {event.date}
                  </time>
                  <span
                    className="rounded-full bg-muted/40 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-muted-foreground"
                    aria-label={`Track: ${event.category}`}
                  >
                    {event.category}
                  </span>
                </div>
                <h3 className="mt-1 text-base font-semibold text-foreground">
                  {event.title}
                </h3>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  {event.description}
                </p>
              </article>
            </motion.li>
          );
        })}
      </ol>
    </section>
  );
}

"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  Accessibility,
  Code2,
  GitBranch,
  Palette,
  Rocket,
  Timer,
} from "lucide-react";
import { cn } from "../lib/cn";

export interface BenefitsIconGridProps {
  className?: string;
}

const BENEFITS = [
  {
    title: "Ship in days",
    description: "Production blocks that drop into any Next.js or Vite project.",
    icon: Rocket,
  },
  {
    title: "Own your source",
    description: "Code lives in your repo — no runtime, no breaking updates.",
    icon: Code2,
  },
  {
    title: "Token-driven",
    description: "Themes are CSS variables. Swap a brand without touching markup.",
    icon: Palette,
  },
  {
    title: "Accessible by default",
    description: "Keyboard, screen reader, and contrast tested with axe-core.",
    icon: Accessibility,
  },
  {
    title: "Reduced-motion safe",
    description: "Every motion respects prefers-reduced-motion automatically.",
    icon: Timer,
  },
  {
    title: "Versioned with intent",
    description: "Semantic releases mean upgrades are a deliberate choice, not a surprise.",
    icon: GitBranch,
  },
] as const;

export function BenefitsIconGrid({ className }: BenefitsIconGridProps) {
  const headingId = React.useId();
  const reduceMotion = useReducedMotion();

  return (
    <section
      aria-labelledby={headingId}
      className={cn(
        "w-full max-w-5xl rounded-3xl border border-border/60 bg-card/40 p-8 text-foreground backdrop-blur-xl sm:p-10",
        className,
      )}
    >
      <header className="mb-8 max-w-2xl">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
          Built-in benefits
        </p>
        <h2
          id={headingId}
          className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl"
        >
          The boring things, handled
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Spend your time on the parts of your product that matter — we cover
          the foundations.
        </p>
      </header>

      <ul
        className="grid gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-3"
      >
        {BENEFITS.map((benefit, index) => {
          const Icon = benefit.icon;
          return (
            <motion.li
              key={benefit.title}
              initial={reduceMotion ? false : { opacity: 0, y: 10 }}
              whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={
                reduceMotion
                  ? undefined
                  : { duration: 0.35, delay: index * 0.07, ease: "easeOut" }
              }
              className="flex flex-col items-start"
            >
              <span
                aria-hidden="true"
                className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-primary/30 bg-primary/10 text-primary"
              >
                <Icon className="h-5 w-5" />
              </span>
              <h3 className="mt-4 text-base font-semibold text-foreground">
                {benefit.title}
              </h3>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                {benefit.description}
              </p>
            </motion.li>
          );
        })}
      </ul>
    </section>
  );
}

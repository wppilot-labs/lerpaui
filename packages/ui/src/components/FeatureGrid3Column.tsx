"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowUpRight,
  Boxes,
  Gauge,
  Keyboard,
  Layers,
  Paintbrush,
  ShieldCheck,
} from "lucide-react";
import { cn } from "../lib/cn";

export interface FeatureGrid3ColumnProps {
  className?: string;
}

const FEATURES = [
  {
    title: "Composable primitives",
    description:
      "Small, focused parts you arrange into anything — from a single button to a full marketing page.",
    icon: Boxes,
    href: "#composable",
  },
  {
    title: "Tokenized theming",
    description:
      "Color, spacing, type, and motion live as CSS variables you can swap per brand or per surface.",
    icon: Paintbrush,
    href: "#tokens",
  },
  {
    title: "Accessibility by default",
    description:
      "Keyboard, screen reader, and reduced-motion behavior verified by axe-core in CI on every commit.",
    icon: ShieldCheck,
    href: "#a11y",
  },
  {
    title: "Performance budget",
    description:
      "Tree-shakeable exports, lazy motion, and zero runtime CSS keep your INP and LCP healthy.",
    icon: Gauge,
    href: "#performance",
  },
  {
    title: "Stackable blocks",
    description:
      "Drop in heroes, pricing, dashboards, and footers that already speak the same design language.",
    icon: Layers,
    href: "#blocks",
  },
  {
    title: "Keyboard ergonomics",
    description:
      "Roving tabindex, focus rings, and arrow-key navigation built into every interactive primitive.",
    icon: Keyboard,
    href: "#keyboard",
  },
] as const;

export function FeatureGrid3Column({ className }: FeatureGrid3ColumnProps) {
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
          Why teams choose us
        </p>
        <h2
          id={headingId}
          className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl"
        >
          Everything you need to ship interfaces faster
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Six foundations that move the needle on the metrics product teams care
          about — without trading off design quality.
        </p>
      </header>

      <ul
        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
      >
        {FEATURES.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <motion.li
              key={feature.title}
              initial={reduceMotion ? false : { opacity: 0, y: 12 }}
              whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={
                reduceMotion
                  ? undefined
                  : { duration: 0.35, delay: index * 0.06, ease: "easeOut" }
              }
            >
              <article
                className={cn(
                  "group h-full rounded-2xl border border-border/60 bg-background/60 p-5 transition-all",
                  reduceMotion
                    ? "hover:border-border"
                    : "hover:-translate-y-0.5 hover:border-border hover:shadow-sm",
                )}
              >
                <span
                  aria-hidden="true"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-primary/30 bg-primary/10 text-primary"
                >
                  <Icon className="h-5 w-5" />
                </span>
                <h3 className="mt-4 text-base font-semibold text-foreground">
                  {feature.title}
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                  {feature.description}
                </p>
                <a
                  href={feature.href}
                  className={cn(
                    "mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary",
                    "transition-colors hover:text-primary/80",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                  )}
                >
                  Learn more
                  <ArrowUpRight
                    className={cn(
                      "h-4 w-4 transition-transform",
                      !reduceMotion && "group-hover:translate-x-0.5 group-hover:-translate-y-0.5",
                    )}
                    aria-hidden="true"
                  />
                </a>
              </article>
            </motion.li>
          );
        })}
      </ul>
    </section>
  );
}

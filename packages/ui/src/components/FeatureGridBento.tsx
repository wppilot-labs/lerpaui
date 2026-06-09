"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  BarChart3,
  Blocks,
  Globe2,
  Layers,
  Sparkles,
  Zap,
} from "lucide-react";
import { cn } from "../lib/cn";

export interface FeatureGridBentoProps {
  className?: string;
}

interface BentoCell {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  spanClass: string;
  mockup?: "analytics" | "stack" | "globe";
}

const CELLS: BentoCell[] = [
  {
    id: "analytics",
    title: "Real product analytics",
    description:
      "Drop in chart blocks with loading, empty, and tooltip states already wired up.",
    icon: BarChart3,
    spanClass: "md:col-span-2 md:row-span-2",
    mockup: "analytics",
  },
  {
    id: "speed",
    title: "Ship in minutes",
    description:
      "Copy-paste source straight into your repo — no runtime, no lock-in.",
    icon: Zap,
    spanClass: "md:col-span-2",
  },
  {
    id: "blocks",
    title: "60+ blocks ready",
    description: "Heroes, pricing, CTAs, dashboards — all share a single token map.",
    icon: Blocks,
    spanClass: "md:col-span-1",
    mockup: "stack",
  },
  {
    id: "global",
    title: "Worldwide ready",
    description: "RTL-friendly, locale-aware date and number formatting.",
    icon: Globe2,
    spanClass: "md:col-span-1",
    mockup: "globe",
  },
  {
    id: "compose",
    title: "Compose anything",
    description: "Tiny primitives with strict types compose into entire product surfaces.",
    icon: Layers,
    spanClass: "md:col-span-2",
  },
];

function AnalyticsMockup() {
  return (
    <div className="mt-5 rounded-xl border border-border/60 bg-background/60 p-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
            Monthly active
          </p>
          <p className="text-xl font-semibold text-foreground">128,420</p>
        </div>
        <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">
          <Sparkles className="h-3 w-3" aria-hidden="true" />
          +18%
        </span>
      </div>
      <div className="mt-3 flex h-20 items-end gap-1" aria-hidden="true">
        {[28, 44, 36, 60, 48, 72, 58, 80, 66, 90, 78, 100].map((h, i) => (
          <div
            key={i}
            className="flex-1 rounded-sm bg-gradient-to-t from-primary/30 to-primary/80"
            style={{ height: `${h}%` }}
          />
        ))}
      </div>
    </div>
  );
}

function StackMockup() {
  return (
    <div className="mt-4 space-y-1.5" aria-hidden="true">
      {["Hero", "Pricing", "Dashboard"].map((label, i) => (
        <div
          key={label}
          className={cn(
            "rounded-md border border-border/60 bg-background/60 px-2.5 py-1.5 text-[10px] font-medium text-muted-foreground",
            i === 0 && "border-primary/40 text-primary",
          )}
        >
          {label}
        </div>
      ))}
    </div>
  );
}

function GlobeMockup() {
  return (
    <div className="mt-4 flex justify-center" aria-hidden="true">
      <div className="relative h-20 w-20 rounded-full border border-primary/30 bg-[radial-gradient(circle_at_30%_30%,oklch(0.85_0.15_240/0.35),transparent_60%)]">
        <span className="absolute left-2 top-3 h-px w-16 rotate-12 bg-primary/30" />
        <span className="absolute left-1 top-9 h-px w-[72px] -rotate-6 bg-primary/20" />
        <span className="absolute left-3 bottom-3 h-px w-12 rotate-[20deg] bg-primary/20" />
        <span className="absolute right-3 top-4 h-1.5 w-1.5 rounded-full bg-primary" />
        <span className="absolute left-3 bottom-4 h-1.5 w-1.5 rounded-full bg-primary/60" />
      </div>
    </div>
  );
}

function Mockup({ kind }: { kind: BentoCell["mockup"] }) {
  if (kind === "analytics") return <AnalyticsMockup />;
  if (kind === "stack") return <StackMockup />;
  if (kind === "globe") return <GlobeMockup />;
  return null;
}

export function FeatureGridBento({ className }: FeatureGridBentoProps) {
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
          The toolkit
        </p>
        <h2
          id={headingId}
          className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl"
        >
          A complete kit for product surfaces
        </h2>
      </header>

      <ul
        className="grid auto-rows-[minmax(160px,auto)] grid-cols-1 gap-4 md:grid-cols-4"
      >
        {CELLS.map((cell, index) => {
          const Icon = cell.icon;
          return (
            <motion.li
              key={cell.id}
              initial={reduceMotion ? false : { opacity: 0, y: 12 }}
              whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={
                reduceMotion
                  ? undefined
                  : { duration: 0.4, delay: index * 0.07, ease: "easeOut" }
              }
              className={cn("group", cell.spanClass)}
            >
              <article
                className={cn(
                  "relative h-full overflow-hidden rounded-2xl border border-border/60 bg-background/60 p-5 transition-colors",
                  "hover:border-border",
                )}
              >
                <div className="flex items-start gap-3">
                  <span
                    aria-hidden="true"
                    className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-primary/30 bg-primary/10 text-primary"
                  >
                    <Icon className="h-4 w-4" />
                  </span>
                  <div className="min-w-0">
                    <h3 className="text-base font-semibold text-foreground">
                      {cell.title}
                    </h3>
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                      {cell.description}
                    </p>
                  </div>
                </div>
                <Mockup kind={cell.mockup} />
              </article>
            </motion.li>
          );
        })}
      </ul>
    </section>
  );
}

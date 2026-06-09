"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Check, TrendingUp, Users, Zap } from "lucide-react";
import { cn } from "../lib/cn";

export interface BenefitsSplitContentProps {
  className?: string;
}

const BENEFITS = [
  {
    title: "Cut design-to-production time in half",
    description:
      "Skip the bespoke component build. Drop in production-ready primitives that already match your brand.",
  },
  {
    title: "Ship a consistent experience",
    description:
      "Every block speaks the same token language — colors, spacing, motion, and type stay coherent.",
  },
  {
    title: "Keep ownership of your code",
    description:
      "Source lives in your repository. No runtime dependency, no breaking upgrades down the line.",
  },
];

const STATS = [
  { label: "Faster shipping", value: "2.4x", icon: Zap },
  { label: "Team velocity", value: "+38%", icon: TrendingUp },
  { label: "Engineers onboarded", value: "12k+", icon: Users },
];

export function BenefitsSplitContent({ className }: BenefitsSplitContentProps) {
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
      <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-12">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, x: -12 }}
          whileInView={reduceMotion ? undefined : { opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={
            reduceMotion ? undefined : { duration: 0.45, ease: "easeOut" }
          }
        >
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
            Why it matters
          </p>
          <h2
            id={headingId}
            className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl"
          >
            Outcomes your team will feel in the first sprint
          </h2>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
            Skip the months of foundational work and focus your effort on the
            product surfaces that move your metrics.
          </p>

          <ul className="mt-6 space-y-4">
            {BENEFITS.map((benefit) => (
              <li key={benefit.title} className="flex items-start gap-3">
                <span
                  aria-hidden="true"
                  className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-primary/40 bg-primary/10 text-primary"
                >
                  <Check className="h-3.5 w-3.5" />
                </span>
                <div>
                  <h3 className="text-sm font-semibold text-foreground">
                    {benefit.title}
                  </h3>
                  <p className="mt-0.5 text-sm leading-relaxed text-muted-foreground">
                    {benefit.description}
                  </p>
                </div>
              </li>
            ))}
          </ul>

          <a
            href="#get-started"
            className={cn(
              "mt-8 inline-flex items-center gap-1.5 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground",
              "transition-colors hover:bg-primary/90",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background",
            )}
          >
            Start a project
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </a>
        </motion.div>

        <motion.div
          initial={reduceMotion ? false : { opacity: 0, x: 12 }}
          whileInView={reduceMotion ? undefined : { opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={
            reduceMotion
              ? undefined
              : { duration: 0.45, delay: 0.1, ease: "easeOut" }
          }
          className="relative"
        >
          <div
            aria-hidden="true"
            className="absolute inset-0 -z-10 rounded-3xl bg-[radial-gradient(circle_at_30%_20%,oklch(0.85_0.18_270/0.18),transparent_55%),radial-gradient(circle_at_80%_80%,oklch(0.85_0.15_180/0.15),transparent_55%)]"
          />

          <dl className="grid gap-3 rounded-3xl border border-border/60 bg-background/70 p-5">
            {STATS.map((stat) => {
              const Icon = stat.icon;
              return (
                <div
                  key={stat.label}
                  className="flex items-center gap-4 rounded-2xl border border-border/60 bg-card/80 p-4"
                >
                  <span
                    aria-hidden="true"
                    className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-primary/30 bg-primary/10 text-primary"
                  >
                    <Icon className="h-5 w-5" />
                  </span>
                  <div>
                    <dt className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      {stat.label}
                    </dt>
                    <dd className="mt-0.5 text-2xl font-semibold text-foreground">
                      {stat.value}
                    </dd>
                  </div>
                </div>
              );
            })}

            <p className="px-1 pt-1 text-xs text-muted-foreground">
              Reported by teams that adopted the toolkit in 2025.
            </p>
          </dl>
        </motion.div>
      </div>
    </section>
  );
}

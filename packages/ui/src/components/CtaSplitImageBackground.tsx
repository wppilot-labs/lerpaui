"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { cn } from "../lib/cn";

export interface CtaSplitImageBackgroundProps {
  className?: string;
  eyebrow?: string;
  headline?: string;
  subline?: string;
  primaryHref?: string;
  primaryLabel?: string;
  secondaryHref?: string;
  secondaryLabel?: string;
}

export function CtaSplitImageBackground({
  className,
  eyebrow = "Limited beta",
  headline = "Ship faster with one source of truth",
  subline = "Centralise specs, design, and code in a workspace your team actually wants to live in.",
  primaryHref = "#get-started",
  primaryLabel = "Start free trial",
  secondaryHref = "#demo",
  secondaryLabel = "Watch demo",
}: CtaSplitImageBackgroundProps) {
  const reduced = useReducedMotion() ?? false;
  const headingId = React.useId();

  return (
    <section
      aria-labelledby={headingId}
      className={cn(
        "relative isolate w-full overflow-hidden rounded-3xl py-16 md:py-24",
        className
      )}
    >
      <div aria-hidden className="absolute inset-0 -z-20">
        <div className="absolute inset-0 bg-[linear-gradient(115deg,oklch(0.2_0.04_280)_0%,oklch(0.25_0.06_260)_45%,oklch(0.18_0.04_220)_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(60%_60%_at_30%_30%,oklch(0.7_0.22_280/0.45),transparent_60%),radial-gradient(50%_50%_at_85%_75%,oklch(0.7_0.18_200/0.4),transparent_60%)]" />
        <svg className="absolute inset-0 h-full w-full opacity-25" aria-hidden>
          <defs>
            <pattern id="grid-cta-split" width="50" height="50" patternUnits="userSpaceOnUse">
              <path d="M 50 0 L 0 0 0 50" fill="none" stroke="white" strokeOpacity="0.15" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid-cta-split)" />
        </svg>
      </div>

      <div className="relative mx-auto flex max-w-3xl flex-col items-center px-6 text-center text-white sm:px-12">
        <motion.span
          initial={reduced ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[11px] font-medium uppercase tracking-widest text-white/80 backdrop-blur-md"
        >
          <Sparkles className="h-3 w-3" aria-hidden /> {eyebrow}
        </motion.span>
        <motion.h2
          id={headingId}
          initial={reduced ? false : { opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.08 }}
          className="mt-5 text-balance text-4xl font-black leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl"
        >
          {headline}
        </motion.h2>
        <motion.p
          initial={reduced ? false : { opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.16 }}
          className="mt-5 max-w-xl text-pretty text-base leading-relaxed text-white/75 sm:text-lg"
        >
          {subline}
        </motion.p>
        <motion.div
          initial={reduced ? false : { opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.24 }}
          className="mt-8 flex flex-col items-center gap-3 sm:flex-row"
        >
          <a
            href={primaryHref}
            className="group inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-xl shadow-primary/25 transition-all hover:brightness-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
          >
            {primaryLabel}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none" aria-hidden />
          </a>
          <a
            href={secondaryHref}
            className="inline-flex items-center justify-center rounded-xl border border-white/25 bg-white/5 px-6 py-3 text-sm font-semibold text-white backdrop-blur-sm transition-colors hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
          >
            {secondaryLabel}
          </a>
        </motion.div>
      </div>
    </section>
  );
}

export default CtaSplitImageBackground;

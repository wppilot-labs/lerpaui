"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Sparkles, Star } from "lucide-react";
import { cn } from "../lib/cn";

export interface HeroSaasGradientProps {
  className?: string;
}

const LOGOS = ["Linear", "Vercel", "Stripe", "Notion", "Loom"];

export function HeroSaasGradient({ className }: HeroSaasGradientProps) {
  const reduced = useReducedMotion();
  const headingId = React.useId();

  return (
    <section
      aria-labelledby={headingId}
      className={cn(
        "relative isolate w-full overflow-hidden rounded-3xl border border-border/50 bg-background px-6 py-20 sm:px-12 sm:py-28",
        className
      )}
    >
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,oklch(0.72_0.22_300/0.22),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,oklch(0.78_0.18_200/0.22),transparent_55%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,oklch(0.7_0.2_30/0.18),transparent_55%)]" />
        <svg
          className="absolute inset-0 h-full w-full text-foreground/[0.04]"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern id="hsg-grid" x="0" y="0" width="48" height="48" patternUnits="userSpaceOnUse">
              <path d="M48 0H0V48" fill="none" stroke="currentColor" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#hsg-grid)" />
        </svg>
      </div>

      <div className="relative z-10 mx-auto max-w-3xl text-center">
        <motion.div
          initial={reduced ? false : { opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/60 px-3.5 py-1.5 text-xs text-muted-foreground backdrop-blur-sm"
        >
          <span className="flex -space-x-1">
            {[0, 1, 2, 3].map((i) => (
              <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" aria-hidden />
            ))}
          </span>
          <span className="text-foreground/80">
            <span className="font-bold">4.9</span> from 2,400+ teams
          </span>
        </motion.div>

        <motion.h1
          id={headingId}
          initial={reduced ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.08 }}
          className="mt-7 text-balance text-5xl font-black leading-[1.02] tracking-tight text-foreground sm:text-6xl lg:text-7xl"
        >
          The operating system for{" "}
          <span
            className="bg-clip-text text-transparent"
            style={{
              backgroundImage:
                "linear-gradient(135deg, oklch(0.85 0.2 90), oklch(0.78 0.22 320), oklch(0.78 0.2 200))",
            }}
          >
            modern product teams
          </span>
        </motion.h1>

        <motion.p
          initial={reduced ? false : { opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.18 }}
          className="mx-auto mt-6 max-w-xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg"
        >
          One toolchain to plan, build, review, and launch. Replace seven point-tools with a
          single, opinionated workspace.
        </motion.p>

        <motion.div
          initial={reduced ? false : { opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.26 }}
          className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row"
        >
          <a
            href="#start"
            className="group inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/30 transition-all hover:-translate-y-0.5 hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 motion-reduce:hover:translate-y-0"
          >
            <Sparkles className="h-4 w-4" aria-hidden />
            Start building free
            <ArrowRight
              className="h-4 w-4 transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none"
              aria-hidden
            />
          </a>
          <a
            href="#demo"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-card/60 px-6 py-3 text-sm font-semibold text-foreground backdrop-blur-sm transition-colors hover:bg-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
          >
            Watch the 2-min demo
          </a>
        </motion.div>

        <motion.div
          initial={reduced ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="mt-14 border-t border-border/40 pt-6"
        >
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground/70">
            Trusted by teams at
          </p>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm font-semibold text-muted-foreground/80">
            {LOGOS.map((l) => (
              <span key={l} className="opacity-80 transition-opacity hover:opacity-100">
                {l}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default HeroSaasGradient;

"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { BookOpen, Star, ArrowRight } from "lucide-react";
import { cn } from "../lib/cn";

export interface HeroBookLaunchProps {
  className?: string;
  eyebrow?: string;
  title?: string;
  description?: string;
  coverLabel?: string;
  coverTitle?: string;
  coverAuthor?: string;
  quote?: string;
  quoteAuthor?: string;
  primaryCtaLabel?: string;
  secondaryCtaLabel?: string;
  rating?: string;
  retailers?: string[];
}

const DEFAULT_RETAILERS = ["Amazon", "Bookshop", "Apple Books", "Audible"];

/** Book launch hero with mock cover, author note, and buy CTAs. */
export function HeroBookLaunch({
  className,
  eyebrow = "New release · Apr 2026",
  title = "Shipping Without Drama",
  description = "A field guide for teams that want to release on Friday, sleep on Saturday, and still ship faster than the competition.",
  coverLabel = "A field guide",
  coverTitle = "Shipping\nWithout\nDrama",
  coverAuthor = "M. Chen",
  quote = "The book I wish I'd had when I started my first engineering team. Practical, humane, and refreshingly free of cargo cults.",
  quoteAuthor = "— D. Patel, VP Engineering",
  primaryCtaLabel = "Pre-order — $24",
  secondaryCtaLabel = "Read a sample",
  rating = "4.8 from 320 readers",
  retailers = DEFAULT_RETAILERS,
}: HeroBookLaunchProps) {
  const reduced = useReducedMotion();
  const headingId = React.useId();

  return (
    <section
      aria-labelledby={headingId}
      className={cn(
        "relative isolate w-full overflow-hidden rounded-3xl border border-border/50 bg-card/30 px-6 py-16 backdrop-blur-xl sm:px-12 md:py-24",
        className,
      )}
    >
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -left-24 top-0 h-72 w-72 rounded-full bg-primary/15 blur-3xl" />
        <div className="absolute -right-24 bottom-0 h-80 w-80 rounded-full bg-accent/12 blur-3xl" />
      </div>

      <div className="relative mx-auto grid max-w-5xl items-center gap-10 lg:grid-cols-[auto_1fr]">
        <motion.div
          initial={reduced ? false : { opacity: 0, y: 16, rotate: -4 }}
          animate={{ opacity: 1, y: 0, rotate: -4 }}
          transition={{ duration: 0.7 }}
          className="mx-auto"
          aria-hidden
        >
          <div className="relative h-72 w-52 rounded-r-md rounded-l-sm bg-gradient-to-br from-primary via-primary/90 to-accent p-5 shadow-2xl shadow-primary/30 sm:h-80 sm:w-56">
            <div className="absolute inset-y-0 left-0 w-2 rounded-l-sm bg-black/20" />
            <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-primary-foreground/70">
              {coverLabel}
            </p>
            <p className="mt-6 whitespace-pre-line text-2xl font-black leading-tight text-primary-foreground">
              {coverTitle}
            </p>
            <p className="absolute bottom-5 left-5 text-xs font-semibold uppercase tracking-widest text-primary-foreground/70">
              {coverAuthor}
            </p>
          </div>
        </motion.div>

        <div>
          <motion.span
            initial={reduced ? false : { opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-primary"
          >
            <BookOpen className="h-3.5 w-3.5" aria-hidden />
            {eyebrow}
          </motion.span>

          <motion.h1
            id={headingId}
            initial={reduced ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.08 }}
            className="mt-5 text-balance text-3xl font-semibold tracking-tight text-foreground sm:text-4xl md:text-5xl"
          >
            {title}
          </motion.h1>

          <motion.p
            initial={reduced ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.14 }}
            className="mt-4 max-w-md text-base leading-relaxed text-muted-foreground md:text-lg"
          >
            {description}
          </motion.p>

          <motion.blockquote
            initial={reduced ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.22 }}
            className="mt-5 rounded-2xl border bg-card p-4 text-sm italic text-foreground/90 shadow-sm"
          >
            &ldquo;{quote}&rdquo;
            <footer className="mt-2 not-italic text-xs font-semibold text-muted-foreground">
              {quoteAuthor}
            </footer>
          </motion.blockquote>

          <motion.div
            initial={reduced ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.3 }}
            className="mt-6 flex flex-wrap gap-3"
          >
            <a
              href="#preorder"
              className="group inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
            >
              {primaryCtaLabel}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none" aria-hidden />
            </a>
            <a
              href="#sample"
              className="inline-flex items-center gap-2 rounded-xl border border-border bg-background px-5 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
            >
              {secondaryCtaLabel}
            </a>
          </motion.div>

          <motion.div
            initial={reduced ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.55, delay: 0.4 }}
            className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground"
          >
            <span className="inline-flex items-center gap-1">
              <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" aria-hidden />
              {rating}
            </span>
            <span className="text-muted-foreground/70">Also at:</span>
            {retailers.map((r) => (
              <a key={r} href="/" className="hover:text-foreground">
                {r}
              </a>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default HeroBookLaunch;

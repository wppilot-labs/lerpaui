"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Quote, Star } from "lucide-react";
import { cn } from "../lib/cn";

export interface TestimonialQuoteSpotlightProps {
  className?: string;
  quote?: string;
  name?: string;
  role?: string;
  company?: string;
  initials?: string;
  rating?: number;
  metric?: { value: string; label: string };
}

export function TestimonialQuoteSpotlight({
  className,
  quote = "We replaced four tools with this one platform. Ship velocity tripled and our marketing team stopped waiting on engineering. It's the single best decision we made this year.",
  name = "Naomi Park",
  role = "VP Marketing",
  company = "Helio Studio",
  initials = "NP",
  rating = 5,
  metric = { value: "3x", label: "Faster ship cycles" },
}: TestimonialQuoteSpotlightProps) {
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
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/4 top-0 h-72 w-[36rem] -translate-x-1/2 rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute right-0 bottom-0 h-64 w-64 rounded-full bg-accent/15 blur-3xl" />
      </div>

      <div className="relative mx-auto grid max-w-6xl gap-10 md:grid-cols-[1.4fr_1fr] md:items-center">
        <motion.div
          initial={reduced ? false : { opacity: 0, y: 16 }}
          whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <Quote className="h-12 w-12 text-primary/30" aria-hidden />
          <h2
            id={headingId}
            className="mt-6 text-balance text-3xl font-semibold leading-tight tracking-tight text-foreground sm:text-4xl md:text-5xl"
          >
            &ldquo;{quote}&rdquo;
          </h2>

          <div
            className="mt-6 flex items-center gap-1"
            aria-label={`${rating} out of 5 stars`}
          >
            {Array.from({ length: rating }).map((_, i) => (
              <Star
                key={i}
                className="h-5 w-5 fill-amber-400 text-amber-400"
                aria-hidden
              />
            ))}
          </div>

          <figcaption className="mt-6 flex items-center gap-4">
            <div
              className="grid h-12 w-12 place-items-center rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 font-bold text-white"
              aria-hidden
            >
              {initials}
            </div>
            <div>
              <div className="font-semibold text-foreground">{name}</div>
              <div className="text-sm text-muted-foreground">
                {role}, {company}
              </div>
            </div>
          </figcaption>
        </motion.div>

        <motion.div
          initial={reduced ? false : { opacity: 0, scale: 0.95 }}
          whileInView={reduced ? undefined : { opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.12 }}
          className="rounded-2xl border bg-card p-8 shadow-sm"
        >
          <div className="text-sm uppercase tracking-wider text-muted-foreground">
            Outcome
          </div>
          <div className="mt-2 bg-gradient-to-br from-primary via-primary to-accent bg-clip-text text-6xl font-semibold tracking-tight text-transparent sm:text-7xl">
            {metric.value}
          </div>
          <div className="mt-2 text-base text-foreground/90">{metric.label}</div>
          <div className="mt-6 border-t border-border/60 pt-4 text-xs text-muted-foreground">
            Measured across 90 days post-launch on {company}&rsquo;s public surfaces.
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default TestimonialQuoteSpotlight;

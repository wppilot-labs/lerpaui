"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Sparkles, Check } from "lucide-react";
import { cn } from "../lib/cn";

export interface HeroSaasSimpleProps {
  className?: string;
}

const HIGHLIGHTS = [
  "No credit card required",
  "14-day free trial",
  "Cancel anytime",
];

export function HeroSaasSimple({ className }: HeroSaasSimpleProps) {
  const reduced = useReducedMotion();
  const headingId = React.useId();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <section
      aria-labelledby={headingId}
      className={cn(
        "relative isolate w-full overflow-hidden rounded-3xl border border-border/50 bg-card/30 px-6 py-20 backdrop-blur-xl sm:px-12 sm:py-28",
        className
      )}
    >
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -left-24 top-0 h-72 w-72 rounded-full bg-primary/15 blur-3xl" />
        <div className="absolute -right-24 bottom-0 h-80 w-80 rounded-full bg-accent/10 blur-3xl" />
        <div
          className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent"
        />
      </div>

      <div className="relative z-10 mx-auto max-w-2xl text-center">
        <motion.span
          initial={reduced ? false : { opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-primary"
        >
          <Sparkles className="h-3.5 w-3.5" aria-hidden />
          v3.0 — Now shipping
        </motion.span>

        <motion.h1
          id={headingId}
          initial={reduced ? false : { opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.05 }}
          className="mt-6 text-balance text-4xl font-black leading-[1.05] tracking-tight text-foreground sm:text-5xl lg:text-6xl"
        >
          Ship product like the{" "}
          <span className="bg-gradient-to-br from-primary via-primary to-accent bg-clip-text text-transparent">
            best teams
          </span>{" "}
          on the planet.
        </motion.h1>

        <motion.p
          initial={reduced ? false : { opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.12 }}
          className="mx-auto mt-5 max-w-xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg"
        >
          The opinionated workspace for product teams who treat velocity as a craft. Plan, build,
          and ship in one connected surface.
        </motion.p>

        <motion.form
          onSubmit={handleSubmit}
          initial={reduced ? false : { opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.2 }}
          className="mx-auto mt-8 flex w-full max-w-md flex-col gap-2 sm:flex-row"
        >
          <label htmlFor="hero-saas-simple-email" className="sr-only">
            Work email
          </label>
          <input
            id="hero-saas-simple-email"
            type="email"
            required
            placeholder="name@company.com"
            className="flex-1 rounded-xl border border-border/60 bg-background/60 px-4 py-3 text-sm text-foreground shadow-inner shadow-black/20 placeholder:text-muted-foreground/60 focus:border-primary/60 focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
          <button
            type="submit"
            className="group inline-flex items-center justify-center gap-1.5 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:-translate-y-0.5 hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-primary/40 motion-reduce:hover:translate-y-0"
          >
            Start free
            <ArrowRight
              className="h-4 w-4 transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none"
              aria-hidden
            />
          </button>
        </motion.form>

        <motion.ul
          initial={reduced ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.32 }}
          className="mx-auto mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-muted-foreground"
        >
          {HIGHLIGHTS.map((h) => (
            <li key={h} className="inline-flex items-center gap-1.5">
              <Check className="h-3.5 w-3.5 text-primary" aria-hidden />
              {h}
            </li>
          ))}
        </motion.ul>
      </div>
    </section>
  );
}

export default HeroSaasSimple;

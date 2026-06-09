"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Mail, Check } from "lucide-react";
import { cn } from "../lib/cn";

export interface HeroNewsletterLandingProps {
  className?: string;
}

const AVATAR_COLORS = [
  "from-rose-400 to-amber-300",
  "from-sky-400 to-violet-400",
  "from-emerald-400 to-teal-300",
  "from-fuchsia-400 to-pink-300",
];

/** Newsletter landing hero with single-field subscribe and avatar social proof. */
export function HeroNewsletterLanding({ className }: HeroNewsletterLandingProps) {
  const reduced = useReducedMotion();
  const headingId = React.useId();
  const [submitted, setSubmitted] = React.useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <section
      aria-labelledby={headingId}
      className={cn(
        "relative isolate w-full overflow-hidden rounded-3xl border border-border/50 bg-card/30 px-6 py-16 backdrop-blur-xl sm:px-12 md:py-24",
        className,
      )}
    >
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-1/2 h-72 w-[40rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/12 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-2xl text-center">
        <motion.span
          initial={reduced ? false : { opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-primary"
        >
          <Mail className="h-3.5 w-3.5" aria-hidden />
          Weekly · 2 min read
        </motion.span>

        <motion.h1
          id={headingId}
          initial={reduced ? false : { opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.06 }}
          className="mt-5 text-balance text-3xl font-semibold tracking-tight text-foreground sm:text-4xl md:text-5xl"
        >
          The newsletter for{" "}
          <span className="bg-gradient-to-br from-primary via-primary to-accent bg-clip-text text-transparent">
            curious engineers.
          </span>
        </motion.h1>

        <motion.p
          initial={reduced ? false : { opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.14 }}
          className="mx-auto mt-5 max-w-md text-base leading-relaxed text-muted-foreground md:text-lg"
        >
          A handpicked digest of essays, tools, and case studies — delivered Friday at 9am.
        </motion.p>

        <motion.form
          onSubmit={handleSubmit}
          initial={reduced ? false : { opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.22 }}
          className="mx-auto mt-8 flex w-full max-w-md flex-col gap-2 sm:flex-row"
        >
          <label htmlFor="hero-nl-email" className="sr-only">
            Email
          </label>
          <input
            id="hero-nl-email"
            type="email"
            required
            disabled={submitted}
            placeholder="you@domain.com"
            className="flex-1 rounded-xl border border-border/60 bg-background/60 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-primary/60 focus:outline-none focus:ring-2 focus:ring-[var(--ring)] disabled:opacity-60"
          />
          <button
            type="submit"
            disabled={submitted}
            className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] disabled:opacity-70"
          >
            {submitted ? (
              <>
                <Check className="h-4 w-4" aria-hidden />
                Subscribed
              </>
            ) : (
              "Subscribe"
            )}
          </button>
        </motion.form>

        <motion.div
          initial={reduced ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.55, delay: 0.34 }}
          className="mt-7 inline-flex items-center gap-3 text-xs text-muted-foreground"
        >
          <span className="flex -space-x-2">
            {AVATAR_COLORS.map((c, i) => (
              <span
                key={i}
                aria-hidden
                className={cn(
                  "h-6 w-6 rounded-full border-2 border-card bg-gradient-to-br",
                  c,
                )}
              />
            ))}
          </span>
          <span>
            <span className="font-semibold text-foreground">18,400+ readers</span> · including
            engineers from Vercel, Stripe, and Figma
          </span>
        </motion.div>

        <p className="mt-4 text-[11px] text-muted-foreground/70">
          No spam. Unsubscribe in one click.
        </p>
      </div>
    </section>
  );
}

export default HeroNewsletterLanding;

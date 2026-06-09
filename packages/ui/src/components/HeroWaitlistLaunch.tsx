"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Mail, Rocket, Users } from "lucide-react";
import { cn } from "../lib/cn";

export interface HeroWaitlistLaunchProps {
  className?: string;
}

const AVATAR_TONES = [
  "from-rose-400 to-amber-400",
  "from-sky-400 to-indigo-500",
  "from-emerald-400 to-teal-500",
  "from-fuchsia-400 to-purple-500",
  "from-orange-400 to-red-500",
];

const AVATAR_INITIALS = ["AK", "MR", "JL", "SO", "TN"];

export function HeroWaitlistLaunch({ className }: HeroWaitlistLaunchProps) {
  const reduced = useReducedMotion() ?? false;
  const headingId = React.useId();
  const emailId = React.useId();

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
        <div className="absolute left-1/2 top-0 h-72 w-[36rem] -translate-x-1/2 rounded-full bg-primary/15 blur-3xl" />
        <div className="absolute bottom-0 left-1/2 h-px w-2/3 -translate-x-1/2 bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
      </div>

      <div className="relative mx-auto flex max-w-2xl flex-col items-center text-center">
        <motion.span
          initial={reduced ? false : { opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-primary"
        >
          <Rocket className="h-3.5 w-3.5" aria-hidden />
          Launching soon
        </motion.span>

        <motion.h1
          id={headingId}
          initial={reduced ? false : { opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.06 }}
          className="mt-6 text-balance text-4xl font-black leading-[1.05] tracking-tight text-foreground sm:text-5xl lg:text-6xl"
        >
          The fastest way to build,{" "}
          <span className="bg-gradient-to-br from-primary via-primary to-accent bg-clip-text text-transparent">
            ship and grow
          </span>{" "}
          your next product.
        </motion.h1>

        <motion.p
          initial={reduced ? false : { opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.12 }}
          className="mt-5 max-w-xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg"
        >
          Join the private beta and be first to try the toolkit indie hackers and small teams are
          using to launch in days, not quarters.
        </motion.p>

        <motion.form
          onSubmit={handleSubmit}
          initial={reduced ? false : { opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.2 }}
          className="mt-8 flex w-full max-w-md flex-col gap-2 sm:flex-row"
        >
          <label htmlFor={emailId} className="sr-only">
            Email address
          </label>
          <div className="relative flex-1">
            <Mail
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden
            />
            <input
              id={emailId}
              type="email"
              required
              aria-required="true"
              autoComplete="email"
              placeholder="you@domain.com"
              className="w-full rounded-xl border border-border/60 bg-background/60 px-4 py-3 pl-9 text-sm text-foreground shadow-inner shadow-black/20 placeholder:text-muted-foreground/60 focus:border-primary/60 focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
          <button
            type="submit"
            className="group inline-flex items-center justify-center gap-1.5 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:-translate-y-0.5 hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-primary/40 motion-reduce:hover:translate-y-0"
          >
            Join waitlist
            <ArrowRight
              className="h-4 w-4 transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none"
              aria-hidden
            />
          </button>
        </motion.form>

        <motion.div
          initial={reduced ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.32 }}
          className="mt-6 flex flex-col items-center gap-3 sm:flex-row"
        >
          <ul aria-label="Recent waitlist members" className="flex -space-x-2">
            {AVATAR_INITIALS.map((initials, i) => (
              <li
                key={initials}
                aria-hidden
                className={cn(
                  "inline-flex h-7 w-7 items-center justify-center rounded-full border-2 border-background bg-gradient-to-br text-[10px] font-semibold text-white shadow-sm",
                  AVATAR_TONES[i % AVATAR_TONES.length]
                )}
              >
                {initials}
              </li>
            ))}
          </ul>
          <p className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
            <Users className="h-3.5 w-3.5 text-primary" aria-hidden />
            <strong className="font-semibold text-foreground">2,847+</strong>
            developers already joined
          </p>
        </motion.div>
      </div>
    </section>
  );
}

export default HeroWaitlistLaunch;

"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { cn } from "../lib/cn";

export interface FinalCtaBannerProps {
  className?: string;
}

export function FinalCtaBanner({ className }: FinalCtaBannerProps) {
  const reduced = useReducedMotion() ?? false;
  const headingId = React.useId();
  const patternId = React.useId();

  return (
    <section
      aria-labelledby={headingId}
      className={cn(
        "relative isolate w-full overflow-hidden rounded-3xl border border-border/50 bg-card/30 px-6 py-20 text-center backdrop-blur-xl sm:px-12 sm:py-28",
        className
      )}
    >
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(120%_80%_at_50%_0%,oklch(0.65_0.2_280/0.35),transparent_55%),radial-gradient(120%_80%_at_50%_100%,oklch(0.65_0.2_200/0.3),transparent_55%)]" />
        <svg
          className="absolute inset-0 h-full w-full opacity-[0.18]"
          width="100%"
          height="100%"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden
        >
          <defs>
            <pattern
              id={patternId}
              x="0"
              y="0"
              width="40"
              height="40"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M0 40L40 0M-10 10L10 -10M30 50L50 30"
                stroke="currentColor"
                strokeWidth="0.6"
                className="text-foreground/60"
                fill="none"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill={`url(#${patternId})`} />
        </svg>
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-accent/40 to-transparent" />
      </div>

      <div className="relative mx-auto flex max-w-2xl flex-col items-center">
        <motion.h2
          id={headingId}
          initial={reduced ? false : { opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.05 }}
          className="text-balance text-4xl font-black leading-[1.05] tracking-tight text-foreground sm:text-5xl lg:text-6xl"
        >
          Ready to ship something{" "}
          <span className="bg-gradient-to-br from-primary via-primary to-accent bg-clip-text text-transparent">
            worth talking about?
          </span>
        </motion.h2>

        <motion.p
          initial={reduced ? false : { opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.12 }}
          className="mt-5 max-w-xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg"
        >
          Spin up your first project in minutes and join thousands of teams building faster with a
          toolkit they actually enjoy.
        </motion.p>

        <motion.div
          initial={reduced ? false : { opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.2 }}
          className="mt-8 flex flex-col items-center gap-3"
        >
          <a
            href="#get-started"
            className="group inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-7 py-3.5 text-base font-semibold text-primary-foreground shadow-xl shadow-primary/30 transition-all hover:brightness-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
          >
            Get started for free
            <ArrowRight
              className="h-5 w-5 transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none"
              aria-hidden
            />
          </a>
          <p className="text-xs text-muted-foreground">
            No credit card required · Free forever for personal projects
          </p>
        </motion.div>
      </div>
    </section>
  );
}

export default FinalCtaBanner;

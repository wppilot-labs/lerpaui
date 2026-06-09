"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Sparkles, ArrowRight } from "lucide-react";
import { cn } from "../lib/cn";

export interface BannerEarlyAccessProps {
  className?: string;
  /** Number of seats taken so far. */
  taken?: number;
  /** Total seats available. */
  total?: number;
}

/** Invite-only early access banner with a progress meter showing remaining seats. */
export function BannerEarlyAccess({
  className,
  taken = 1840,
  total = 2500,
}: BannerEarlyAccessProps) {
  const reduced = useReducedMotion();
  const headingId = React.useId();
  const pct = Math.min(100, Math.round((taken / total) * 100));
  const remaining = Math.max(0, total - taken);

  return (
    <motion.section
      aria-labelledby={headingId}
      initial={reduced ? false : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={cn(
        "relative isolate w-full overflow-hidden rounded-2xl border border-primary/30 bg-gradient-to-r from-primary/15 via-accent/15 to-primary/15 p-1.5 shadow-lg shadow-primary/10",
        className,
      )}
    >
      <div className="rounded-xl bg-card/80 p-5 backdrop-blur-xl sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <span className="grid h-10 w-10 flex-shrink-0 place-items-center rounded-xl bg-primary/15 text-primary">
              <Sparkles className="h-5 w-5" aria-hidden />
            </span>
            <div>
              <span className="inline-block rounded-full bg-primary/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary">
                Invite only
              </span>
              <h2 id={headingId} className="mt-1 text-base font-semibold text-foreground sm:text-lg">
                Forge v4 — closed beta is taking shape.
              </h2>
              <p className="mt-1 max-w-md text-xs leading-relaxed text-muted-foreground">
                Request access to try the new runtime, branching API, and edge-first dashboards
                ahead of the public launch.
              </p>
            </div>
          </div>
          <a
            href="#request"
            className="group inline-flex flex-shrink-0 items-center gap-2 self-start rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] sm:self-auto"
          >
            Request access
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none" aria-hidden />
          </a>
        </div>

        <div className="mt-5">
          <div className="flex items-center justify-between text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            <span>
              <span className="text-foreground">{taken.toLocaleString()}</span> of {total.toLocaleString()} seats claimed
            </span>
            <span className="text-primary">{remaining.toLocaleString()} left</span>
          </div>
          <div
            className="mt-2 h-2 overflow-hidden rounded-full bg-background/60"
            role="progressbar"
            aria-valuenow={pct}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Seats claimed"
          >
            <motion.div
              initial={reduced ? false : { width: 0 }}
              animate={{ width: `${pct}%` }}
              transition={{ duration: 0.9, ease: "easeOut" }}
              className="h-full rounded-full bg-gradient-to-r from-primary via-accent to-primary"
            />
          </div>
        </div>
      </div>
    </motion.section>
  );
}

export default BannerEarlyAccess;

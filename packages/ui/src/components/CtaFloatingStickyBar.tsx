"use client";

import React from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { ArrowRight, X, Sparkles } from "lucide-react";
import { cn } from "../lib/cn";

export interface CtaFloatingStickyBarProps {
  className?: string;
  headline?: string;
  subline?: string;
  primaryHref?: string;
  primaryLabel?: string;
  dismissible?: boolean;
}

export function CtaFloatingStickyBar({
  className,
  headline = "Save 25% on annual plans",
  subline = "Offer ends Friday at midnight UTC.",
  primaryHref = "#claim",
  primaryLabel = "Claim discount",
  dismissible = true,
}: CtaFloatingStickyBarProps) {
  const reduced = useReducedMotion() ?? false;
  const [open, setOpen] = React.useState(true);

  return (
    <div
      className={cn(
        "pointer-events-none fixed inset-x-0 bottom-0 z-50 flex justify-center px-3 pb-3 sm:pb-5",
        className
      )}
    >
      <AnimatePresence>
        {open && (
          <motion.div
            role="region"
            aria-label="Promotional offer"
            initial={reduced ? false : { y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={reduced ? { opacity: 0 } : { y: 80, opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="pointer-events-auto flex w-full max-w-3xl items-center gap-3 rounded-2xl border border-border/60 bg-card/95 px-4 py-3 shadow-2xl shadow-black/20 backdrop-blur-xl sm:px-5"
          >
            <span className="grid h-9 w-9 flex-shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
              <Sparkles className="h-4 w-4" aria-hidden />
            </span>

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-foreground">{headline}</p>
              <p className="truncate text-xs text-muted-foreground">{subline}</p>
            </div>

            <a
              href={primaryHref}
              className="group inline-flex flex-shrink-0 items-center gap-1.5 rounded-xl bg-primary px-3.5 py-2 text-xs font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:brightness-110 sm:px-4 sm:py-2.5 sm:text-sm"
            >
              {primaryLabel}
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none" aria-hidden />
            </a>

            {dismissible && (
              <button
                type="button"
                aria-label="Dismiss"
                onClick={() => setOpen(false)}
                className="grid h-8 w-8 flex-shrink-0 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-muted/40 hover:text-foreground"
              >
                <X className="h-4 w-4" aria-hidden />
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default CtaFloatingStickyBar;

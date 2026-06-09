"use client";

import React from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Rocket, X, ArrowRight } from "lucide-react";
import { cn } from "../lib/cn";

export interface BannerVersionUpdateProps {
  className?: string;
  /** Version string shown in the banner. */
  version?: string;
  /** Whether the banner is initially visible. */
  defaultOpen?: boolean;
}

/** Top-strip banner announcing a new app version with a changelog link. */
export function BannerVersionUpdate({
  className,
  version = "v3.2.0",
  defaultOpen = true,
}: BannerVersionUpdateProps) {
  const reduced = useReducedMotion();
  const [open, setOpen] = React.useState(defaultOpen);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          role="status"
          aria-live="polite"
          initial={reduced ? { opacity: 0 } : { y: -32, opacity: 0 }}
          animate={reduced ? { opacity: 1 } : { y: 0, opacity: 1 }}
          exit={reduced ? { opacity: 0 } : { y: -32, opacity: 0 }}
          transition={{ duration: 0.35 }}
          className={cn(
            "relative w-full border-b border-border/60 bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10",
            className,
          )}
        >
          <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-2.5 text-xs text-foreground">
            <p className="flex items-center gap-2">
              <span className="grid h-6 w-6 place-items-center rounded-full bg-primary/20 text-primary">
                <Rocket className="h-3.5 w-3.5" aria-hidden />
              </span>
              <span>
                <span className="font-mono font-semibold text-primary">{version}</span> is live —{" "}
                <span className="text-muted-foreground">faster builds, better DX, dark mode by default.</span>
              </span>
            </p>
            <div className="flex items-center gap-1">
              <a
                href="#changelog"
                className="group inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold text-primary transition-colors hover:bg-primary/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
              >
                Read the changelog
                <ArrowRight
                  className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none"
                  aria-hidden
                />
              </a>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Dismiss update notice"
                className="grid h-6 w-6 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
              >
                <X className="h-3.5 w-3.5" aria-hidden />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default BannerVersionUpdate;

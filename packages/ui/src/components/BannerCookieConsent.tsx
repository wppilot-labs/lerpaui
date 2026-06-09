"use client";

import React from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Cookie, X } from "lucide-react";
import { cn } from "../lib/cn";

export interface BannerCookieConsentProps {
  className?: string;
  /** Whether the banner is initially visible. */
  defaultOpen?: boolean;
}

/** Bottom-fixed cookie consent banner with accept and customize actions. */
export function BannerCookieConsent({ className, defaultOpen = true }: BannerCookieConsentProps) {
  const reduced = useReducedMotion();
  const headingId = React.useId();
  const [open, setOpen] = React.useState(defaultOpen);

  return (
    <AnimatePresence>
      {open && (
        <motion.aside
          role="dialog"
          aria-labelledby={headingId}
          aria-modal={false}
          initial={reduced ? { opacity: 0 } : { y: 24, opacity: 0 }}
          animate={reduced ? { opacity: 1 } : { y: 0, opacity: 1 }}
          exit={reduced ? { opacity: 0 } : { y: 24, opacity: 0 }}
          transition={{ duration: 0.35 }}
          className={cn(
            "fixed inset-x-3 bottom-3 z-50 mx-auto max-w-2xl rounded-2xl border bg-card/95 p-5 shadow-xl shadow-black/20 backdrop-blur-xl sm:inset-x-4 sm:bottom-4",
            className,
          )}
        >
          <div className="flex items-start gap-4">
            <span className="grid h-10 w-10 flex-shrink-0 place-items-center rounded-xl bg-primary/15 text-primary">
              <Cookie className="h-5 w-5" aria-hidden />
            </span>
            <div className="min-w-0 flex-1">
              <h2 id={headingId} className="text-sm font-semibold text-foreground">
                We use cookies to make this site work better.
              </h2>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                Essential cookies are always on. Analytics and personalization stay off until you
                say yes. See our{" "}
                <a href="#cookies" className="underline hover:text-foreground">
                  cookie policy
                </a>{" "}
                for details.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="inline-flex items-center justify-center rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground shadow transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
                >
                  Accept all
                </button>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="inline-flex items-center justify-center rounded-xl border border-border bg-background px-4 py-2 text-xs font-semibold text-foreground transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
                >
                  Customize
                </button>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="inline-flex items-center justify-center rounded-xl px-4 py-2 text-xs font-semibold text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
                >
                  Reject all
                </button>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Dismiss"
              className="grid h-8 w-8 flex-shrink-0 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
            >
              <X className="h-4 w-4" aria-hidden />
            </button>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}

export default BannerCookieConsent;

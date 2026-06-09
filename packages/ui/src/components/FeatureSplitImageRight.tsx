"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Check, Sparkles } from "lucide-react";
import { cn } from "../lib/cn";

export interface FeatureSplitImageRightProps {
  className?: string;
  eyebrow?: string;
  title?: string;
  description?: string;
  bullets?: string[];
  ctaLabel?: string;
  ctaHref?: string;
}

const DEFAULT_BULLETS = [
  "Real-time collaboration across timezones",
  "Branch-aware previews on every commit",
  "Granular role and audit log controls",
  "Open API with first-party SDKs",
];

/** Split feature section: text content on the left, mock product visual on the right. */
export function FeatureSplitImageRight({
  className,
  eyebrow = "Collaboration",
  title = "One source of truth for the entire product loop.",
  description = "Specs, designs, code reviews, and launch checklists, threaded together. No more lost context between tools.",
  bullets = DEFAULT_BULLETS,
  ctaLabel = "Learn more",
  ctaHref = "#learn",
}: FeatureSplitImageRightProps) {
  const reduced = useReducedMotion();
  const headingId = React.useId();

  return (
    <section
      aria-labelledby={headingId}
      className={cn(
        "relative isolate w-full overflow-hidden rounded-3xl border border-border/50 bg-background px-6 py-16 sm:px-12 md:py-24",
        className,
      )}
    >
      <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2">
        <div>
          <motion.span
            initial={reduced ? false : { opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-primary"
          >
            <Sparkles className="h-3.5 w-3.5" aria-hidden />
            {eyebrow}
          </motion.span>

          <motion.h2
            id={headingId}
            initial={reduced ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.06 }}
            className="mt-5 text-3xl font-semibold tracking-tight text-balance text-foreground sm:text-4xl md:text-5xl"
          >
            {title}
          </motion.h2>

          <motion.p
            initial={reduced ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.14 }}
            className="mt-4 max-w-md text-base leading-relaxed text-muted-foreground md:text-lg"
          >
            {description}
          </motion.p>

          <ul className="mt-7 space-y-3">
            {bullets.map((b, i) => (
              <motion.li
                key={b}
                initial={reduced ? false : { opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.45, delay: 0.22 + i * 0.06 }}
                className="flex items-start gap-3 text-sm text-foreground/90"
              >
                <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" aria-hidden />
                {b}
              </motion.li>
            ))}
          </ul>

          <a
            href={ctaHref}
            className="group mt-8 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
          >
            {ctaLabel}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none" aria-hidden />
          </a>
        </div>

        <motion.div
          initial={reduced ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.18 }}
          className="rounded-2xl border bg-card p-5 shadow-sm transition-shadow hover:shadow-md"
        >
          <div className="flex items-center justify-between border-b border-border/40 pb-3">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-rose-400" aria-hidden />
              <span className="h-2.5 w-2.5 rounded-full bg-amber-300" aria-hidden />
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" aria-hidden />
            </div>
            <span className="rounded-md bg-background px-2 py-0.5 text-[10px] font-mono text-muted-foreground">
              forge / main
            </span>
          </div>
          <div className="mt-4 space-y-2">
            {[0, 1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="flex items-center gap-3 rounded-lg border border-border/40 bg-background/40 p-3"
              >
                <span
                  aria-hidden
                  className={cn(
                    "h-6 w-6 flex-shrink-0 rounded-full bg-gradient-to-br",
                    ["from-rose-400 to-amber-300", "from-sky-400 to-violet-400", "from-emerald-400 to-teal-300", "from-fuchsia-400 to-pink-300", "from-orange-400 to-rose-300"][i % 5],
                  )}
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-semibold text-foreground">
                    {["Mira pushed", "Dev opened a PR", "Sam left a review", "Yara approved", "CI deployed"][i]}
                  </p>
                  <p className="truncate text-[11px] text-muted-foreground">
                    {["fix(api): drop deprecated field", "feat: new pricing tier", "looks great, ship it", "design lgtm", "preview-23 ready"][i]}
                  </p>
                </div>
                <span className="text-[10px] text-muted-foreground/70">{i + 1}m</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default FeatureSplitImageRight;

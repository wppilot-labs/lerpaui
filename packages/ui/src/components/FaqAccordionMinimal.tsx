"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Plus, Minus } from "lucide-react";
import { cn } from "../lib/cn";

export interface FaqQa {
  category: string;
  q: string;
  a: string;
}

export interface FaqAccordionMinimalProps {
  className?: string;
  title?: string;
  subtitle?: string;
  items?: FaqQa[];
  categoryTones?: Record<string, string>;
}

const DEFAULT_CATEGORY_TONES: Record<string, string> = {
  Pricing: "bg-amber-400/15 text-amber-500",
  Security: "bg-emerald-400/15 text-emerald-500",
  Support: "bg-sky-400/15 text-sky-500",
  Product: "bg-violet-400/15 text-violet-500",
};

const DEFAULT_QAS: FaqQa[] = [
  { category: "Pricing", q: "Is there a free tier?", a: "Yes — a generous free tier with no time limit, no credit card required, and full access to the core platform." },
  { category: "Security", q: "Are you SOC 2 compliant?", a: "We are SOC 2 Type II audited annually. The full report is available on request under NDA." },
  { category: "Product", q: "Can I use this with my existing stack?", a: "First-party SDKs for TypeScript, Python, Go, and Rust, plus a REST API that follows JSON:API conventions." },
  { category: "Support", q: "What's the typical response time?", a: "Median first response under 90 minutes during business hours. Enterprise customers get a 30-minute P1 SLA." },
  { category: "Pricing", q: "Do you offer non-profit pricing?", a: "Yes — 50% off all paid plans for registered nonprofits, public-good research labs, and accredited universities." },
];

/** Minimal FAQ accordion with a colored category badge on each row. */
export function FaqAccordionMinimal({
  className,
  title = "Frequently asked.",
  subtitle = "Tap a question to expand. Tap again to collapse.",
  items = DEFAULT_QAS,
  categoryTones = DEFAULT_CATEGORY_TONES,
}: FaqAccordionMinimalProps) {
  const reduced = useReducedMotion();
  const headingId = React.useId();
  const [open, setOpen] = React.useState<string | null>(items[0]?.q ?? null);

  return (
    <section
      aria-labelledby={headingId}
      className={cn(
        "relative isolate w-full overflow-hidden rounded-3xl border border-border/50 bg-background px-6 py-16 sm:px-12 md:py-24",
        className,
      )}
    >
      <div className="mx-auto max-w-3xl">
        <div className="text-center">
          <h2
            id={headingId}
            className="text-3xl font-semibold tracking-tight text-balance text-foreground sm:text-4xl md:text-5xl"
          >
            {title}
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground md:text-lg">
            {subtitle}
          </p>
        </div>

        <ul className="mt-12 divide-y divide-border/60 border-y border-border/60">
          {items.map((qa, i) => {
            const isOpen = open === qa.q;
            return (
              <li key={qa.q}>
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : qa.q)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between gap-4 py-5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
                >
                  <span className="flex min-w-0 items-center gap-3">
                    <span
                      className={cn(
                        "rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider",
                        categoryTones[qa.category] ?? "bg-muted text-muted-foreground",
                      )}
                    >
                      {qa.category}
                    </span>
                    <span className="text-sm font-semibold text-foreground">{qa.q}</span>
                  </span>
                  <span
                    aria-hidden
                    className="grid h-7 w-7 flex-shrink-0 place-items-center rounded-full border border-border/60 text-muted-foreground"
                  >
                    {isOpen ? <Minus className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
                  </span>
                </button>
                <motion.div
                  initial={false}
                  animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }}
                  transition={reduced ? { duration: 0 } : { duration: 0.3, delay: i * 0.0 }}
                  className="overflow-hidden"
                >
                  <p className="pb-5 pl-[5.5rem] pr-10 text-sm leading-relaxed text-muted-foreground">
                    {qa.a}
                  </p>
                </motion.div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

export default FaqAccordionMinimal;

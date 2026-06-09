"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { cn } from "../lib/cn";

export interface FaqQA {
  q: string;
  a: string;
}

export interface FaqTwoColumnLayoutProps {
  className?: string;
  title?: string;
  subtitle?: string;
  columnA?: FaqQA[];
  columnB?: FaqQA[];
}

const DEFAULT_COL_A: FaqQA[] = [
  { q: "How does pricing scale as we grow?", a: "All plans include a generous monthly allowance. Usage above the included tier rolls over for 30 days and is billed at flat per-event rates." },
  { q: "Can we self-host on our own VPC?", a: "Yes. The Enterprise plan includes a single-tenant deployment option with a Terraform module and full control over keys and networking." },
  { q: "What kind of support is included?", a: "Email support on all plans, dedicated Slack on Pro, and a named technical account manager on Enterprise. Median first response under 90 minutes." },
];

const DEFAULT_COL_B: FaqQA[] = [
  { q: "Do you offer a free trial?", a: "Every plan has a 14-day free trial with no credit card required. You can keep your data and downgrade at any time." },
  { q: "How do you handle data residency?", a: "Pick from US, EU, or APAC regions on signup. Data, backups, and replicas stay inside the chosen region — guaranteed by contract." },
  { q: "Is there an academic discount?", a: "Yes. We offer 50% off for accredited universities, public-good research labs, and registered nonprofits. Email us for the code." },
];

function Item({ q, a }: FaqQA) {
  const reduced = useReducedMotion();
  const [open, setOpen] = React.useState(false);
  return (
    <div className="overflow-hidden rounded-2xl border bg-card shadow-sm transition-shadow hover:shadow-md">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-sm font-semibold text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
      >
        <span>{q}</span>
        <ChevronDown
          className={cn(
            "h-4 w-4 flex-shrink-0 text-muted-foreground transition-transform",
            open && "rotate-180",
          )}
          aria-hidden
        />
      </button>
      <motion.div
        initial={false}
        animate={reduced ? { height: open ? "auto" : 0 } : { height: open ? "auto" : 0 }}
        transition={{ duration: 0.3 }}
        className="overflow-hidden"
      >
        <p className="px-5 pb-4 text-sm leading-relaxed text-muted-foreground">{a}</p>
      </motion.div>
    </div>
  );
}

/** FAQ section laid out as two parallel accordion columns. */
export function FaqTwoColumnLayout({
  className,
  title = "Questions, answered.",
  subtitle = "Can't find what you're looking for? Our team usually replies within the hour.",
  columnA = DEFAULT_COL_A,
  columnB = DEFAULT_COL_B,
}: FaqTwoColumnLayoutProps) {
  const headingId = React.useId();

  return (
    <section
      aria-labelledby={headingId}
      className={cn(
        "relative isolate w-full overflow-hidden rounded-3xl border border-border/50 bg-background px-6 py-16 sm:px-12 md:py-24",
        className,
      )}
    >
      <div className="mx-auto max-w-5xl">
        <div className="mx-auto max-w-2xl text-center">
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

        <div className="mt-12 grid gap-4 md:grid-cols-2">
          <div className="space-y-3">
            {columnA.map((qa) => (
              <Item key={qa.q} {...qa} />
            ))}
          </div>
          <div className="space-y-3">
            {columnB.map((qa) => (
              <Item key={qa.q} {...qa} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default FaqTwoColumnLayout;

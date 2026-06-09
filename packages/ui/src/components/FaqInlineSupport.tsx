"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ChevronDown, MessageCircle, ArrowRight, Clock } from "lucide-react";
import { cn } from "../lib/cn";

export interface FaqInlineSupportProps {
  className?: string;
}

interface QA {
  q: string;
  a: string;
}

const QAS: QA[] = [
  { q: "What happens after the trial ends?", a: "If you don't upgrade, your workspace becomes read-only for 30 days. Nothing is deleted — you can resume at any time by adding a payment method." },
  { q: "Can I switch plans mid-month?", a: "Yes. Upgrades take effect immediately and are prorated. Downgrades take effect at the next renewal." },
  { q: "Do you have an enterprise SLA?", a: "Enterprise customers get a 99.99% uptime SLA, named TAM, and a first response SLA of 30 minutes for P1 issues." },
  { q: "How do you handle data deletion?", a: "Account deletion permanently removes all data after a 14-day grace period. Per-record deletion is available via the API or dashboard." },
];

function Item({ q, a }: QA) {
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
          className={cn("h-4 w-4 flex-shrink-0 text-muted-foreground transition-transform", open && "rotate-180")}
          aria-hidden
        />
      </button>
      <motion.div
        initial={false}
        animate={{ height: open ? "auto" : 0 }}
        transition={reduced ? { duration: 0 } : { duration: 0.3 }}
        className="overflow-hidden"
      >
        <p className="px-5 pb-4 text-sm leading-relaxed text-muted-foreground">{a}</p>
      </motion.div>
    </div>
  );
}

/** FAQ accordion paired inline with an embedded support / chat callout card. */
export function FaqInlineSupport({ className }: FaqInlineSupportProps) {
  const headingId = React.useId();

  return (
    <section
      aria-labelledby={headingId}
      className={cn(
        "relative isolate w-full overflow-hidden rounded-3xl border border-border/50 bg-background px-6 py-16 sm:px-12 md:py-24",
        className,
      )}
    >
      <div className="mx-auto grid max-w-5xl items-start gap-10 lg:grid-cols-[1fr_320px]">
        <div>
          <h2
            id={headingId}
            className="text-3xl font-semibold tracking-tight text-balance text-foreground sm:text-4xl md:text-5xl"
          >
            Common questions.
          </h2>
          <p className="mt-4 max-w-md text-base leading-relaxed text-muted-foreground md:text-lg">
            Everything you need to know about plans, support, and security.
          </p>

          <div className="mt-8 space-y-3">
            {QAS.map((qa) => (
              <Item key={qa.q} {...qa} />
            ))}
          </div>
        </div>

        <aside className="rounded-2xl border bg-card p-6 shadow-sm transition-shadow hover:shadow-md lg:sticky lg:top-24">
          <span className="inline-grid h-10 w-10 place-items-center rounded-xl bg-primary/15 text-primary">
            <MessageCircle className="h-5 w-5" aria-hidden />
          </span>
          <h3 className="mt-4 text-lg font-semibold text-foreground">Talk to a human.</h3>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Real engineers, real answers. We typically reply within an hour during weekdays.
          </p>
          <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
            <Clock className="h-3.5 w-3.5" aria-hidden />
            <span className="inline-flex items-center gap-1.5">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75 motion-reduce:hidden" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              Online now
            </span>
          </div>
          <a
            href="#chat"
            className="group mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
          >
            Start a chat
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none" aria-hidden />
          </a>
          <a
            href="#docs"
            className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-border bg-background px-4 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
          >
            Browse the docs
          </a>
        </aside>
      </div>
    </section>
  );
}

export default FaqInlineSupport;

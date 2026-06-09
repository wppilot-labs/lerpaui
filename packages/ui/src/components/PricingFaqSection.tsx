"use client";

import React, { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ChevronDown, HelpCircle, MessageCircle } from "lucide-react";
import { cn } from "../lib/cn";

export interface PricingFaqSectionProps {
  className?: string;
}

const FAQS = [
  {
    q: "Can I change plans at any time?",
    a: "Yes. Upgrades take effect immediately and we'll prorate the difference. Downgrades take effect at the end of your current billing period — no penalties.",
  },
  {
    q: "Do you offer a free trial?",
    a: "Every paid plan includes a 14-day free trial with full access. No credit card required to start. We'll email a friendly reminder before the trial ends.",
  },
  {
    q: "What payment methods do you accept?",
    a: "We accept all major credit cards, PayPal, ACH for annual plans, and wire transfers for enterprise. Invoicing is available on annual contracts.",
  },
  {
    q: "Is there a discount for non-profits or students?",
    a: "Yes — verified non-profits and educators get 50% off any plan. Students get our Pro plan free for the duration of their studies. Just email us.",
  },
  {
    q: "What happens if I exceed my plan's limits?",
    a: "We'll never cut you off or charge surprise overages. If you're consistently bumping into limits we'll reach out with a recommendation to upgrade.",
  },
  {
    q: "How do I cancel?",
    a: "One click from your billing page, any time. We'll keep your data for 30 days in case you change your mind, then delete it permanently per our privacy policy.",
  },
];

export function PricingFaqSection({ className }: PricingFaqSectionProps) {
  const reduced = useReducedMotion();
  const [open, setOpen] = useState<number | null>(0);
  const headingId = React.useId();

  return (
    <section
      aria-labelledby={headingId}
      className={cn(
        "relative isolate w-full overflow-hidden rounded-3xl border border-border/50 bg-card/30 px-6 py-16 backdrop-blur-xl sm:px-10 sm:py-20",
        className,
      )}
    >
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -left-24 top-0 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-3xl">
        <div className="text-center">
          <motion.span
            initial={reduced ? false : { opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-primary"
          >
            <HelpCircle className="h-3.5 w-3.5" aria-hidden />
            FAQ
          </motion.span>

          <motion.h2
            id={headingId}
            initial={reduced ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.06 }}
            className="mt-5 text-balance text-3xl font-semibold leading-tight tracking-tight text-foreground sm:text-4xl md:text-5xl"
          >
            Frequently asked questions
          </motion.h2>

          <motion.p
            initial={reduced ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.14 }}
            className="mx-auto mt-4 max-w-lg text-pretty text-base leading-relaxed text-muted-foreground"
          >
            Got more questions?{" "}
            <a href="#contact" className="font-semibold text-primary hover:underline">
              Talk to our team
            </a>{" "}
            — we typically reply in under an hour.
          </motion.p>
        </div>

        <ul className="mt-10 space-y-3">
          {FAQS.map((item, idx) => {
            const isOpen = open === idx;
            return (
              <motion.li
                key={item.q}
                initial={reduced ? false : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2 + idx * 0.05 }}
                className={cn(
                  "overflow-hidden rounded-2xl border bg-card shadow-sm transition-colors",
                  isOpen
                    ? "border-primary/30 shadow-md"
                    : "border-border/60 hover:border-border",
                )}
              >
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : idx)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between gap-4 p-5 text-left transition-colors hover:bg-accent/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 md:p-6"
                >
                  <span className="text-base font-semibold text-foreground">
                    {item.q}
                  </span>
                  <motion.div
                    animate={reduced ? undefined : { rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full border border-border/60 bg-background"
                  >
                    <ChevronDown
                      className="h-4 w-4 text-muted-foreground"
                      aria-hidden
                    />
                  </motion.div>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={reduced ? { opacity: 0 } : { height: 0, opacity: 0 }}
                      animate={
                        reduced ? { opacity: 1 } : { height: "auto", opacity: 1 }
                      }
                      exit={reduced ? { opacity: 0 } : { height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden"
                    >
                      <p className="border-t border-border/40 p-5 text-sm leading-relaxed text-muted-foreground md:p-6">
                        {item.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.li>
            );
          })}
        </ul>

        <motion.div
          initial={reduced ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-10 flex flex-col items-center gap-4 rounded-2xl border border-border/60 bg-background/60 p-6 text-center backdrop-blur-sm sm:flex-row sm:justify-between sm:text-left"
        >
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-primary/20 bg-primary/10 text-primary">
              <MessageCircle className="h-4 w-4" aria-hidden />
            </span>
            <div>
              <div className="text-sm font-semibold text-foreground">
                Still have questions?
              </div>
              <p className="text-sm text-muted-foreground">
                Chat with our team Monday–Friday, 9–5 PT.
              </p>
            </div>
          </div>
          <a
            href="#chat"
            className="inline-flex items-center justify-center rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow shadow-primary/25 transition-all hover:brightness-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
          >
            Start chat
          </a>
        </motion.div>
      </div>
    </section>
  );
}

export default PricingFaqSection;

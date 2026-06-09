"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, HelpCircle } from "lucide-react";
import { cn } from "../lib/cn";
import { usePrefersReducedMotion } from "../animation/hooks";

type QA = { q: string; a: string };

const ITEMS: QA[] = [
  {
    q: "Can I cancel my subscription at any time?",
    a: "Yes. Plans are billed monthly with no long-term contract. Cancel from your billing settings and you keep access until the end of the current period.",
  },
  {
    q: "Do you offer a free trial?",
    a: "Every paid plan starts with a 14-day free trial. No credit card is required up front, and you can upgrade or downgrade once you decide.",
  },
  {
    q: "How does team billing work?",
    a: "You are charged per active seat. Add or remove members anytime and we prorate the difference automatically on your next invoice.",
  },
  {
    q: "Is my data exportable if I leave?",
    a: "Always. You can export your full workspace to CSV or JSON at any moment, and we retain backups for 30 days after cancellation.",
  },
];

export interface FaqAccordionSectionBlockProps {
  className?: string;
}

export function FaqAccordionSectionBlock({ className }: FaqAccordionSectionBlockProps) {
  const reduced = usePrefersReducedMotion();
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section
      className={cn(
        "w-full max-w-xl bg-card/45 backdrop-blur-xl border border-border/50 p-6 rounded-2xl shadow-xl font-sans text-foreground",
        className,
      )}
    >
      <div className="flex items-center gap-2 mb-5">
        <HelpCircle className="w-5 h-5 text-primary" />
        <h2 className="text-base font-bold">Frequently asked questions</h2>
      </div>

      <ul className="space-y-2">
        {ITEMS.map((item, idx) => {
          const isOpen = open === idx;
          return (
            <li
              key={item.q}
              className="rounded-xl border border-foreground/[0.05] bg-foreground/[0.02] overflow-hidden"
            >
              <button
                type="button"
                aria-expanded={isOpen}
                onClick={() => setOpen(isOpen ? null : idx)}
                className="w-full flex items-center justify-between gap-3 p-4 text-left transition-colors hover:bg-foreground/[0.03]"
              >
                <span className="text-sm font-semibold">{item.q}</span>
                <ChevronDown
                  className={cn(
                    "w-4 h-4 shrink-0 text-muted-foreground/60 transition-transform duration-200",
                    isOpen && "rotate-180",
                  )}
                />
              </button>
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={reduced ? false : { height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={reduced ? { opacity: 0 } : { height: 0, opacity: 0 }}
                    transition={{ duration: reduced ? 0 : 0.22 }}
                    className="overflow-hidden"
                  >
                    <p className="px-4 pb-4 text-sm leading-relaxed text-muted-foreground/75">
                      {item.a}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

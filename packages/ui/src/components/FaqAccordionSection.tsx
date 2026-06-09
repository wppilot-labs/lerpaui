"use client";

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "../lib/cn";

export interface FaqAccordionSectionProps {
  className?: string;
}

interface QA {
  question: string;
  answer: string;
}

const ITEMS: QA[] = [
  {
    question: "Can I change my plan later?",
    answer:
      "Yes. You can upgrade, downgrade, or cancel at any time from your billing settings. Changes are prorated automatically against your next invoice.",
  },
  {
    question: "Do you offer a free trial?",
    answer:
      "Every paid plan includes a 14-day free trial with full access to all features. No credit card is required to get started.",
  },
  {
    question: "How does team billing work?",
    answer:
      "You're billed per active seat each month. Adding or removing teammates updates your subscription immediately, and you only pay for what you use.",
  },
  {
    question: "Is my data secure?",
    answer:
      "All data is encrypted in transit and at rest. We're SOC 2 Type II compliant and run continuous third-party security audits.",
  },
];

export function FaqAccordionSection({ className }: FaqAccordionSectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section
      aria-label="Frequently asked questions"
      className={cn("w-full max-w-2xl", className)}
    >
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-bold tracking-tight text-foreground">Frequently asked questions</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Everything you need to know about the product and billing.
        </p>
      </div>

      <div className="divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card">
        {ITEMS.map((item, index) => {
          const isOpen = openIndex === index;
          const panelId = `faq-panel-${index}`;
          const buttonId = `faq-button-${index}`;
          return (
            <div key={item.question}>
              <h3>
                <button
                  type="button"
                  id={buttonId}
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition-colors hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"
                >
                  <span className="text-base font-medium text-foreground">{item.question}</span>
                  <ChevronDown
                    className={cn(
                      "h-5 w-5 shrink-0 text-muted-foreground transition-transform duration-200",
                      isOpen && "rotate-180",
                    )}
                    aria-hidden="true"
                  />
                </button>
              </h3>
              <div
                id={panelId}
                role="region"
                aria-labelledby={buttonId}
                hidden={!isOpen}
                className="px-5 pb-4 text-sm leading-relaxed text-muted-foreground"
              >
                {item.answer}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default FaqAccordionSection;

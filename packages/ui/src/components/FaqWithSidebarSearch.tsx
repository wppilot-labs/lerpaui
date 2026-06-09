"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Search, ChevronDown } from "lucide-react";
import { cn } from "../lib/cn";

export interface FaqWithSidebarSearchProps {
  className?: string;
}

interface QA {
  q: string;
  a: string;
  category: string;
}

const QAS: QA[] = [
  { category: "Billing", q: "How does pricing scale as we grow?", a: "Generous monthly allowance with overage that rolls over for 30 days and is billed at flat per-event rates." },
  { category: "Billing", q: "Do you offer annual discounts?", a: "Yes. Annual prepay saves 20% across every paid plan and unlocks priority support on Pro and above." },
  { category: "Security", q: "Are you SOC 2 compliant?", a: "We are SOC 2 Type II audited annually. The full report is available under NDA from your account manager." },
  { category: "Security", q: "Can we bring our own encryption keys?", a: "BYO-KMS is supported on the Enterprise plan, with AWS KMS, GCP KMS, and HashiCorp Vault out of the box." },
  { category: "Setup", q: "How long does onboarding take?", a: "Self-serve setup is under 10 minutes. Enterprise migrations take 1–2 weeks with our solutions engineering team." },
  { category: "Setup", q: "Do you support self-hosting?", a: "Yes. A single-tenant Kubernetes deployment is available on the Enterprise plan with a Terraform module." },
];

/** FAQ section with a search input that filters the answer list to the right. */
export function FaqWithSidebarSearch({ className }: FaqWithSidebarSearchProps) {
  const reduced = useReducedMotion();
  const headingId = React.useId();
  const [query, setQuery] = React.useState("");
  const [open, setOpen] = React.useState<string | null>(QAS[0].q);

  const filtered = QAS.filter((qa) => {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return qa.q.toLowerCase().includes(q) || qa.a.toLowerCase().includes(q) || qa.category.toLowerCase().includes(q);
  });

  return (
    <section
      aria-labelledby={headingId}
      className={cn(
        "relative isolate w-full overflow-hidden rounded-3xl border border-border/50 bg-background px-6 py-16 sm:px-12 md:py-24",
        className,
      )}
    >
      <div className="mx-auto max-w-5xl">
        <div className="max-w-2xl">
          <h2
            id={headingId}
            className="text-3xl font-semibold tracking-tight text-balance text-foreground sm:text-4xl md:text-5xl"
          >
            Find an answer fast.
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground md:text-lg">
            Search the most-asked questions, or pick a topic to browse.
          </p>
        </div>

        <div className="mt-10 grid gap-8 md:grid-cols-[280px_1fr]">
          <aside className="md:sticky md:top-24 md:self-start">
            <label htmlFor="faq-search" className="sr-only">
              Search FAQ
            </label>
            <div className="flex items-center gap-2 rounded-xl border bg-card p-2 shadow-sm transition-shadow hover:shadow-md">
              <Search className="ml-1 h-4 w-4 flex-shrink-0 text-muted-foreground" aria-hidden />
              <input
                id="faq-search"
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search questions..."
                className="flex-1 bg-transparent px-1 py-1 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none"
              />
            </div>
            <p className="mt-3 text-xs text-muted-foreground">
              Showing <span className="font-semibold text-foreground">{filtered.length}</span> of {QAS.length}
            </p>
          </aside>

          <div className="space-y-3">
            {filtered.length === 0 && (
              <p className="rounded-2xl border bg-card p-6 text-sm text-muted-foreground shadow-sm">
                No results. Try a broader search.
              </p>
            )}
            {filtered.map((qa) => {
              const isOpen = open === qa.q;
              return (
                <motion.div
                  key={qa.q}
                  initial={reduced ? false : { opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden rounded-2xl border bg-card shadow-sm transition-shadow hover:shadow-md"
                >
                  <button
                    type="button"
                    onClick={() => setOpen(isOpen ? null : qa.q)}
                    aria-expanded={isOpen}
                    className="flex w-full items-start justify-between gap-4 px-5 py-4 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
                  >
                    <span>
                      <span className="block text-[11px] font-semibold uppercase tracking-wider text-primary">
                        {qa.category}
                      </span>
                      <span className="mt-0.5 block text-sm font-semibold text-foreground">{qa.q}</span>
                    </span>
                    <ChevronDown
                      className={cn(
                        "mt-1 h-4 w-4 flex-shrink-0 text-muted-foreground transition-transform",
                        isOpen && "rotate-180",
                      )}
                      aria-hidden
                    />
                  </button>
                  <motion.div
                    initial={false}
                    animate={{ height: isOpen ? "auto" : 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <p className="px-5 pb-4 text-sm leading-relaxed text-muted-foreground">{qa.a}</p>
                  </motion.div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

export default FaqWithSidebarSearch;

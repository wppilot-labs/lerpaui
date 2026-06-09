"use client";

import React from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { ChevronDown, MessageCircle, Headset, ArrowRight } from "lucide-react";
import { cn } from "../lib/cn";

export interface FaqHandoffItem {
  q: string;
  a: string;
}

export interface FaqLiveChatHandoffProps {
  className?: string;
  title?: string;
  subtitle?: string;
  faqs?: FaqHandoffItem[];
  asideTitle?: string;
  asideDescription?: string;
  ctaLabel?: string;
  agentsStatus?: string;
}

const DEFAULT_FAQS: FaqHandoffItem[] = [
  {
    q: "How does the trial work?",
    a: "Get full access to every feature for 14 days. No card required up front — if you don't subscribe, your data goes into read-only mode.",
  },
  {
    q: "Can I switch plans mid-cycle?",
    a: "Yes. Upgrades take effect immediately and are prorated. Downgrades take effect at the end of the current billing period.",
  },
  {
    q: "Do you offer discounts for non-profits or students?",
    a: "We do — 50% off Pro for verified non-profits, 100% off for accredited students. Email support@example.com with proof of status.",
  },
  {
    q: "Where is my data stored?",
    a: "Primary data lives in us-east and is replicated to eu-west. Enterprise plans can pin storage to a specific region.",
  },
  {
    q: "What's your refund policy?",
    a: "30-day no-questions refund on annual plans. Monthly plans are non-refundable but you can cancel any time.",
  },
];

export function FaqLiveChatHandoff({
  className,
  title = "Frequently asked",
  subtitle = "Quick answers to the things people ask before signing up.",
  faqs = DEFAULT_FAQS,
  asideTitle = "Still wondering?",
  asideDescription = "A real human will jump in within a minute or two.",
  ctaLabel = "Start live chat",
  agentsStatus = "4 agents online · avg reply 38s",
}: FaqLiveChatHandoffProps) {
  const reduced = useReducedMotion() ?? false;
  const [open, setOpen] = React.useState<number | null>(0);

  return (
    <section
      aria-label="Frequently asked questions"
      className={cn(
        "w-full rounded-2xl border bg-card p-6 shadow-sm transition-shadow hover:shadow-md md:p-8",
        className
      )}
    >
      <div className="grid items-start gap-8 md:grid-cols-[1fr_280px]">
        <div>
          <h3 className="text-2xl font-black tracking-tight text-foreground sm:text-3xl">{title}</h3>
          <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>

          <ul className="mt-6 divide-y rounded-xl border bg-muted/10">
            {faqs.map((f, i) => {
              const isOpen = open === i;
              const id = `faq-${i}`;
              return (
                <li key={f.q}>
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={id}
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="flex w-full items-center justify-between gap-3 px-4 py-3.5 text-left transition-colors hover:bg-muted/30"
                  >
                    <span className="text-sm font-semibold text-foreground">{f.q}</span>
                    <ChevronDown
                      className={cn("h-4 w-4 flex-shrink-0 text-muted-foreground transition-transform", isOpen && "rotate-180")}
                      aria-hidden
                    />
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        id={id}
                        initial={reduced ? { height: "auto", opacity: 1 } : { height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={reduced ? { opacity: 0 } : { height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="overflow-hidden"
                      >
                        <p className="px-4 pb-4 text-sm leading-relaxed text-muted-foreground">{f.a}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </li>
              );
            })}
          </ul>
        </div>

        <aside className="rounded-2xl border bg-primary/5 p-5">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary/15 text-primary">
            <Headset className="h-5 w-5" aria-hidden />
          </span>
          <h4 className="mt-3 text-base font-semibold text-foreground">{asideTitle}</h4>
          <p className="mt-1 text-sm text-muted-foreground">{asideDescription}</p>

          <button
            type="button"
            className="group mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:brightness-110"
          >
            <MessageCircle className="h-4 w-4" aria-hidden />
            {ctaLabel}
            <ArrowRight className="ml-auto h-4 w-4 transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none" aria-hidden />
          </button>

          <div className="mt-4 flex items-center gap-2 text-[11px] text-muted-foreground">
            <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
            <span>{agentsStatus}</span>
          </div>
        </aside>
      </div>
    </section>
  );
}

export default FaqLiveChatHandoff;

"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, BookOpen, Check, Download, Mail, ShieldCheck, Users } from "lucide-react";
import { cn } from "../lib/cn";

export interface LeadMagnetSectionProps {
  className?: string;
}

const BENEFITS = [
  "12 chapters of step-by-step playbooks used by 500+ founders",
  "Real conversion benchmarks across SaaS, eCom and AI tools",
  "Email teardown templates you can copy in under 5 minutes",
  "Quarterly updates — always free for early subscribers",
];

const TRUST = [
  { icon: Users, label: "10,000+ subscribers" },
  { icon: ShieldCheck, label: "Unsubscribe anytime" },
  { icon: BookOpen, label: "Free 48-page PDF" },
];

export function LeadMagnetSection({ className }: LeadMagnetSectionProps) {
  const reduced = useReducedMotion() ?? false;
  const headingId = React.useId();
  const emailId = React.useId();
  const nameId = React.useId();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <section
      aria-labelledby={headingId}
      className={cn(
        "relative isolate w-full overflow-hidden rounded-3xl border border-border/50 bg-card/30 px-6 py-14 backdrop-blur-xl sm:px-12 sm:py-20",
        className
      )}
    >
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -left-24 top-0 h-72 w-72 rounded-full bg-primary/15 blur-3xl" />
        <div className="absolute -right-24 bottom-0 h-72 w-72 rounded-full bg-accent/10 blur-3xl" />
      </div>

      <div className="relative grid grid-cols-1 items-start gap-10 lg:grid-cols-2 lg:gap-16">
        <div>
          <motion.span
            initial={reduced ? false : { opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-primary"
          >
            <Download className="h-3.5 w-3.5" aria-hidden />
            Free Guide
          </motion.span>

          <motion.h2
            id={headingId}
            initial={reduced ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="mt-5 text-balance text-3xl font-black leading-[1.1] tracking-tight text-foreground sm:text-4xl"
          >
            Download the free guide to{" "}
            <span className="bg-gradient-to-br from-primary via-primary to-accent bg-clip-text text-transparent">
              high-converting landing pages
            </span>
          </motion.h2>

          <motion.p
            initial={reduced ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-4 max-w-md text-pretty text-sm leading-relaxed text-muted-foreground sm:text-base"
          >
            The same teardown framework we use with Series A startups, distilled into a 48-page
            PDF. No fluff. Implement in an afternoon.
          </motion.p>

          <motion.ul
            initial={reduced ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.18 }}
            className="mt-6 space-y-2.5"
          >
            {BENEFITS.map((b) => (
              <li key={b} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary">
                  <Check className="h-3 w-3" aria-hidden />
                </span>
                <span>{b}</span>
              </li>
            ))}
          </motion.ul>
        </div>

        <motion.div
          initial={reduced ? false : { opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.12 }}
          className="rounded-2xl border border-border/60 bg-background/40 p-6 shadow-xl shadow-black/20 backdrop-blur-md sm:p-8"
        >
          <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate={false}>
            <div className="flex flex-col gap-1.5">
              <label htmlFor={nameId} className="text-xs font-medium text-foreground">
                First name
              </label>
              <input
                id={nameId}
                type="text"
                name="name"
                autoComplete="given-name"
                required
                aria-required="true"
                placeholder="Ada"
                className="rounded-xl border border-border/60 bg-background/60 px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-primary/60 focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor={emailId} className="text-xs font-medium text-foreground">
                Work email
              </label>
              <div className="relative">
                <Mail
                  className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                  aria-hidden
                />
                <input
                  id={emailId}
                  type="email"
                  name="email"
                  autoComplete="email"
                  required
                  aria-required="true"
                  placeholder="name@company.com"
                  className="w-full rounded-xl border border-border/60 bg-background/60 px-4 py-2.5 pl-9 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-primary/60 focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>
            </div>

            <button
              type="submit"
              className="group inline-flex items-center justify-center gap-1.5 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-primary/40"
            >
              <Download className="h-4 w-4" aria-hidden />
              Send me the guide
              <ArrowRight
                className="h-4 w-4 transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none"
                aria-hidden
              />
            </button>

            <ul className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[11px] text-muted-foreground">
              {TRUST.map((t) => {
                const Icon = t.icon;
                return (
                  <li key={t.label} className="inline-flex items-center gap-1.5">
                    <Icon className="h-3 w-3 text-primary" aria-hidden />
                    {t.label}
                  </li>
                );
              })}
            </ul>
          </form>
        </motion.div>
      </div>
    </section>
  );
}

export default LeadMagnetSection;

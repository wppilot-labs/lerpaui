"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, ShieldCheck, TrendingUp, PlayCircle } from "lucide-react";
import { cn } from "../lib/cn";

export interface HeroEnterpriseProps {
  className?: string;
}

const LOGOS = ["NORTHWIND", "FABRIKAM", "CONTOSO", "INITECH", "HOOLI", "MASSIVE"];

/** Enterprise hero with trust logos row, ROI stat callout, and demo CTA. */
export function HeroEnterprise({ className }: HeroEnterpriseProps) {
  const reduced = useReducedMotion();
  const headingId = React.useId();

  return (
    <section
      aria-labelledby={headingId}
      className={cn(
        "relative isolate w-full overflow-hidden rounded-3xl border border-border/50 bg-card/30 px-6 py-16 backdrop-blur-xl sm:px-12 md:py-24",
        className,
      )}
    >
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-0 h-72 w-[36rem] -translate-x-1/2 rounded-full bg-primary/12 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-5xl">
        <div className="mx-auto max-w-3xl text-center">
          <motion.span
            initial={reduced ? false : { opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-primary"
          >
            <ShieldCheck className="h-3.5 w-3.5" aria-hidden />
            SOC 2 · HIPAA · ISO 27001
          </motion.span>

          <motion.h1
            id={headingId}
            initial={reduced ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.06 }}
            className="mt-6 text-balance text-3xl font-semibold tracking-tight text-foreground sm:text-4xl md:text-5xl"
          >
            The platform Fortune 500 ops teams{" "}
            <span className="bg-gradient-to-br from-primary via-primary to-accent bg-clip-text text-transparent">
              standardize on.
            </span>
          </motion.h1>

          <motion.p
            initial={reduced ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.14 }}
            className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg"
          >
            Compliance-first infrastructure with the controls, audit trails, and dedicated support
            your security team expects.
          </motion.p>
        </div>

        <motion.div
          initial={reduced ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.22 }}
          className="mx-auto mt-10 max-w-xl rounded-2xl border bg-card p-6 shadow-sm md:flex md:items-center md:justify-between md:gap-6"
        >
          <div className="flex items-start gap-3">
            <span className="grid h-12 w-12 place-items-center rounded-xl bg-primary/15 text-primary">
              <TrendingUp className="h-6 w-6" aria-hidden />
            </span>
            <div>
              <p className="text-3xl font-semibold tracking-tight text-foreground md:text-4xl">312% ROI</p>
              <p className="text-sm text-muted-foreground">
                in year one, per Forrester TEI commissioned study.
              </p>
            </div>
          </div>
          <a
            href="#study"
            className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline md:mt-0"
          >
            Read the study
            <ArrowRight className="h-4 w-4" aria-hidden />
          </a>
        </motion.div>

        <motion.div
          initial={reduced ? false : { opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.3 }}
          className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row"
        >
          <a
            href="#demo"
            className="group inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
          >
            <PlayCircle className="h-4 w-4" aria-hidden />
            Book a demo
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none" aria-hidden />
          </a>
          <a
            href="#contact"
            className="inline-flex items-center gap-2 rounded-xl border border-border bg-background px-6 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
          >
            Talk to sales
          </a>
        </motion.div>

        <motion.div
          initial={reduced ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.42 }}
          className="mt-14 border-t border-border/40 pt-6"
        >
          <p className="text-center text-xs uppercase tracking-[0.2em] text-muted-foreground/70">
            Trusted by global teams
          </p>
          <div className="mt-5 grid grid-cols-2 items-center justify-items-center gap-4 sm:grid-cols-3 md:grid-cols-6">
            {LOGOS.map((l) => (
              <span
                key={l}
                className="font-mono text-xs font-bold tracking-widest text-muted-foreground/80 transition-colors hover:text-foreground"
              >
                {l}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default HeroEnterprise;

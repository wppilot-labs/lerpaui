"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, ShieldCheck, Zap, Coins, CreditCard } from "lucide-react";
import { cn } from "../lib/cn";

export interface FintechValueProp {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  body: string;
}

export interface HeroFintechCardProps {
  className?: string;
  eyebrow?: string;
  title?: string;
  highlightedTitle?: string;
  description?: string;
  ctaLabel?: string;
  ctaHref?: string;
  valueProps?: FintechValueProp[];
  cardholderName?: string;
  cardExpiry?: string;
  cardNumber?: string;
}

const DEFAULT_VALUE_PROPS: FintechValueProp[] = [
  { icon: ShieldCheck, title: "0% FX fees", body: "Spend abroad at the real interbank rate. No markups, no surprises." },
  { icon: Zap, title: "Instant payouts", body: "Earnings hit your card in seconds, not the next business day." },
  { icon: Coins, title: "4.7% on balance", body: "Idle cash earns competitive yield, paid daily, FDIC-insured." },
];

/** Fintech hero with a tilted credit card mockup and a value props column. */
export function HeroFintechCard({
  className,
  eyebrow = "Now with Apple Pay",
  title = "The card built for",
  highlightedTitle = "modern money.",
  description = "Banking, spending, and saving — re-engineered around how you actually use your money.",
  ctaLabel = "Apply in 90 seconds",
  ctaHref = "#apply",
  valueProps = DEFAULT_VALUE_PROPS,
  cardholderName = "M. CHEN",
  cardExpiry = "12 / 29",
  cardNumber = "4242 1234 5678 9010",
}: HeroFintechCardProps) {
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
        <div className="absolute -left-32 top-0 h-80 w-80 rounded-full bg-primary/15 blur-3xl" />
        <div className="absolute -right-24 bottom-0 h-72 w-72 rounded-full bg-accent/15 blur-3xl" />
      </div>

      <div className="relative mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2">
        <div>
          <motion.span
            initial={reduced ? false : { opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-primary"
          >
            <CreditCard className="h-3.5 w-3.5" aria-hidden />
            {eyebrow}
          </motion.span>

          <motion.h1
            id={headingId}
            initial={reduced ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.08 }}
            className="mt-5 text-balance text-3xl font-semibold tracking-tight text-foreground sm:text-4xl md:text-5xl"
          >
            {title}{" "}
            <span className="bg-gradient-to-br from-primary via-primary to-accent bg-clip-text text-transparent">
              {highlightedTitle}
            </span>
          </motion.h1>

          <motion.p
            initial={reduced ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.14 }}
            className="mt-5 max-w-md text-base leading-relaxed text-muted-foreground md:text-lg"
          >
            {description}
          </motion.p>

          <motion.ul
            initial={reduced ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.22 }}
            className="mt-7 space-y-3"
          >
            {valueProps.map((v, i) => (
              <motion.li
                key={v.title}
                initial={reduced ? false : { opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.45, delay: 0.28 + i * 0.07 }}
                className="flex items-start gap-3"
              >
                <span className="grid h-9 w-9 flex-shrink-0 place-items-center rounded-lg bg-primary/15 text-primary">
                  <v.icon className="h-4 w-4" aria-hidden />
                </span>
                <div>
                  <p className="text-sm font-semibold text-foreground">{v.title}</p>
                  <p className="text-xs leading-relaxed text-muted-foreground">{v.body}</p>
                </div>
              </motion.li>
            ))}
          </motion.ul>

          <motion.a
            initial={reduced ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.5 }}
            href={ctaHref}
            className="group mt-8 inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
          >
            {ctaLabel}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none" aria-hidden />
          </motion.a>
        </div>

        <motion.div
          initial={reduced ? false : { opacity: 0, rotate: -4, y: 20 }}
          animate={{ opacity: 1, rotate: -8, y: 0 }}
          transition={{ duration: 0.7, delay: 0.18 }}
          className="mx-auto w-full max-w-sm"
          aria-hidden
        >
          <div className="relative aspect-[1.586/1] w-full rounded-2xl bg-gradient-to-br from-foreground via-foreground/90 to-primary p-6 shadow-2xl shadow-primary/20">
            <div className="absolute right-6 top-6 flex items-center gap-1">
              <span className="h-7 w-7 rounded-full bg-rose-400/90" />
              <span className="-ml-3 h-7 w-7 rounded-full bg-amber-300/90 mix-blend-screen" />
            </div>
            <div className="absolute left-6 top-6 grid h-9 w-12 place-items-center rounded-md bg-background/90 text-xs text-foreground">
              CHIP
            </div>
            <div className="absolute bottom-14 left-6 right-6 font-mono text-base tracking-widest text-background sm:text-lg">
              {cardNumber}
            </div>
            <div className="absolute bottom-5 left-6 right-6 flex items-end justify-between text-[11px] font-semibold uppercase tracking-widest text-background/70">
              <span>{cardholderName}</span>
              <span>{cardExpiry}</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default HeroFintechCard;

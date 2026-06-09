"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Star, Shield, Sparkles } from "lucide-react";
import { cn } from "../lib/cn";

export interface CtaStat {
  icon: React.ComponentType<{ className?: string }>;
  value: string;
  label: string;
}

export interface CtaGradientGlowFinalProps {
  className?: string;
  headline?: string;
  subline?: string;
  primaryLabel?: string;
  primaryHref?: string;
  secondaryLabel?: string;
  secondaryHref?: string;
  stats?: CtaStat[];
}

const DEFAULT_STATS: CtaStat[] = [
  { icon: Star, value: "4.9/5", label: "G2 rating" },
  { icon: Shield, value: "SOC 2", label: "Type II" },
  { icon: Sparkles, value: "10k+", label: "Teams" },
];

export function CtaGradientGlowFinal({
  className,
  headline = "Stop wrangling tools. Start shipping product.",
  subline = "Replace the patchwork stack with one calm workspace your team will actually open in the morning.",
  primaryLabel = "Get started — it's free",
  primaryHref = "#start",
  secondaryLabel = "Talk to sales",
  secondaryHref = "#talk",
  stats = DEFAULT_STATS,
}: CtaGradientGlowFinalProps) {
  const reduced = useReducedMotion() ?? false;
  const headingId = React.useId();

  return (
    <section
      aria-labelledby={headingId}
      className={cn(
        "relative isolate w-full overflow-hidden rounded-3xl border border-border/40 bg-card px-6 py-20 text-center md:py-28",
        className
      )}
    >
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(60%_60%_at_50%_120%,oklch(0.7_0.22_280/0.55),transparent_55%),radial-gradient(50%_50%_at_50%_-20%,oklch(0.7_0.18_200/0.4),transparent_60%)]" />
        <motion.div
          aria-hidden
          initial={reduced ? false : { opacity: 0.4 }}
          animate={reduced ? undefined : { opacity: [0.4, 0.7, 0.4] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,oklch(0.7_0.22_280/0.35),transparent_70%)] blur-3xl"
        />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-accent/40 to-transparent" />
      </div>

      <div className="relative mx-auto flex max-w-2xl flex-col items-center">
        <motion.h2
          id={headingId}
          initial={reduced ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.05 }}
          className="text-balance text-4xl font-black leading-[1.05] tracking-tight text-foreground sm:text-5xl lg:text-6xl"
        >
          {headline.split(".").map((part, i, arr) => (
            <React.Fragment key={i}>
              {i === arr.length - 1 && part.trim() === "" ? "" : (
                <>
                  {i === 1 ? (
                    <span className="bg-gradient-to-br from-primary via-primary to-accent bg-clip-text text-transparent">
                      {part}{i < arr.length - 1 ? "." : ""}
                    </span>
                  ) : (
                    <>{part}{i < arr.length - 1 ? "." : ""}</>
                  )}
                </>
              )}
            </React.Fragment>
          ))}
        </motion.h2>

        <motion.p
          initial={reduced ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.14 }}
          className="mt-5 max-w-xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg"
        >
          {subline}
        </motion.p>

        <motion.div
          initial={reduced ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.22 }}
          className="mt-8 flex flex-col items-center gap-3 sm:flex-row"
        >
          <a
            href={primaryHref}
            className="group inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-7 py-3.5 text-base font-semibold text-primary-foreground shadow-2xl shadow-primary/25 transition-all hover:brightness-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
          >
            {primaryLabel}
            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none" aria-hidden />
          </a>
          <a
            href={secondaryHref}
            className="inline-flex items-center justify-center rounded-xl border bg-card/40 px-7 py-3.5 text-base font-semibold text-foreground backdrop-blur transition-colors hover:bg-muted/40"
          >
            {secondaryLabel}
          </a>
        </motion.div>

        <ul className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-muted-foreground">
          {stats.map((s) => {
            const Icon = s.icon;
            return (
              <li key={s.label} className="flex items-center gap-2">
                <Icon className="h-4 w-4 text-primary" aria-hidden />
                <span className="font-semibold text-foreground">{s.value}</span> {s.label}
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

export default CtaGradientGlowFinal;

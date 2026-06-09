"use client";

import React from "react";
import { motion } from "framer-motion";
import { Apple, Play, Star, Check } from "lucide-react";
import { cn } from "../lib/cn";
import { usePrefersReducedMotion } from "../animation/hooks";

const FEATURES = ["Offline-first sync", "Biometric lock", "Lives in your pocket"];

export interface HeroSectionMobileAppProps {
  className?: string;
}

export function HeroSectionMobileApp({
  className,
}: HeroSectionMobileAppProps) {
  const reduced = usePrefersReducedMotion();

  return (
    <section
      className={cn(
        "w-full max-w-3xl overflow-hidden rounded-2xl border border-border/50 bg-card/45 shadow-xl backdrop-blur-xl font-sans text-foreground",
        className,
      )}
    >
      <div className="grid items-center gap-6 p-8 sm:grid-cols-2">
        <motion.div
          initial={reduced ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <span className="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-secondary/40 px-3 py-1 text-xs font-semibold text-muted-foreground">
            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
            4.8 on the App Store
          </span>

          <h1 className="mt-4 text-4xl font-black leading-[1.1] tracking-tight sm:text-5xl">
            Your money,
            <br />
            <span className="text-primary">finally in sync.</span>
          </h1>

          <p className="mt-3 max-w-xs text-base leading-relaxed text-muted-foreground">
            Track spending, split bills, and hit savings goals — all from one
            beautifully simple app.
          </p>

          <ul className="mt-4 space-y-1.5">
            {FEATURES.map((f) => (
              <li
                key={f}
                className="flex items-center gap-2 text-sm text-muted-foreground"
              >
                <Check className="h-4 w-4 text-emerald-400" />
                {f}
              </li>
            ))}
          </ul>

          <div className="mt-5 flex flex-wrap gap-2.5">
            <a
              href="/"
              aria-label="Download on the App Store"
              className="inline-flex items-center gap-2 rounded-xl bg-foreground px-4 py-2 text-background transition-opacity hover:opacity-90"
            >
              <Apple className="h-5 w-5" />
              <span className="text-left leading-none">
                <span className="block text-[11px] opacity-70">Download on the</span>
                <span className="block text-sm font-bold">App Store</span>
              </span>
            </a>
            <a
              href="/"
              aria-label="Get it on Google Play"
              className="inline-flex items-center gap-2 rounded-xl border border-border/60 bg-secondary/40 px-4 py-2 text-foreground transition-colors hover:bg-secondary/60"
            >
              <Play className="h-5 w-5 fill-current" />
              <span className="text-left leading-none">
                <span className="block text-[11px] opacity-70">Get it on</span>
                <span className="block text-sm font-bold">Google Play</span>
              </span>
            </a>
          </div>
        </motion.div>

        <motion.div
          initial={reduced ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: reduced ? 0 : 0.1 }}
          className="flex justify-center"
        >
          <div className="relative h-64 w-36 rounded-[2rem] border-4 border-border/70 bg-gradient-to-b from-secondary/60 to-card p-2.5 shadow-2xl">
            <span className="absolute left-1/2 top-2 h-1 w-10 -translate-x-1/2 rounded-full bg-border" />
            <div className="mt-4 space-y-2">
              <div className="rounded-xl bg-primary/15 p-2.5">
                <p className="text-[8px] font-medium text-muted-foreground/70">
                  Balance
                </p>
                <p className="text-base font-black">$4,820.50</p>
              </div>
              <div className="rounded-xl bg-secondary/40 p-2">
                <div className="flex items-center justify-between">
                  <span className="text-[8px] font-semibold">Groceries</span>
                  <span className="text-[8px] font-bold text-rose-400">−$62</span>
                </div>
              </div>
              <div className="rounded-xl bg-secondary/40 p-2">
                <div className="flex items-center justify-between">
                  <span className="text-[8px] font-semibold">Payday</span>
                  <span className="text-[8px] font-bold text-emerald-400">
                    +$2,100
                  </span>
                </div>
              </div>
              <div className="h-12 rounded-xl bg-gradient-to-t from-emerald-400/25 to-transparent" />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

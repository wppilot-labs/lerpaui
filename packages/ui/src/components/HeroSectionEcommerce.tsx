"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, Star, Truck } from "lucide-react";
import { cn } from "../lib/cn";
import { usePrefersReducedMotion } from "../animation/hooks";

export interface HeroSectionEcommerceProps {
  className?: string;
}

export function HeroSectionEcommerce({
  className,
}: HeroSectionEcommerceProps) {
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
          initial={reduced ? false : { opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
        >
          <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-500/10 px-3 py-1 text-xs font-bold uppercase tracking-wide text-rose-400">
            Summer drop · up to 40% off
          </span>

          <h1 className="mt-4 text-4xl font-black leading-[1.1] tracking-tight sm:text-5xl">
            Everyday essentials,
            <br />
            <span className="text-primary">elevated.</span>
          </h1>

          <p className="mt-3 max-w-xs text-base leading-relaxed text-muted-foreground">
            Thoughtfully made pieces in organic cotton and linen. Free returns,
            always.
          </p>

          <div className="mt-5 flex items-center gap-3">
            <a
              href="/"
              className="inline-flex items-center gap-1.5 rounded-xl bg-foreground px-5 py-2.5 text-sm font-bold text-background transition-opacity hover:opacity-90"
            >
              Shop the drop <ArrowRight className="h-4 w-4" />
            </a>
            <a
              href="/"
              className="text-sm font-semibold text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline"
            >
              Lookbook
            </a>
          </div>

          <div className="mt-5 flex items-center gap-4 text-xs text-muted-foreground/70">
            <span className="flex items-center gap-1">
              <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
              4.9 · 2,400 reviews
            </span>
            <span className="flex items-center gap-1">
              <Truck className="h-3.5 w-3.5" />
              Free shipping $75+
            </span>
          </div>
        </motion.div>

        <motion.div
          initial={reduced ? false : { opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.45, delay: reduced ? 0 : 0.1 }}
          className="relative"
        >
          <div className="relative aspect-square overflow-hidden rounded-2xl bg-gradient-to-br from-amber-200/30 via-secondary/40 to-emerald-200/20">
            <span className="absolute right-3 top-3 rounded-full bg-foreground px-2.5 py-1 text-xs font-bold text-background">
              New
            </span>
            <div className="absolute bottom-3 left-3 rounded-xl border border-border/50 bg-card/70 px-3 py-2 backdrop-blur-md">
              <p className="text-sm font-semibold">Linen Overshirt</p>
              <p className="text-xs font-bold text-primary">$89</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

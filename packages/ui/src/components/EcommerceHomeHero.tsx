"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, Truck, RotateCcw, ShieldCheck } from "lucide-react";
import { cn } from "../lib/cn";
import { usePrefersReducedMotion } from "../animation/hooks";

const PERKS = [
  { icon: Truck, label: "Free shipping over $50" },
  { icon: RotateCcw, label: "60-day returns" },
  { icon: ShieldCheck, label: "2-year warranty" },
];

export interface EcommerceHomeHeroProps {
  className?: string;
}

export function EcommerceHomeHero({ className }: EcommerceHomeHeroProps) {
  const reduced = usePrefersReducedMotion();

  return (
    <div className={cn("relative w-full max-w-2xl overflow-hidden bg-card/45 backdrop-blur-xl border border-border/50 rounded-2xl shadow-xl font-sans text-foreground", className)}>
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-violet-500/10 to-transparent" aria-hidden />
      <div className="relative grid grid-cols-1 sm:grid-cols-[1.4fr_1fr] gap-4 p-6">
        <div className="flex flex-col justify-center">
          <span className="inline-flex w-fit items-center text-xs font-bold uppercase tracking-wider bg-emerald-500/15 text-emerald-400 px-2.5 py-1 rounded-full border border-emerald-500/20">
            New season drop
          </span>
          <motion.h1
            initial={reduced ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reduced ? 0 : 0.4 }}
            className="text-2xl font-bold leading-tight mt-3"
          >
            Up to 40% off<br />the autumn collection
          </motion.h1>
          <p className="text-sm text-muted-foreground/70 mt-2 max-w-xs">
            Layer up with our most-loved knits, shells, and accessories — restocked and ready to ship.
          </p>
          <div className="flex items-center gap-2 mt-4">
            <button type="button" className="inline-flex items-center gap-1.5 text-sm font-semibold rounded-lg px-4 py-2 bg-primary text-primary-foreground hover:brightness-110 transition">
              Shop sale <ArrowRight className="w-4 h-4" />
            </button>
            <button type="button" className="text-sm font-medium rounded-lg px-4 py-2 border border-foreground/[0.1] bg-foreground/[0.03] hover:border-foreground/25 transition">
              New arrivals
            </button>
          </div>
        </div>

        <motion.div
          initial={reduced ? false : { opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: reduced ? 0 : 0.5, delay: reduced ? 0 : 0.1 }}
          className="hidden sm:block rounded-xl bg-gradient-to-br from-amber-400/30 to-rose-500/20 border border-foreground/[0.06]"
        />
      </div>

      <div className="relative grid grid-cols-3 divide-x divide-foreground/[0.05] border-t border-foreground/[0.05]">
        {PERKS.map((p) => {
          const Icon = p.icon;
          return (
            <div key={p.label} className="flex items-center justify-center gap-1.5 px-2 py-2.5 text-xs text-muted-foreground/70">
              <Icon className="w-4 h-4 text-primary shrink-0" />
              <span className="truncate">{p.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

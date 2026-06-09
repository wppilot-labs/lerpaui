"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Sparkles } from "lucide-react";
import { cn } from "../lib/cn";
import { usePrefersReducedMotion } from "../animation/hooks";

export interface AnnualMonthlyToggleHeroProps {
  className?: string;
}

type Cycle = "monthly" | "annual";

const TIERS = [
  {
    key: "starter",
    name: "Starter",
    monthly: 12,
    annual: 9,
    featured: false,
    features: ["3 projects", "Community support"],
  },
  {
    key: "pro",
    name: "Pro",
    monthly: 39,
    annual: 29,
    featured: true,
    features: ["Unlimited projects", "Priority email"],
  },
] as const;

export function AnnualMonthlyToggleHero({ className }: AnnualMonthlyToggleHeroProps) {
  const [cycle, setCycle] = useState<Cycle>("annual");
  const reduced = usePrefersReducedMotion();

  return (
    <div
      className={cn(
        "w-full max-w-sm border border-white/5 bg-zinc-950/40 rounded-2xl shadow-2xl p-6 flex flex-col gap-3 backdrop-blur-xl",
        className,
      )}
    >
      <div className="flex flex-col gap-1 font-mono select-none">
        <span className="text-[9px] uppercase tracking-widest font-bold text-primary">BILLING_CYCLE</span>
        <span className="text-[8px] text-white/40 uppercase font-semibold">Reactive prices · animated savings</span>
      </div>

      <div
        role="radiogroup"
        aria-label="Billing cycle"
        className="relative flex items-center bg-white/[0.03] border border-white/5 rounded-full p-1"
      >
        <motion.span
          aria-hidden="true"
          className="absolute top-1 bottom-1 w-[calc(50%-4px)] rounded-full bg-primary/90 shadow-[0_0_18px_-4px_var(--accent-glow)]"
          animate={{ left: cycle === "monthly" ? 4 : "50%" }}
          transition={reduced ? { duration: 0 } : { type: "spring", stiffness: 360, damping: 28 }}
        />
        {(["monthly", "annual"] as Cycle[]).map((c) => (
          <button
            key={c}
            type="button"
            role="radio"
            aria-checked={cycle === c}
            onClick={() => setCycle(c)}
            className={cn(
              "relative z-10 flex-1 py-1.5 text-[10px] font-mono uppercase tracking-widest rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/60",
              cycle === c ? "text-zinc-950 font-bold" : "text-white/60 hover:text-white",
            )}
          >
            {c === "annual" ? (
              <span className="inline-flex items-center gap-1">
                Annual
                <AnimatePresence>
                  {cycle === "annual" && (
                    <motion.span
                      key="chip"
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.5, opacity: 0 }}
                      transition={reduced ? { duration: 0 } : { type: "spring", stiffness: 480, damping: 22 }}
                      className="text-[8px] bg-zinc-950 text-primary px-1.5 py-0.5 rounded-full font-bold"
                    >
                      -25%
                    </motion.span>
                  )}
                </AnimatePresence>
              </span>
            ) : (
              "Monthly"
            )}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-2">
        {TIERS.map((tier) => {
          const price = cycle === "annual" ? tier.annual : tier.monthly;
          return (
            <div
              key={tier.key}
              className={cn(
                "relative rounded-xl border p-3 flex flex-col gap-2 transition-colors",
                tier.featured
                  ? "border-primary/40 bg-primary/5"
                  : "border-white/5 bg-white/[0.02]",
              )}
            >
              {tier.featured && (
                <span className="absolute -top-2 right-2 text-[7px] font-mono uppercase tracking-widest bg-primary text-zinc-950 px-1.5 py-0.5 rounded-full flex items-center gap-0.5 font-bold">
                  <Sparkles aria-hidden="true" className="w-2 h-2" /> Pop
                </span>
              )}
              <span className="text-[9px] font-mono uppercase tracking-widest text-white/50">{tier.name}</span>
              <div className="flex items-baseline gap-1">
                <span className="text-[9px] text-white/40">$</span>
                <AnimatePresence mode="popLayout">
                  <motion.span
                    key={`${tier.key}-${cycle}`}
                    initial={reduced ? { opacity: 1 } : { y: 8, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={reduced ? { opacity: 0 } : { y: -8, opacity: 0 }}
                    transition={{ duration: 0.18 }}
                    className="text-xl font-black tabular-nums text-white"
                  >
                    {price}
                  </motion.span>
                </AnimatePresence>
                <span className="text-[9px] text-white/40">/mo</span>
              </div>
              {cycle === "annual" && (
                <span className="text-[8px] font-mono text-primary uppercase tracking-widest">
                  save ${(tier.monthly - tier.annual) * 12}/yr
                </span>
              )}
              <ul className="flex flex-col gap-1 pt-1 border-t border-white/5">
                {tier.features.map((f) => (
                  <li key={f} className="text-[9.5px] text-white/70 flex items-center gap-1.5">
                    <Check aria-hidden="true" className="w-2.5 h-2.5 text-primary shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
}

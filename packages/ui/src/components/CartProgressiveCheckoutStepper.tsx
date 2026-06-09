"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, Truck, CreditCard, Check, ArrowRight } from "lucide-react";
import { cn } from "../lib/cn";

interface Step {
  id: "cart" | "ship" | "pay";
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  hint: string;
}

const STEPS: Step[] = [
  { id: "cart", label: "Cart", icon: ShoppingBag, hint: "2 items · $254" },
  { id: "ship", label: "Ship", icon: Truck, hint: "Standard · 2 days" },
  { id: "pay", label: "Pay", icon: CreditCard, hint: "Card · ••4242" },
];

export interface CartProgressiveCheckoutStepperProps {
  className?: string;
}

export function CartProgressiveCheckoutStepper({ className }: CartProgressiveCheckoutStepperProps) {
  const [step, setStep] = useState(0);
  const next = () => setStep((s) => Math.min(STEPS.length - 1, s + 1));
  const prev = () => setStep((s) => Math.max(0, s - 1));
  const current = STEPS[step];

  return (
    <div
      className={cn(
        "flex flex-col gap-3 p-6 border border-white/5 bg-zinc-950/40 rounded-2xl shadow-2xl w-full max-w-sm text-foreground select-none",
        className
      )}
      role="region"
      aria-label="Checkout progress"
    >
      <div className="flex flex-col gap-1 font-mono select-none">
        <span className="text-[9px] uppercase tracking-widest font-bold text-primary">CHECKOUT_STEPPER</span>
        <span className="text-[8px] text-white/40 uppercase font-semibold">Inline ribbon preview</span>
      </div>

      <ol
        className="relative flex items-center justify-between gap-2"
        aria-label={`Step ${step + 1} of ${STEPS.length}: ${current.label}`}
      >
        <div className="absolute left-4 right-4 top-4 h-px bg-edge" aria-hidden="true" />
        <motion.div
          className="absolute left-4 top-4 h-px bg-accent shadow-[0_0_8px_var(--accent-glow)]"
          initial={false}
          animate={{ width: `calc((100% - 32px) * ${step / (STEPS.length - 1)})` }}
          transition={{ type: "spring", stiffness: 220, damping: 28 }}
          aria-hidden="true"
        />
        {STEPS.map((s, i) => {
          const Icon = s.icon;
          const state = i < step ? "done" : i === step ? "active" : "todo";
          return (
            <li key={s.id} className="relative z-10 flex flex-col items-center gap-1">
              <button
                type="button"
                onClick={() => setStep(i)}
                aria-current={state === "active" ? "step" : undefined}
                aria-label={`Go to ${s.label} step`}
                className={cn(
                  "w-8 h-8 rounded-full grid place-items-center border transition-colors",
                  state === "done" && "bg-accent text-bg border-accent",
                  state === "active" && "bg-accent-soft text-accent border-accent/60",
                  state === "todo" && "bg-bg-3 text-text-3 border-edge"
                )}
              >
                {state === "done" ? (
                  <Check className="w-4 h-4" aria-hidden="true" />
                ) : (
                  <Icon className="w-4 h-4" aria-hidden="true" />
                )}
              </button>
              <span
                className={cn(
                  "text-[10px] font-mono uppercase tracking-widest",
                  state === "active" ? "text-accent" : "text-text-3"
                )}
              >
                {s.label}
              </span>
            </li>
          );
        })}
      </ol>

      <div className="relative h-12 overflow-hidden rounded-xl border border-edge bg-bg-3">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={current.id}
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -16 }}
            transition={{ duration: 0.22 }}
            className="absolute inset-0 flex items-center justify-between px-4"
          >
            <div className="flex flex-col">
              <span className="text-[10px] font-mono uppercase tracking-widest text-text-3">
                {current.label}
              </span>
              <span className="text-xs font-semibold text-text">{current.hint}</span>
            </div>
            <current.icon className="w-5 h-5 text-accent" aria-hidden="true" />
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={prev}
          disabled={step === 0}
          className="px-3 py-1.5 rounded-lg border border-edge text-[11px] font-mono uppercase tracking-wider text-text-2 hover:text-text hover:border-edge-2 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          Back
        </button>
        <button
          type="button"
          onClick={next}
          disabled={step === STEPS.length - 1}
          className="flex-1 px-3 py-1.5 rounded-lg bg-accent text-bg text-[11px] font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed transition-opacity"
        >
          {step === STEPS.length - 1 ? "Place order" : "Continue"}
          <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}

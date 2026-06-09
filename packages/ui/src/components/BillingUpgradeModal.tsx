"use client";

import React, { useCallback, useEffect, useId, useRef, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { X, CreditCard, Check, Sparkles } from "lucide-react";
import { cn } from "../lib/cn";

export interface BillingUpgradeModalProps {
  className?: string;
}

type PlanId = "starter" | "pro" | "team";
type Cycle = "monthly" | "annual";

interface Plan {
  id: PlanId;
  name: string;
  tagline: string;
  monthly: number;
  annual: number;
  highlight?: boolean;
  features: string[];
}

const PLANS: Plan[] = [
  {
    id: "starter",
    name: "Starter",
    tagline: "For individuals trying things out.",
    monthly: 0,
    annual: 0,
    features: ["1 project", "Community support", "10k requests / mo"],
  },
  {
    id: "pro",
    name: "Pro",
    tagline: "For solo builders shipping in production.",
    monthly: 19,
    annual: 15,
    highlight: true,
    features: ["10 projects", "Email support", "1M requests / mo", "Custom domains"],
  },
  {
    id: "team",
    name: "Team",
    tagline: "For small teams that need controls.",
    monthly: 49,
    annual: 39,
    features: ["Unlimited projects", "Priority support", "10M requests / mo", "SSO + audit logs"],
  },
];

const CURRENT_PLAN: PlanId = "starter";

export function BillingUpgradeModal({ className }: BillingUpgradeModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [cycle, setCycle] = useState<Cycle>("monthly");
  const reducedMotion = useReducedMotion();

  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const firstFocusRef = useRef<HTMLButtonElement>(null);

  const titleId = useId();
  const descId = useId();
  const cycleLabelId = useId();

  const close = useCallback(() => {
    setIsOpen(false);
    requestAnimationFrame(() => triggerRef.current?.focus());
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const focusableSelector =
      'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        close();
        return;
      }
      if (e.key === "Tab" && panelRef.current) {
        const nodes = panelRef.current.querySelectorAll<HTMLElement>(focusableSelector);
        if (nodes.length === 0) return;
        const first = nodes[0];
        const last = nodes[nodes.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener("keydown", handleKey);
    const t = window.setTimeout(() => firstFocusRef.current?.focus(), 60);

    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = previousOverflow;
      window.clearTimeout(t);
    };
  }, [isOpen, close]);

  const motionProps = reducedMotion
    ? { initial: false, animate: { opacity: 1 }, exit: { opacity: 0 } }
    : {
        initial: { opacity: 0, scale: 0.96, y: 8 },
        animate: { opacity: 1, scale: 1, y: 0 },
        exit: { opacity: 0, scale: 0.96, y: 8 },
        transition: { type: "spring" as const, duration: 0.4 },
      };

  return (
    <div className={cn("flex flex-col items-center gap-3 font-sans", className)}>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setIsOpen(true)}
        className="px-4 py-2 bg-primary hover:brightness-110 text-primary-foreground font-semibold text-sm rounded-xl shadow-lg active:scale-95 transition-all inline-flex items-center gap-2"
      >
        <CreditCard className="w-4 h-4" aria-hidden="true" />
        Upgrade plan
      </button>

      <AnimatePresence>
        {isOpen && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            aria-describedby={descId}
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={close}
              className="absolute inset-0 bg-black/60 backdrop-blur-md"
              aria-hidden="true"
            />

            <motion.div
              ref={panelRef}
              {...motionProps}
              className="relative w-full max-w-3xl bg-card border border-border p-6 rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto"
            >
              <button
                type="button"
                onClick={close}
                aria-label="Close dialog"
                className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-4 h-4" aria-hidden="true" />
              </button>

              <div className="text-center mb-6 px-6">
                <h2 id={titleId} className="text-xl font-semibold text-foreground mb-1">
                  Choose the plan that fits your team
                </h2>
                <p id={descId} className="text-sm text-muted-foreground">
                  Upgrade, downgrade, or cancel anytime. Annual plans save 20%.
                </p>
              </div>

              <div className="flex justify-center mb-6">
                <div
                  role="radiogroup"
                  aria-labelledby={cycleLabelId}
                  className="inline-flex rounded-full border border-border bg-muted p-1"
                >
                  <span id={cycleLabelId} className="sr-only">
                    Billing cycle
                  </span>
                  {(["monthly", "annual"] as Cycle[]).map((c, i) => {
                    const active = cycle === c;
                    return (
                      <button
                        key={c}
                        ref={i === 0 ? firstFocusRef : undefined}
                        type="button"
                        role="radio"
                        aria-checked={active}
                        onClick={() => setCycle(c)}
                        className={cn(
                          "px-4 py-1.5 text-sm font-medium rounded-full transition-colors",
                          active
                            ? "bg-background text-foreground shadow-sm"
                            : "text-muted-foreground hover:text-foreground"
                        )}
                      >
                        {c === "monthly" ? "Monthly" : "Annual"}
                        {c === "annual" && (
                          <span className="ml-1.5 text-[10px] font-semibold text-primary">−20%</span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                {PLANS.map((plan) => {
                  const isCurrent = plan.id === CURRENT_PLAN;
                  const price = cycle === "monthly" ? plan.monthly : plan.annual;
                  return (
                    <div
                      key={plan.id}
                      className={cn(
                        "relative rounded-xl border p-5 flex flex-col",
                        plan.highlight
                          ? "border-primary/60 bg-primary/[0.04] shadow-md"
                          : "border-border bg-background/40"
                      )}
                    >
                      {plan.highlight && (
                        <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary text-primary-foreground text-[10px] font-semibold">
                          <Sparkles className="w-3 h-3" aria-hidden="true" />
                          Most popular
                        </span>
                      )}

                      <div className="flex items-center justify-between mb-1">
                        <h3 className="text-base font-semibold text-foreground">{plan.name}</h3>
                        {isCurrent && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-muted text-[10px] font-semibold text-muted-foreground border border-border">
                            Current
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mb-4">{plan.tagline}</p>

                      <div className="mb-4">
                        <span className="text-3xl font-bold text-foreground tabular-nums">${price}</span>
                        <span className="text-xs text-muted-foreground ml-1">
                          {price === 0 ? "/ forever" : cycle === "monthly" ? "/ mo" : "/ mo, billed yearly"}
                        </span>
                      </div>

                      <ul className="space-y-2 mb-5 flex-1">
                        {plan.features.map((f) => (
                          <li key={f} className="flex items-start gap-2 text-sm text-foreground">
                            <Check className="w-4 h-4 mt-0.5 text-primary flex-shrink-0" aria-hidden="true" />
                            <span>{f}</span>
                          </li>
                        ))}
                      </ul>

                      <button
                        type="button"
                        disabled={isCurrent}
                        onClick={close}
                        className={cn(
                          "w-full py-2 text-sm font-semibold rounded-lg transition-all",
                          isCurrent
                            ? "bg-muted text-muted-foreground cursor-not-allowed"
                            : plan.highlight
                              ? "bg-primary hover:brightness-110 text-primary-foreground shadow-sm"
                              : "bg-secondary hover:bg-secondary/80 text-secondary-foreground"
                        )}
                      >
                        {isCurrent ? "Current plan" : `Upgrade to ${plan.name}`}
                      </button>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

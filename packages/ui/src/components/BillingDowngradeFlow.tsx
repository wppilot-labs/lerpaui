"use client";

import { useState } from "react";
import { Check, ArrowDown } from "lucide-react";
import { cn } from "../lib/cn";

type Plan = {
  id: string;
  name: string;
  price: string;
  features: string[];
};

const CURRENT: Plan = {
  id: "pro",
  name: "Pro",
  price: "$29",
  features: ["25 seats", "Unlimited projects", "Priority support", "Advanced analytics"],
};

const TARGET: Plan = {
  id: "starter",
  name: "Starter",
  price: "$9",
  features: ["5 seats", "10 projects", "Community support", "Basic analytics"],
};

export interface BillingDowngradeFlowProps {
  className?: string;
}

export function BillingDowngradeFlow({ className }: BillingDowngradeFlowProps) {
  const [confirmed, setConfirmed] = useState(false);

  return (
    <div className={cn("w-full max-w-md bg-card backdrop-blur-xl border border-border p-5 rounded-2xl shadow-sm font-sans text-foreground", className)}>
      <h3 className="text-base font-bold">Downgrade plan</h3>
      <p className="mb-4 text-sm text-muted-foreground">
        Compare what changes when you move to a smaller plan.
      </p>

      <div className="flex items-stretch gap-2">
        <PlanCard plan={CURRENT} tone="current" />
        <div className="flex items-center justify-center">
          <span className="grid h-9 w-9 place-items-center rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400">
            <ArrowDown className="h-4 w-4" />
          </span>
        </div>
        <PlanCard plan={TARGET} tone="target" />
      </div>

      <div className="mt-4 rounded-xl border border-amber-500/20 bg-amber-500/[0.07] p-3 text-sm text-amber-700 dark:text-amber-200/90">
        Downgrading removes 20 seats and access to advanced analytics at the end of your billing cycle.
      </div>

      <label className="mt-3 flex cursor-pointer items-center gap-2 text-sm text-muted-foreground">
        <input
          type="checkbox"
          checked={confirmed}
          onChange={(e) => setConfirmed(e.target.checked)}
          className="h-4 w-4 accent-primary"
        />
        I understand I&apos;ll lose access to Pro features
      </label>

      <button
        type="button"
        disabled={!confirmed}
        className="mt-3 w-full rounded-xl bg-primary py-2.5 text-sm font-bold text-primary-foreground transition-all hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40"
      >
        Switch to Starter
      </button>
    </div>
  );
}

function PlanCard({ plan, tone }: { plan: Plan; tone: "current" | "target" }) {
  return (
    <div
      className={cn(
        "flex-1 rounded-xl border p-4",
        tone === "target" ? "border-primary/30 bg-primary/[0.06]" : "border-border bg-foreground/[0.02]"
      )}
    >
      <div className="flex items-baseline justify-between">
        <span className="text-sm font-bold">{plan.name}</span>
        <span className="text-[11px] uppercase tracking-wide text-muted-foreground">
          {tone === "current" ? "Current" : "New"}
        </span>
      </div>
      <div className="mb-2.5 mt-0.5">
        <span className="text-2xl font-black">{plan.price}</span>
        <span className="text-xs text-muted-foreground">/mo</span>
      </div>
      <ul className="space-y-1.5">
        {plan.features.map((f) => (
          <li key={f} className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Check className="h-3.5 w-3.5 shrink-0 text-emerald-600 dark:text-emerald-400" />
            {f}
          </li>
        ))}
      </ul>
    </div>
  );
}

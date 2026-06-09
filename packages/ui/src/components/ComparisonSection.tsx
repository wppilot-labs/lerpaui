"use client";

import React from "react";
import { Check, Minus } from "lucide-react";
import { cn } from "../lib/cn";

type Plan = "Starter" | "Pro" | "Scale";

type FeatureRow = {
  feature: string;
  values: Record<Plan, boolean | string>;
};

const PLANS: Plan[] = ["Starter", "Pro", "Scale"];

const ROWS: FeatureRow[] = [
  { feature: "Team members", values: { Starter: "3", Pro: "25", Scale: "Unlimited" } },
  { feature: "Projects", values: { Starter: "10", Pro: "Unlimited", Scale: "Unlimited" } },
  { feature: "Analytics dashboard", values: { Starter: false, Pro: true, Scale: true } },
  { feature: "Custom roles", values: { Starter: false, Pro: true, Scale: true } },
  { feature: "Audit logs", values: { Starter: false, Pro: false, Scale: true } },
  { feature: "SAML SSO", values: { Starter: false, Pro: false, Scale: true } },
];

function renderValue(value: boolean | string) {
  if (typeof value === "string") {
    return <span className="text-sm font-medium text-foreground/90">{value}</span>;
  }
  return value ? (
    <Check className="mx-auto h-4 w-4 text-emerald-600 dark:text-emerald-400" />
  ) : (
    <Minus className="mx-auto h-4 w-4 text-muted-foreground/30" />
  );
}

export interface ComparisonSectionProps {
  className?: string;
}

export function ComparisonSection({ className }: ComparisonSectionProps) {
  return (
    <div
      className={cn(
        "w-full max-w-2xl bg-card/45 backdrop-blur-xl border border-border/50 rounded-2xl shadow-xl font-sans text-foreground overflow-hidden",
        className,
      )}
    >
      <table className="w-full border-collapse text-left">
        <thead>
          <tr className="border-b border-foreground/[0.06]">
            <th className="px-4 py-3.5 text-xs font-semibold text-muted-foreground/60">
              Compare plans
            </th>
            {PLANS.map((plan) => (
              <th
                key={plan}
                className={cn(
                  "px-4 py-3.5 text-center text-xs font-bold",
                  plan === "Pro" ? "text-primary" : "text-foreground/90",
                )}
              >
                {plan}
                {plan === "Pro" && (
                  <span className="ml-1.5 rounded-full bg-primary/15 px-1.5 py-0.5 text-[11px] font-semibold uppercase text-primary">
                    Popular
                  </span>
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-foreground/[0.04]">
          {ROWS.map((row) => (
            <tr key={row.feature} className="transition-colors hover:bg-foreground/[0.02]">
              <td className="px-4 py-3 text-sm text-foreground/80">{row.feature}</td>
              {PLANS.map((plan) => (
                <td
                  key={plan}
                  className={cn("px-4 py-3 text-center", plan === "Pro" && "bg-primary/[0.04]")}
                >
                  {renderValue(row.values[plan])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

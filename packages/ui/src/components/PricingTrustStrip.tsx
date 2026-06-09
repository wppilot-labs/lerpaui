"use client";

import React from "react";
import { ShieldCheck, RefreshCcw, Lock, Headphones } from "lucide-react";
import { cn } from "../lib/cn";

type Badge = {
  id: string;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  sub: string;
};

const BADGES: Badge[] = [
  { id: "guarantee", icon: ShieldCheck, title: "30-day guarantee", sub: "Full refund, no questions" },
  { id: "cancel", icon: RefreshCcw, title: "Cancel anytime", sub: "No long-term contracts" },
  { id: "secure", icon: Lock, title: "Secure checkout", sub: "256-bit SSL encryption" },
  { id: "support", icon: Headphones, title: "Human support", sub: "Avg. reply under 2h" },
];

export interface PricingTrustStripProps {
  className?: string;
}

export function PricingTrustStrip({ className }: PricingTrustStripProps) {
  return (
    <div
      className={cn(
        "w-full max-w-3xl bg-card border border-border rounded-2xl shadow-sm font-sans text-foreground p-5",
        className,
      )}
    >
      <ul className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {BADGES.map((b) => {
          const Icon = b.icon;
          return (
            <li
              key={b.id}
              className="flex items-center gap-3 rounded-xl bg-muted border border-border p-3"
            >
              <div className="h-10 w-10 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                <Icon className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="text-sm font-bold truncate">{b.title}</div>
                <div className="text-xs text-muted-foreground truncate">
                  {b.sub}
                </div>
              </div>
            </li>
          );
        })}
      </ul>

      <div className="mt-3 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
        <span>Trusted by 12,000+ teams</span>
        <span aria-hidden="true">·</span>
        <span>SOC 2 Type II</span>
        <span aria-hidden="true">·</span>
        <span>GDPR compliant</span>
      </div>
    </div>
  );
}

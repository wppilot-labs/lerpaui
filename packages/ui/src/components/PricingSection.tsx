"use client";

import React from "react";
import { Check } from "lucide-react";
import { cn } from "../lib/cn";

type Tier = {
  id: string;
  name: string;
  price: string;
  period: string;
  blurb: string;
  features: string[];
  cta: string;
  featured?: boolean;
};

const TIERS: Tier[] = [
  {
    id: "starter",
    name: "Starter",
    price: "$0",
    period: "/mo",
    blurb: "For side projects",
    features: ["1 project", "Community support", "1 GB storage"],
    cta: "Get started",
  },
  {
    id: "pro",
    name: "Pro",
    price: "$24",
    period: "/mo",
    blurb: "For growing teams",
    features: ["Unlimited projects", "Priority support", "100 GB storage", "Analytics"],
    cta: "Start free trial",
    featured: true,
  },
  {
    id: "scale",
    name: "Scale",
    price: "$79",
    period: "/mo",
    blurb: "For large orgs",
    features: ["Everything in Pro", "SSO & SAML", "Audit logs", "SLA"],
    cta: "Contact sales",
  },
];

export interface PricingSectionProps {
  className?: string;
}

export function PricingSection({ className }: PricingSectionProps) {
  return (
    <div
      className={cn(
        "w-full max-w-3xl grid grid-cols-1 sm:grid-cols-3 gap-4 font-sans text-foreground",
        className,
      )}
    >
      {TIERS.map((t) => (
        <div
          key={t.id}
          className={cn(
            "relative flex flex-col rounded-2xl border p-6 shadow-sm",
            t.featured
              ? "border-primary/40 bg-primary/[0.06] sm:-mt-2 sm:mb-2"
              : "border-border bg-card",
          )}
        >
          {t.featured && (
            <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 rounded-full bg-primary px-2.5 py-0.5 text-[11px] font-black uppercase tracking-wide text-primary-foreground">
              Most popular
            </span>
          )}

          <h3 className="text-base font-bold">{t.name}</h3>
          <p className="text-xs text-muted-foreground">{t.blurb}</p>

          <div className="mt-3 flex items-baseline gap-1">
            <span className="text-4xl font-black">{t.price}</span>
            <span className="text-sm text-muted-foreground">{t.period}</span>
          </div>

          <ul className="mt-4 space-y-2 flex-1">
            {t.features.map((f) => (
              <li key={f} className="flex items-start gap-2 text-sm">
                <Check
                  className={cn(
                    "w-4 h-4 shrink-0 mt-0.5",
                    t.featured ? "text-primary" : "text-emerald-600 dark:text-emerald-400",
                  )}
                />
                <span className="text-muted-foreground">{f}</span>
              </li>
            ))}
          </ul>

          <button
            type="button"
            className={cn(
              "mt-5 h-11 rounded-xl text-sm font-bold transition-all",
              t.featured
                ? "bg-primary text-primary-foreground hover:opacity-90"
                : "bg-secondary text-secondary-foreground hover:bg-secondary/70",
            )}
          >
            {t.cta}
          </button>
        </div>
      ))}
    </div>
  );
}

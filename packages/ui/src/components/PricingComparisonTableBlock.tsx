"use client";

import React, { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Check, Minus, Sparkles } from "lucide-react";
import { cn } from "../lib/cn";

export interface PricingComparisonTableBlockProps {
  className?: string;
}

type Billing = "monthly" | "annual";
type Plan = "starter" | "pro" | "team";

interface Row {
  label: string;
  starter: boolean | string;
  pro: boolean | string;
  team: boolean | string;
}

const ROWS: Row[] = [
  { label: "Active projects", starter: "3", pro: "Unlimited", team: "Unlimited" },
  { label: "Storage", starter: "10 GB", pro: "100 GB", team: "1 TB" },
  { label: "Team members", starter: "1", pro: "5", team: "Unlimited" },
  { label: "Custom domains", starter: false, pro: true, team: true },
  { label: "Advanced analytics", starter: false, pro: true, team: true },
  { label: "SSO + SCIM", starter: false, pro: false, team: true },
  { label: "Priority support", starter: false, pro: true, team: true },
  { label: "Dedicated CSM", starter: false, pro: false, team: true },
];

const PRICES: Record<Plan, { monthly: number; annual: number }> = {
  starter: { monthly: 0, annual: 0 },
  pro: { monthly: 39, annual: 31 },
  team: { monthly: 89, annual: 71 },
};

function Cell({ value }: { value: boolean | string }) {
  if (typeof value === "string") {
    return <span className="text-sm font-medium text-foreground">{value}</span>;
  }
  return value ? (
    <Check className="h-4 w-4 text-primary" aria-label="Included" />
  ) : (
    <Minus className="h-4 w-4 text-muted-foreground/40" aria-label="Not included" />
  );
}

export function PricingComparisonTableBlock({
  className,
}: PricingComparisonTableBlockProps) {
  const reduced = useReducedMotion();
  const [billing, setBilling] = useState<Billing>("annual");
  const headingId = React.useId();

  return (
    <section
      aria-labelledby={headingId}
      className={cn(
        "relative isolate w-full overflow-hidden rounded-3xl border border-border/50 bg-card/30 px-6 py-16 backdrop-blur-xl sm:px-10 sm:py-20",
        className,
      )}
    >
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-0 h-72 w-[36rem] -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-5xl">
        <div className="mx-auto max-w-2xl text-center">
          <motion.span
            initial={reduced ? false : { opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-primary"
          >
            <Sparkles className="h-3.5 w-3.5" aria-hidden />
            Compare plans
          </motion.span>

          <motion.h2
            id={headingId}
            initial={reduced ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.06 }}
            className="mt-5 text-balance text-3xl font-semibold leading-tight tracking-tight text-foreground sm:text-4xl md:text-5xl"
          >
            Find the right{" "}
            <span className="bg-gradient-to-br from-primary via-primary to-accent bg-clip-text text-transparent">
              fit
            </span>{" "}
            for your team
          </motion.h2>

          <motion.div
            initial={reduced ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.18 }}
            className="mt-6 inline-flex items-center gap-1 rounded-full border border-border/60 bg-background/60 p-1"
            role="tablist"
          >
            {(["monthly", "annual"] as const).map((t) => (
              <button
                key={t}
                type="button"
                role="tab"
                aria-selected={billing === t}
                onClick={() => setBilling(t)}
                className={cn(
                  "rounded-full px-4 py-1.5 text-xs font-semibold capitalize transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40",
                  billing === t
                    ? "bg-primary text-primary-foreground shadow"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {t}
                {t === "annual" && (
                  <span className="ml-1.5 rounded-full bg-emerald-400/15 px-1.5 py-0.5 text-[10px] font-bold text-emerald-400">
                    −20%
                  </span>
                )}
              </button>
            ))}
          </motion.div>
        </div>

        <motion.div
          initial={reduced ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.26 }}
          className="mt-10 overflow-hidden rounded-2xl border border-border/60 bg-card shadow-sm"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border/60 bg-muted/30">
                  <th className="w-2/5 px-4 py-4 text-left text-xs font-bold uppercase tracking-wider text-muted-foreground sm:px-6">
                    Feature
                  </th>
                  {(["starter", "pro", "team"] as const).map((p) => (
                    <th
                      key={p}
                      className={cn(
                        "px-3 py-4 text-center sm:px-6",
                        p === "pro" && "bg-primary/5",
                      )}
                    >
                      <div
                        className={cn(
                          "text-xs font-bold uppercase tracking-wider",
                          p === "pro" ? "text-primary" : "text-foreground",
                        )}
                      >
                        {p}
                      </div>
                      <div className="mt-1.5 text-lg font-semibold tracking-tight text-foreground sm:text-xl">
                        $
                        {billing === "annual"
                          ? PRICES[p].annual
                          : PRICES[p].monthly}
                        <span className="text-xs font-normal text-muted-foreground">
                          /mo
                        </span>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {ROWS.map((row, i) => (
                  <tr
                    key={row.label}
                    className={cn(
                      "border-b border-border/40 last:border-b-0",
                      i % 2 === 1 && "bg-muted/15",
                    )}
                  >
                    <td className="px-4 py-3.5 text-sm font-medium text-foreground sm:px-6">
                      {row.label}
                    </td>
                    <td className="px-3 py-3.5 text-center sm:px-6">
                      <span className="inline-flex items-center justify-center">
                        <Cell value={row.starter} />
                      </span>
                    </td>
                    <td className="bg-primary/5 px-3 py-3.5 text-center sm:px-6">
                      <span className="inline-flex items-center justify-center">
                        <Cell value={row.pro} />
                      </span>
                    </td>
                    <td className="px-3 py-3.5 text-center sm:px-6">
                      <span className="inline-flex items-center justify-center">
                        <Cell value={row.team} />
                      </span>
                    </td>
                  </tr>
                ))}
                <tr className="bg-muted/20">
                  <td className="px-4 py-4 sm:px-6" />
                  <td className="px-3 py-4 text-center sm:px-6">
                    <button className="inline-flex w-full items-center justify-center rounded-xl border border-border bg-background px-3 py-2 text-xs font-semibold text-foreground transition-colors hover:bg-accent">
                      Start free
                    </button>
                  </td>
                  <td className="bg-primary/5 px-3 py-4 text-center sm:px-6">
                    <button className="inline-flex w-full items-center justify-center rounded-xl bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground shadow shadow-primary/25 transition-all hover:brightness-110">
                      Start Pro
                    </button>
                  </td>
                  <td className="px-3 py-4 text-center sm:px-6">
                    <button className="inline-flex w-full items-center justify-center rounded-xl border border-border bg-background px-3 py-2 text-xs font-semibold text-foreground transition-colors hover:bg-accent">
                      Contact us
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default PricingComparisonTableBlock;

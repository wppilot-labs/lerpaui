"use client";

import React from "react";
import { Check, Minus } from "lucide-react";
import { cn } from "../lib/cn";

const PLANS = [
  { id: "starter", name: "Starter", price: "$0" },
  { id: "growth", name: "Growth", price: "$29", featured: true },
  { id: "scale", name: "Scale", price: "$99" },
];

type Group = {
  title: string;
  rows: { label: string; values: (string | boolean)[] }[];
};

const GROUPS: Group[] = [
  {
    title: "Usage",
    rows: [
      { label: "Monthly requests", values: ["10K", "1M", "Unlimited"] },
      { label: "Team members", values: ["2", "15", "Unlimited"] },
      { label: "Environments", values: ["1", "5", "Unlimited"] },
    ],
  },
  {
    title: "Collaboration",
    rows: [
      { label: "Shared workspaces", values: [true, true, true] },
      { label: "Roles & permissions", values: [false, true, true] },
      { label: "Audit log", values: [false, false, true] },
    ],
  },
  {
    title: "Support",
    rows: [
      { label: "Community", values: [true, true, true] },
      { label: "Priority email", values: [false, true, true] },
      { label: "24/7 phone & SLA", values: [false, false, true] },
    ],
  },
];

function Cell({ value, featured }: { value: string | boolean; featured?: boolean }) {
  return (
    <td
      className={cn(
        "px-4 py-3 text-center text-sm",
        featured && "bg-primary/[0.05]",
      )}
    >
      {typeof value === "boolean" ? (
        value ? (
          <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 mx-auto" />
        ) : (
          <Minus className="w-4 h-4 text-muted-foreground mx-auto" />
        )
      ) : (
        <span className="font-semibold">{value}</span>
      )}
    </td>
  );
}

export interface PricingFeatureMatrixBlockProps {
  className?: string;
}

export function PricingFeatureMatrixBlock({
  className,
}: PricingFeatureMatrixBlockProps) {
  return (
    <section
      className={cn(
        "w-full max-w-2xl bg-card border border-border rounded-2xl shadow-sm font-sans text-foreground overflow-hidden",
        className,
      )}
    >
      <div className="px-5 pt-5 pb-2 text-center">
        <h2 className="text-xl font-black">Compare every plan</h2>
        <p className="text-xs text-muted-foreground">
          Everything included, broken down by category
        </p>
      </div>

      <table className="w-full border-collapse">
        <thead className="sticky top-0">
          <tr className="border-b border-border">
            <th className="px-4 py-3 text-left" />
            {PLANS.map((p) => (
              <th
                key={p.id}
                className={cn(
                  "px-4 py-3 text-center",
                  p.featured && "bg-primary/10",
                )}
              >
                <div className="text-sm font-bold">{p.name}</div>
                <div className="text-lg font-black">{p.price}</div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {GROUPS.map((g) => (
            <React.Fragment key={g.title}>
              <tr>
                <td
                  colSpan={PLANS.length + 1}
                  className="px-4 pt-4 pb-1.5 text-[11px] font-black uppercase tracking-wider text-primary bg-muted"
                >
                  {g.title}
                </td>
              </tr>
              {g.rows.map((r) => (
                <tr key={r.label} className="border-b border-border">
                  <td className="px-4 py-3 text-sm font-medium text-muted-foreground">
                    {r.label}
                  </td>
                  {r.values.map((v, i) => (
                    <Cell key={i} value={v} featured={PLANS[i].featured} />
                  ))}
                </tr>
              ))}
            </React.Fragment>
          ))}
          <tr>
            <td className="px-4 py-4" />
            {PLANS.map((p) => (
              <td
                key={p.id}
                className={cn("px-4 py-4 text-center", p.featured && "bg-primary/[0.05]")}
              >
                <button
                  type="button"
                  className={cn(
                    "w-full py-2 rounded-lg text-xs font-bold transition-all",
                    p.featured
                      ? "bg-primary text-primary-foreground hover:opacity-90"
                      : "bg-secondary text-secondary-foreground hover:bg-secondary/70",
                  )}
                >
                  Choose
                </button>
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </section>
  );
}

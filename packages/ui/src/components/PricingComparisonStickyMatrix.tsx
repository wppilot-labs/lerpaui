"use client";

import React, { useState } from "react";
import { Check, Minus, Sparkles } from "lucide-react";
import { cn } from "../lib/cn";

export interface PricingComparisonStickyMatrixProps {
  className?: string;
}

type TierKey = "starter" | "pro" | "scale";

const TIERS: { key: TierKey; name: string; price: string; popular?: boolean }[] = [
  { key: "starter", name: "Starter", price: "$0" },
  { key: "pro", name: "Pro", price: "$29", popular: true },
  { key: "scale", name: "Scale", price: "$99" },
];

const ROWS: {
  group: string;
  items: { label: string; cells: Record<TierKey, string | boolean> }[];
}[] = [
  {
    group: "Core",
    items: [
      { label: "Active projects", cells: { starter: "3", pro: "Unlimited", scale: "Unlimited" } },
      { label: "Team members", cells: { starter: "1", pro: "10", scale: "Unlimited" } },
      { label: "Build minutes / mo", cells: { starter: "500", pro: "5,000", scale: "50,000" } },
    ],
  },
  {
    group: "Workflow",
    items: [
      { label: "Custom domains", cells: { starter: true, pro: true, scale: true } },
      { label: "Preview deployments", cells: { starter: false, pro: true, scale: true } },
      { label: "SSO / SAML", cells: { starter: false, pro: false, scale: true } },
    ],
  },
  {
    group: "Support",
    items: [
      { label: "Community", cells: { starter: true, pro: true, scale: true } },
      { label: "Priority email", cells: { starter: false, pro: true, scale: true } },
      { label: "Dedicated CSM", cells: { starter: false, pro: false, scale: true } },
    ],
  },
];

function Cell({ v }: { v: string | boolean }) {
  if (v === true) return <Check aria-label="Included" className="w-3.5 h-3.5 text-primary mx-auto" />;
  if (v === false) return <Minus aria-label="Not included" className="w-3.5 h-3.5 text-white/20 mx-auto" />;
  return <span className="text-[10px] font-mono text-white/80">{v}</span>;
}

export function PricingComparisonStickyMatrix({ className }: PricingComparisonStickyMatrixProps) {
  const [hoverTier, setHoverTier] = useState<TierKey | null>(null);

  return (
    <div
      className={cn(
        "w-full max-w-sm border border-white/5 bg-zinc-950/40 rounded-2xl shadow-2xl p-6 flex flex-col gap-3 backdrop-blur-xl",
        className,
      )}
    >
      <div className="flex flex-col gap-1 font-mono select-none">
        <span className="text-[9px] uppercase tracking-widest font-bold text-primary">FEATURE_MATRIX</span>
        <span className="text-[8px] text-white/40 uppercase font-semibold">Sticky tier header · sticky feature column</span>
      </div>

      <div className="relative max-h-[280px] overflow-auto rounded-xl border border-white/5 bg-black/30">
        <table
          aria-label="Plan feature comparison"
          className="w-full border-collapse text-[10px]"
        >
          <thead>
            <tr className="sticky top-0 z-20 bg-zinc-950/95 backdrop-blur">
              <th
                scope="col"
                className="sticky left-0 z-30 bg-zinc-950/95 text-left px-2.5 py-2 font-mono text-[8px] uppercase tracking-widest text-white/40 border-b border-white/5"
              >
                Feature
              </th>
              {TIERS.map((t) => (
                <th
                  key={t.key}
                  scope="col"
                  onMouseEnter={() => setHoverTier(t.key)}
                  onMouseLeave={() => setHoverTier(null)}
                  className={cn(
                    "px-2 py-2 font-mono text-[9px] uppercase tracking-wider border-b border-white/5 transition-colors text-center",
                    hoverTier === t.key ? "text-primary" : "text-white/70",
                  )}
                >
                  <div className="flex flex-col items-center gap-0.5">
                    <span className="flex items-center gap-1">
                      {t.name}
                      {t.popular && <Sparkles aria-hidden="true" className="w-2.5 h-2.5 text-primary" />}
                    </span>
                    <span className="text-[8px] text-white/40 normal-case font-sans">{t.price}/mo</span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ROWS.map((group) => (
              <React.Fragment key={group.group}>
                <tr>
                  <th
                    scope="colgroup"
                    colSpan={TIERS.length + 1}
                    className="sticky left-0 px-2.5 py-1.5 text-left font-mono text-[8px] uppercase tracking-widest text-primary/70 bg-zinc-900/60"
                  >
                    {group.group}
                  </th>
                </tr>
                {group.items.map((row) => (
                  <tr key={row.label} className="border-b border-white/[0.03] last:border-0">
                    <th
                      scope="row"
                      className="sticky left-0 z-10 bg-zinc-950/85 backdrop-blur px-2.5 py-2 text-left font-sans text-[10px] text-white/85 font-medium"
                    >
                      {row.label}
                    </th>
                    {TIERS.map((t) => (
                      <td
                        key={t.key}
                        className={cn(
                          "px-2 py-2 text-center align-middle transition-colors",
                          hoverTier === t.key && "bg-primary/5",
                        )}
                      >
                        <Cell v={row.cells[t.key]} />
                      </td>
                    ))}
                  </tr>
                ))}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between font-mono text-[8px] text-white/40 uppercase tracking-widest">
        <span>{ROWS.reduce((n, g) => n + g.items.length, 0)} features</span>
        <span className="text-primary">scroll · sticky axes</span>
      </div>
    </div>
  );
}

"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Check, Minus, Sparkles, X } from "lucide-react";
import { cn } from "../lib/cn";

type Cell = boolean | "partial" | string;

interface Feature {
  group: string;
  label: string;
  values: Cell[];
}

const PLANS = ["Hobby", "Pro", "Team", "Enterprise"];

const FEATURES: Feature[] = [
  { group: "Core", label: "Components", values: ["50", "320+", "320+", "320+"] },
  { group: "Core", label: "Custom domain", values: [false, true, true, true] },
  { group: "Core", label: "Theme studio", values: ["partial", true, true, true] },
  { group: "Collab", label: "Seats", values: ["1", "5", "25", "∞"] },
  { group: "Collab", label: "Shared workspaces", values: [false, true, true, true] },
  { group: "Collab", label: "Role-based access", values: [false, false, true, true] },
  { group: "Ops", label: "Build minutes / mo", values: ["100", "2k", "10k", "Custom"] },
  { group: "Ops", label: "SLA", values: [false, false, "99.9%", "99.99%"] },
  { group: "Ops", label: "Audit logs", values: [false, false, "partial", true] },
  { group: "Support", label: "Community", values: [true, true, true, true] },
  { group: "Support", label: "Priority queue", values: [false, true, true, true] },
  { group: "Support", label: "Dedicated CSM", values: [false, false, false, true] },
];

function renderCell(v: Cell, highlight: boolean) {
  if (v === true)
    return <Check className={cn("w-3.5 h-3.5 mx-auto", highlight ? "text-fuchsia-400" : "text-emerald-400")} />;
  if (v === false) return <X className="w-3 h-3 mx-auto text-zinc-700" />;
  if (v === "partial") return <Minus className="w-3 h-3 mx-auto text-amber-400" />;
  return <span className={cn("text-[10px] font-mono", highlight ? "text-fuchsia-200 font-bold" : "text-zinc-300")}>{v}</span>;
}

export function StickyComparisonMatrix({ className }: { className?: string }) {
  const [highlighted, setHighlighted] = useState(1);

  return (
    <div
      className={cn(
        "relative w-full max-w-[620px] rounded-2xl bg-zinc-950/80 border border-white/10 p-5 flex flex-col gap-3 overflow-hidden shadow-2xl backdrop-blur-xl select-none text-white",
        className
      )}
    >
      <div className="absolute -top-10 right-10 w-40 h-40 rounded-full bg-fuchsia-500/5 blur-3xl pointer-events-none" />

      <div className="relative z-10 flex items-center justify-between">
        <div className="flex flex-col gap-1 font-mono">
          <span className="text-[9px] uppercase tracking-widest font-bold text-primary">COMPARE_MATRIX</span>
          <span className="text-[8px] text-white/40 uppercase font-semibold">sticky header · sticky first column</span>
        </div>
        <div className="flex items-center gap-1 text-[9px] font-mono text-fuchsia-300/80">
          <Sparkles className="w-3 h-3" />
          <span>HIGHLIGHT_{PLANS[highlighted].toUpperCase()}</span>
        </div>
      </div>

      <div className="relative z-10 overflow-auto max-h-[340px] border border-white/5 rounded-xl bg-white/[0.01]">
        <table className="w-full border-collapse text-left min-w-[520px]">
          <thead className="sticky top-0 z-20 bg-zinc-950/95 backdrop-blur">
            <tr className="text-[9px] uppercase tracking-wider font-mono text-zinc-400">
              <th className="sticky left-0 z-30 bg-zinc-950/95 backdrop-blur py-2.5 px-3 border-b border-r border-white/5 text-left">
                Feature
              </th>
              {PLANS.map((p, i) => (
                <th
                  key={p}
                  onClick={() => setHighlighted(i)}
                  className={cn(
                    "py-2.5 px-3 border-b border-white/5 text-center cursor-pointer transition-colors relative",
                    i === highlighted ? "text-fuchsia-300" : "text-zinc-400 hover:text-white"
                  )}
                >
                  <span className="relative z-10">{p}</span>
                  {i === highlighted && (
                    <motion.span
                      layoutId="plan-highlight"
                      className="absolute inset-x-1 inset-y-1 bg-fuchsia-500/10 border border-fuchsia-500/30 rounded-md"
                      transition={{ type: "spring", stiffness: 260, damping: 28 }}
                    />
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {FEATURES.map((f, idx) => {
              const prevGroup = idx > 0 ? FEATURES[idx - 1].group : null;
              const showGroup = f.group !== prevGroup;
              return (
                <React.Fragment key={f.label}>
                  {showGroup && (
                    <tr>
                      <td
                        colSpan={PLANS.length + 1}
                        className="sticky left-0 bg-white/[0.03] border-y border-white/5 py-1.5 px-3 text-[9px] uppercase tracking-widest font-mono text-zinc-500"
                      >
                        {f.group}
                      </td>
                    </tr>
                  )}
                  <tr className="border-b border-white/[0.03] hover:bg-white/[0.02]">
                    <th
                      scope="row"
                      className="sticky left-0 z-10 bg-zinc-950/90 backdrop-blur py-2 px-3 text-[11px] font-medium text-white border-r border-white/5 text-left"
                    >
                      {f.label}
                    </th>
                    {f.values.map((v, i) => (
                      <td
                        key={i}
                        className={cn(
                          "py-2 px-3 text-center align-middle",
                          i === highlighted && "bg-fuchsia-500/[0.04]"
                        )}
                      >
                        {renderCell(v, i === highlighted)}
                      </td>
                    ))}
                  </tr>
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="relative z-10 flex items-center justify-between text-[10px] font-mono text-zinc-400">
        <span>{FEATURES.length} features · {PLANS.length} plans</span>
        <span className="text-fuchsia-300">tap a plan header to highlight</span>
      </div>
    </div>
  );
}

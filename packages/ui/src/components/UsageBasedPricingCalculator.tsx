"use client";

import React, { useId, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Users, Zap, HardDrive, Calculator } from "lucide-react";
import { cn } from "../lib/cn";
import { usePrefersReducedMotion } from "../animation/hooks";

export interface UsageBasedPricingCalculatorProps {
  className?: string;
}

type Knob = {
  key: "seats" | "calls" | "storage";
  label: string;
  Icon: typeof Users;
  min: number;
  max: number;
  step: number;
  unit: string;
  rate: number;
  format: (n: number) => string;
};

const KNOBS: Knob[] = [
  {
    key: "seats",
    label: "Seats",
    Icon: Users,
    min: 1,
    max: 50,
    step: 1,
    unit: "user",
    rate: 8,
    format: (n) => `${n}`,
  },
  {
    key: "calls",
    label: "API calls",
    Icon: Zap,
    min: 0,
    max: 10,
    step: 1,
    unit: "M/mo",
    rate: 4,
    format: (n) => `${n}M`,
  },
  {
    key: "storage",
    label: "Storage",
    Icon: HardDrive,
    min: 0,
    max: 500,
    step: 10,
    unit: "GB",
    rate: 0.12,
    format: (n) => `${n}GB`,
  },
];

export function UsageBasedPricingCalculator({ className }: UsageBasedPricingCalculatorProps) {
  const [values, setValues] = useState<Record<Knob["key"], number>>({
    seats: 5,
    calls: 1,
    storage: 50,
  });
  const reduced = usePrefersReducedMotion();
  const baseId = useId();

  const breakdown = useMemo(
    () =>
      KNOBS.map((k) => ({
        key: k.key,
        label: k.label,
        sub: k.format(values[k.key]),
        amount: Math.round(values[k.key] * k.rate * 100) / 100,
      })),
    [values],
  );
  const total = useMemo(
    () => Math.round(breakdown.reduce((s, b) => s + b.amount, 0) * 100) / 100,
    [breakdown],
  );

  return (
    <div
      className={cn(
        "w-full max-w-sm border border-white/5 bg-zinc-950/40 rounded-2xl shadow-2xl p-6 flex flex-col gap-3 backdrop-blur-xl",
        className,
      )}
    >
      <div className="flex flex-col gap-1 font-mono select-none">
        <span className="text-[9px] uppercase tracking-widest font-bold text-primary">USAGE_CALCULATOR</span>
        <span className="text-[8px] text-white/40 uppercase font-semibold">Live total · per-knob breakdown</span>
      </div>

      <div className="flex flex-col gap-3 rounded-xl border border-white/5 bg-black/30 p-3">
        {KNOBS.map((k) => {
          const id = `${baseId}-${k.key}`;
          const pct = ((values[k.key] - k.min) / (k.max - k.min)) * 100;
          return (
            <div key={k.key} className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label
                  htmlFor={id}
                  className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-widest text-white/60"
                >
                  <k.Icon aria-hidden="true" className="w-3 h-3 text-primary" />
                  {k.label}
                </label>
                <span className="text-[10px] font-mono text-white tabular-nums">
                  {k.format(values[k.key])}
                  <span className="text-white/30 ml-1">/ {k.unit}</span>
                </span>
              </div>
              <div className="relative h-1.5 rounded-full bg-white/[0.04]">
                <div
                  aria-hidden="true"
                  className="absolute inset-y-0 left-0 rounded-full bg-primary/80"
                  style={{ width: `${pct}%` }}
                />
                <input
                  id={id}
                  type="range"
                  min={k.min}
                  max={k.max}
                  step={k.step}
                  value={values[k.key]}
                  onChange={(e) =>
                    setValues((v) => ({ ...v, [k.key]: Number(e.target.value) }))
                  }
                  aria-label={`${k.label}: ${k.format(values[k.key])}`}
                  aria-valuetext={`${k.format(values[k.key])} ${k.unit}, $${(values[k.key] * k.rate).toFixed(2)} per month`}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="rounded-xl border border-primary/20 bg-primary/[0.04] p-3 flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-widest text-white/60">
            <Calculator aria-hidden="true" className="w-3 h-3 text-primary" />
            Monthly total
          </span>
          <motion.span
            key={total}
            initial={reduced ? { opacity: 1 } : { scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.18 }}
            className="text-xl font-black text-primary tabular-nums"
          >
            ${total.toFixed(2)}
          </motion.span>
        </div>
        <ul className="flex flex-col gap-0.5 pt-1.5 border-t border-white/5">
          {breakdown.map((b) => (
            <li
              key={b.key}
              className="flex items-center justify-between text-[9.5px] font-mono text-white/60"
            >
              <span>
                {b.label} <span className="text-white/30">· {b.sub}</span>
              </span>
              <span className="tabular-nums text-white/80">${b.amount.toFixed(2)}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

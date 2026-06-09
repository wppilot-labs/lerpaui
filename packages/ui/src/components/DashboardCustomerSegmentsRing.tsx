"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { PieChart } from "lucide-react";
import { cn } from "../lib/cn";

export interface DashboardCustomerSegmentsRingProps {
  className?: string;
}

const SEGMENTS = [
  { label: "Enterprise", value: 38, color: "oklch(0.65 0.2 280)" },
  { label: "Pro", value: 28, color: "oklch(0.7 0.18 200)" },
  { label: "Team", value: 20, color: "oklch(0.7 0.16 150)" },
  { label: "Solo", value: 14, color: "oklch(0.75 0.18 80)" },
];

const CIRC = 2 * Math.PI * 60;

export function DashboardCustomerSegmentsRing({ className }: DashboardCustomerSegmentsRingProps) {
  const reduced = useReducedMotion() ?? false;
  let offset = 0;

  return (
    <section
      aria-label="Customer segments"
      className={cn(
        "w-full max-w-2xl rounded-2xl border bg-card p-6 shadow-sm transition-shadow hover:shadow-md",
        className
      )}
    >
      <header className="mb-5 flex items-start justify-between">
        <div className="flex items-center gap-2">
          <PieChart className="h-4 w-4 text-primary" aria-hidden />
          <div>
            <h3 className="text-base font-semibold tracking-tight text-foreground">Customer segments</h3>
            <p className="mt-0.5 text-xs text-muted-foreground">4,128 active customers</p>
          </div>
        </div>
      </header>

      <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative h-44 w-44 flex-shrink-0">
          <svg viewBox="0 0 160 160" className="-rotate-90 h-full w-full">
            <circle cx="80" cy="80" r="60" fill="none" stroke="currentColor" className="text-muted/30" strokeWidth="18" />
            {SEGMENTS.map((s) => {
              const length = (s.value / 100) * CIRC;
              const circle = (
                <motion.circle
                  key={s.label}
                  cx="80"
                  cy="80"
                  r="60"
                  fill="none"
                  stroke={s.color}
                  strokeWidth="18"
                  strokeDasharray={`${length} ${CIRC - length}`}
                  strokeDashoffset={-offset}
                  initial={reduced ? false : { opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6 }}
                />
              );
              offset += length;
              return circle;
            })}
          </svg>
          <div className="absolute inset-0 grid place-items-center">
            <div className="text-center">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Customers</p>
              <p className="text-2xl font-semibold tabular-nums text-foreground">4,128</p>
            </div>
          </div>
        </div>

        <ul className="flex-1 space-y-2.5">
          {SEGMENTS.map((s) => (
            <li key={s.label} className="flex items-center justify-between rounded-lg border bg-muted/20 px-3 py-2">
              <div className="flex items-center gap-2.5">
                <span className="h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: s.color }} aria-hidden />
                <span className="text-sm font-medium text-foreground">{s.label}</span>
              </div>
              <div className="text-right">
                <span className="text-sm font-semibold tabular-nums text-foreground">{s.value}%</span>
                <span className="ml-2 text-[11px] text-muted-foreground">{Math.round((s.value / 100) * 4128)}</span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export default DashboardCustomerSegmentsRing;

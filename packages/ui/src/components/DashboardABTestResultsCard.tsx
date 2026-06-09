"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { FlaskConical, Trophy, TrendingUp, Users } from "lucide-react";
import { cn } from "../lib/cn";

export interface DashboardABTestResultsCardProps {
  className?: string;
}

const VARIANTS = [
  {
    label: "Variant A",
    sub: "Original",
    visitors: 6420,
    conversions: 218,
    rate: 3.39,
    isWinner: false,
    color: "from-muted-foreground/60 to-muted-foreground/30",
  },
  {
    label: "Variant B",
    sub: "Bold CTA + social proof",
    visitors: 6488,
    conversions: 304,
    rate: 4.68,
    isWinner: true,
    color: "from-primary to-primary/60",
  },
];

export function DashboardABTestResultsCard({ className }: DashboardABTestResultsCardProps) {
  const reduced = useReducedMotion() ?? false;
  const max = Math.max(...VARIANTS.map((v) => v.rate));

  return (
    <section
      aria-label="A/B test results"
      className={cn(
        "w-full max-w-2xl rounded-2xl border bg-card p-6 shadow-sm transition-shadow hover:shadow-md",
        className
      )}
    >
      <header className="mb-5 flex items-start justify-between">
        <div className="flex items-center gap-2">
          <FlaskConical className="h-4 w-4 text-primary" aria-hidden />
          <div>
            <h3 className="text-base font-semibold tracking-tight text-foreground">A/B test results</h3>
            <p className="mt-0.5 text-xs text-muted-foreground">Pricing-page-hero · ran 14 days · 12,908 visitors</p>
          </div>
        </div>
        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-500">
          <Trophy className="h-3 w-3" /> Significant (p &lt; 0.01)
        </span>
      </header>

      <div className="space-y-4">
        {VARIANTS.map((v, i) => (
          <motion.div
            key={v.label}
            initial={reduced ? false : { opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: i * 0.1 }}
            className={cn(
              "relative rounded-xl border p-4",
              v.isWinner ? "border-primary/40 bg-primary/5" : "bg-muted/20"
            )}
          >
            {v.isWinner && (
              <span className="absolute -top-2 right-4 inline-flex items-center gap-1 rounded-full bg-primary px-2 py-0.5 text-[10px] font-semibold text-primary-foreground shadow-sm shadow-primary/25">
                <Trophy className="h-2.5 w-2.5" /> Winner
              </span>
            )}
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-semibold text-foreground">{v.label}</p>
                <p className="text-[11px] text-muted-foreground">{v.sub}</p>
              </div>
              <p className="text-2xl font-semibold tabular-nums text-foreground">{v.rate}%</p>
            </div>

            <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-muted/40">
              <motion.div
                initial={reduced ? false : { width: 0 }}
                animate={{ width: `${(v.rate / max) * 100}%` }}
                transition={{ duration: 0.7, delay: 0.2 + i * 0.1 }}
                className={cn("h-full rounded-full bg-gradient-to-r", v.color)}
              />
            </div>

            <div className="mt-3 grid grid-cols-3 gap-2 text-[11px]">
              <Stat icon={Users} label="Visitors" value={v.visitors.toLocaleString()} />
              <Stat icon={TrendingUp} label="Conversions" value={v.conversions.toString()} />
              <Stat icon={FlaskConical} label="Conv rate" value={`${v.rate}%`} />
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-5 flex items-center justify-between rounded-xl border bg-muted/20 px-4 py-3">
        <p className="text-xs text-muted-foreground">Variant B lifted conversion by <span className="font-semibold text-emerald-500">+38%</span></p>
        <button type="button" className="rounded-md bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground shadow-sm shadow-primary/25 hover:brightness-110">
          Ship winner
        </button>
      </div>
    </section>
  );
}

function Stat({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
  return (
    <div className="rounded-md border bg-card/50 px-2.5 py-2">
      <span className="flex items-center gap-1 text-[10px] uppercase tracking-wider text-muted-foreground">
        <Icon className="h-2.5 w-2.5" /> {label}
      </span>
      <p className="mt-0.5 text-sm font-semibold tabular-nums text-foreground">{value}</p>
    </div>
  );
}

export default DashboardABTestResultsCard;

"use client";

import * as React from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowDownRight,
  ArrowUpRight,
  CreditCard,
  Minus,
  Users,
  Wallet,
  Zap,
} from "lucide-react";
import { usePrefersReducedMotion } from "../animation/hooks";
import { cn } from "../lib/cn";

export interface DashboardStatCard {
  id: string;
  label: string;
  value: string;
  deltaPct: number;
  icon: React.ComponentType<{ className?: string; "aria-hidden"?: boolean }>;
  series: number[];
}

export interface DashboardStatsHeroRowProps
  extends React.HTMLAttributes<HTMLElement> {
  title?: string;
  subtitle?: string;
  stats?: DashboardStatCard[];
  sticky?: boolean;
  className?: string;
}

const DEFAULT_STATS: DashboardStatCard[] = [
  {
    id: "mrr",
    label: "Monthly recurring revenue",
    value: "$148,210",
    deltaPct: 12.4,
    icon: Wallet,
    series: [40, 38, 42, 48, 47, 55, 60, 58, 64, 70, 76, 82],
  },
  {
    id: "active",
    label: "Active workspaces",
    value: "2,841",
    deltaPct: 8.2,
    icon: Users,
    series: [22, 28, 26, 30, 33, 35, 38, 41, 44, 46, 48, 52],
  },
  {
    id: "txn",
    label: "Transactions today",
    value: "12,392",
    deltaPct: -2.1,
    icon: CreditCard,
    series: [80, 75, 78, 70, 72, 68, 65, 70, 66, 60, 58, 62],
  },
  {
    id: "uptime",
    label: "API uptime (30d)",
    value: "99.984%",
    deltaPct: 0,
    icon: Zap,
    series: [99, 99, 100, 99, 100, 100, 99, 100, 100, 99, 100, 100],
  },
];

interface SparklineProps {
  data: number[];
  trend: "up" | "down" | "flat";
  reduced: boolean;
}

function Sparkline({ data, trend, reduced }: SparklineProps) {
  const w = 120;
  const h = 36;
  const rid = React.useId();
  const gradientId = `sl-${rid.replace(/[:]/g, "")}`;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = Math.max(1, max - min);
  const step = data.length > 1 ? w / (data.length - 1) : w;

  const points = data.map((d, i) => {
    const x = i * step;
    const y = h - ((d - min) / range) * h;
    return [x, y] as const;
  });

  const linePath = points
    .map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`)
    .join(" ");
  const areaPath = `${linePath} L${w},${h} L0,${h} Z`;

  const color =
    trend === "down"
      ? "oklch(0.66 0.2 25)"
      : trend === "flat"
        ? "oklch(0.65 0.04 250)"
        : "oklch(0.7 0.18 145)";

  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      aria-hidden="true"
      preserveAspectRatio="none"
      className="h-9 w-full"
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.35" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={areaPath} fill={`url(#${gradientId})`} />
      <motion.path
        d={linePath}
        fill="none"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={reduced ? false : { pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      />
    </svg>
  );
}

function DeltaChip({ pct }: { pct: number }) {
  const trend: "up" | "down" | "flat" =
    pct > 0 ? "up" : pct < 0 ? "down" : "flat";
  const Icon =
    trend === "up" ? ArrowUpRight : trend === "down" ? ArrowDownRight : Minus;
  const classes =
    trend === "up"
      ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
      : trend === "down"
        ? "bg-red-500/10 text-red-600 dark:text-red-400"
        : "bg-muted text-muted-foreground";
  return (
    <span
      className={cn(
        "inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[11px] font-semibold",
        classes
      )}
    >
      <Icon className="h-3 w-3" aria-hidden />
      {pct === 0 ? "0%" : `${pct > 0 ? "+" : ""}${pct.toFixed(1)}%`}
    </span>
  );
}

export function DashboardStatsHeroRow({
  title = "Overview",
  subtitle = "Last 30 days · compared to previous period",
  stats = DEFAULT_STATS,
  sticky = false,
  className,
  ...rest
}: DashboardStatsHeroRowProps) {
  const prefersHook = usePrefersReducedMotion();
  const fmReduced = useReducedMotion();
  const reduced = prefersHook || Boolean(fmReduced);
  const headingId = React.useId();
  const safe = stats.length ? stats : DEFAULT_STATS;

  return (
    <section
      {...rest}
      aria-labelledby={headingId}
      className={cn(
        "relative w-full border-b border-border bg-background/90 backdrop-blur-md",
        sticky && "sticky top-0 z-30",
        className
      )}
    >
      <div className="mx-auto max-w-7xl px-6 py-6 sm:py-8">
        <div className="mb-5 flex flex-col items-start justify-between gap-2 sm:flex-row sm:items-end">
          <div>
            <h2
              id={headingId}
              className="text-lg font-bold tracking-tight text-foreground sm:text-xl"
            >
              {title}
            </h2>
            <p className="text-xs text-muted-foreground">{subtitle}</p>
          </div>
          <div className="flex items-center gap-1 rounded-lg border border-border bg-card p-0.5 text-xs">
            {["24h", "7d", "30d", "90d"].map((r, i) => (
              <button
                key={r}
                type="button"
                aria-pressed={i === 2}
                className={cn(
                  "rounded-md px-2.5 py-1 font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                  i === 2
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {safe.map((stat, i) => {
            const Icon = stat.icon;
            const trend: "up" | "down" | "flat" =
              stat.deltaPct > 0
                ? "up"
                : stat.deltaPct < 0
                  ? "down"
                  : "flat";
            return (
              <motion.div
                key={stat.id}
                initial={reduced ? false : { opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.45,
                  delay: reduced ? 0 : i * 0.06,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="group relative overflow-hidden rounded-xl border border-border bg-card p-4 text-card-foreground shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Icon className="h-4 w-4" aria-hidden />
                  </span>
                  <DeltaChip pct={stat.deltaPct} />
                </div>
                <dl className="mt-3">
                  <dt className="truncate text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                    {stat.label}
                  </dt>
                  <dd className="mt-1 text-2xl font-bold tracking-tight text-foreground">
                    {stat.value}
                  </dd>
                </dl>
                <div className="mt-3">
                  <Sparkline
                    data={stat.series}
                    trend={trend}
                    reduced={reduced}
                  />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default DashboardStatsHeroRow;

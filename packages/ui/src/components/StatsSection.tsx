"use client";

import React from "react";
import { Users, Globe2, Zap, Star } from "lucide-react";
import { cn } from "../lib/cn";

type Stat = { icon: React.ElementType; value: string; label: string; sub: string };

const STATS: Stat[] = [
  { icon: Users, value: "48K+", label: "Active teams", sub: "across 90 countries" },
  { icon: Zap, value: "99.99%", label: "Uptime", sub: "last 12 months" },
  { icon: Globe2, value: "2.4B", label: "Requests / day", sub: "served globally" },
  { icon: Star, value: "4.9", label: "Avg. rating", sub: "from 12K reviews" },
];

export interface StatsSectionProps {
  className?: string;
}

export function StatsSection({ className }: StatsSectionProps) {
  return (
    <section
      className={cn(
        "w-full max-w-3xl rounded-3xl border border-border/50 bg-card/40 px-6 py-8 font-sans text-foreground shadow-xl backdrop-blur-xl",
        className,
      )}
    >
      <div className="mb-6 text-center">
        <span className="text-xs font-bold uppercase tracking-wider text-primary">By the numbers</span>
        <h2 className="mt-1 text-2xl font-black">Trusted by teams worldwide</h2>
      </div>

      <dl className="grid grid-cols-2 gap-6 sm:grid-cols-4">
        {STATS.map((s) => (
          <div key={s.label} className="text-center">
            <span className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <s.icon className="h-5 w-5" />
            </span>
            <dd className="text-3xl font-black leading-none tracking-tight">{s.value}</dd>
            <dt className="mt-1 text-sm font-semibold">{s.label}</dt>
            <p className="text-xs text-muted-foreground/50">{s.sub}</p>
          </div>
        ))}
      </dl>
    </section>
  );
}

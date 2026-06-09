"use client";

import React from "react";
import { Zap, ShieldCheck, Globe, LineChart, Puzzle, Headphones } from "lucide-react";
import { cn } from "../lib/cn";

type Benefit = {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  desc: string;
};

const BENEFITS: Benefit[] = [
  { icon: Zap, title: "Blazing fast", desc: "Sub-50ms responses worldwide on our edge network." },
  { icon: ShieldCheck, title: "Secure by default", desc: "SOC 2 Type II, SSO, and encryption at rest." },
  { icon: Globe, title: "Global scale", desc: "Deploy to 30+ regions with a single command." },
  { icon: LineChart, title: "Real-time insights", desc: "Live dashboards and alerts that catch issues early." },
  { icon: Puzzle, title: "Extensible", desc: "Plug into 200+ integrations or build your own." },
  { icon: Headphones, title: "Human support", desc: "Talk to real engineers, not bots, 24/7." },
];

export interface BenefitsSectionProps {
  className?: string;
}

export function BenefitsSection({ className }: BenefitsSectionProps) {
  return (
    <section className={cn("w-full max-w-3xl bg-card backdrop-blur-xl border border-border p-6 rounded-2xl shadow-sm font-sans text-foreground", className)}>
      <div className="mb-6 text-center">
        <span className="text-xs font-bold uppercase tracking-widest text-primary">Why teams choose us</span>
        <h2 className="mt-1.5 text-2xl font-black">Everything you need to ship</h2>
        <p className="mt-1.5 text-sm text-muted-foreground">Powerful primitives, none of the busywork.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {BENEFITS.map((b) => (
          <div
            key={b.title}
            className="rounded-xl border border-border bg-foreground/[0.02] p-5 transition-colors hover:bg-foreground/[0.04]"
          >
            <span className="mb-3 inline-grid h-11 w-11 place-items-center rounded-lg bg-primary/15 text-primary">
              <b.icon className="w-5 h-5" />
            </span>
            <h3 className="text-base font-bold">{b.title}</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{b.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

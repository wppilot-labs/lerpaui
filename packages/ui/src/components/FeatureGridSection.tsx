"use client";

import React from "react";
import { Zap, Shield, Globe, GitBranch, Gauge, Lock } from "lucide-react";
import { cn } from "../lib/cn";

type Feature = { title: string; desc: string; Icon: React.ElementType };

const FEATURES: Feature[] = [
  { title: "Blazing fast", desc: "Edge-rendered in under 50ms worldwide.", Icon: Zap },
  { title: "Secure by default", desc: "SOC 2 Type II with end-to-end encryption.", Icon: Shield },
  { title: "Global CDN", desc: "300+ points of presence across 6 continents.", Icon: Globe },
  { title: "Git-based", desc: "Preview every branch with isolated deploys.", Icon: GitBranch },
  { title: "Real-time metrics", desc: "Latency, errors and traffic, live.", Icon: Gauge },
  { title: "Access control", desc: "Granular roles and SSO for your team.", Icon: Lock },
];

export interface FeatureGridSectionProps {
  className?: string;
}

export function FeatureGridSection({ className }: FeatureGridSectionProps) {
  return (
    <div className={cn("w-full max-w-3xl font-sans text-foreground", className)}>
      <div className="text-center mb-6">
        <h3 className="text-xl font-bold">Everything you need to ship</h3>
        <p className="text-sm text-muted-foreground/60 mt-1">A complete platform, built for speed and scale.</p>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {FEATURES.map((f) => (
          <div
            key={f.title}
            className="rounded-2xl border border-border/50 bg-card/45 backdrop-blur-xl p-5 shadow-lg hover:border-foreground/[0.12] transition-colors"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary mb-3">
              <f.Icon className="w-5 h-5" />
            </span>
            <h4 className="text-sm font-bold">{f.title}</h4>
            <p className="text-xs text-muted-foreground/60 mt-1 leading-relaxed">{f.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

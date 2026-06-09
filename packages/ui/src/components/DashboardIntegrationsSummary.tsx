"use client";

import React from "react";
import { Slack, Github, Figma, Database, Plug, ArrowRight } from "lucide-react";
import { cn } from "../lib/cn";

const LOGOS = [Slack, Github, Figma, Database];

export interface DashboardIntegrationsSummaryProps {
  className?: string;
}

export function DashboardIntegrationsSummary({ className }: DashboardIntegrationsSummaryProps) {
  const connected = 12;
  const total = 18;
  const pct = (connected / total) * 100;

  return (
    <div className={cn("w-full max-w-md bg-card/45 backdrop-blur-xl border border-border/50 p-5 rounded-2xl shadow-xl font-sans text-foreground", className)}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-base font-bold flex items-center gap-1.5">
          <Plug className="w-4 h-4 text-primary" /> Integrations
        </h3>
        <span className="text-xs text-muted-foreground/60">
          <span className="font-bold text-foreground">{connected}</span> / {total}
        </span>
      </div>

      <div className="h-1.5 rounded-full bg-foreground/[0.06] overflow-hidden mb-4">
        <div className="h-full rounded-full bg-primary" style={{ width: `${pct}%` }} />
      </div>

      <div className="flex items-center justify-between">
        <div className="flex -space-x-2">
          {LOGOS.map((Icon, i) => (
            <div key={i} className="h-9 w-9 rounded-full bg-secondary/60 border border-card flex items-center justify-center">
              <Icon className="w-4 h-4 text-foreground/80" />
            </div>
          ))}
          <div className="h-9 w-9 rounded-full bg-secondary/40 border border-card flex items-center justify-center text-[11px] font-bold text-muted-foreground">
            +8
          </div>
        </div>
        <button type="button" className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline">
          Manage <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

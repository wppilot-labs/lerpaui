"use client";

import React, { useId, useState } from "react";
import { Workflow, BarChart3, Bell, Check } from "lucide-react";
import { cn } from "../lib/cn";

type Tab = { id: string; label: string; Icon: React.ElementType; heading: string; body: string; bullets: string[] };

const TABS: Tab[] = [
  {
    id: "automate",
    label: "Automate",
    Icon: Workflow,
    heading: "Workflows that run themselves",
    body: "Chain triggers and actions visually — no code required.",
    bullets: ["Drag-and-drop builder", "200+ integrations", "Conditional branching"],
  },
  {
    id: "analyze",
    label: "Analyze",
    Icon: BarChart3,
    heading: "Insights at a glance",
    body: "Track the metrics that matter with real-time dashboards.",
    bullets: ["Custom dashboards", "Cohort analysis", "Scheduled reports"],
  },
  {
    id: "notify",
    label: "Notify",
    Icon: Bell,
    heading: "Reach the right person",
    body: "Send alerts across email, Slack and mobile push.",
    bullets: ["Multi-channel delivery", "Smart routing", "Quiet hours"],
  },
];

export interface FeatureTabsSectionProps {
  className?: string;
}

export function FeatureTabsSection({ className }: FeatureTabsSectionProps) {
  const [active, setActive] = useState(TABS[0].id);
  const baseId = useId();
  const current = TABS.find((t) => t.id === active) ?? TABS[0];

  return (
    <div className={cn("w-full max-w-2xl bg-card/45 backdrop-blur-xl border border-border/50 p-5 rounded-2xl shadow-xl font-sans text-foreground", className)}>
      <div role="tablist" aria-label="Features" className="flex gap-1 mb-5 p-0.5 rounded-xl bg-foreground/[0.03] border border-foreground/[0.05]">
        {TABS.map((t) => {
          const on = t.id === active;
          return (
            <button
              key={t.id}
              type="button"
              role="tab"
              id={`${baseId}-tab-${t.id}`}
              aria-selected={on}
              aria-controls={`${baseId}-panel-${t.id}`}
              onClick={() => setActive(t.id)}
              className={cn(
                "flex-1 inline-flex items-center justify-center gap-1.5 text-xs font-semibold py-2.5 rounded-lg transition-colors",
                on ? "bg-card text-foreground shadow-sm" : "text-muted-foreground/60 hover:text-foreground",
              )}
            >
              <t.Icon className="w-4 h-4" />
              {t.label}
            </button>
          );
        })}
      </div>

      <div role="tabpanel" id={`${baseId}-panel-${current.id}`} aria-labelledby={`${baseId}-tab-${current.id}`} className="grid sm:grid-cols-2 gap-5 items-center">
        <div>
          <h4 className="text-base font-bold">{current.heading}</h4>
          <p className="text-sm text-muted-foreground/65 mt-1.5 leading-relaxed">{current.body}</p>
          <ul className="mt-3 space-y-1.5">
            {current.bullets.map((b) => (
              <li key={b} className="flex items-center gap-2 text-sm text-muted-foreground/80">
                <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                {b}
              </li>
            ))}
          </ul>
        </div>
        <div className="aspect-video rounded-xl bg-gradient-to-br from-primary/15 to-foreground/[0.02] border border-foreground/[0.06] flex items-center justify-center">
          <current.Icon className="w-12 h-12 text-primary/50" />
        </div>
      </div>
    </div>
  );
}

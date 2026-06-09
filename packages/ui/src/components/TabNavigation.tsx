"use client";

import React, { useState } from "react";
import { LayoutGrid, Activity, Bell, Lock } from "lucide-react";
import { cn } from "../lib/cn";

type Tab = { id: string; label: string; icon: React.ElementType };

const TABS: Tab[] = [
  { id: "overview", label: "Overview", icon: LayoutGrid },
  { id: "activity", label: "Activity", icon: Activity },
  { id: "alerts", label: "Alerts", icon: Bell },
  { id: "security", label: "Security", icon: Lock },
];

const PANELS: Record<string, string> = {
  overview: "A high-level snapshot of usage, billing, and team activity at a glance.",
  activity: "Every action across your workspace, from deploys to comments, in real time.",
  alerts: "Threshold notifications for spend, errors, and uptime delivered where you work.",
  security: "Audit logs, active sessions, and access policies for your organization.",
};

export interface TabNavigationProps {
  className?: string;
}

export function TabNavigation({ className }: TabNavigationProps) {
  const [active, setActive] = useState("overview");

  return (
    <div
      className={cn(
        "w-full max-w-md rounded-2xl border border-border/50 bg-card/60 p-1.5 font-sans text-foreground shadow-xl backdrop-blur-xl",
        className,
      )}
    >
      <div role="tablist" aria-label="Settings sections" className="flex gap-1">
        {TABS.map((tab) => {
          const isActive = active === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              id={`tab-${tab.id}`}
              aria-selected={isActive}
              aria-controls={`panel-${tab.id}`}
              onClick={() => setActive(tab.id)}
              className={cn(
                "flex flex-1 items-center justify-center gap-1.5 rounded-xl px-2.5 py-2.5 text-sm font-semibold transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground/70 hover:bg-foreground/[0.04] hover:text-foreground",
              )}
            >
              <tab.icon className="h-4 w-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      <div
        role="tabpanel"
        id={`panel-${active}`}
        aria-labelledby={`tab-${active}`}
        className="px-3 py-4 text-sm leading-relaxed text-muted-foreground"
      >
        {PANELS[active]}
      </div>
    </div>
  );
}

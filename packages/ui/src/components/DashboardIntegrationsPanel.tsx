"use client";

import React, { useState } from "react";
import { Slack, Github, Figma, Calendar, Database, Plug } from "lucide-react";
import { cn } from "../lib/cn";

type Integration = { id: string; name: string; icon: React.ComponentType<{ className?: string }>; desc: string };

const ITEMS: Integration[] = [
  { id: "slack", name: "Slack", icon: Slack, desc: "Alerts & notifications" },
  { id: "github", name: "GitHub", icon: Github, desc: "Sync issues & PRs" },
  { id: "figma", name: "Figma", icon: Figma, desc: "Embed designs" },
  { id: "gcal", name: "Calendar", icon: Calendar, desc: "Schedule events" },
  { id: "pg", name: "Postgres", icon: Database, desc: "Data warehouse" },
];

export interface DashboardIntegrationsPanelProps {
  className?: string;
}

export function DashboardIntegrationsPanel({ className }: DashboardIntegrationsPanelProps) {
  const [on, setOn] = useState<Record<string, boolean>>({ slack: true, github: true });

  return (
    <div className={cn("w-full max-w-md bg-card/45 backdrop-blur-xl border border-border/50 p-5 rounded-2xl shadow-xl font-sans text-foreground", className)}>
      <h3 className="text-base font-bold flex items-center gap-1.5 mb-4">
        <Plug className="w-4 h-4 text-primary" /> Integrations
      </h3>
      <ul className="grid grid-cols-1 gap-2">
        {ITEMS.map((it) => {
          const Icon = it.icon;
          const connected = !!on[it.id];
          return (
            <li key={it.id} className="flex items-center gap-3 p-3 rounded-xl bg-foreground/[0.02] border border-foreground/[0.04]">
              <div className="h-10 w-10 rounded-xl bg-secondary/40 flex items-center justify-center shrink-0">
                <Icon className="w-5 h-5 text-foreground/90" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-sm font-semibold">{it.name}</div>
                <div className="text-xs text-muted-foreground/55">{it.desc}</div>
              </div>
              <button
                type="button"
                onClick={() => setOn((s) => ({ ...s, [it.id]: !s[it.id] }))}
                aria-pressed={connected}
                className={cn(
                  "text-xs font-bold px-3 py-1.5 rounded-lg border transition-colors shrink-0",
                  connected
                    ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                    : "bg-primary text-primary-foreground border-transparent hover:brightness-110",
                )}
              >
                {connected ? "Connected" : "Connect"}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

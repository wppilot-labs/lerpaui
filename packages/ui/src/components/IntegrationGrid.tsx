"use client";

import React, { useState } from "react";
import { Slack, Github, Figma, Chrome, Database, Mail, Check, Plus } from "lucide-react";
import { cn } from "../lib/cn";

type Integration = {
  id: string;
  name: string;
  category: string;
  icon: React.ComponentType<{ className?: string }>;
  connected: boolean;
};

const INTEGRATIONS: Integration[] = [
  { id: "slack", name: "Slack", category: "Communication", icon: Slack, connected: true },
  { id: "github", name: "GitHub", category: "Development", icon: Github, connected: true },
  { id: "figma", name: "Figma", category: "Design", icon: Figma, connected: false },
  { id: "chrome", name: "Chrome", category: "Browser", icon: Chrome, connected: false },
  { id: "postgres", name: "Postgres", category: "Database", icon: Database, connected: false },
  { id: "gmail", name: "Gmail", category: "Email", icon: Mail, connected: false },
];

export interface IntegrationGridProps {
  className?: string;
}

export function IntegrationGrid({ className }: IntegrationGridProps) {
  const [connected, setConnected] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(INTEGRATIONS.map((i) => [i.id, i.connected])),
  );

  const toggle = (id: string) =>
    setConnected((prev) => ({ ...prev, [id]: !prev[id] }));

  return (
    <div
      className={cn(
        "w-full max-w-2xl bg-card/45 backdrop-blur-xl border border-border/50 p-5 rounded-2xl shadow-xl font-sans text-foreground",
        className,
      )}
    >
      <h3 className="text-base font-bold mb-4">Integrations</h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {INTEGRATIONS.map((item) => {
          const Icon = item.icon;
          const isOn = connected[item.id];
          return (
            <div
              key={item.id}
              className="flex items-center gap-3 rounded-xl border border-foreground/[0.05] bg-foreground/[0.02] p-3"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-foreground/[0.05] text-foreground/90">
                <Icon className="w-5 h-5" />
              </span>
              <div className="min-w-0 flex-1">
                <div className="text-sm font-semibold">{item.name}</div>
                <div className="text-[11px] text-muted-foreground/55">{item.category}</div>
              </div>
              <button
                type="button"
                aria-pressed={isOn}
                onClick={() => toggle(item.id)}
                className={cn(
                  "inline-flex shrink-0 items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors",
                  isOn
                    ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20"
                    : "bg-primary/15 text-primary hover:bg-primary/25",
                )}
              >
                {isOn ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    Connected
                  </>
                ) : (
                  <>
                    <Plus className="w-3.5 h-3.5" />
                    Connect
                  </>
                )}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

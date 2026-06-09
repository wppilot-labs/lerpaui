"use client";

import React, { useState } from "react";
import { Flag } from "lucide-react";
import { cn } from "../lib/cn";

type Flag = {
  key: string;
  name: string;
  desc: string;
  rollout: string;
  enabled: boolean;
};

const INITIAL: Flag[] = [
  { key: "new-billing", name: "new_billing_flow", desc: "Redesigned checkout & invoices", rollout: "100%", enabled: true },
  { key: "ai-search", name: "ai_semantic_search", desc: "Vector search on dashboard", rollout: "25%", enabled: true },
  { key: "dark-export", name: "pdf_dark_export", desc: "Dark-themed PDF reports", rollout: "Beta", enabled: false },
  { key: "team-roles", name: "granular_team_roles", desc: "Per-resource permissions", rollout: "Internal", enabled: false },
];

export interface AdminFeatureFlagPanelProps {
  className?: string;
}

export function AdminFeatureFlagPanel({ className }: AdminFeatureFlagPanelProps) {
  const [flags, setFlags] = useState<Flag[]>(INITIAL);

  const toggle = (key: string) =>
    setFlags((fs) => fs.map((f) => (f.key === key ? { ...f, enabled: !f.enabled } : f)));

  return (
    <div
      className={cn(
        "w-full max-w-md bg-card border border-border p-5 rounded-2xl shadow-sm font-sans text-foreground",
        className,
      )}
    >
      <div className="flex items-center gap-2 mb-4">
        <Flag className="w-4 h-4 text-primary" />
        <h3 className="text-base font-bold">Feature flags</h3>
        <span className="ml-auto text-xs text-muted-foreground">
          {flags.filter((f) => f.enabled).length} / {flags.length} on
        </span>
      </div>

      <ul className="space-y-2">
        {flags.map((f) => (
          <li
            key={f.key}
            className="flex items-center gap-3 p-3 rounded-xl bg-muted border border-border"
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <code className="text-xs font-semibold font-mono">{f.name}</code>
                <span
                  className={cn(
                    "text-[10px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wide",
                    f.enabled
                      ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                      : "bg-foreground/[0.06] text-muted-foreground",
                  )}
                >
                  {f.rollout}
                </span>
              </div>
              <p className="text-[11px] text-muted-foreground mt-0.5">{f.desc}</p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={f.enabled}
              aria-label={`Toggle ${f.name}`}
              onClick={() => toggle(f.key)}
              className={cn(
                "relative w-9 h-5 rounded-full transition-colors shrink-0",
                f.enabled ? "bg-emerald-500/80" : "bg-muted-foreground/25",
              )}
            >
              <span
                className={cn(
                  "absolute top-0.5 h-4 w-4 rounded-full bg-background shadow-sm transition-transform",
                  f.enabled ? "translate-x-4" : "translate-x-0.5",
                )}
              />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

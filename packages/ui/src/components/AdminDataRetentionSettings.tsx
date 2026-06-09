"use client";

import React, { useState } from "react";
import { Archive, Database, Save } from "lucide-react";
import { cn } from "../lib/cn";

type Policy = { key: string; label: string; hint: string };

const POLICIES: Policy[] = [
  { key: "logs", label: "Application logs", hint: "Request & error logs" },
  { key: "events", label: "Audit events", hint: "Security & admin actions" },
  { key: "backups", label: "Database backups", hint: "Nightly snapshots" },
];

const PERIODS = ["30 days", "90 days", "1 year", "Forever"];

export interface AdminDataRetentionSettingsProps {
  className?: string;
}

export function AdminDataRetentionSettings({ className }: AdminDataRetentionSettingsProps) {
  const [periods, setPeriods] = useState<Record<string, string>>({
    logs: "90 days",
    events: "1 year",
    backups: "30 days",
  });
  const [autoPurge, setAutoPurge] = useState(true);

  return (
    <div
      className={cn(
        "w-full max-w-md bg-card border border-border p-5 rounded-2xl shadow-sm font-sans text-foreground",
        className,
      )}
    >
      <div className="flex items-center gap-2 mb-1">
        <Archive className="w-4 h-4 text-primary" />
        <h3 className="text-base font-bold">Data retention</h3>
      </div>
      <p className="text-xs text-muted-foreground mb-4">
        Choose how long each data category is kept before deletion.
      </p>

      <div className="space-y-3">
        {POLICIES.map((p) => (
          <div
            key={p.key}
            className="flex items-center gap-3 p-3 rounded-xl bg-muted border border-border"
          >
            <Database className="w-4 h-4 text-muted-foreground shrink-0" />
            <div className="flex-1 min-w-0">
              <label htmlFor={`retain-${p.key}`} className="text-sm font-semibold block">
                {p.label}
              </label>
              <span className="text-[11px] text-muted-foreground">{p.hint}</span>
            </div>
            <select
              id={`retain-${p.key}`}
              value={periods[p.key]}
              onChange={(e) => setPeriods((s) => ({ ...s, [p.key]: e.target.value }))}
              className="bg-background border border-border rounded-lg px-2 py-1.5 text-xs text-foreground focus:ring-1 focus:ring-primary/50 focus:outline-none"
            >
              {PERIODS.map((d) => (
                <option key={d} value={d} className="bg-card text-foreground">
                  {d}
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
        <div className="flex flex-col">
          <span className="text-xs font-semibold">Auto-purge expired data</span>
          <span className="text-[11px] text-muted-foreground">Runs daily at 02:00 UTC</span>
        </div>
        <button
          type="button"
          role="switch"
          aria-checked={autoPurge}
          aria-label="Toggle auto-purge of expired data"
          onClick={() => setAutoPurge((v) => !v)}
          className={cn(
            "relative w-9 h-5 rounded-full transition-colors shrink-0",
            autoPurge ? "bg-emerald-500/80" : "bg-muted-foreground/25",
          )}
        >
          <span
            className={cn(
              "absolute top-0.5 h-4 w-4 rounded-full bg-background shadow-sm transition-transform",
              autoPurge ? "translate-x-4" : "translate-x-0.5",
            )}
          />
        </button>
      </div>

      <button
        type="button"
        className="mt-5 w-full inline-flex items-center justify-center gap-1.5 rounded-xl bg-primary text-primary-foreground py-2.5 text-sm font-semibold hover:opacity-90 transition-opacity"
      >
        <Save className="w-4 h-4" /> Save retention policy
      </button>
    </div>
  );
}

"use client";

import React, { useState } from "react";
import { Users, Plus, X, Filter } from "lucide-react";
import { cn } from "../lib/cn";

type Rule = { id: number; field: string; op: string; value: string };

const FIELDS = ["Country", "Plan", "Signup date", "Sessions", "LTV"];
const OPS = ["is", "is not", "greater than", "less than", "contains"];

let nextId = 4;

export interface AnalyticsSegmentBuilderProps {
  className?: string;
}

export function AnalyticsSegmentBuilder({ className }: AnalyticsSegmentBuilderProps) {
  const [match, setMatch] = useState<"all" | "any">("all");
  const [rules, setRules] = useState<Rule[]>([
    { id: 1, field: "Plan", op: "is", value: "Pro" },
    { id: 2, field: "Sessions", op: "greater than", value: "10" },
    { id: 3, field: "Country", op: "is", value: "United States" },
  ]);

  const update = (id: number, patch: Partial<Rule>) =>
    setRules((rs) => rs.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  const remove = (id: number) => setRules((rs) => rs.filter((r) => r.id !== id));
  const add = () =>
    setRules((rs) => [...rs, { id: nextId++, field: "Country", op: "is", value: "" }]);

  return (
    <div
      className={cn(
        "w-full max-w-md bg-card border border-border p-5 rounded-2xl shadow-sm font-sans text-foreground",
        className,
      )}
    >
      <div className="flex items-center gap-2 mb-4">
        <Users className="w-4 h-4 text-primary" />
        <h3 className="text-base font-bold">Segment builder</h3>
        <span className="ml-auto inline-flex items-center gap-1 text-xs text-muted-foreground">
          <Filter className="w-3.5 h-3.5" />
          <span className="tabular-nums">{rules.length} rules</span>
        </span>
      </div>

      <div className="flex items-center gap-2 text-xs mb-3">
        <span className="text-muted-foreground">Match</span>
        <div className="inline-flex rounded-lg border border-border overflow-hidden">
          {(["all", "any"] as const).map((m) => (
            <button
              key={m}
              type="button"
              aria-pressed={match === m}
              onClick={() => setMatch(m)}
              className={cn(
                "px-2.5 py-1 text-xs font-semibold transition-colors",
                match === m ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted",
              )}
            >
              {m}
            </button>
          ))}
        </div>
        <span className="text-muted-foreground">of the following</span>
      </div>

      <div className="space-y-2">
        {rules.map((r) => (
          <div
            key={r.id}
            className="flex items-center gap-1.5 p-2 rounded-xl bg-muted border border-border"
          >
            <select
              aria-label="Field"
              value={r.field}
              onChange={(e) => update(r.id, { field: e.target.value })}
              className="bg-background border border-border rounded-lg px-2 py-1.5 text-xs text-foreground focus:ring-1 focus:ring-primary/50 focus:outline-none"
            >
              {FIELDS.map((f) => (
                <option key={f} value={f} className="bg-card text-foreground">
                  {f}
                </option>
              ))}
            </select>
            <select
              aria-label="Operator"
              value={r.op}
              onChange={(e) => update(r.id, { op: e.target.value })}
              className="bg-background border border-border rounded-lg px-2 py-1.5 text-xs text-muted-foreground focus:ring-1 focus:ring-primary/50 focus:outline-none"
            >
              {OPS.map((o) => (
                <option key={o} value={o} className="bg-card text-foreground">
                  {o}
                </option>
              ))}
            </select>
            <input
              aria-label="Value"
              value={r.value}
              onChange={(e) => update(r.id, { value: e.target.value })}
              placeholder="value"
              className="flex-1 min-w-0 bg-background border border-border rounded-lg px-2 py-1.5 text-xs text-foreground placeholder:text-muted-foreground focus:ring-1 focus:ring-primary/50 focus:outline-none"
            />
            <button
              type="button"
              aria-label="Remove rule"
              onClick={() => remove(r.id)}
              className="text-muted-foreground hover:text-red-600 dark:hover:text-red-400 transition-colors shrink-0 p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={add}
        className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:opacity-80 transition-opacity"
      >
        <Plus className="w-4 h-4" /> Add rule
      </button>
    </div>
  );
}

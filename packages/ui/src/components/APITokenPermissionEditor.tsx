"use client";

import React, { useState } from "react";
import { KeyRound } from "lucide-react";
import { cn } from "../lib/cn";

type Scope = { id: string; label: string; access: "read" | "write" };

const SCOPES: Scope[] = [
  { id: "customers.read", label: "customers", access: "read" },
  { id: "customers.write", label: "customers", access: "write" },
  { id: "invoices.read", label: "invoices", access: "read" },
  { id: "invoices.write", label: "invoices", access: "write" },
  { id: "webhooks.read", label: "webhooks", access: "read" },
  { id: "webhooks.write", label: "webhooks", access: "write" },
];

export interface APITokenPermissionEditorProps {
  className?: string;
}

export function APITokenPermissionEditor({ className }: APITokenPermissionEditorProps) {
  const [selected, setSelected] = useState<string[]>([
    "customers.read",
    "invoices.read",
    "invoices.write",
  ]);

  const toggle = (id: string) =>
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));

  return (
    <div
      className={cn(
        "w-full max-w-md bg-card border border-border p-5 rounded-2xl shadow-sm font-sans text-foreground",
        className,
      )}
    >
      <div className="flex items-center gap-2 mb-1">
        <KeyRound className="w-4 h-4 text-primary" />
        <h3 className="text-base font-bold">Token permissions</h3>
        <span className="ml-auto text-xs text-muted-foreground tabular-nums">
          {selected.length} scopes
        </span>
      </div>
      <p className="text-xs text-muted-foreground mb-4">
        Grant the minimum access this API token needs.
      </p>

      <div className="grid grid-cols-2 gap-2">
        {SCOPES.map((s) => {
          const on = selected.includes(s.id);
          return (
            <label
              key={s.id}
              className={cn(
                "flex items-center gap-2.5 p-3 rounded-xl border cursor-pointer transition-colors",
                on ? "bg-primary/[0.07] border-primary/30" : "bg-muted border-border hover:bg-muted/70",
              )}
            >
              <button
                type="button"
                role="checkbox"
                aria-checked={on}
                aria-label={`${s.label} ${s.access}`}
                onClick={() => toggle(s.id)}
                className={cn(
                  "w-4 h-4 rounded border grid place-items-center transition-colors shrink-0",
                  on ? "bg-primary border-primary" : "border-border bg-background",
                )}
              >
                {on && (
                  <svg viewBox="0 0 12 12" className="w-3 h-3 text-primary-foreground" fill="none">
                    <path d="M2.5 6.5L5 9L9.5 3.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </button>
              <div className="min-w-0">
                <code className="text-xs font-mono font-semibold block truncate">{s.label}</code>
                <span
                  className={cn(
                    "text-[10px] font-bold uppercase tracking-wide",
                    s.access === "write" ? "text-amber-600 dark:text-amber-400" : "text-sky-600 dark:text-sky-400",
                  )}
                >
                  {s.access}
                </span>
              </div>
            </label>
          );
        })}
      </div>

      <button
        type="button"
        className="mt-5 w-full rounded-xl bg-primary text-primary-foreground py-2.5 text-sm font-semibold hover:opacity-90 transition-opacity"
      >
        Update permissions
      </button>
    </div>
  );
}

"use client";

import React from "react";
import { Lock } from "lucide-react";
import { cn } from "../lib/cn";

type Param = { name: string; type: string; required: boolean };

export interface ApiEndpointCardProps {
  className?: string;
}

const PARAMS: Param[] = [
  { name: "limit", type: "integer", required: false },
  { name: "status", type: "string", required: false },
  { name: "customer_id", type: "string", required: true },
];

export function ApiEndpointCard({ className }: ApiEndpointCardProps) {
  return (
    <div
      className={cn(
        "w-full max-w-md bg-card border border-border p-5 rounded-2xl shadow-sm font-sans text-foreground",
        className,
      )}
    >
      <div className="flex items-center gap-2 mb-3">
        <span className="px-2 py-0.5 rounded-md bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 text-xs font-bold tracking-wide">
          GET
        </span>
        <code className="text-sm font-mono font-semibold truncate">/v1/invoices</code>
        <span className="ml-auto inline-flex items-center gap-1 text-xs text-muted-foreground">
          <Lock className="w-3.5 h-3.5" /> Auth
        </span>
      </div>

      <p className="text-xs text-muted-foreground leading-relaxed mb-4">
        Returns a paginated list of invoices, most recent first. Filter by customer or status.
      </p>

      <span className="block text-[11px] text-muted-foreground uppercase font-bold tracking-wider mb-2">
        Query parameters
      </span>
      <ul className="space-y-1.5 mb-4">
        {PARAMS.map((p) => (
          <li
            key={p.name}
            className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-muted border border-border"
          >
            <code className="text-xs font-mono font-semibold">{p.name}</code>
            <span className="text-[11px] text-muted-foreground font-mono">{p.type}</span>
            <span
              className={cn(
                "ml-auto text-[10px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded",
                p.required
                  ? "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                  : "bg-foreground/[0.06] text-muted-foreground",
              )}
            >
              {p.required ? "Required" : "Optional"}
            </span>
          </li>
        ))}
      </ul>

      <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-muted border border-border">
        <span className="text-xs text-emerald-600 dark:text-emerald-400 font-mono font-bold">200</span>
        <span className="text-xs text-muted-foreground font-mono">application/json</span>
      </div>
    </div>
  );
}

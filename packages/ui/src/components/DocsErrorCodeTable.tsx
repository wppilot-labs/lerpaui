"use client";

import React from "react";
import { cn } from "../lib/cn";

export interface DocsErrorCodeTableProps {
  className?: string;
}

type ErrorRow = { code: number; slug: string; meaning: string; retry: boolean };

const ERRORS: ErrorRow[] = [
  { code: 400, slug: "invalid_request", meaning: "A required parameter was missing or malformed.", retry: false },
  { code: 401, slug: "unauthorized", meaning: "The API key is missing, revoked, or expired.", retry: false },
  { code: 404, slug: "not_found", meaning: "The requested resource does not exist.", retry: false },
  { code: 429, slug: "rate_limited", meaning: "Too many requests in the current window.", retry: true },
  { code: 503, slug: "service_unavailable", meaning: "A temporary outage. Retry with backoff.", retry: true },
];

export function DocsErrorCodeTable({ className }: DocsErrorCodeTableProps) {
  return (
    <div
      className={cn(
        "w-full max-w-2xl bg-card/45 backdrop-blur-xl border border-border/50 p-6 rounded-2xl shadow-xl font-sans text-foreground",
        className,
      )}
    >
      <header className="mb-4">
        <p className="text-[11px] uppercase font-bold tracking-wider text-muted-foreground/45">Reference</p>
        <h3 className="text-base font-bold mt-0.5">Error codes</h3>
      </header>

      <div className="overflow-hidden rounded-xl border border-foreground/[0.05]">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-foreground/[0.02] text-[11px] uppercase font-bold text-muted-foreground/50 tracking-wider">
              <th scope="col" className="px-3 py-2">Code</th>
              <th scope="col" className="px-3 py-2">Type</th>
              <th scope="col" className="px-3 py-2">Meaning</th>
              <th scope="col" className="px-3 py-2 text-right">Retry</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-foreground/[0.04] text-sm">
            {ERRORS.map((e) => (
              <tr key={e.code} className="hover:bg-foreground/[0.02] transition-colors">
                <td className="px-3 py-3">
                  <span
                    className={cn(
                      "font-mono font-bold text-sm",
                      e.code >= 500 ? "text-rose-400" : e.code === 429 ? "text-amber-400" : "text-foreground/80",
                    )}
                  >
                    {e.code}
                  </span>
                </td>
                <td className="px-3 py-3 font-mono text-xs text-sky-300/80">{e.slug}</td>
                <td className="px-3 py-3 text-muted-foreground/70">{e.meaning}</td>
                <td className="px-3 py-3 text-right">
                  <span className={cn("text-xs font-medium", e.retry ? "text-emerald-400" : "text-muted-foreground/40")}>
                    {e.retry ? "Yes" : "No"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

"use client";

import React, { useState } from "react";
import { Search } from "lucide-react";
import { cn } from "../lib/cn";

type Row = { actor: string; action: string; target: string; time: string; ok: boolean };

const ROWS: Row[] = [
  { actor: "jane@acme.co", action: "user.login", target: "web · SF", time: "09:42", ok: true },
  { actor: "marcus@acme.co", action: "billing.update", target: "plan → Pro", time: "09:31", ok: true },
  { actor: "api-key-3f2", action: "token.revoke", target: "key_88af", time: "08:55", ok: true },
  { actor: "priya@acme.co", action: "user.delete", target: "u_2291", time: "08:12", ok: false },
];

export interface DashboardAuditLogTableProps {
  className?: string;
}

export function DashboardAuditLogTable({ className }: DashboardAuditLogTableProps) {
  const [q, setQ] = useState("");
  const rows = ROWS.filter((r) => (r.actor + r.action + r.target).toLowerCase().includes(q.toLowerCase()));

  return (
    <div className={cn("w-full max-w-xl bg-card/45 backdrop-blur-xl border border-border/50 p-5 rounded-2xl shadow-xl font-sans text-foreground", className)}>
      <div className="flex items-center justify-between mb-4 gap-3">
        <h3 className="text-base font-bold whitespace-nowrap">Audit log</h3>
        <div className="relative w-full max-w-[200px]">
          <Search className="absolute left-2.5 top-2.5 w-4 h-4 text-muted-foreground/40" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search events"
            aria-label="Search audit log"
            className="w-full bg-foreground/[0.03] border border-foreground/[0.06] rounded-lg pl-9 pr-3 py-1.5 text-xs focus:ring-1 focus:ring-primary/50 focus:outline-none"
          />
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-foreground/[0.05]">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-foreground/[0.02] text-[11px] uppercase font-bold text-muted-foreground/50 tracking-wider">
              <th className="px-3 py-2.5">Actor</th>
              <th className="px-3 py-2.5">Action</th>
              <th className="px-3 py-2.5">Target</th>
              <th className="px-3 py-2.5 text-right">Time</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-foreground/[0.04] text-xs">
            {rows.map((r, i) => (
              <tr key={i} className="hover:bg-foreground/[0.02] transition-colors">
                <td className="px-3 py-2.5 font-medium truncate max-w-[140px]">{r.actor}</td>
                <td className="px-3 py-2.5">
                  <code className={cn("text-[11px] px-1.5 py-0.5 rounded", r.ok ? "bg-foreground/[0.04] text-foreground/80" : "bg-red-500/10 text-red-400")}>{r.action}</code>
                </td>
                <td className="px-3 py-2.5 text-muted-foreground/70">{r.target}</td>
                <td className="px-3 py-2.5 text-right text-muted-foreground/50 tabular-nums">{r.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

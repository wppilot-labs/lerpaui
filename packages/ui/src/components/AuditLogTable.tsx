"use client";

import { useState } from "react";
import { ShieldCheck, Search } from "lucide-react";
import { cn } from "../lib/cn";

type AuditEntry = {
  actor: string;
  event: string;
  ip: string;
  status: "success" | "denied";
  time: string;
};

const ENTRIES: AuditEntry[] = [
  { actor: "jane@acme.co", event: "role.update", ip: "203.0.113.24", status: "success", time: "14:02:11" },
  { actor: "marcus@acme.co", event: "auth.login", ip: "198.51.100.7", status: "success", time: "13:47:55" },
  { actor: "unknown", event: "auth.login", ip: "45.137.21.9", status: "denied", time: "13:31:08" },
  { actor: "priya@acme.co", event: "apikey.create", ip: "203.0.113.88", status: "success", time: "12:58:40" },
  { actor: "alex@acme.co", event: "billing.export", ip: "192.0.2.140", status: "denied", time: "11:19:23" },
];

export interface AuditLogTableProps {
  className?: string;
}

export function AuditLogTable({ className }: AuditLogTableProps) {
  const [q, setQ] = useState("");
  const rows = ENTRIES.filter((e) => (e.actor + e.event + e.ip).toLowerCase().includes(q.toLowerCase()));

  return (
    <div className={cn("w-full max-w-xl bg-card backdrop-blur-xl border border-border p-5 rounded-2xl shadow-sm font-sans text-foreground", className)}>
      <div className="flex items-center justify-between mb-4 gap-3">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-primary" />
          <h3 className="text-sm font-bold whitespace-nowrap">Audit log</h3>
        </div>
        <div className="relative w-full max-w-[220px]">
          <Search className="absolute left-2.5 top-2.5 w-4 h-4 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Filter events"
            aria-label="Filter audit events"
            className="w-full bg-foreground/[0.04] border border-border rounded-lg pl-9 pr-3 py-2 text-xs focus:ring-1 focus:ring-primary/50 focus:outline-none"
          />
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-border">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-foreground/[0.04] text-[11px] uppercase font-bold text-muted-foreground tracking-wider">
              <th className="px-3 py-2.5">Actor</th>
              <th className="px-3 py-2.5 font-mono normal-case">Event</th>
              <th className="px-3 py-2.5 font-mono normal-case">IP address</th>
              <th className="px-3 py-2.5">Result</th>
              <th className="px-3 py-2.5 text-right">Time</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border text-sm">
            {rows.map((e, i) => (
              <tr key={i} className="hover:bg-foreground/[0.04] transition-colors">
                <td className="px-3 py-3 font-semibold">{e.actor}</td>
                <td className="px-3 py-3 font-mono text-xs text-muted-foreground">{e.event}</td>
                <td className="px-3 py-3 font-mono text-xs text-muted-foreground">{e.ip}</td>
                <td className="px-3 py-3">
                  <span
                    className={cn(
                      "inline-flex items-center gap-1.5 text-xs font-medium",
                      e.status === "success" ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"
                    )}
                  >
                    <span className={cn("h-1.5 w-1.5 rounded-full", e.status === "success" ? "bg-emerald-500" : "bg-rose-500")} />
                    {e.status === "success" ? "Success" : "Denied"}
                  </span>
                </td>
                <td className="px-3 py-3 text-right font-mono text-xs text-muted-foreground">{e.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

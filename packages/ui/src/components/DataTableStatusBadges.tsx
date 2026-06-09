"use client";

import React from "react";
import { cn } from "../lib/cn";

type Status = "active" | "pending" | "failed" | "paused";
type Row = { id: string; job: string; status: Status; ran: string };

const ROWS: Row[] = [
  { id: "1", job: "Nightly sync", status: "active", ran: "2m ago" },
  { id: "2", job: "Invoice export", status: "pending", ran: "queued" },
  { id: "3", job: "Webhook retry", status: "failed", ran: "1h ago" },
  { id: "4", job: "Backup", status: "paused", ran: "—" },
  { id: "5", job: "Index rebuild", status: "active", ran: "just now" },
];

const STATUS: Record<Status, { label: string; cls: string; dot: string }> = {
  active: { label: "Active", cls: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20", dot: "bg-emerald-400" },
  pending: { label: "Pending", cls: "bg-amber-500/10 text-amber-400 border-amber-500/20", dot: "bg-amber-400" },
  failed: { label: "Failed", cls: "bg-rose-500/10 text-rose-400 border-rose-500/20", dot: "bg-rose-400" },
  paused: { label: "Paused", cls: "bg-foreground/[0.04] text-muted-foreground/60 border-foreground/[0.08]", dot: "bg-muted-foreground/40" },
};

export interface DataTableStatusBadgesProps {
  className?: string;
}

export function DataTableStatusBadges({ className }: DataTableStatusBadgesProps) {
  return (
    <div className={cn("w-full max-w-md bg-card/45 backdrop-blur-xl border border-border/50 p-5 rounded-2xl shadow-xl font-sans text-foreground", className)}>
      <h3 className="text-base font-bold mb-4">Background jobs</h3>
      <div className="overflow-hidden rounded-xl border border-foreground/[0.05]">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-foreground/[0.02] text-[11px] uppercase font-bold text-muted-foreground/50 tracking-wider">
              <th scope="col" className="px-4 py-2.5">Job</th>
              <th scope="col" className="px-4 py-2.5">Status</th>
              <th scope="col" className="px-4 py-2.5 text-right">Last run</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-foreground/[0.04] text-sm">
            {ROWS.map((r) => {
              const s = STATUS[r.status];
              return (
                <tr key={r.id} className="hover:bg-foreground/[0.02] transition-colors">
                  <td className="px-4 py-3 font-semibold">{r.job}</td>
                  <td className="px-4 py-3">
                    <span className={cn("inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide px-2.5 py-0.5 rounded-full border", s.cls)}>
                      <span className={cn("h-1.5 w-1.5 rounded-full", s.dot)} />
                      {s.label}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right text-muted-foreground/55">{r.ran}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

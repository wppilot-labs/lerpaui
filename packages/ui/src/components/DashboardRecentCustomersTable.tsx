"use client";

import React from "react";
import { cn } from "../lib/cn";

type Row = { name: string; plan: string; mrr: string; status: "active" | "trial" | "churned" };

const ROWS: Row[] = [
  { name: "Northwind Inc", plan: "Enterprise", mrr: "$2,480", status: "active" },
  { name: "Vertex Labs", plan: "Pro", mrr: "$290", status: "active" },
  { name: "Lumen Co", plan: "Pro", mrr: "$290", status: "trial" },
  { name: "Delta App", plan: "Starter", mrr: "$0", status: "churned" },
];

const STATUS: Record<Row["status"], string> = {
  active: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  trial: "bg-sky-500/10 text-sky-400 border-sky-500/20",
  churned: "bg-foreground/[0.04] text-muted-foreground/60 border-foreground/[0.08]",
};

export interface DashboardRecentCustomersTableProps {
  className?: string;
}

export function DashboardRecentCustomersTable({ className }: DashboardRecentCustomersTableProps) {
  return (
    <div className={cn("w-full max-w-xl bg-card/45 backdrop-blur-xl border border-border/50 p-5 rounded-2xl shadow-xl font-sans text-foreground", className)}>
      <h3 className="text-base font-bold mb-4">Customers</h3>
      <div className="overflow-hidden rounded-xl border border-foreground/[0.05]">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-foreground/[0.02] text-[11px] uppercase font-bold text-muted-foreground/50 tracking-wider">
              <th className="px-3 py-2.5">Account</th>
              <th className="px-3 py-2.5">Plan</th>
              <th className="px-3 py-2.5 text-right">MRR</th>
              <th className="px-3 py-2.5 text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-foreground/[0.04] text-xs">
            {ROWS.map((r) => (
              <tr key={r.name} className="hover:bg-foreground/[0.02] transition-colors">
                <td className="px-3 py-2.5 font-semibold">{r.name}</td>
                <td className="px-3 py-2.5 text-muted-foreground/70">{r.plan}</td>
                <td className="px-3 py-2.5 text-right tabular-nums">{r.mrr}</td>
                <td className="px-3 py-2.5 text-right">
                  <span className={cn("inline-block text-[11px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full border capitalize", STATUS[r.status])}>{r.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

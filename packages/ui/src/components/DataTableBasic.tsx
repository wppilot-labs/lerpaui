"use client";

import React from "react";
import { cn } from "../lib/cn";

type Row = { name: string; email: string; role: string; joined: string };

const ROWS: Row[] = [
  { name: "John Doe", email: "john@acme.co", role: "Owner", joined: "Jan 2024" },
  { name: "Sarah Smith", email: "sarah@acme.co", role: "Admin", joined: "Mar 2024" },
  { name: "Mike Johnson", email: "mike@acme.co", role: "Developer", joined: "Jul 2024" },
  { name: "Lena Park", email: "lena@acme.co", role: "Viewer", joined: "Sep 2024" },
];

export interface DataTableBasicProps {
  className?: string;
}

export function DataTableBasic({ className }: DataTableBasicProps) {
  return (
    <div className={cn("w-full max-w-md bg-card/45 backdrop-blur-xl border border-border/50 p-5 rounded-2xl shadow-xl font-sans text-foreground", className)}>
      <h3 className="text-base font-bold mb-4">Team members</h3>
      <div className="overflow-hidden rounded-xl border border-foreground/[0.05]">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-foreground/[0.02] text-[11px] uppercase font-bold text-muted-foreground/50 tracking-wider">
              <th scope="col" className="px-4 py-2.5">Name</th>
              <th scope="col" className="px-4 py-2.5">Role</th>
              <th scope="col" className="px-4 py-2.5 text-right">Joined</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-foreground/[0.04] text-sm">
            {ROWS.map((r) => (
              <tr key={r.email} className="hover:bg-foreground/[0.02] transition-colors">
                <td className="px-4 py-3">
                  <div className="font-semibold">{r.name}</div>
                  <div className="text-xs text-muted-foreground/45">{r.email}</div>
                </td>
                <td className="px-4 py-3 text-muted-foreground/70">{r.role}</td>
                <td className="px-4 py-3 text-right tabular-nums text-muted-foreground/55">{r.joined}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

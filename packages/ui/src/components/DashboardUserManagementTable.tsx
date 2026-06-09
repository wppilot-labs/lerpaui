"use client";

import React, { useState } from "react";
import { Search, MoreHorizontal } from "lucide-react";
import { cn } from "../lib/cn";

type User = { name: string; email: string; role: string; active: boolean };

const USERS: User[] = [
  { name: "Jane Doe", email: "jane@acme.co", role: "Owner", active: true },
  { name: "Marcus Lee", email: "marcus@acme.co", role: "Admin", active: true },
  { name: "Priya Patel", email: "priya@acme.co", role: "Member", active: true },
  { name: "Alex Kim", email: "alex@acme.co", role: "Member", active: false },
];

export interface DashboardUserManagementTableProps {
  className?: string;
}

export function DashboardUserManagementTable({ className }: DashboardUserManagementTableProps) {
  const [q, setQ] = useState("");
  const rows = USERS.filter((u) => (u.name + u.email).toLowerCase().includes(q.toLowerCase()));

  return (
    <div className={cn("w-full max-w-xl bg-card/45 backdrop-blur-xl border border-border/50 p-5 rounded-2xl shadow-xl font-sans text-foreground", className)}>
      <div className="flex items-center justify-between mb-4 gap-3">
        <h3 className="text-base font-bold whitespace-nowrap">Users</h3>
        <div className="relative w-full max-w-[200px]">
          <Search className="absolute left-2.5 top-2.5 w-4 h-4 text-muted-foreground/40" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search users"
            aria-label="Search users"
            className="w-full bg-foreground/[0.03] border border-foreground/[0.06] rounded-lg pl-9 pr-3 py-1.5 text-xs focus:ring-1 focus:ring-primary/50 focus:outline-none"
          />
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-foreground/[0.05]">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-foreground/[0.02] text-[11px] uppercase font-bold text-muted-foreground/50 tracking-wider">
              <th className="px-3 py-2.5">User</th>
              <th className="px-3 py-2.5">Role</th>
              <th className="px-3 py-2.5">Status</th>
              <th className="px-3 py-2.5 w-8" />
            </tr>
          </thead>
          <tbody className="divide-y divide-foreground/[0.04] text-xs">
            {rows.map((u) => (
              <tr key={u.email} className="hover:bg-foreground/[0.02] transition-colors">
                <td className="px-3 py-2.5">
                  <div className="font-semibold">{u.name}</div>
                  <div className="text-[11px] text-muted-foreground/45">{u.email}</div>
                </td>
                <td className="px-3 py-2.5 text-muted-foreground/70">{u.role}</td>
                <td className="px-3 py-2.5">
                  <span className={cn("inline-flex items-center gap-1 text-xs", u.active ? "text-emerald-400" : "text-muted-foreground/50")}>
                    <span className={cn("h-1.5 w-1.5 rounded-full", u.active ? "bg-emerald-400" : "bg-muted-foreground/40")} />
                    {u.active ? "Active" : "Invited"}
                  </span>
                </td>
                <td className="px-3 py-2.5 text-right">
                  <button type="button" aria-label={`Manage ${u.name}`} className="text-muted-foreground/40 hover:text-foreground transition-colors">
                    <MoreHorizontal className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

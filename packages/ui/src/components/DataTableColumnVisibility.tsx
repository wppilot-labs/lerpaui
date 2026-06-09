"use client";

import React, { useState } from "react";
import { Columns3, Check, ChevronDown } from "lucide-react";
import { cn } from "../lib/cn";

type ColKey = "email" | "role" | "joined";
type Row = { name: string; email: string; role: string; joined: string };

const ROWS: Row[] = [
  { name: "Jane Doe", email: "jane@acme.co", role: "Owner", joined: "Jan 2024" },
  { name: "Marcus Lee", email: "marcus@acme.co", role: "Admin", joined: "Mar 2024" },
  { name: "Priya Patel", email: "priya@acme.co", role: "Member", joined: "Jul 2024" },
];

const COLUMNS: { key: ColKey; label: string }[] = [
  { key: "email", label: "Email" },
  { key: "role", label: "Role" },
  { key: "joined", label: "Joined" },
];

export interface DataTableColumnVisibilityProps {
  className?: string;
}

export function DataTableColumnVisibility({ className }: DataTableColumnVisibilityProps) {
  const [open, setOpen] = useState(true);
  const [visible, setVisible] = useState<Record<ColKey, boolean>>({ email: true, role: true, joined: false });

  const toggle = (k: ColKey) => setVisible((v) => ({ ...v, [k]: !v[k] }));

  return (
    <div className={cn("w-full max-w-md bg-card/45 backdrop-blur-xl border border-border/50 p-5 rounded-2xl shadow-xl font-sans text-foreground", className)}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-bold">Members</h3>
        <div className="relative">
          <button
            type="button"
            aria-haspopup="menu"
            aria-expanded={open}
            onClick={() => setOpen((o) => !o)}
            className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-lg border border-foreground/[0.08] hover:bg-foreground/[0.04] transition-colors"
          >
            <Columns3 className="w-4 h-4" />
            Columns
            <ChevronDown className="w-3.5 h-3.5 text-muted-foreground/50" />
          </button>
          {open && (
            <div role="menu" className="absolute right-0 mt-1.5 w-40 z-10 rounded-xl border border-foreground/[0.08] bg-popover/95 backdrop-blur-xl shadow-xl p-1">
              {COLUMNS.map((c) => (
                <button
                  key={c.key}
                  type="button"
                  role="menuitemcheckbox"
                  aria-checked={visible[c.key]}
                  onClick={() => toggle(c.key)}
                  className="w-full flex items-center justify-between gap-2 text-sm px-2.5 py-2 rounded-lg hover:bg-foreground/[0.05] transition-colors"
                >
                  <span className={cn(visible[c.key] ? "text-foreground" : "text-muted-foreground/50")}>{c.label}</span>
                  {visible[c.key] && <Check className="w-3.5 h-3.5 text-primary" />}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-foreground/[0.05]">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-foreground/[0.02] text-[11px] uppercase font-bold text-muted-foreground/50 tracking-wider">
              <th scope="col" className="px-4 py-2.5">Name</th>
              {visible.email && <th scope="col" className="px-4 py-2.5">Email</th>}
              {visible.role && <th scope="col" className="px-4 py-2.5">Role</th>}
              {visible.joined && <th scope="col" className="px-4 py-2.5 text-right">Joined</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-foreground/[0.04] text-sm">
            {ROWS.map((r) => (
              <tr key={r.email} className="hover:bg-foreground/[0.02] transition-colors">
                <td className="px-4 py-3 font-semibold">{r.name}</td>
                {visible.email && <td className="px-4 py-3 text-muted-foreground/55">{r.email}</td>}
                {visible.role && <td className="px-4 py-3 text-muted-foreground/70">{r.role}</td>}
                {visible.joined && <td className="px-4 py-3 text-right text-muted-foreground/55">{r.joined}</td>}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

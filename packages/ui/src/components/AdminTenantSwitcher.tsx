"use client";

import React, { useState } from "react";
import { Check, ChevronsUpDown, Search, Plus } from "lucide-react";
import { cn } from "../lib/cn";

type Tenant = { id: string; name: string; plan: string; members: number; color: string };

const TENANTS: Tenant[] = [
  { id: "acme", name: "Acme Corporation", plan: "Enterprise", members: 1284, color: "bg-sky-500" },
  { id: "globex", name: "Globex", plan: "Business", members: 312, color: "bg-emerald-500" },
  { id: "initech", name: "Initech", plan: "Business", members: 88, color: "bg-violet-500" },
  { id: "umbrella", name: "Umbrella Labs", plan: "Free", members: 14, color: "bg-amber-500" },
];

const initials = (name: string) =>
  name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

export interface AdminTenantSwitcherProps {
  className?: string;
}

export function AdminTenantSwitcher({ className }: AdminTenantSwitcherProps) {
  const [open, setOpen] = useState(true);
  const [active, setActive] = useState("acme");
  const [query, setQuery] = useState("");
  const current = TENANTS.find((t) => t.id === active) ?? TENANTS[0];
  const results = TENANTS.filter((t) => t.name.toLowerCase().includes(query.toLowerCase()));

  return (
    <div
      className={cn(
        "w-full max-w-xs bg-card border border-border p-3 rounded-2xl shadow-sm font-sans text-foreground",
        className,
      )}
    >
      <span className="block text-[11px] text-muted-foreground uppercase font-bold tracking-wider mb-1.5 px-1">
        Tenant
      </span>

      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center gap-2.5 p-2 rounded-xl bg-muted border border-border hover:bg-muted/70 transition-colors"
      >
        <span className={cn("w-8 h-8 rounded-lg grid place-items-center text-xs font-bold text-white shrink-0", current.color)}>
          {initials(current.name)}
        </span>
        <div className="flex-1 text-left min-w-0">
          <span className="text-sm font-semibold block truncate">{current.name}</span>
          <span className="text-[11px] text-muted-foreground">{current.plan}</span>
        </div>
        <ChevronsUpDown className="w-4 h-4 text-muted-foreground shrink-0" />
      </button>

      {open && (
        <div className="mt-1.5">
          <div className="relative mb-1.5">
            <Search className="absolute left-2.5 top-2 w-4 h-4 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Find tenant..."
              aria-label="Find tenant"
              className="w-full bg-muted border border-border rounded-lg pl-8 pr-3 py-1.5 text-xs focus:ring-1 focus:ring-primary/50 focus:outline-none"
            />
          </div>

          <ul role="listbox" aria-label="Tenants" className="space-y-0.5 max-h-44 overflow-y-auto">
            {results.map((t) => (
              <li key={t.id} role="option" aria-selected={t.id === active}>
                <button
                  type="button"
                  onClick={() => {
                    setActive(t.id);
                    setOpen(false);
                  }}
                  className={cn(
                    "w-full flex items-center gap-2.5 px-2 py-1.5 rounded-lg text-left transition-colors",
                    t.id === active ? "bg-primary/10" : "hover:bg-muted",
                  )}
                >
                  <span className={cn("w-7 h-7 rounded-md grid place-items-center text-[11px] font-bold text-white shrink-0", t.color)}>
                    {initials(t.name)}
                  </span>
                  <div className="flex-1 min-w-0">
                    <span className="text-xs font-semibold block truncate">{t.name}</span>
                    <span className="text-[11px] text-muted-foreground tabular-nums">
                      {t.members.toLocaleString()} members
                    </span>
                  </div>
                  {t.id === active && <Check className="w-4 h-4 text-primary shrink-0" />}
                </button>
              </li>
            ))}
          </ul>

          <button
            type="button"
            className="mt-1 w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            <Plus className="w-4 h-4" /> Create tenant
          </button>
        </div>
      )}
    </div>
  );
}

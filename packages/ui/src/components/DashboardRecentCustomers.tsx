"use client";

import React from "react";
import { cn } from "../lib/cn";

type Customer = { name: string; email: string; initials: string; spend: string };

const CUSTOMERS: Customer[] = [
  { name: "Olivia Hart", email: "olivia@northwind.io", initials: "OH", spend: "$2,480" },
  { name: "Liam Chen", email: "liam@vertex.dev", initials: "LC", spend: "$1,120" },
  { name: "Sofia Ramos", email: "sofia@lumen.co", initials: "SR", spend: "$960" },
  { name: "Noah Patel", email: "noah@delta.app", initials: "NP", spend: "$740" },
];

export interface DashboardRecentCustomersProps {
  className?: string;
}

export function DashboardRecentCustomers({ className }: DashboardRecentCustomersProps) {
  return (
    <div className={cn("w-full max-w-md bg-card/45 backdrop-blur-xl border border-border/50 p-5 rounded-2xl shadow-xl font-sans text-foreground", className)}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-bold">Recent customers</h3>
        <button type="button" className="text-xs font-bold text-primary hover:underline">See all</button>
      </div>
      <ul className="space-y-1">
        {CUSTOMERS.map((c) => (
          <li key={c.email} className="flex items-center gap-3 py-2">
            <div className="h-10 w-10 rounded-full bg-secondary/60 flex items-center justify-center text-xs font-bold shrink-0">{c.initials}</div>
            <div className="min-w-0 flex-1">
              <div className="text-sm font-semibold truncate">{c.name}</div>
              <div className="text-xs text-muted-foreground/50 truncate">{c.email}</div>
            </div>
            <span className="text-sm font-bold tabular-nums shrink-0">{c.spend}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

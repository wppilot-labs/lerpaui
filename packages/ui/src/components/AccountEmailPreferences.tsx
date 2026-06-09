"use client";

import React, { useState } from "react";
import { Mail } from "lucide-react";
import { cn } from "../lib/cn";

type Pref = { id: string; title: string; desc: string };

const PREFS: Pref[] = [
  { id: "product", title: "Product updates", desc: "New features and improvements" },
  { id: "security", title: "Security alerts", desc: "Sign-ins and password changes" },
  { id: "billing", title: "Billing & receipts", desc: "Invoices and payment notices" },
  { id: "newsletter", title: "Newsletter", desc: "Monthly tips and stories" },
];

export interface AccountEmailPreferencesProps {
  className?: string;
}

export function AccountEmailPreferences({ className }: AccountEmailPreferencesProps) {
  const [on, setOn] = useState<Record<string, boolean>>({ product: true, security: true, billing: true, newsletter: false });

  return (
    <div className={cn("w-full max-w-md bg-card/45 backdrop-blur-xl border border-border/50 p-5 rounded-2xl shadow-xl font-sans text-foreground", className)}>
      <div className="flex items-center gap-2 mb-4">
        <Mail className="w-4 h-4 text-primary" />
        <h3 className="text-base font-bold">Email preferences</h3>
      </div>

      <ul className="space-y-1">
        {PREFS.map((p) => (
          <li key={p.id} className="flex items-center gap-3 py-2">
            <div className="min-w-0 flex-1">
              <div className="text-sm font-semibold">{p.title}</div>
              <div className="text-xs text-muted-foreground/55">{p.desc}</div>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={!!on[p.id]}
              aria-label={p.title}
              onClick={() => setOn((s) => ({ ...s, [p.id]: !s[p.id] }))}
              className={cn("relative h-5 w-9 rounded-full transition-colors shrink-0", on[p.id] ? "bg-primary" : "bg-foreground/10")}
            >
              <span className={cn("absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform", on[p.id] && "translate-x-4")} />
            </button>
          </li>
        ))}
      </ul>

      <div className="mt-4 pt-3 border-t border-foreground/[0.05] flex items-center justify-between">
        <label htmlFor="email-digest" className="text-xs font-medium text-muted-foreground/80">Digest frequency</label>
        <select
          id="email-digest"
          defaultValue="weekly"
          className="bg-foreground/[0.03] border border-foreground/[0.06] rounded-lg px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-primary/50"
        >
          <option value="realtime">Real-time</option>
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
        </select>
      </div>
    </div>
  );
}

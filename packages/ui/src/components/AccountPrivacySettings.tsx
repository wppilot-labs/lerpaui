"use client";

import React, { useState } from "react";
import { Shield } from "lucide-react";
import { cn } from "../lib/cn";

type Toggle = { id: string; title: string; desc: string };

const TOGGLES: Toggle[] = [
  { id: "indexing", title: "Search engine indexing", desc: "Let search engines show your profile" },
  { id: "activity", title: "Show activity status", desc: "Others can see when you're online" },
  { id: "analytics", title: "Usage analytics", desc: "Share anonymous usage to improve the product" },
  { id: "datasharing", title: "Third-party data sharing", desc: "Allow partners to access limited data" },
];

export interface AccountPrivacySettingsProps {
  className?: string;
}

export function AccountPrivacySettings({ className }: AccountPrivacySettingsProps) {
  const [on, setOn] = useState<Record<string, boolean>>({ indexing: false, activity: true, analytics: true, datasharing: false });

  return (
    <div className={cn("w-full max-w-md bg-card/45 backdrop-blur-xl border border-border/50 p-5 rounded-2xl shadow-xl font-sans text-foreground", className)}>
      <div className="flex items-center gap-2 mb-4">
        <Shield className="w-4 h-4 text-primary" />
        <h3 className="text-base font-bold">Privacy</h3>
      </div>

      <div className="flex items-center justify-between mb-3 pb-3 border-b border-foreground/[0.05]">
        <label htmlFor="profile-visibility" className="text-xs font-medium text-muted-foreground/80">Profile visibility</label>
        <select
          id="profile-visibility"
          defaultValue="team"
          className="bg-foreground/[0.03] border border-foreground/[0.06] rounded-lg px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-primary/50"
        >
          <option value="public">Public</option>
          <option value="team">Team only</option>
          <option value="private">Private</option>
        </select>
      </div>

      <ul className="space-y-1">
        {TOGGLES.map((t) => (
          <li key={t.id} className="flex items-center gap-3 py-2">
            <div className="min-w-0 flex-1">
              <div className="text-sm font-semibold">{t.title}</div>
              <div className="text-xs text-muted-foreground/55">{t.desc}</div>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={!!on[t.id]}
              aria-label={t.title}
              onClick={() => setOn((s) => ({ ...s, [t.id]: !s[t.id] }))}
              className={cn("relative h-5 w-9 rounded-full transition-colors shrink-0", on[t.id] ? "bg-primary" : "bg-foreground/10")}
            >
              <span className={cn("absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform", on[t.id] && "translate-x-4")} />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

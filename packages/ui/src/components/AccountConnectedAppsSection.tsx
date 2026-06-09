"use client";

import React, { useState } from "react";
import { Slack, Github, Figma, Calendar } from "lucide-react";
import { cn } from "../lib/cn";

type App = {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  scopes: string;
  authorized: string;
};

const APPS: App[] = [
  { id: "slack", name: "Slack", icon: Slack, scopes: "Post messages, read channels", authorized: "Mar 2026" },
  { id: "github", name: "GitHub", icon: Github, scopes: "Read repositories, commit status", authorized: "Jan 2026" },
  { id: "figma", name: "Figma", icon: Figma, scopes: "Read files, export assets", authorized: "Feb 2026" },
  { id: "gcal", name: "Google Calendar", icon: Calendar, scopes: "Read & write events", authorized: "Apr 2026" },
];

export interface AccountConnectedAppsSectionProps {
  className?: string;
}

export function AccountConnectedAppsSection({ className }: AccountConnectedAppsSectionProps) {
  const [revoked, setRevoked] = useState<string[]>([]);

  return (
    <div className={cn("w-full max-w-md bg-card/45 backdrop-blur-xl border border-border/50 p-5 rounded-2xl shadow-xl font-sans text-foreground", className)}>
      <div className="mb-4">
        <h3 className="text-base font-bold">Connected apps</h3>
        <p className="text-xs text-muted-foreground/70">Third-party apps with access to your account</p>
      </div>

      <ul className="divide-y divide-foreground/[0.04]">
        {APPS.map((a) => {
          const Icon = a.icon;
          const isRevoked = revoked.includes(a.id);
          return (
            <li key={a.id} className={cn("flex items-center gap-3 py-3", isRevoked && "opacity-40")}>
              <div className="h-9 w-9 rounded-xl bg-secondary/40 flex items-center justify-center shrink-0">
                <Icon className="w-4 h-4 text-foreground/90" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-sm font-semibold">{a.name}</div>
                <div className="text-xs text-muted-foreground/55 truncate">{a.scopes}</div>
                <div className="text-[11px] text-muted-foreground/35">Authorized {a.authorized}</div>
              </div>
              <button
                type="button"
                onClick={() => setRevoked((r) => (isRevoked ? r.filter((x) => x !== a.id) : [...r, a.id]))}
                className="text-xs font-bold px-2.5 py-1 rounded-lg border border-foreground/[0.06] bg-secondary/40 text-muted-foreground hover:text-red-400 hover:border-red-500/20 transition-colors shrink-0"
              >
                {isRevoked ? "Undo" : "Revoke"}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

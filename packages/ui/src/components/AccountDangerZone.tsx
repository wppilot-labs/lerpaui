"use client";

import React from "react";
import { AlertTriangle, Download, PauseCircle, Trash2 } from "lucide-react";
import { cn } from "../lib/cn";

type Action = {
  id: string;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  desc: string;
  cta: string;
  destructive?: boolean;
};

const ACTIONS: Action[] = [
  { id: "export", icon: Download, title: "Export account data", desc: "Download a copy of everything in your account.", cta: "Export" },
  { id: "deactivate", icon: PauseCircle, title: "Deactivate account", desc: "Temporarily disable your account. Reactivate anytime.", cta: "Deactivate" },
  { id: "delete", icon: Trash2, title: "Delete account", desc: "Permanently erase your account and all data.", cta: "Delete", destructive: true },
];

export interface AccountDangerZoneProps {
  className?: string;
}

export function AccountDangerZone({ className }: AccountDangerZoneProps) {
  return (
    <div className={cn("w-full max-w-md bg-card/45 backdrop-blur-xl border border-red-500/25 p-5 rounded-2xl shadow-xl font-sans text-foreground", className)}>
      <div className="flex items-center gap-2 mb-1">
        <AlertTriangle className="w-4 h-4 text-red-400" />
        <h3 className="text-base font-bold text-red-400">Danger zone</h3>
      </div>
      <p className="text-xs text-muted-foreground/70 mb-4">Irreversible and destructive actions</p>

      <ul className="space-y-2.5">
        {ACTIONS.map((a) => {
          const Icon = a.icon;
          return (
            <li
              key={a.id}
              className={cn(
                "flex items-start gap-3 p-3 rounded-xl border",
                a.destructive ? "bg-red-500/[0.04] border-red-500/20" : "bg-foreground/[0.02] border-foreground/[0.04]",
              )}
            >
              <Icon className={cn("w-4 h-4 mt-0.5 shrink-0", a.destructive ? "text-red-400" : "text-muted-foreground")} />
              <div className="min-w-0 flex-1">
                <div className="text-sm font-semibold">{a.title}</div>
                <div className="text-xs text-muted-foreground/60 leading-snug">{a.desc}</div>
              </div>
              <button
                type="button"
                className={cn(
                  "text-xs font-bold px-2.5 py-1 rounded-lg border transition-colors shrink-0",
                  a.destructive
                    ? "bg-red-500/15 text-red-400 border-red-500/30 hover:bg-red-500/25"
                    : "bg-secondary/50 text-muted-foreground border-foreground/[0.06] hover:text-foreground",
                )}
              >
                {a.cta}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

"use client";

import React from "react";
import { Bell, Settings } from "lucide-react";
import { cn } from "../lib/cn";

type Item = { id: string; dot: string; text: string; time: string };

const ITEMS: Item[] = [
  { id: "1", dot: "bg-primary", text: "Your export is ready to download", time: "just now" },
  { id: "2", dot: "bg-emerald-400", text: "Backup completed successfully", time: "20m" },
  { id: "3", dot: "bg-amber-400", text: "Storage is 85% full", time: "2h" },
];

export interface DashboardNotificationPanelProps {
  className?: string;
}

export function DashboardNotificationPanel({ className }: DashboardNotificationPanelProps) {
  return (
    <div className={cn("w-full max-w-[280px] bg-card/80 backdrop-blur-2xl border border-border/50 rounded-2xl shadow-2xl font-sans text-foreground overflow-hidden", className)}>
      <div className="flex items-center justify-between px-4 py-3 border-b border-foreground/[0.06]">
        <span className="text-sm font-bold flex items-center gap-1.5">
          <Bell className="w-4 h-4 text-primary" /> Notifications
        </span>
        <button type="button" aria-label="Notification settings" className="text-muted-foreground/50 hover:text-foreground transition-colors">
          <Settings className="w-4 h-4" />
        </button>
      </div>

      <ul className="py-1">
        {ITEMS.map((it) => (
          <li key={it.id}>
            <button type="button" className="w-full flex items-center gap-2.5 px-4 py-2.5 text-left hover:bg-foreground/[0.03] transition-colors">
              <span className={cn("h-1.5 w-1.5 rounded-full shrink-0", it.dot)} />
              <span className="flex-1 text-xs leading-snug">{it.text}</span>
              <span className="text-[11px] text-muted-foreground/40 shrink-0">{it.time}</span>
            </button>
          </li>
        ))}
      </ul>

      <button type="button" className="w-full py-2.5 text-xs font-bold text-primary border-t border-foreground/[0.06] hover:bg-foreground/[0.02] transition-colors">
        View all notifications
      </button>
    </div>
  );
}

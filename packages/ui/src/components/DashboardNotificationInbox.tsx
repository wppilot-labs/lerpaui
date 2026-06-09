"use client";

import React, { useState } from "react";
import { MessageSquare, GitPullRequest, CreditCard, AtSign } from "lucide-react";
import { cn } from "../lib/cn";

type Note = { id: string; icon: React.ComponentType<{ className?: string }>; title: string; body: string; time: string; read: boolean };

const INITIAL: Note[] = [
  { id: "1", icon: AtSign, title: "Priya mentioned you", body: "in “Q3 roadmap” — can you review?", time: "2m", read: false },
  { id: "2", icon: GitPullRequest, title: "PR #1284 approved", body: "Marcus approved your changes", time: "1h", read: false },
  { id: "3", icon: CreditCard, title: "Payment received", body: "Invoice #8841 — $1,200", time: "3h", read: true },
  { id: "4", icon: MessageSquare, title: "New comment", body: "Alex replied on INC-77", time: "1d", read: true },
];

export interface DashboardNotificationInboxProps {
  className?: string;
}

export function DashboardNotificationInbox({ className }: DashboardNotificationInboxProps) {
  const [notes, setNotes] = useState(INITIAL);
  const [tab, setTab] = useState<"all" | "unread">("all");

  const shown = tab === "all" ? notes : notes.filter((n) => !n.read);
  const unread = notes.filter((n) => !n.read).length;

  return (
    <div className={cn("w-full max-w-md bg-card/45 backdrop-blur-xl border border-border/50 rounded-2xl shadow-xl font-sans text-foreground overflow-hidden", className)}>
      <div className="flex items-center justify-between px-5 pt-4 pb-3">
        <h3 className="text-base font-bold">Inbox {unread > 0 && <span className="text-xs font-bold text-primary">({unread})</span>}</h3>
        <button type="button" onClick={() => setNotes((n) => n.map((x) => ({ ...x, read: true })))} className="text-xs font-bold text-muted-foreground/60 hover:text-foreground">
          Mark all read
        </button>
      </div>

      <div className="flex gap-0.5 px-5 mb-1">
        {(["all", "unread"] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={cn("px-3 py-1 rounded-lg text-xs font-semibold capitalize transition-colors", tab === t ? "bg-secondary/60 text-foreground" : "text-muted-foreground/60 hover:text-foreground")}
          >
            {t}
          </button>
        ))}
      </div>

      <ul className="divide-y divide-foreground/[0.04]">
        {shown.map((n) => {
          const Icon = n.icon;
          return (
            <li key={n.id}>
              <button
                type="button"
                onClick={() => setNotes((s) => s.map((x) => (x.id === n.id ? { ...x, read: true } : x)))}
                className="w-full flex items-start gap-3 px-5 py-3 text-left hover:bg-foreground/[0.02] transition-colors"
              >
                <div className="relative h-9 w-9 rounded-lg bg-secondary/40 flex items-center justify-center shrink-0">
                  <Icon className="w-4 h-4 text-foreground/80" />
                  {!n.read && <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-primary ring-2 ring-card" />}
                </div>
                <div className="min-w-0 flex-1">
                  <div className={cn("text-sm", n.read ? "font-medium text-foreground/80" : "font-bold")}>{n.title}</div>
                  <div className="text-xs text-muted-foreground/55 truncate">{n.body}</div>
                </div>
                <span className="text-[11px] text-muted-foreground/40 shrink-0">{n.time}</span>
              </button>
            </li>
          );
        })}
        {shown.length === 0 && <li className="px-5 py-8 text-center text-sm text-muted-foreground/50">You&apos;re all caught up</li>}
      </ul>
    </div>
  );
}

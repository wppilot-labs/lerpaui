"use client";

import React, { useState } from "react";
import {
  Bell,
  MessageSquare,
  GitPullRequest,
  AtSign,
  CheckCheck,
} from "lucide-react";
import { cn } from "../lib/cn";

type Notif = {
  id: string;
  icon: React.ElementType;
  tint: string;
  title: string;
  body: string;
  time: string;
  unread: boolean;
};

const NOTIFS: Notif[] = [
  {
    id: "1",
    icon: AtSign,
    tint: "text-primary bg-primary/10",
    title: "Priya mentioned you",
    body: "“@you can you review the onboarding copy?”",
    time: "2m",
    unread: true,
  },
  {
    id: "2",
    icon: GitPullRequest,
    tint: "text-emerald-400 bg-emerald-500/10",
    title: "PR #482 merged",
    body: "Fix: race condition in token refresh",
    time: "1h",
    unread: true,
  },
  {
    id: "3",
    icon: MessageSquare,
    tint: "text-sky-400 bg-sky-500/10",
    title: "New comment on Design Q3",
    body: "Marcus left feedback on slide 4",
    time: "3h",
    unread: false,
  },
];

export interface NotificationDropdownProps {
  className?: string;
}

export function NotificationDropdown({ className }: NotificationDropdownProps) {
  const [open, setOpen] = useState(true);
  const [items, setItems] = useState(NOTIFS);
  const unread = items.filter((i) => i.unread).length;

  return (
    <div className={cn("relative w-full max-w-[340px] font-sans text-foreground", className)}>
      <button
        type="button"
        aria-label="Notifications"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className="relative rounded-xl border border-border/50 bg-card/60 p-2 backdrop-blur-xl transition-colors hover:bg-card"
      >
        <Bell className="h-5 w-5" />
        {unread > 0 && (
          <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground">
            {unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-2 w-[340px] overflow-hidden rounded-2xl border border-border/50 bg-card/95 shadow-2xl backdrop-blur-2xl">
          <div className="flex items-center justify-between border-b border-foreground/[0.06] px-4 py-3">
            <span className="text-sm font-bold">Notifications</span>
            <button
              type="button"
              onClick={() => setItems((cur) => cur.map((i) => ({ ...i, unread: false })))}
              className="flex items-center gap-1 text-xs font-semibold text-primary transition-opacity hover:opacity-80"
            >
              <CheckCheck className="h-3.5 w-3.5" /> Mark all read
            </button>
          </div>

          <ul className="max-h-72 divide-y divide-foreground/[0.04] overflow-y-auto">
            {items.map((n) => (
              <li key={n.id}>
                <button
                  type="button"
                  onClick={() =>
                    setItems((cur) => cur.map((i) => (i.id === n.id ? { ...i, unread: false } : i)))
                  }
                  className={cn(
                    "flex w-full items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-foreground/[0.03]",
                    n.unread && "bg-primary/[0.04]",
                  )}
                >
                  <span className={cn("mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full", n.tint)}>
                    <n.icon className="h-4 w-4" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-semibold leading-tight">{n.title}</span>
                    <span className="block truncate text-xs text-muted-foreground/60">{n.body}</span>
                  </span>
                  <span className="shrink-0 text-[11px] text-muted-foreground/40">{n.time}</span>
                </button>
              </li>
            ))}
          </ul>

          <a
            href="/"
            className="block border-t border-foreground/[0.06] py-2.5 text-center text-sm font-bold text-primary transition-colors hover:bg-foreground/[0.02]"
          >
            View all notifications
          </a>
        </div>
      )}
    </div>
  );
}

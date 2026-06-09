"use client";

import React, { useState } from "react";
import { Inbox, Star, Paperclip } from "lucide-react";
import { cn } from "../lib/cn";

type Thread = {
  id: string;
  from: string;
  initials: string;
  tint: string;
  subject: string;
  preview: string;
  time: string;
  unread: boolean;
  assignee?: string;
  attachment?: boolean;
};

const THREADS: Thread[] = [
  {
    id: "1",
    from: "Acme Billing",
    initials: "AB",
    tint: "bg-violet-500/15 text-violet-300",
    subject: "Invoice #2381 needs review",
    preview: "The customer is disputing a line item on their…",
    time: "9:24",
    unread: true,
    assignee: "PP",
  },
  {
    id: "2",
    from: "Lena Hofer",
    initials: "LH",
    tint: "bg-sky-500/15 text-sky-300",
    subject: "Re: API access for staging",
    preview: "Thanks! That worked. One more question about…",
    time: "8:51",
    unread: true,
    attachment: true,
  },
  {
    id: "3",
    from: "Github",
    initials: "GH",
    tint: "bg-emerald-500/15 text-emerald-300",
    subject: "Deploy succeeded: web@v2.4.0",
    preview: "Production deployment finished in 3m 12s with…",
    time: "Tue",
    unread: false,
    assignee: "ML",
  },
  {
    id: "4",
    from: "Priya Patel",
    initials: "PP",
    tint: "bg-amber-500/15 text-amber-300",
    subject: "Q3 OKR draft for feedback",
    preview: "Left a few comments in the doc — mostly around…",
    time: "Mon",
    unread: false,
  },
];

export interface TeamSharedInboxProps {
  className?: string;
}

export function TeamSharedInbox({ className }: TeamSharedInboxProps) {
  const [starred, setStarred] = useState<Record<string, boolean>>({ "1": true });
  const unread = THREADS.filter((t) => t.unread).length;

  return (
    <div
      className={cn(
        "w-full max-w-md bg-card/45 backdrop-blur-xl border border-border/50 rounded-2xl shadow-xl font-sans text-foreground overflow-hidden",
        className,
      )}
    >
      <div className="flex items-center justify-between border-b border-border/50 px-5 py-3.5">
        <h3 className="flex items-center gap-1.5 text-base font-bold">
          <Inbox className="h-4 w-4 text-primary" /> Shared inbox
        </h3>
        <span className="rounded-full bg-primary/15 px-2 py-0.5 text-xs font-semibold text-primary">
          {unread} unread
        </span>
      </div>

      <ul className="divide-y divide-border/40">
        {THREADS.map((t) => (
          <li
            key={t.id}
            className={cn(
              "flex items-start gap-3 px-4 py-3 transition-colors hover:bg-secondary/30",
              t.unread && "bg-secondary/15",
            )}
          >
            <button
              type="button"
              onClick={() =>
                setStarred((s) => ({ ...s, [t.id]: !s[t.id] }))
              }
              aria-label={starred[t.id] ? "Unstar thread" : "Star thread"}
              aria-pressed={!!starred[t.id]}
              className="mt-0.5 shrink-0"
            >
              <Star
                className={cn(
                  "h-4 w-4 transition-colors",
                  starred[t.id]
                    ? "fill-amber-400 text-amber-400"
                    : "text-muted-foreground/40 hover:text-muted-foreground",
                )}
              />
            </button>

            <span
              className={cn(
                "flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[11px] font-bold",
                t.tint,
              )}
            >
              {t.initials}
            </span>

            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <span
                  className={cn(
                    "truncate text-sm",
                    t.unread ? "font-bold" : "font-medium text-foreground/85",
                  )}
                >
                  {t.from}
                </span>
                <span className="shrink-0 text-xs text-muted-foreground/45">
                  {t.time}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <p
                  className={cn(
                    "truncate text-xs",
                    t.unread ? "text-foreground/90" : "text-muted-foreground",
                  )}
                >
                  {t.subject}
                </p>
                {t.attachment && (
                  <Paperclip className="h-3.5 w-3.5 shrink-0 text-muted-foreground/40" />
                )}
              </div>
              <div className="mt-0.5 flex items-center justify-between gap-2">
                <p className="truncate text-xs text-muted-foreground/50">
                  {t.preview}
                </p>
                {t.assignee && (
                  <span className="shrink-0 rounded-full border border-border/60 bg-secondary/50 px-1.5 py-0.5 text-[11px] font-semibold text-muted-foreground/80">
                    @{t.assignee}
                  </span>
                )}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

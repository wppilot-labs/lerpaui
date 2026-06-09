"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Inbox, Flag, Clock, MessageSquare } from "lucide-react";
import { cn } from "../lib/cn";

export interface DashboardSupportInboxTriageProps {
  className?: string;
}

type Priority = "urgent" | "high" | "normal" | "low";

const TICKETS: Array<{
  id: string;
  subject: string;
  customer: string;
  initials: string;
  priority: Priority;
  age: string;
  channel: "email" | "chat" | "phone";
  unread?: boolean;
}> = [
  { id: "T-8421", subject: "Cannot access dashboard after upgrade", customer: "Hannah Lee", initials: "HL", priority: "urgent", age: "4m", channel: "chat", unread: true },
  { id: "T-8419", subject: "Refund request for double-charge", customer: "Marcus Chen", initials: "MC", priority: "high", age: "12m", channel: "email", unread: true },
  { id: "T-8415", subject: "SSO integration question", customer: "Priya Patel", initials: "PP", priority: "normal", age: "38m", channel: "email" },
  { id: "T-8410", subject: "Feature request: dark mode toggle", customer: "Diego Alvarez", initials: "DA", priority: "low", age: "1h", channel: "chat" },
  { id: "T-8407", subject: "Webhook delivery failing intermittently", customer: "Ana Rossi", initials: "AR", priority: "high", age: "2h", channel: "email" },
];

const PRIORITY: Record<Priority, { label: string; class: string }> = {
  urgent: { label: "Urgent", class: "bg-rose-500/10 text-rose-500 border-rose-500/20" },
  high: { label: "High", class: "bg-amber-500/10 text-amber-500 border-amber-500/20" },
  normal: { label: "Normal", class: "bg-sky-500/10 text-sky-500 border-sky-500/20" },
  low: { label: "Low", class: "bg-muted/40 text-muted-foreground border-border" },
};

export function DashboardSupportInboxTriage({ className }: DashboardSupportInboxTriageProps) {
  const reduced = useReducedMotion() ?? false;

  return (
    <section
      aria-label="Support inbox"
      className={cn(
        "w-full max-w-3xl rounded-2xl border bg-card p-6 shadow-sm transition-shadow hover:shadow-md",
        className
      )}
    >
      <header className="mb-5 flex items-start justify-between">
        <div className="flex items-center gap-2">
          <Inbox className="h-4 w-4 text-primary" aria-hidden />
          <div>
            <h3 className="text-base font-semibold tracking-tight text-foreground">Support inbox</h3>
            <p className="mt-0.5 text-xs text-muted-foreground">5 open · 2 urgent · avg first reply 8m</p>
          </div>
        </div>
        <span className="inline-flex items-center gap-1 rounded-full bg-rose-500/10 px-2 py-0.5 text-[10px] font-medium text-rose-500">
          <Flag className="h-3 w-3" /> 2 urgent
        </span>
      </header>

      <ol className="divide-y rounded-xl border bg-muted/10">
        {TICKETS.map((t, i) => {
          const p = PRIORITY[t.priority];
          return (
            <motion.li
              key={t.id}
              initial={reduced ? false : { opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
              className="flex items-start gap-3 px-4 py-3 transition-colors hover:bg-muted/30"
            >
              <div className="relative grid h-9 w-9 flex-shrink-0 place-items-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                {t.initials}
                {t.unread && <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full border-2 border-card bg-rose-500" />}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono text-muted-foreground">{t.id}</span>
                  <span className={cn("inline-flex items-center gap-1 rounded-full border px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider", p.class)}>
                    {t.priority === "urgent" && <Flag className="h-2.5 w-2.5" />} {p.label}
                  </span>
                  <span className="ml-auto inline-flex items-center gap-1 text-[10px] text-muted-foreground">
                    <Clock className="h-2.5 w-2.5" /> {t.age}
                  </span>
                </div>
                <p className="mt-0.5 truncate text-sm font-medium text-foreground">{t.subject}</p>
                <p className="mt-0.5 truncate text-[11px] text-muted-foreground">
                  {t.customer} · via {t.channel}
                </p>
              </div>

              <button
                type="button"
                aria-label={`Reply to ${t.id}`}
                className="rounded-md border bg-muted/30 p-1.5 text-muted-foreground transition-colors hover:bg-muted/50 hover:text-foreground"
              >
                <MessageSquare className="h-3.5 w-3.5" aria-hidden />
              </button>
            </motion.li>
          );
        })}
      </ol>
    </section>
  );
}

export default DashboardSupportInboxTriage;

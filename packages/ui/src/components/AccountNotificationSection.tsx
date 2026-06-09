"use client";

import React, { useState } from "react";
import { Bell, Mail, Smartphone, MessageSquare } from "lucide-react";
import { cn } from "../lib/cn";

const CHANNELS = [
  { id: "email", label: "Email", icon: Mail },
  { id: "push", label: "Push", icon: Smartphone },
  { id: "sms", label: "SMS", icon: MessageSquare },
] as const;

const EVENTS = ["Mentions", "Comments", "Task assigned", "Weekly report"];

type Key = `${number}:${string}`;

export interface AccountNotificationSectionProps {
  className?: string;
}

export function AccountNotificationSection({ className }: AccountNotificationSectionProps) {
  const [on, setOn] = useState<Record<Key, boolean>>({
    "0:email": true, "0:push": true, "1:email": true, "2:push": true, "2:email": true, "3:email": true,
  });

  const toggle = (k: Key) => setOn((s) => ({ ...s, [k]: !s[k] }));

  return (
    <div className={cn("w-full max-w-md bg-card/45 backdrop-blur-xl border border-border/50 p-5 rounded-2xl shadow-xl font-sans text-foreground", className)}>
      <div className="flex items-center gap-2 mb-4">
        <Bell className="w-4 h-4 text-primary" />
        <h3 className="text-base font-bold">Notifications</h3>
      </div>

      <div className="grid grid-cols-[1fr_repeat(3,2.25rem)] gap-y-1 items-center">
        <span />
        {CHANNELS.map((c) => (
          <span key={c.id} className="flex flex-col items-center gap-0.5 text-[11px] uppercase font-bold text-muted-foreground/50 tracking-wide">
            <c.icon className="w-3.5 h-3.5" />
            {c.label}
          </span>
        ))}

        {EVENTS.map((event, row) => (
          <React.Fragment key={event}>
            <span className="text-xs font-medium text-foreground/90 py-1.5">{event}</span>
            {CHANNELS.map((c) => {
              const k = `${row}:${c.id}` as Key;
              return (
                <span key={c.id} className="flex justify-center">
                  <button
                    type="button"
                    role="checkbox"
                    aria-checked={!!on[k]}
                    aria-label={`${event} via ${c.label}`}
                    onClick={() => toggle(k)}
                    className={cn(
                      "h-4 w-4 rounded-[5px] border flex items-center justify-center transition-colors",
                      on[k] ? "bg-primary border-primary" : "bg-foreground/[0.03] border-foreground/15 hover:border-foreground/30",
                    )}
                  >
                    {on[k] && (
                      <svg viewBox="0 0 12 12" className="w-2.5 h-2.5 text-primary-foreground" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M2.5 6.5L5 9l4.5-5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </button>
                </span>
              );
            })}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

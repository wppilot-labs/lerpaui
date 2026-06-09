"use client";

import React from "react";
import { PhoneIncoming, PhoneOutgoing, PhoneMissed, Voicemail } from "lucide-react";
import { cn } from "../lib/cn";

type CallDirection = "incoming" | "outgoing" | "missed" | "voicemail";

type CallEntry = {
  id: string;
  name: string;
  direction: CallDirection;
  note: string;
  duration: string;
  time: string;
};

const CALLS: CallEntry[] = [
  { id: "1", name: "Dana Whitfield", direction: "outgoing", note: "Discussed Q3 renewal terms", duration: "12m 04s", time: "9:42 AM" },
  { id: "2", name: "Marcus Lee", direction: "incoming", note: "Inbound pricing question", duration: "6m 31s", time: "Yesterday" },
  { id: "3", name: "Priya Nair", direction: "missed", note: "No answer — left no message", duration: "—", time: "Yesterday" },
  { id: "4", name: "Acme Corp main line", direction: "voicemail", note: "Voicemail about contract draft", duration: "1m 18s", time: "Mon" },
];

const META: Record<
  CallDirection,
  { icon: React.ComponentType<{ className?: string }>; label: string; color: string }
> = {
  incoming: { icon: PhoneIncoming, label: "Incoming", color: "text-emerald-400 bg-emerald-500/10" },
  outgoing: { icon: PhoneOutgoing, label: "Outgoing", color: "text-sky-400 bg-sky-500/10" },
  missed: { icon: PhoneMissed, label: "Missed", color: "text-red-400 bg-red-500/10" },
  voicemail: { icon: Voicemail, label: "Voicemail", color: "text-amber-400 bg-amber-500/10" },
};

export interface CRMCallLogTimelineProps {
  className?: string;
}

export function CRMCallLogTimeline({ className }: CRMCallLogTimelineProps) {
  return (
    <div
      className={cn(
        "w-full max-w-md bg-card/45 backdrop-blur-xl border border-border/50 p-5 rounded-2xl shadow-xl font-sans text-foreground",
        className,
      )}
    >
      <h3 className="text-sm font-bold mb-4">Call history</h3>

      <ol className="relative space-y-4 before:absolute before:left-[15px] before:top-1 before:bottom-1 before:w-px before:bg-foreground/[0.07]">
        {CALLS.map((call) => {
          const meta = META[call.direction];
          const Icon = meta.icon;
          return (
            <li key={call.id} className="relative flex gap-3 pl-0">
              <div
                className={cn(
                  "relative z-10 h-8 w-8 shrink-0 rounded-full flex items-center justify-center ring-4 ring-card/45",
                  meta.color,
                )}
              >
                <Icon className="w-4 h-4" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-semibold truncate">{call.name}</span>
                  <span className="text-[11px] text-muted-foreground/50 shrink-0">{call.time}</span>
                </div>
                <p className="text-xs text-muted-foreground/70 truncate">{call.note}</p>
                <div className="mt-1 flex items-center gap-2 text-[11px] text-muted-foreground/50">
                  <span className={cn("font-medium", meta.color.split(" ")[0])}>{meta.label}</span>
                  <span aria-hidden>·</span>
                  <span>{call.duration}</span>
                </div>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

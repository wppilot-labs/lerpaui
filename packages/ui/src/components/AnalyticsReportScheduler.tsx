"use client";

import React, { useState } from "react";
import { CalendarClock, Mail, Clock } from "lucide-react";
import { cn } from "../lib/cn";

const FREQUENCIES = ["Daily", "Weekly", "Monthly"];
const DAYS = ["S", "M", "T", "W", "T", "F", "S"];

export interface AnalyticsReportSchedulerProps {
  className?: string;
}

export function AnalyticsReportScheduler({ className }: AnalyticsReportSchedulerProps) {
  const [frequency, setFrequency] = useState("Weekly");
  const [days, setDays] = useState<number[]>([1]);
  const [time, setTime] = useState("09:00");
  const [recipients, setRecipients] = useState("team@acme.co");

  const toggleDay = (i: number) =>
    setDays((d) => (d.includes(i) ? d.filter((x) => x !== i) : [...d, i]));

  return (
    <div
      className={cn(
        "w-full max-w-md bg-card border border-border p-5 rounded-2xl shadow-sm font-sans text-foreground",
        className,
      )}
    >
      <div className="flex items-center gap-2 mb-4">
        <CalendarClock className="w-4 h-4 text-primary" />
        <h3 className="text-base font-bold">Schedule report</h3>
      </div>

      <div className="space-y-4">
        <div>
          <span className="block text-[11px] text-muted-foreground uppercase font-bold tracking-wider mb-2">
            Frequency
          </span>
          <div className="flex gap-1.5">
            {FREQUENCIES.map((f) => (
              <button
                key={f}
                type="button"
                aria-pressed={frequency === f}
                onClick={() => setFrequency(f)}
                className={cn(
                  "flex-1 py-2 rounded-lg text-xs font-semibold transition-colors border",
                  frequency === f
                    ? "bg-primary/10 border-primary/40 text-primary"
                    : "bg-muted border-border text-muted-foreground hover:bg-muted/70",
                )}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {frequency === "Weekly" && (
          <div>
            <span className="block text-[11px] text-muted-foreground uppercase font-bold tracking-wider mb-2">
              Send on
            </span>
            <div className="flex gap-1.5">
              {DAYS.map((d, i) => (
                <button
                  key={i}
                  type="button"
                  aria-label={`Toggle day ${i + 1}`}
                  aria-pressed={days.includes(i)}
                  onClick={() => toggleDay(i)}
                  className={cn(
                    "flex-1 aspect-square rounded-lg text-xs font-bold transition-colors",
                    days.includes(i)
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground hover:bg-muted/70",
                  )}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>
        )}

        <div>
          <label htmlFor="schedule-time" className="block text-[11px] text-muted-foreground uppercase font-bold tracking-wider mb-2">
            Time (UTC)
          </label>
          <div className="relative">
            <Clock className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground pointer-events-none" />
            <input
              id="schedule-time"
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full bg-muted border border-border rounded-xl pl-9 pr-3 py-2.5 text-xs text-foreground focus:ring-1 focus:ring-primary/50 focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label htmlFor="schedule-recipients" className="block text-[11px] text-muted-foreground uppercase font-bold tracking-wider mb-2">
            Recipients
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground pointer-events-none" />
            <input
              id="schedule-recipients"
              type="text"
              value={recipients}
              onChange={(e) => setRecipients(e.target.value)}
              placeholder="email@company.com"
              className="w-full bg-muted border border-border rounded-xl pl-9 pr-3 py-2.5 text-xs text-foreground placeholder:text-muted-foreground focus:ring-1 focus:ring-primary/50 focus:outline-none"
            />
          </div>
        </div>
      </div>

      <button
        type="button"
        className="mt-5 w-full rounded-xl bg-primary text-primary-foreground py-2.5 text-sm font-semibold hover:opacity-90 transition-opacity"
      >
        Schedule {frequency.toLowerCase()} report
      </button>
    </div>
  );
}

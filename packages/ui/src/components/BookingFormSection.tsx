"use client";

import React, { useState } from "react";
import { Calendar, Clock, Check } from "lucide-react";
import { cn } from "../lib/cn";

type Day = { label: string; date: string; full: boolean };

const DAYS: Day[] = [
  { label: "Mon", date: "12", full: false },
  { label: "Tue", date: "13", full: false },
  { label: "Wed", date: "14", full: true },
  { label: "Thu", date: "15", full: false },
  { label: "Fri", date: "16", full: false },
];

const TIMES = ["9:00", "10:30", "13:00", "14:30", "16:00", "17:30"];

export interface BookingFormSectionProps {
  className?: string;
}

export function BookingFormSection({ className }: BookingFormSectionProps) {
  const [day, setDay] = useState("13");
  const [time, setTime] = useState("10:30");
  const [booked, setBooked] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setBooked(true);
    window.setTimeout(() => setBooked(false), 2500);
  };

  return (
    <section
      className={cn(
        "w-full max-w-md bg-card/45 backdrop-blur-xl border border-border/50 p-6 rounded-2xl shadow-xl font-sans text-foreground",
        className,
      )}
    >
      <div className="flex items-center gap-2">
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/15 text-primary">
          <Calendar className="w-4 h-4" />
        </span>
        <div>
          <h2 className="text-base font-bold leading-tight">Book an appointment</h2>
          <p className="text-xs text-muted-foreground/65">June 2026 · 30 min session</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="mt-5 space-y-5">
        <fieldset>
          <legend className="mb-2 block text-sm font-medium text-foreground/80">Select a day</legend>
          <div className="grid grid-cols-5 gap-1.5">
            {DAYS.map((d) => {
              const isActive = day === d.date;
              return (
                <button
                  key={d.date}
                  type="button"
                  role="radio"
                  aria-checked={isActive}
                  disabled={d.full}
                  onClick={() => setDay(d.date)}
                  className={cn(
                    "flex flex-col items-center rounded-lg border py-2 transition-colors",
                    d.full && "cursor-not-allowed opacity-35",
                    isActive
                      ? "border-primary/40 bg-primary/15 text-primary"
                      : "border-foreground/[0.08] bg-foreground/[0.02] text-muted-foreground/70 hover:bg-foreground/[0.04]",
                  )}
                >
                  <span className="text-[11px] uppercase">{d.label}</span>
                  <span className="text-base font-bold text-foreground">{d.date}</span>
                </button>
              );
            })}
          </div>
        </fieldset>

        <fieldset>
          <legend className="mb-2 flex items-center gap-1 text-sm font-medium text-foreground/80">
            <Clock className="w-3.5 h-3.5" /> Available times
          </legend>
          <div className="grid grid-cols-3 gap-1.5">
            {TIMES.map((t) => {
              const isActive = time === t;
              return (
                <button
                  key={t}
                  type="button"
                  role="radio"
                  aria-checked={isActive}
                  onClick={() => setTime(t)}
                  className={cn(
                    "rounded-lg border py-2.5 text-sm font-medium transition-colors",
                    isActive
                      ? "border-primary/40 bg-primary/15 text-primary"
                      : "border-foreground/[0.08] bg-foreground/[0.02] text-muted-foreground/70 hover:bg-foreground/[0.04]",
                  )}
                >
                  {t}
                </button>
              );
            })}
          </div>
        </fieldset>

        <button
          type="submit"
          className={cn(
            "flex w-full items-center justify-center gap-1.5 rounded-lg px-4 py-2.5 text-sm font-semibold transition",
            booked
              ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
              : "bg-primary text-primary-foreground hover:brightness-110",
          )}
        >
          {booked ? (
            <>
              <Check className="w-4 h-4" />
              Booked for the {day}th at {time}
            </>
          ) : (
            "Confirm booking"
          )}
        </button>
      </form>
    </section>
  );
}

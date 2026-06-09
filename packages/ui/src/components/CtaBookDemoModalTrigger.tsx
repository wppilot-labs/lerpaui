"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { CalendarDays, Video, ArrowRight, Clock } from "lucide-react";
import { cn } from "../lib/cn";

export interface BookingDay {
  day: string;
  date: number;
  slots: number;
}

export interface CtaBookDemoModalTriggerProps {
  className?: string;
  onSelect?: (slot: string) => void;
  eyebrow?: string;
  title?: string;
  description?: string;
  days?: BookingDay[];
  times?: string[];
}

const DEFAULT_DAYS: BookingDay[] = [
  { day: "Mon", date: 25, slots: 3 },
  { day: "Tue", date: 26, slots: 5 },
  { day: "Wed", date: 27, slots: 0 },
  { day: "Thu", date: 28, slots: 4 },
  { day: "Fri", date: 29, slots: 2 },
];

const DEFAULT_TIMES = ["09:00", "10:30", "13:00", "14:30", "16:00"];

export function CtaBookDemoModalTrigger({
  className,
  onSelect,
  eyebrow = "Live 30-min walkthrough",
  title = "Book a demo",
  description = "See the platform working with your data. Bring your team — we'll tailor the walkthrough to your stack.",
  days = DEFAULT_DAYS,
  times = DEFAULT_TIMES,
}: CtaBookDemoModalTriggerProps) {
  const reduced = useReducedMotion() ?? false;
  const [activeDay, setActiveDay] = React.useState(1);
  const [activeSlot, setActiveSlot] = React.useState<string | null>(null);

  return (
    <section
      aria-label="Book a demo"
      className={cn(
        "w-full overflow-hidden rounded-3xl border bg-card shadow-sm transition-shadow hover:shadow-md",
        className
      )}
    >
      <div className="grid items-stretch lg:grid-cols-2">
        <div className="flex flex-col justify-center px-6 py-16 md:py-24">
          <motion.span
            initial={reduced ? false : { opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex w-fit items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-primary"
          >
            <Video className="h-3 w-3" aria-hidden /> {eyebrow}
          </motion.span>

          <h2 className="mt-5 text-balance text-4xl font-black leading-tight tracking-tight text-foreground sm:text-5xl">
            {title}
          </h2>
          <p className="mt-3 max-w-md text-pretty text-base text-muted-foreground">
            {description}
          </p>

          <ul className="mt-6 space-y-2 text-sm text-muted-foreground">
            <li className="flex items-center gap-2"><Clock className="h-4 w-4 text-primary" aria-hidden /> 30 minutes · video call</li>
            <li className="flex items-center gap-2"><CalendarDays className="h-4 w-4 text-primary" aria-hidden /> Reschedule any time</li>
          </ul>
        </div>

        <div className="border-t bg-muted/20 px-6 py-8 lg:border-l lg:border-t-0">
          <p className="mb-3 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Pick a day</p>
          <div className="mb-5 grid grid-cols-5 gap-2">
            {days.map((d, i) => {
              const disabled = d.slots === 0;
              return (
                <button
                  key={d.date}
                  type="button"
                  disabled={disabled}
                  aria-pressed={activeDay === i}
                  onClick={() => { setActiveDay(i); setActiveSlot(null); }}
                  className={cn(
                    "flex flex-col items-center rounded-xl border px-2 py-2.5 text-xs transition-colors",
                    disabled && "cursor-not-allowed opacity-40",
                    !disabled && activeDay === i && "border-primary bg-primary/10 text-foreground",
                    !disabled && activeDay !== i && "bg-card hover:bg-muted/40"
                  )}
                >
                  <span className="text-[10px] font-medium uppercase text-muted-foreground">{d.day}</span>
                  <span className="text-lg font-semibold tabular-nums text-foreground">{d.date}</span>
                  <span className="text-[9px] text-muted-foreground">{d.slots} open</span>
                </button>
              );
            })}
          </div>

          <p className="mb-3 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Available times</p>
          <div className="mb-5 grid grid-cols-3 gap-2">
            {times.map((t) => (
              <button
                key={t}
                type="button"
                aria-pressed={activeSlot === t}
                onClick={() => setActiveSlot(t)}
                className={cn(
                  "rounded-lg border px-3 py-2 text-sm font-medium transition-colors",
                  activeSlot === t ? "border-primary bg-primary text-primary-foreground shadow-sm shadow-primary/25" : "bg-card text-foreground hover:bg-muted/40"
                )}
              >
                {t}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => activeSlot && onSelect?.(`${days[activeDay].date} @ ${activeSlot}`)}
            disabled={!activeSlot}
            className="group inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {activeSlot ? `Confirm ${activeSlot}` : "Pick a time slot"}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none" aria-hidden />
          </button>
        </div>
      </div>
    </section>
  );
}

export default CtaBookDemoModalTrigger;

"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { ArrowRight, Calendar, Check, ChevronLeft, ChevronRight, Clock, Video } from "lucide-react";
import { Button } from "../components/Button";
import { Container } from "../components/Container";
import { SectionHeader } from "../components/SectionHeader";
import { usePrefersReducedMotion } from "../animation/hooks";
import { cn } from "../lib/cn";

export interface DemoBullet {
  label: string;
}

export interface CtaBookDemoEmbedProps {
  eyebrow?: string;
  title?: string;
  description?: string;
  bullets?: DemoBullet[];
  /** Time slots offered for any selected day. */
  slots?: string[];
  /** Duration label shown alongside the call icon. */
  duration?: string;
  /** Display name of the person taking the call. */
  hostName?: string;
  hostRole?: string;
  hostAvatarColor?: string;
  /** Called when the user confirms a slot. */
  onBook?: (payload: { date: Date; time: string }) => void | Promise<void>;
  className?: string;
}

const DEFAULT_BULLETS: DemoBullet[] = [
  { label: "30-minute live walkthrough on your real workflow" },
  { label: "Token system + theming tailored to your brand" },
  { label: "Migration plan from your current design system" },
  { label: "Roadmap preview and questions answered" },
];

const DEFAULT_SLOTS = ["09:00", "10:30", "11:00", "13:30", "14:00", "15:30", "16:00"];

function startOfMonth(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}

function addMonths(d: Date, n: number): Date {
  return new Date(d.getFullYear(), d.getMonth() + n, 1);
}

function sameDay(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function isWeekend(d: Date): boolean {
  const day = d.getDay();
  return day === 0 || day === 6;
}

function initialsOf(name: string): string {
  return name
    .split(" ")
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

const WEEKDAY_LABELS = ["S", "M", "T", "W", "T", "F", "S"];

export function CtaBookDemoEmbed({
  eyebrow = "Book a demo",
  title = "See Lerpa UI on your own product.",
  description = "30 minutes, your real data, no slides. We walk through migration and theming in front of you.",
  bullets = DEFAULT_BULLETS,
  slots = DEFAULT_SLOTS,
  duration = "30 min",
  hostName = "Mara Choi",
  hostRole = "Solutions Engineer",
  hostAvatarColor = "oklch(0.72 0.18 280)",
  onBook,
  className,
}: CtaBookDemoEmbedProps) {
  const reduced = usePrefersReducedMotion();
  const today = React.useMemo(() => new Date(), []);
  const [viewMonth, setViewMonth] = React.useState<Date>(startOfMonth(today));
  const [selectedDate, setSelectedDate] = React.useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = React.useState<string | null>(null);
  const [confirmed, setConfirmed] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);

  const monthLabel = viewMonth.toLocaleDateString(undefined, { month: "long", year: "numeric" });
  const monthStart = startOfMonth(viewMonth);
  const startWeekday = monthStart.getDay();
  const daysInMonth = new Date(viewMonth.getFullYear(), viewMonth.getMonth() + 1, 0).getDate();

  const grid: Array<Date | null> = React.useMemo(() => {
    const out: Array<Date | null> = [];
    for (let i = 0; i < startWeekday; i++) out.push(null);
    for (let d = 1; d <= daysInMonth; d++) out.push(new Date(viewMonth.getFullYear(), viewMonth.getMonth(), d));
    return out;
  }, [startWeekday, daysInMonth, viewMonth]);

  const canGoPrev = viewMonth > startOfMonth(today);

  const handleConfirm = async () => {
    if (!selectedDate || !selectedTime) return;
    try {
      setSubmitting(true);
      if (onBook) await onBook({ date: selectedDate, time: selectedTime });
      setConfirmed(true);
    } finally {
      setSubmitting(false);
    }
  };

  const slotsForDate = selectedDate ? slots : [];

  return (
    <section className={cn("relative w-full bg-background py-20 sm:py-28", className)}>
      <Container>
        <SectionHeader align="center" tag={eyebrow} title={title} description={description} />

        <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Left: meeting details */}
          <motion.div
            initial={reduced ? false : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-5 flex flex-col gap-5 rounded-2xl border border-border bg-card p-7 text-card-foreground"
          >
            <div className="flex items-center gap-3">
              <span
                className="inline-flex h-12 w-12 items-center justify-center rounded-full text-sm font-bold text-white"
                style={{ background: hostAvatarColor }}
                aria-hidden
              >
                {initialsOf(hostName)}
              </span>
              <div>
                <p className="text-sm font-bold text-foreground">{hostName}</p>
                <p className="text-xs text-muted-foreground">{hostRole}</p>
              </div>
            </div>

            <h3 className="text-xl font-bold tracking-tight text-foreground">Product demo</h3>

            <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5" aria-hidden /> {duration}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Video className="h-3.5 w-3.5" aria-hidden /> Google Meet
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5" aria-hidden /> Mon–Fri
              </span>
            </div>

            <ul className="mt-2 space-y-2.5">
              {bullets.map((b) => (
                <li key={b.label} className="flex items-start gap-2 text-sm leading-relaxed text-foreground/90">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" aria-hidden />
                  {b.label}
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Right: calendar + slot picker */}
          <motion.div
            initial={reduced ? false : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.5, delay: reduced ? 0 : 0.1 }}
            className="lg:col-span-7 flex flex-col gap-5 rounded-2xl border border-border bg-card p-7 text-card-foreground"
          >
            {confirmed ? (
              <div className="flex h-full min-h-[300px] flex-col items-center justify-center gap-3 text-center">
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10">
                  <Check className="h-6 w-6 text-emerald-500" aria-hidden />
                </span>
                <h3 className="text-xl font-bold text-foreground">You&apos;re booked</h3>
                <p className="max-w-sm text-sm text-muted-foreground">
                  Calendar invite headed to your inbox for{" "}
                  <span className="font-semibold text-foreground">
                    {selectedDate?.toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" })}
                  </span>{" "}
                  at{" "}
                  <span className="font-semibold text-foreground">{selectedTime}</span>.
                </p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  {/* Calendar */}
                  <div>
                    <div className="mb-3 flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => canGoPrev && setViewMonth(addMonths(viewMonth, -1))}
                        disabled={!canGoPrev}
                        aria-label="Previous month"
                        className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
                      >
                        <ChevronLeft className="h-4 w-4" aria-hidden />
                      </button>
                      <p className="text-sm font-bold text-foreground" aria-live="polite">
                        {monthLabel}
                      </p>
                      <button
                        type="button"
                        onClick={() => setViewMonth(addMonths(viewMonth, 1))}
                        aria-label="Next month"
                        className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
                      >
                        <ChevronRight className="h-4 w-4" aria-hidden />
                      </button>
                    </div>

                    <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-bold uppercase tracking-wider text-muted-foreground" aria-hidden>
                      {WEEKDAY_LABELS.map((w, i) => (
                        <span key={i} className="py-1">
                          {w}
                        </span>
                      ))}
                    </div>

                    <div role="group" aria-label="Choose a date" className="grid grid-cols-7 gap-1">
                      {grid.map((d, i) => {
                        if (!d) return <span key={`pad-${i}`} aria-hidden />;
                        const isPast = d < new Date(today.getFullYear(), today.getMonth(), today.getDate());
                        const disabled = isPast || isWeekend(d);
                        const isSelected = selectedDate ? sameDay(d, selectedDate) : false;
                        const isToday = sameDay(d, today);
                        return (
                          <button
                            key={d.toISOString()}
                            type="button"
                            aria-pressed={isSelected}
                            aria-label={d.toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" })}
                            disabled={disabled}
                            onClick={() => {
                              setSelectedDate(d);
                              setSelectedTime(null);
                            }}
                            className={cn(
                              "h-9 rounded-md text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50",
                              disabled && "text-muted-foreground/40 cursor-not-allowed",
                              !disabled && !isSelected && "text-foreground hover:bg-muted",
                              isSelected && "bg-primary text-primary-foreground shadow",
                              isToday && !isSelected && "ring-1 ring-primary/40"
                            )}
                          >
                            {d.getDate()}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Slot picker */}
                  <div>
                    <p className="mb-3 text-sm font-bold text-foreground">
                      {selectedDate
                        ? selectedDate.toLocaleDateString(undefined, { weekday: "long", month: "short", day: "numeric" })
                        : "Pick a day"}
                    </p>
                    {selectedDate ? (
                      <div className="grid max-h-[260px] grid-cols-2 gap-2 overflow-y-auto pr-1">
                        {slotsForDate.map((t) => {
                          const isOn = selectedTime === t;
                          return (
                            <button
                              key={t}
                              type="button"
                              onClick={() => setSelectedTime(t)}
                              aria-pressed={isOn}
                              className={cn(
                                "rounded-md border px-3 py-2 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50",
                                isOn
                                  ? "border-primary bg-primary text-primary-foreground"
                                  : "border-border bg-background text-foreground hover:bg-muted"
                              )}
                            >
                              {t}
                            </button>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="flex h-32 items-center justify-center rounded-md border border-dashed border-border text-xs text-muted-foreground">
                        Select a date to see times
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-1 flex flex-col items-center justify-between gap-3 border-t border-border pt-4 sm:flex-row">
                  <p className="text-xs text-muted-foreground">
                    {selectedDate && selectedTime
                      ? `Confirming ${selectedDate.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" })} at ${selectedTime}`
                      : "All times shown in your local timezone."}
                  </p>
                  <Button
                    onClick={handleConfirm}
                    disabled={!selectedDate || !selectedTime || submitting}
                    className="gap-2"
                  >
                    {submitting ? "Booking…" : "Confirm booking"}
                    <ArrowRight className="h-4 w-4" aria-hidden />
                  </Button>
                </div>
              </>
            )}
          </motion.div>
        </div>
      </Container>
    </section>
  );
}

export default CtaBookDemoEmbed;

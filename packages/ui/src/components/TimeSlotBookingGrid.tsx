"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Clock3, Trash2 } from "lucide-react";
import { cn } from "../lib/cn";

const HOURS = Array.from({ length: 12 }).map((_, i) => i + 8); // 8 AM .. 7 PM
const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri"];
const SLOT_PER_HOUR = 2; // 30 min slots
const ROWS = HOURS.length * SLOT_PER_HOUR;

interface Booking {
  id: string;
  day: number;
  start: number;
  end: number;
  label: string;
}

const seedBookings: Booking[] = [
  { id: "b1", day: 0, start: 2, end: 5, label: "Planning" },
  { id: "b2", day: 2, start: 6, end: 10, label: "Workshop" },
  { id: "b3", day: 4, start: 12, end: 15, label: "Review" },
];

function slotToTime(slot: number): string {
  const totalMin = HOURS[0] * 60 + slot * 30;
  const h = Math.floor(totalMin / 60);
  const m = totalMin % 60;
  const suffix = h >= 12 ? "PM" : "AM";
  const hh = ((h + 11) % 12) + 1;
  return `${hh}:${m.toString().padStart(2, "0")} ${suffix}`;
}

export function TimeSlotBookingGrid({ className }: { className?: string }) {
  const [bookings, setBookings] = useState<Booking[]>(seedBookings);
  const [drag, setDrag] = useState<{ day: number; start: number; end: number } | null>(null);
  const dragRef = useRef(drag);
  dragRef.current = drag;

  const finalize = useCallback(() => {
    const d = dragRef.current;
    if (!d) return;
    const lo = Math.min(d.start, d.end);
    const hi = Math.max(d.start, d.end);
    if (hi - lo < 1) {
      setDrag(null);
      return;
    }
    setBookings((prev) => [
      ...prev.filter((b) => !(b.day === d.day && !(b.end <= lo || b.start >= hi + 1))),
      { id: `b-${Date.now()}`, day: d.day, start: lo, end: hi + 1, label: "New Block" },
    ]);
    setDrag(null);
  }, []);

  useEffect(() => {
    const onUp = () => finalize();
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);
    return () => {
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
    };
  }, [finalize]);

  const startDrag = (day: number, slot: number) => setDrag({ day, start: slot, end: slot });
  const extendDrag = (day: number, slot: number) => {
    if (drag && drag.day === day) setDrag({ ...drag, end: slot });
  };

  const removeBooking = (id: string) => setBookings((p) => p.filter((b) => b.id !== id));

  return (
    <div
      className={cn(
        "flex flex-col gap-3 p-6 border border-white/5 bg-zinc-950/40 rounded-2xl shadow-2xl w-full max-w-[560px] text-white",
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-1 font-mono select-none">
          <span className="text-[9px] uppercase tracking-widest font-bold text-primary">TIME_SLOT_GRID</span>
          <span className="text-[8px] text-white/40 uppercase font-semibold">Drag to book a slot</span>
        </div>
        <div className="flex items-center gap-1.5 text-[10px] font-mono text-white/40">
          <Clock3 className="w-3 h-3" /> 30-min increments
        </div>
      </div>

      <div className="grid grid-cols-[40px_repeat(5,1fr)] gap-0.5 select-none">
        <div />
        {DAYS.map((d) => (
          <div key={d} className="text-center text-[10px] font-mono uppercase text-white/50 pb-1">
            {d}
          </div>
        ))}

        {Array.from({ length: HOURS.length }).map((_, hi) => (
          <React.Fragment key={`row-${hi}`}>
            <div className="text-[9px] font-mono text-white/30 text-right pr-1 pt-0.5 h-10">
              {HOURS[hi]}
            </div>
            {DAYS.map((_, di) => {
              const top = hi * SLOT_PER_HOUR;
              return (
                <div
                  key={`cell-${di}-${hi}`}
                  className="relative h-10 border border-white/5 rounded-sm bg-white/[0.015] overflow-hidden"
                >
                  {[0, 1].map((sub) => {
                    const slot = top + sub;
                    return (
                      <button
                        type="button"
                        key={sub}
                        aria-label={`Book ${DAYS[di]} ${slotToTime(slot)}`}
                        onPointerDown={(e) => {
                          e.preventDefault();
                          startDrag(di, slot);
                        }}
                        onPointerEnter={() => extendDrag(di, slot)}
                        className="absolute left-0 right-0 h-1/2 cursor-crosshair hover:bg-white/5"
                        style={{ top: `${sub * 50}%` }}
                      />
                    );
                  })}
                </div>
              );
            })}
          </React.Fragment>
        ))}

        <div />
        <div className="col-span-5 relative pointer-events-none" style={{ marginTop: `-${ROWS * 40 + 1}px`, height: `${ROWS * 40}px` }}>
          <AnimatePresence>
            {bookings.map((b) => (
              <motion.div
                key={b.id}
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.92 }}
                transition={{ type: "spring", stiffness: 300, damping: 24 }}
                className="absolute pointer-events-auto rounded-md bg-primary/25 border border-primary/60 text-[9px] font-mono p-1.5 flex flex-col justify-between"
                style={{
                  left: `${(b.day / DAYS.length) * 100}%`,
                  width: `${100 / DAYS.length}%`,
                  top: `${(b.start / ROWS) * 100}%`,
                  height: `${((b.end - b.start) / ROWS) * 100}%`,
                }}
              >
                <div className="flex items-start justify-between gap-1">
                  <span className="font-semibold text-primary truncate">{b.label}</span>
                  <button
                    type="button"
                    onClick={() => removeBooking(b.id)}
                    aria-label={`Remove ${b.label}`}
                    className="p-0.5 rounded hover:bg-white/10 cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
                  >
                    <Trash2 className="w-2.5 h-2.5 text-white/60" />
                  </button>
                </div>
                <span className="text-white/60 text-[8px]">{slotToTime(b.start)}</span>
              </motion.div>
            ))}
            {drag && Math.abs(drag.end - drag.start) >= 0 && (
              <motion.div
                key="drag-preview"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute rounded-md bg-cyan-400/25 border border-cyan-400/60 pointer-events-none"
                style={{
                  left: `${(drag.day / DAYS.length) * 100}%`,
                  width: `${100 / DAYS.length}%`,
                  top: `${(Math.min(drag.start, drag.end) / ROWS) * 100}%`,
                  height: `${((Math.abs(drag.end - drag.start) + 1) / ROWS) * 100}%`,
                }}
              />
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

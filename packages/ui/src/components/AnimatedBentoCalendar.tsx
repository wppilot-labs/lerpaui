"use client";

import React, { useState } from "react";
import { motion, AnimatePresence} from "framer-motion";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, Plus, X } from "lucide-react";
import { cn } from "../lib/cn";

interface Event {
  id: string;
  title: string;
  time: string;
  category: "work" | "personal" | "finance" | "other";
}

const CATEGORY_COLORS = {
  work: "bg-purple-500 shadow-purple-500/50",
  personal: "bg-emerald-500 shadow-emerald-500/50",
  finance: "bg-amber-500 shadow-amber-500/50",
  other: "bg-blue-500 shadow-blue-500/50",
};

export function AnimatedBentoCalendar({ className }: { className?: string }) {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 4, 22)); // May 2026 as starting date
  const [selectedDate, setSelectedDate] = useState<number | null>(22);
  const [slideDirection, setSlideDirection] = useState<"left" | "right">("right");
  const [showDrawer, setShowDrawer] = useState(false);

  // Mock events list for May 2026
  const [events, setEvents] = useState<Record<number, Event[]>>({
    10: [
      { id: "1", title: "Corporate Design Alignment", time: "10:00 AM", category: "work" },
      { id: "2", title: "Investments Portfolio Rebalance", time: "02:30 PM", category: "finance" },
    ],
    15: [{ id: "3", title: "Family Dinner Social", time: "07:00 PM", category: "personal" }],
    22: [
      { id: "4", title: "Lerpa UI Docs Delivery", time: "11:00 AM", category: "work" },
      { id: "5", title: "Gym Session & Training", time: "06:00 PM", category: "personal" },
    ],
    28: [{ id: "6", title: "Monthly Bills & Ledger Review", time: "09:00 AM", category: "finance" }],
  });

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const daysOfWeek = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

  // Helper to count days in month
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const totalDays = getDaysInMonth(year, month);
  const startDayIndex = getFirstDayOfMonth(year, month);

  const prevMonth = () => {
    setSlideDirection("left");
    setCurrentDate(new Date(year, month - 1, 1));
    setSelectedDate(null);
  };

  const nextMonth = () => {
    setSlideDirection("right");
    setCurrentDate(new Date(year, month + 1, 1));
    setSelectedDate(null);
  };

  const activeEvents = selectedDate ? events[selectedDate] || [] : [];

  const handleDateClick = (day: number) => {
    setSelectedDate(day);
    if (events[day]) {
      setShowDrawer(true);
    }
  };

  const variants = {
    enter: (direction: "left" | "right") => ({
      x: direction === "right" ? 50 : -50,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: "left" | "right") => ({
      x: direction === "right" ? -50 : 50,
      opacity: 0,
    }),
  };

  return (
    <div
      className={cn(
        "relative w-full max-w-[340px] h-[380px] rounded-2xl bg-zinc-950/80 border border-white/10 p-5 flex flex-col justify-between overflow-hidden shadow-2xl backdrop-blur-xl select-none text-white",
        className
      )}
    >
      {/* Dynamic Background Glow */}
      <div className="absolute -top-16 -right-16 w-32 h-32 rounded-full bg-purple-500/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-16 -left-16 w-32 h-32 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />

      {/* Header Panel */}
      <div className="relative z-10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-white/5 border border-white/10">
            <CalendarIcon className="w-4 h-4 text-purple-400" />
          </div>
          <div>
            <h3 className="text-sm font-bold tracking-tight">
              {monthNames[month]} {year}
            </h3>
            <p className="text-[10px] text-zinc-400 font-mono">BENTO_CALENDAR_V1</p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={prevMonth}
            className="p-1 rounded-md bg-white/5 hover:bg-white/10 border border-white/5 active:scale-95 transition-all cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4 text-zinc-300" />
          </button>
          <button
            onClick={nextMonth}
            className="p-1 rounded-md bg-white/5 hover:bg-white/10 border border-white/5 active:scale-95 transition-all cursor-pointer"
          >
            <ChevronRight className="w-4 h-4 text-zinc-300" />
          </button>
        </div>
      </div>

      {/* Days Grid Wrapper */}
      <div className="relative z-10 flex-1 flex flex-col justify-center mt-3 overflow-hidden">
        {/* Days Header */}
        <div className="grid grid-cols-7 text-center text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-2">
          {daysOfWeek.map((day, idx) => (
            <div key={idx}>{day}</div>
          ))}
        </div>

        <AnimatePresence mode="popLayout" custom={slideDirection}>
          <motion.div
            key={month}
            custom={slideDirection}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="grid grid-cols-7 gap-1"
          >
            {/* Blank placeholders */}
            {Array.from({ length: startDayIndex }).map((_, idx) => (
              <div key={`empty-${idx}`} className="h-8" />
            ))}

            {/* Date items */}
            {Array.from({ length: totalDays }).map((_, idx) => {
              const day = idx + 1;
              const hasEvents = !!events[day];
              const isSelected = selectedDate === day;
              const isToday = day === 22 && month === 4 && year === 2026; // Highlight mock today

              return (
                <motion.button
                  key={`day-${day}`}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleDateClick(day)}
                  className={cn(
                    "relative h-8 rounded-lg flex flex-col items-center justify-center text-xs font-mono border transition-all duration-200 cursor-pointer",
                    isSelected
                      ? "bg-purple-600/30 border-purple-500 text-white font-bold"
                      : isToday
                      ? "bg-white/10 border-white/30 text-white font-bold"
                      : "bg-white/5 hover:bg-white/10 border-transparent text-zinc-300 hover:text-white"
                  )}
                >
                  <span>{day}</span>
                  {hasEvents && (
                    <span className="absolute bottom-1 w-1 h-1 rounded-full bg-purple-400" />
                  )}
                </motion.button>
              );
            })}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Quick Summary Footer */}
      <div className="relative z-10 border-t border-white/5 pt-3 mt-2 flex items-center justify-between text-[11px] text-zinc-400">
        <span className="flex items-center gap-1 font-mono">
          <Clock className="w-3.5 h-3.5 text-zinc-500" />
          <span>Active Tasks: {Object.keys(events).reduce((acc, k) => acc + events[Number(k)].length, 0)}</span>
        </span>
        <button
          onClick={() => {
            const currentDay = selectedDate || 22;
            const newTitle = prompt("Enter custom event title:");
            if (newTitle) {
              const newEv: Event = {
                id: Math.random().toString(),
                title: newTitle,
                time: "12:00 PM",
                category: "work",
              };
              setEvents((prev) => ({
                ...prev,
                [currentDay]: [...(prev[currentDay] || []), newEv],
              }));
              setSelectedDate(currentDay);
              setShowDrawer(true);
            }
          }}
          className="flex items-center gap-0.5 text-purple-400 hover:text-purple-300 transition-colors font-medium cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Schedule</span>
        </button>
      </div>

      {/* Slide-Up Event Drawer */}
      <AnimatePresence>
        {showDrawer && (
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 20, stiffness: 200 }}
            className="absolute inset-x-0 bottom-0 h-[65%] bg-zinc-950/95 border-t border-white/15 rounded-t-2xl p-4 flex flex-col justify-between z-20 backdrop-blur-2xl"
          >
            <div className="flex items-center justify-between pb-2 border-b border-white/5">
              <h4 className="text-xs font-bold font-mono text-purple-400 uppercase">
                Events for May {selectedDate}
              </h4>
              <button
                onClick={() => setShowDrawer(false)}
                className="p-1 rounded-md hover:bg-white/5 cursor-pointer transition-colors"
              >
                <X className="w-4 h-4 text-zinc-400" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto mt-2 space-y-2 pr-1">
              {activeEvents.length > 0 ? (
                activeEvents.map((ev) => (
                  <div
                    key={ev.id}
                    className="p-2 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between gap-2"
                  >
                    <div className="flex items-center gap-2">
                      <span className={cn("w-1.5 h-6 rounded-full", CATEGORY_COLORS[ev.category])} />
                      <div>
                        <p className="text-xs font-medium text-white">{ev.title}</p>
                        <p className="text-[10px] text-zinc-400 font-mono">{ev.time}</p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-zinc-500 gap-1 mt-4">
                  <CalendarIcon className="w-6 h-6 stroke-1" />
                  <p className="text-[10px] font-mono">NO EVENTS SCHEDULED</p>
                </div>
              )}
            </div>

            <button
              onClick={() => setShowDrawer(false)}
              className="w-full py-1.5 mt-2 rounded-xl bg-purple-600 hover:bg-purple-500 font-medium text-xs text-white transition-all active:scale-98 cursor-pointer text-center"
            >
              Close Details
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

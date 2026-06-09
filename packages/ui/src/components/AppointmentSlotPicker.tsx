"use client";

import React, { useState } from "react";
import { motion} from "framer-motion";
import { Calendar, Clock, Check } from "lucide-react";
import { cn } from "../lib/cn";

export function AppointmentSlotPicker({ className }: { className?: string }) {
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);

  const slots = [
    "09:00 AM",
    "10:30 AM",
    "11:00 AM",
    "01:30 PM",
    "03:00 PM",
    "04:30 PM"
  ];

  return (
    <div className={cn("w-full max-w-sm rounded-2xl border border-border/80 bg-card/40 p-5 backdrop-blur-xl shadow-2xl space-y-4", className)}>
      <div className="flex items-center justify-between pb-2 border-b border-border/30">
        <div>
          <h3 className="text-sm font-bold text-foreground">Appointment Booking</h3>
          <p className="text-[10px] text-muted-foreground">Select an active hourly slot below</p>
        </div>
        <Calendar className="w-4 h-4 text-primary" />
      </div>

      <div className="grid grid-cols-2 gap-2">
        {slots.map((slot, idx) => {
          const isSelected = selectedSlot === slot;
          return (
            <motion.button
              key={slot}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              onClick={() => setSelectedSlot(slot)}
              className={cn(
                "flex items-center justify-between px-3.5 py-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer",
                isSelected
                  ? "bg-primary/20 border-primary text-primary shadow-[0_0_12px_rgba(59,130,246,0.2)]"
                  : "bg-zinc-900/30 border-border/40 text-muted-foreground hover:text-foreground hover:bg-zinc-900/60"
              )}
            >
              <div className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 shrink-0" />
                <span>{slot}</span>
              </div>
              {isSelected && <Check className="w-3.5 h-3.5 shrink-0" />}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

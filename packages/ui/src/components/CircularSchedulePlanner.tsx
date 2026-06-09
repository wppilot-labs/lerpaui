"use client";

import React, { useState } from "react";

import { Clock, Sun } from "lucide-react";
import { cn } from "../lib/cn";

interface ScheduledBlock {
  id: string;
  startHour: number; // 0-23
  endHour: number;
  label: string;
  type: "work" | "personal" | "sleep" | "other";
}

const TYPE_COLORS = {
  work: "stroke-purple-500 fill-purple-500/10",
  personal: "stroke-emerald-500 fill-emerald-500/10",
  sleep: "stroke-indigo-500 fill-indigo-500/10",
  other: "stroke-amber-500 fill-amber-500/10",
};

export function CircularSchedulePlanner({ className }: { className?: string }) {
  const [schedule, setSchedule] = useState<ScheduledBlock[]>([
    { id: "1", startHour: 0, endHour: 7, label: "Night Sleep", type: "sleep" },
    { id: "2", startHour: 9, endHour: 17, label: "Core Engineering", type: "work" },
    { id: "3", startHour: 18, endHour: 20, label: "Gym & Recreation", type: "personal" },
  ]);
  const [selectedType, setSelectedType] = useState<"work" | "personal" | "sleep" | "other">("work");
  const [newLabel, setNewLabel] = useState("");

  const handleAddBlock = (start: number, end: number) => {
    if (start >= end) return;
    const newBlock: ScheduledBlock = {
      id: Math.random().toString(),
      startHour: start,
      endHour: end,
      label: newLabel || `${selectedType.toUpperCase()} BLOCK`,
      type: selectedType,
    };
    setSchedule((prev) => [...prev, newBlock]);
    setNewLabel("");
  };

  // Convert hours (0-23) to radial angles (0-360 degrees)
  const getAngle = (hour: number) => (hour * 15 - 90) * (Math.PI / 180);

  // SVG Path generator for arc sectors
  const describeArc = (x: number, y: number, radius: number, startHour: number, endHour: number) => {
    const startAngle = getAngle(startHour);
    const endAngle = getAngle(endHour);

    const x1 = x + radius * Math.cos(startAngle);
    const y1 = y + radius * Math.sin(startAngle);
    const x2 = x + radius * Math.cos(endAngle);
    const y2 = y + radius * Math.sin(endAngle);

    const largeArcFlag = endHour - startHour <= 12 ? "0" : "1";

    return [
      "M", x, y,
      "L", x1, y1,
      "A", radius, radius, 0, largeArcFlag, 1, x2, y2,
      "Z"
    ].join(" ");
  };

  return (
    <div
      className={cn(
        "relative w-full max-w-[340px] rounded-2xl bg-zinc-950/80 border border-white/10 p-5 flex flex-col justify-between overflow-hidden shadow-2xl backdrop-blur-xl select-none text-white",
        className
      )}
    >
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full bg-purple-500/5 blur-3xl pointer-events-none" />

      {/* Header Info */}
      <div className="relative z-10 flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-white/5 border border-white/10">
            <Clock className="w-4 h-4 text-purple-400" />
          </div>
          <div>
            <h3 className="text-sm font-bold tracking-tight">Chronos Dial</h3>
            <p className="text-[10px] text-zinc-400 font-mono">CIRCULAR_PLANNER_V1</p>
          </div>
        </div>

        <div className="flex items-center gap-1 text-[9px] font-mono text-zinc-500 bg-white/5 border border-white/5 px-2 py-0.5 rounded-full">
          <Sun className="w-3 h-3 text-amber-400" />
          <span>24HR_DIAL</span>
        </div>
      </div>

      {/* Circular SVG Dial Arena */}
      <div className="relative z-10 w-full aspect-square flex items-center justify-center py-2">
        <svg className="w-52 h-52 overflow-visible transform rotate-0" viewBox="0 0 200 200">
          {/* Base dial track backing ring */}
          <circle cx="100" cy="100" r="85" className="stroke-white/5 stroke-[8] fill-none" />

          {/* Hour tick marks */}
          {Array.from({ length: 24 }).map((_, idx) => {
            const angle = getAngle(idx);
            const x1 = 100 + 80 * Math.cos(angle);
            const y1 = 100 + 80 * Math.sin(angle);
            const x2 = 100 + 86 * Math.cos(angle);
            const y2 = 100 + 86 * Math.sin(angle);

            const isMajor = idx % 6 === 0;

            return (
              <line
                key={idx}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                className={cn(isMajor ? "stroke-white/30 stroke-1" : "stroke-white/10 stroke-[0.5]")}
              />
            );
          })}

          {/* Render active scheduled segments */}
          {schedule.map((block) => (
            <path
              key={block.id}
              d={describeArc(100, 100, 85, block.startHour, block.endHour)}
              className={cn("stroke-2 transition-all duration-300", TYPE_COLORS[block.type])}
            />
          ))}

          {/* Concentric Text/Indicators inside the Circle */}
          <g transform="translate(100,100)" className="text-center font-mono">
            {/* Total Allocated Hours indicator */}
            <text y="-5" className="fill-white text-[18px] font-bold text-center" textAnchor="middle">
              {schedule.reduce((acc, b) => acc + (b.endHour - b.startHour), 0)} Hrs
            </text>
            <text y="15" className="fill-zinc-500 text-[8px] font-bold tracking-widest text-center" textAnchor="middle">
              ALLOCATED
            </text>
          </g>
        </svg>
      </div>

      {/* Control Actions & Scheduling Forms */}
      <div className="relative z-10 space-y-3 mt-2 border-t border-white/5 pt-3">
        {/* Category tag selection */}
        <div className="grid grid-cols-4 gap-1">
          {(["work", "personal", "sleep", "other"] as const).map((tp) => (
            <button
              key={tp}
              onClick={() => setSelectedType(tp)}
              className={cn(
                "py-1 rounded-lg text-[9px] font-bold uppercase font-mono tracking-wider border transition-all cursor-pointer",
                selectedType === tp
                  ? "bg-white/10 border-purple-500 text-purple-400"
                  : "bg-white/5 border-transparent text-zinc-500 hover:text-zinc-300"
              )}
            >
              {tp}
            </button>
          ))}
        </div>

        {/* Input box scheduler */}
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Event Label..."
            value={newLabel}
            onChange={(e) => setNewLabel(e.target.value)}
            className="flex-1 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs focus:outline-none focus:border-purple-500 placeholder-zinc-700 transition-colors"
          />
          <button
            onClick={() => {
              const startVal = prompt("Enter Start Hour (0-23):");
              const endVal = prompt("Enter End Hour (1-24):");
              if (startVal !== null && endVal !== null) {
                const s = parseInt(startVal, 10);
                const e = parseInt(endVal, 10);
                if (!isNaN(s) && !isNaN(e)) {
                  handleAddBlock(s, e);
                }
              }
            }}
            className="px-3 rounded-xl bg-purple-600 hover:bg-purple-500 font-bold text-xs transition-colors cursor-pointer"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
}

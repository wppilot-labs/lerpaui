"use client";

import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { CalendarDays, Users, Video } from "lucide-react";
import { cn } from "../lib/cn";

interface AgendaEvent {
  id: string;
  start: number;
  end: number;
  title: string;
  attendees: string[];
  color: "primary" | "violet" | "cyan" | "amber" | "pink";
}

const SAMPLE: AgendaEvent[] = [
  { id: "e1", start: 9.0, end: 10.5, title: "Standup + Sprint Review", attendees: ["Ada", "Lin", "Theo"], color: "primary" },
  { id: "e2", start: 9.5, end: 11.0, title: "Design Pairing", attendees: ["Ada", "Mia"], color: "violet" },
  { id: "e3", start: 11.5, end: 12.25, title: "Customer Call - Atlas", attendees: ["Ada", "Sam"], color: "cyan" },
  { id: "e4", start: 13.0, end: 14.0, title: "Lunch + Reading", attendees: ["You"], color: "amber" },
  { id: "e5", start: 13.5, end: 15.0, title: "RFC Review", attendees: ["Theo", "Mia", "Lin"], color: "pink" },
  { id: "e6", start: 15.25, end: 16.5, title: "1:1 with Lin", attendees: ["Ada", "Lin"], color: "primary" },
];

const COLOR_CLASSES: Record<AgendaEvent["color"], { bar: string; chip: string; text: string }> = {
  primary: { bar: "bg-primary", chip: "bg-primary/15 border-primary/40", text: "text-primary" },
  violet: { bar: "bg-violet-400", chip: "bg-violet-500/15 border-violet-400/40", text: "text-violet-300" },
  cyan: { bar: "bg-cyan-400", chip: "bg-cyan-500/15 border-cyan-400/40", text: "text-cyan-300" },
  amber: { bar: "bg-amber-400", chip: "bg-amber-500/15 border-amber-400/40", text: "text-amber-300" },
  pink: { bar: "bg-pink-400", chip: "bg-pink-500/15 border-pink-400/40", text: "text-pink-300" },
};

const HOUR_START = 8;
const HOUR_END = 18;
const HOUR_PX = 56;

interface LaneEvent extends AgendaEvent {
  lane: number;
  laneCount: number;
}

function assignLanes(events: AgendaEvent[]): LaneEvent[] {
  const sorted = [...events].sort((a, b) => a.start - b.start);
  const lanes: { end: number }[] = [];
  const placed: LaneEvent[] = sorted.map((e) => {
    let laneIdx = lanes.findIndex((l) => l.end <= e.start);
    if (laneIdx === -1) {
      lanes.push({ end: e.end });
      laneIdx = lanes.length - 1;
    } else {
      lanes[laneIdx].end = e.end;
    }
    return { ...e, lane: laneIdx, laneCount: 0 };
  });
  const clusters: LaneEvent[][] = [];
  let cluster: LaneEvent[] = [];
  let clusterEnd = 0;
  for (const ev of placed.sort((a, b) => a.start - b.start)) {
    if (cluster.length === 0 || ev.start < clusterEnd) {
      cluster.push(ev);
      clusterEnd = Math.max(clusterEnd, ev.end);
    } else {
      clusters.push(cluster);
      cluster = [ev];
      clusterEnd = ev.end;
    }
  }
  if (cluster.length) clusters.push(cluster);
  clusters.forEach((c) => {
    const count = Math.max(...c.map((e) => e.lane + 1));
    c.forEach((e) => (e.laneCount = count));
  });
  return placed;
}

function formatHour(h: number): string {
  const hh = Math.floor(h);
  const mm = Math.round((h - hh) * 60);
  const suffix = hh >= 12 ? "PM" : "AM";
  const display = ((hh + 11) % 12) + 1;
  return `${display}:${mm.toString().padStart(2, "0")} ${suffix}`;
}

export function MeetingDayAgenda({ className }: { className?: string }) {
  const [active, setActive] = useState<string | null>("e3");
  const laneEvents = useMemo(() => assignLanes(SAMPLE), []);

  return (
    <div
      className={cn(
        "flex flex-col gap-3 p-6 border border-white/5 bg-zinc-950/40 rounded-2xl shadow-2xl w-full max-w-[460px] text-white",
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-1 font-mono select-none">
          <span className="text-[9px] uppercase tracking-widest font-bold text-primary">DAY_AGENDA</span>
          <span className="text-[8px] text-white/40 uppercase font-semibold">Overlap-aware lanes</span>
        </div>
        <div className="flex items-center gap-1.5 text-[10px] font-mono text-white/50">
          <CalendarDays className="w-3 h-3" /> Mon May 25
        </div>
      </div>

      <div className="relative grid grid-cols-[40px_1fr] gap-2" style={{ height: `${(HOUR_END - HOUR_START) * HOUR_PX}px` }}>
        <div className="relative">
          {Array.from({ length: HOUR_END - HOUR_START + 1 }).map((_, i) => {
            const h = HOUR_START + i;
            return (
              <div
                key={h}
                className="absolute right-1 text-[9px] font-mono text-white/40"
                style={{ top: `${i * HOUR_PX - 4}px` }}
              >
                {formatHour(h)}
              </div>
            );
          })}
        </div>

        <div className="relative border-l border-white/10">
          {Array.from({ length: HOUR_END - HOUR_START }).map((_, i) => (
            <div
              key={i}
              className="absolute left-0 right-0 border-t border-white/5"
              style={{ top: `${i * HOUR_PX}px` }}
            />
          ))}

          <div
            className="absolute left-0 right-0 h-px bg-primary/70 z-20"
            style={{ top: `${(11.75 - HOUR_START) * HOUR_PX}px` }}
          >
            <div className="absolute -left-1 -top-[3px] w-2 h-2 rounded-full bg-primary shadow-[0_0_10px_rgba(201,255,55,0.7)]" />
          </div>

          {laneEvents.map((e) => {
            const colors = COLOR_CLASSES[e.color];
            const top = (e.start - HOUR_START) * HOUR_PX;
            const height = (e.end - e.start) * HOUR_PX - 4;
            const widthPct = 100 / e.laneCount;
            const leftPct = e.lane * widthPct;
            const isActive = active === e.id;
            return (
              <motion.button
                key={e.id}
                type="button"
                onClick={() => setActive(e.id)}
                whileHover={{ scale: 1.01 }}
                aria-label={`${e.title} from ${formatHour(e.start)} to ${formatHour(e.end)}`}
                aria-selected={isActive}
                className={cn(
                  "absolute rounded-md border text-left p-2 overflow-hidden cursor-pointer transition-shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                  colors.chip,
                  isActive ? "ring-1 ring-white/30 shadow-lg z-10" : "z-0"
                )}
                style={{
                  top: `${top}px`,
                  height: `${height}px`,
                  left: `calc(${leftPct}% + 2px)`,
                  width: `calc(${widthPct}% - 4px)`,
                }}
              >
                <div className={cn("absolute left-0 top-0 bottom-0 w-0.5", colors.bar)} />
                <div className="pl-1.5 flex flex-col h-full">
                  <span className={cn("text-[10px] font-semibold leading-tight truncate", colors.text)}>{e.title}</span>
                  <span className="text-[8px] font-mono text-white/50 mt-0.5">{formatHour(e.start)}</span>
                  {height > 36 && (
                    <div className="mt-auto flex items-center gap-1 text-[8px] font-mono text-white/40">
                      <Users className="w-2.5 h-2.5" />
                      <span>{e.attendees.length}</span>
                      {e.attendees.length > 1 && <Video className="w-2.5 h-2.5 ml-1" />}
                    </div>
                  )}
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

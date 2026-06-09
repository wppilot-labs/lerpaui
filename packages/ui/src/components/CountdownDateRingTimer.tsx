"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, useSpring, useTransform } from "framer-motion";
import { Rocket, Pause, Play } from "lucide-react";
import { cn } from "../lib/cn";

interface Segment {
  label: string;
  max: number;
  color: string;
  trackColor: string;
}

const SEGMENTS: Segment[] = [
  { label: "DAYS", max: 30, color: "stroke-primary", trackColor: "stroke-primary/15" },
  { label: "HRS", max: 24, color: "stroke-violet-400", trackColor: "stroke-violet-400/15" },
  { label: "MIN", max: 60, color: "stroke-cyan-400", trackColor: "stroke-cyan-400/15" },
  { label: "SEC", max: 60, color: "stroke-amber-400", trackColor: "stroke-amber-400/15" },
];

const SIZE = 220;
const STROKE_W = 8;
const GAP = 5;
const RADII = SEGMENTS.map((_, i) => SIZE / 2 - 14 - i * (STROKE_W + GAP));

function diffParts(target: Date, now: Date) {
  const ms = Math.max(0, target.getTime() - now.getTime());
  const totalSec = Math.floor(ms / 1000);
  const days = Math.floor(totalSec / 86400);
  const hours = Math.floor((totalSec % 86400) / 3600);
  const minutes = Math.floor((totalSec % 3600) / 60);
  const seconds = totalSec % 60;
  return { days, hours, minutes, seconds, ms };
}

function Ring({ radius, progress, segment }: { radius: number; progress: number; segment: Segment }) {
  const circumference = 2 * Math.PI * radius;
  const spring = useSpring(progress, { stiffness: 60, damping: 18 });
  useEffect(() => {
    spring.set(progress);
  }, [progress, spring]);
  const dashOffset = useTransform(spring, (v) => circumference * (1 - v));
  return (
    <>
      <circle
        cx={SIZE / 2}
        cy={SIZE / 2}
        r={radius}
        fill="none"
        strokeWidth={STROKE_W}
        className={segment.trackColor}
      />
      <motion.circle
        cx={SIZE / 2}
        cy={SIZE / 2}
        r={radius}
        fill="none"
        strokeWidth={STROKE_W}
        strokeLinecap="round"
        strokeDasharray={circumference}
        style={{ strokeDashoffset: dashOffset, rotate: -90, transformOrigin: `${SIZE / 2}px ${SIZE / 2}px` }}
        className={segment.color}
      />
    </>
  );
}

export function CountdownDateRingTimer({ className }: { className?: string }) {
  const target = useMemo(() => new Date(2026, 5, 20, 9, 0, 0), []);
  const [now, setNow] = useState(() => new Date(2026, 4, 25, 12, 0, 0));
  const [running, setRunning] = useState(true);
  const rafRef = useRef<number | null>(null);
  const startRealRef = useRef<number>(Date.now());
  const startVirtualRef = useRef<number>(new Date(2026, 4, 25, 12, 0, 0).getTime());

  useEffect(() => {
    if (!running) return;
    const tick = () => {
      const elapsed = Date.now() - startRealRef.current;
      const virtual = startVirtualRef.current + elapsed * 60;
      setNow(new Date(virtual));
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    };
  }, [running]);

  const togglePause = () => {
    if (running) {
      setRunning(false);
    } else {
      startRealRef.current = Date.now();
      startVirtualRef.current = now.getTime();
      setRunning(true);
    }
  };

  const parts = diffParts(target, now);
  const values = [parts.days, parts.hours, parts.minutes, parts.seconds];
  const progresses = values.map((v, i) => Math.min(1, v / SEGMENTS[i].max));

  return (
    <div
      className={cn(
        "flex flex-col gap-3 p-6 border border-white/5 bg-zinc-950/40 rounded-2xl shadow-2xl w-full max-w-[340px] text-white items-center",
        className
      )}
    >
      <div className="w-full flex items-start justify-between">
        <div className="flex flex-col gap-1 font-mono select-none">
          <span className="text-[9px] uppercase tracking-widest font-bold text-primary">COUNTDOWN_RING</span>
          <span className="text-[8px] text-white/40 uppercase font-semibold">Launch · {target.toLocaleDateString("en", { month: "short", day: "numeric" })}</span>
        </div>
        <button
          type="button"
          onClick={togglePause}
          aria-label={running ? "Pause timer" : "Resume timer"}
          className="p-1.5 rounded-md border border-white/10 hover:bg-white/5 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          {running ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
        </button>
      </div>

      <div className="relative" style={{ width: SIZE, height: SIZE }}>
        <svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`}>
          {SEGMENTS.map((seg, i) => (
            <Ring key={seg.label} radius={RADII[i]} progress={progresses[i]} segment={seg} />
          ))}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <Rocket className="w-4 h-4 text-primary mb-1" />
          <motion.div
            key={parts.days}
            initial={{ scale: 0.92, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 360, damping: 18 }}
            className="text-3xl font-mono font-bold tabular-nums"
          >
            {parts.days}
            <span className="text-xs text-white/40 ml-1">d</span>
          </motion.div>
          <div className="text-[10px] font-mono text-white/50 tabular-nums">
            {String(parts.hours).padStart(2, "0")}:{String(parts.minutes).padStart(2, "0")}:{String(parts.seconds).padStart(2, "0")}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-1.5 w-full">
        {SEGMENTS.map((s, i) => (
          <div key={s.label} className="flex flex-col items-center p-1.5 rounded-md border border-white/5 bg-white/[0.02]">
            <span className="text-[9px] font-mono text-white/40">{s.label}</span>
            <span className="text-xs font-mono font-bold text-white tabular-nums">{values[i]}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

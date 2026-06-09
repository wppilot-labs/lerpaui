"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Truck, Clock, Zap } from "lucide-react";
import { cn } from "../lib/cn";

export interface CartShippingCountdownTimerProps {
  className?: string;
  cutoffMinutes?: number;
}

function diff(now: Date, target: Date) {
  const ms = target.getTime() - now.getTime();
  const total = Math.max(0, Math.floor(ms / 1000));
  return {
    total,
    h: Math.floor(total / 3600),
    m: Math.floor((total % 3600) / 60),
    s: total % 60,
  };
}

function pad(n: number) {
  return n.toString().padStart(2, "0");
}

function formatTomorrow(target: Date) {
  return target.toLocaleDateString(undefined, {
    weekday: "long",
    month: "short",
    day: "numeric",
  });
}

export function CartShippingCountdownTimer({
  className,
  cutoffMinutes = 5 * 60 + 23,
}: CartShippingCountdownTimerProps) {
  const cutoff = useMemo(() => {
    const d = new Date();
    d.setSeconds(d.getSeconds() + cutoffMinutes * 60);
    return d;
  }, [cutoffMinutes]);

  const delivery = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d;
  }, []);

  const [now, setNow] = useState(() => new Date());
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    timer.current = setInterval(() => setNow(new Date()), 1000);
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, []);

  const t = diff(now, cutoff);
  const startTotal = cutoffMinutes * 60;
  const progress = startTotal === 0 ? 0 : Math.max(0, Math.min(1, t.total / startTotal));
  const expired = t.total === 0;

  return (
    <div
      className={cn(
        "flex flex-col gap-3 p-6 border border-white/5 bg-zinc-950/40 rounded-2xl shadow-2xl w-full max-w-sm text-foreground select-none",
        className
      )}
      role="region"
      aria-label="Shipping cutoff countdown"
    >
      <div className="flex flex-col gap-1 font-mono select-none">
        <span className="text-[9px] uppercase tracking-widest font-bold text-primary">SHIP_BY_CUTOFF</span>
        <span className="text-[8px] text-white/40 uppercase font-semibold">Live ticker for next-day delivery</span>
      </div>

      <div className="flex items-center gap-3">
        <div className={cn(
          "p-2.5 rounded-xl border",
          expired ? "bg-red-500/10 text-red-400 border-red-500/30" : "bg-accent-soft text-accent border-accent/30"
        )}>
          {expired ? <Clock className="w-5 h-5" aria-hidden="true" /> : <Truck className="w-5 h-5" aria-hidden="true" />}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-text">
            {expired ? "Cutoff passed" : "Order in the next"}
          </p>
          <p className="text-[10px] text-text-3 font-mono">
            for delivery <span className="text-accent">{formatTomorrow(delivery)}</span>
          </p>
        </div>
      </div>

      <div
        className="grid grid-cols-3 gap-2 font-mono"
        role="timer"
        aria-live="polite"
        aria-label={`${t.h} hours ${t.m} minutes ${t.s} seconds remaining`}
      >
        {[
          { v: t.h, l: "hrs" },
          { v: t.m, l: "min" },
          { v: t.s, l: "sec" },
        ].map((cell, i) => (
          <div
            key={i}
            className="rounded-xl border border-edge bg-bg-3 p-2.5 flex flex-col items-center"
          >
            <motion.span
              key={cell.v}
              initial={{ y: -6, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.18 }}
              className={cn(
                "text-2xl font-bold tabular-nums leading-none",
                expired ? "text-red-400" : "text-text"
              )}
            >
              {pad(cell.v)}
            </motion.span>
            <span className="text-[9px] uppercase tracking-widest text-text-3 mt-1">{cell.l}</span>
          </div>
        ))}
      </div>

      <div className="h-1.5 rounded-full bg-bg-3 overflow-hidden" aria-hidden="true">
        <div
          className={cn(
            "h-full transition-[width] duration-1000 ease-linear",
            expired ? "bg-red-500/70" : "bg-accent shadow-[0_0_8px_var(--accent-glow)]"
          )}
          style={{ width: `${progress * 100}%` }}
        />
      </div>

      <p className="text-[9px] text-text-4 font-mono flex items-center gap-1">
        <Zap className="w-3 h-3 text-amber" aria-hidden="true" />
        {expired ? "Switching to standard 2-day shipping" : "Locked in once you check out"}
      </p>
    </div>
  );
}

"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Activity, Loader2, Wifi } from "lucide-react";
import { cn } from "../lib/cn";

interface LogRow {
  id: number;
  ts: string;
  service: string;
  level: "info" | "warn" | "error" | "debug";
  latency: number;
  endpoint: string;
}

const SERVICES = ["edge", "auth", "billing", "queue", "store", "stream"];
const ENDPOINTS = ["/v1/users", "/v1/charge", "/v1/feed", "/v1/auth", "/health", "/v1/upload"];
const LEVELS: LogRow["level"][] = ["info", "info", "info", "warn", "error", "debug"];

function seed(n: number, offset = 0): LogRow[] {
  const rows: LogRow[] = [];
  for (let i = 0; i < n; i++) {
    const idx = offset + i;
    rows.push({
      id: idx,
      ts: new Date(Date.now() - idx * 1300).toISOString().slice(11, 19),
      service: SERVICES[idx % SERVICES.length],
      level: LEVELS[(idx * 7) % LEVELS.length],
      latency: 30 + ((idx * 53) % 470),
      endpoint: ENDPOINTS[(idx * 3) % ENDPOINTS.length],
    });
  }
  return rows;
}

const ROW_H = 30;
const VIEW_H = 280;
const OVERSCAN = 6;

export function VirtualizedInfiniteScrollTable({ className }: { className?: string }) {
  const [rows, setRows] = useState<LogRow[]>(() => seed(80));
  const [scrollTop, setScrollTop] = useState(0);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const rafRef = useRef<number | null>(null);

  const total = rows.length;
  const startIdx = Math.max(0, Math.floor(scrollTop / ROW_H) - OVERSCAN);
  const endIdx = Math.min(total, Math.ceil((scrollTop + VIEW_H) / ROW_H) + OVERSCAN);
  const visible = useMemo(() => rows.slice(startIdx, endIdx), [rows, startIdx, endIdx]);

  const onScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    if (rafRef.current != null) return;
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = null;
      const st = el.scrollTop;
      setScrollTop(st);
      const remaining = el.scrollHeight - st - el.clientHeight;
      if (remaining < 120 && !loading) {
        setLoading(true);
      }
    });
  }, [loading]);

  useEffect(() => {
    if (!loading) return;
    const t = window.setTimeout(() => {
      setRows((prev) => [...prev, ...seed(40, prev.length)]);
      setLoading(false);
    }, 520);
    return () => window.clearTimeout(t);
  }, [loading]);

  useEffect(() => {
    return () => {
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const levelColor: Record<LogRow["level"], string> = {
    info: "text-sky-400",
    warn: "text-amber-400",
    error: "text-rose-400",
    debug: "text-zinc-500",
  };

  return (
    <div
      className={cn(
        "relative w-full max-w-[560px] rounded-2xl bg-zinc-950/80 border border-white/10 p-5 flex flex-col overflow-hidden shadow-2xl backdrop-blur-xl select-none text-white",
        className
      )}
    >
      <div className="absolute -top-12 right-6 w-40 h-40 rounded-full bg-cyan-500/5 blur-3xl pointer-events-none" />

      <div className="relative z-10 flex items-center justify-between mb-3">
        <div className="flex flex-col gap-1 font-mono select-none">
          <span className="text-[9px] uppercase tracking-widest font-bold text-primary">VIRTUAL_STREAM</span>
          <span className="text-[8px] text-white/40 uppercase font-semibold">windowed log table · infinite scroll</span>
        </div>
        <div className="flex items-center gap-1.5 text-[9px] font-mono text-cyan-400/80">
          <Wifi className="w-3 h-3" />
          <span>{total.toLocaleString()}_ROWS</span>
        </div>
      </div>

      <div className="relative z-10 grid grid-cols-[60px_70px_70px_1fr_60px] gap-2 px-3 py-1.5 text-[9px] uppercase tracking-wider font-mono text-zinc-500 border-b border-white/5 bg-white/[0.02] rounded-t-lg">
        <span>Time</span>
        <span>Svc</span>
        <span>Lvl</span>
        <span>Endpoint</span>
        <span className="text-right">ms</span>
      </div>

      <div
        ref={scrollRef}
        onScroll={onScroll}
        role="grid"
        aria-rowcount={total}
        className="relative z-10 overflow-y-auto border-x border-b border-white/5 rounded-b-lg bg-white/[0.01]"
        style={{ height: VIEW_H }}
      >
        <div style={{ height: total * ROW_H, position: "relative" }}>
          {visible.map((row, i) => {
            const idx = startIdx + i;
            return (
              <div
                key={row.id}
                role="row"
                aria-rowindex={idx + 1}
                className="grid grid-cols-[60px_70px_70px_1fr_60px] gap-2 px-3 items-center text-[10px] font-mono border-b border-white/[0.03] hover:bg-white/[0.04]"
                style={{ position: "absolute", top: idx * ROW_H, left: 0, right: 0, height: ROW_H }}
              >
                <span className="text-zinc-500">{row.ts}</span>
                <span className="text-zinc-300">{row.service}</span>
                <span className={cn("uppercase font-bold", levelColor[row.level])}>{row.level}</span>
                <span className="text-white truncate">{row.endpoint}</span>
                <span
                  className={cn(
                    "text-right",
                    row.latency > 400 ? "text-rose-400" : row.latency > 200 ? "text-amber-400" : "text-emerald-400"
                  )}
                >
                  {row.latency}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="relative z-10 mt-3 flex items-center justify-between text-[10px] font-mono text-zinc-400">
        <span className="flex items-center gap-1">
          <Activity className="w-3 h-3 text-cyan-400" />
          rendered {visible.length}/{total}
        </span>
        <span className="flex items-center gap-1.5 text-cyan-300">
          {loading ? (
            <>
              <motion.span animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.9, ease: "linear" }}>
                <Loader2 className="w-3 h-3" />
              </motion.span>
              fetching...
            </>
          ) : (
            <span className="text-zinc-500">scroll to load more</span>
          )}
        </span>
      </div>
    </div>
  );
}

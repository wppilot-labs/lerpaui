"use client";

import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, ThumbsUp, ThumbsDown, ShieldCheck, Loader2 } from "lucide-react";
import { cn } from "../lib/cn";
import { useShouldAnimate } from "../animation/hooks";

interface SummaryPoint {
  label: string;
  count: number;
  kind: "pro" | "con";
}

const POINTS: SummaryPoint[] = [
  { label: "True to size", count: 412, kind: "pro" },
  { label: "Premium materials", count: 318, kind: "pro" },
  { label: "Comfortable all day", count: 271, kind: "pro" },
  { label: "Ships fast & well packed", count: 198, kind: "pro" },
  { label: "Runs slightly warm", count: 47, kind: "con" },
  { label: "Color a touch darker IRL", count: 22, kind: "con" },
];

export interface AIReviewSummaryCardProps {
  className?: string;
  confidence?: number;
  basedOn?: number;
}

export function AIReviewSummaryCard({ className, confidence = 0.94, basedOn = 1283 }: AIReviewSummaryCardProps) {
  const [containerRef, shouldAnimate] = useShouldAnimate<HTMLDivElement>();
  const [streamed, setStreamed] = useState(0);
  const summary = useMemo(
    () =>
      "Customers consistently praise the build quality and accurate sizing. Most repeat buyers cite all-day comfort and rapid shipping. Common nitpick: a slightly warm feel in hot weather.",
    [],
  );

  useEffect(() => {
    if (!shouldAnimate) {
      setStreamed(summary.length);
      return;
    }
    setStreamed(0);
    let i = 0;
    const id = window.setInterval(() => {
      i += 2;
      setStreamed(i);
      if (i >= summary.length) window.clearInterval(id);
    }, 24);
    return () => window.clearInterval(id);
  }, [shouldAnimate, summary]);

  const pros = POINTS.filter((p) => p.kind === "pro");
  const cons = POINTS.filter((p) => p.kind === "con");
  const pct = Math.round(confidence * 100);

  return (
    <div
      ref={containerRef}
      className={cn(
        "w-full max-w-sm bg-card/45 backdrop-blur-xl border border-border/50 p-5 rounded-2xl shadow-xl select-none font-sans text-foreground",
        className,
      )}
    >
      <div className="flex flex-col gap-1 font-mono select-none mb-4">
        <span className="text-[9px] uppercase tracking-widest font-bold text-primary">AI_REVIEW_DIGEST</span>
        <span className="text-[8px] text-white/40 uppercase font-semibold">Synthesised from {basedOn.toLocaleString()} verified reviews</span>
      </div>

      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-1.5">
          <div className="relative w-6 h-6 rounded-md bg-gradient-to-br from-violet-500/40 to-fuchsia-500/40 border border-violet-400/30 flex items-center justify-center">
            <Sparkles className="w-3.5 h-3.5 text-violet-200" />
            {streamed < summary.length && (
              <Loader2
                className="w-2.5 h-2.5 text-violet-100 absolute -top-0.5 -right-0.5"
                style={{ animation: "ai-spin-slow 1.6s linear infinite" }}
              />
            )}
          </div>
          <span className="text-[10px] uppercase tracking-wider font-bold text-violet-300">AI Summary</span>
        </div>
        <span
          className="text-[9px] uppercase font-bold px-1.5 py-0.5 rounded border flex items-center gap-1"
          style={{
            color: `hsl(${140} 70% 70%)`,
            background: `hsla(${140} 70% 40% / 0.12)`,
            borderColor: `hsla(${140} 70% 40% / 0.3)`,
          }}
        >
          <ShieldCheck className="w-2.5 h-2.5" /> {pct}% confident
        </span>
      </div>

      <p className="text-xs text-foreground/85 leading-relaxed mb-4 min-h-[3.75rem]">
        {summary.slice(0, streamed)}
        {streamed < summary.length && (
          <span
            className="inline-block w-1 h-3 bg-violet-400 ml-0.5 align-middle"
            style={{ animation: "ai-caret-blink 1s infinite" }}
          />
        )}
      </p>

      <div className="grid grid-cols-2 gap-2 mb-3">
        <div className="rounded-lg bg-emerald-500/[0.06] border border-emerald-500/15 p-2">
          <div className="flex items-center gap-1 mb-1.5">
            <ThumbsUp className="w-3 h-3 text-emerald-400" />
            <span className="text-[9px] uppercase font-bold text-emerald-300 tracking-wider">Loved</span>
          </div>
          <ul className="space-y-1">
            {pros.map((p, i) => (
              <motion.li
                key={p.label}
                initial={{ opacity: 0, x: -4 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.06 + 0.2 }}
                className="flex items-baseline justify-between gap-1.5 text-[10px]"
              >
                <span className="text-foreground/80 truncate">{p.label}</span>
                <span className="text-emerald-300/80 font-mono shrink-0">{p.count}</span>
              </motion.li>
            ))}
          </ul>
        </div>

        <div className="rounded-lg bg-rose-500/[0.06] border border-rose-500/15 p-2">
          <div className="flex items-center gap-1 mb-1.5">
            <ThumbsDown className="w-3 h-3 text-rose-400" />
            <span className="text-[9px] uppercase font-bold text-rose-300 tracking-wider">Watch-outs</span>
          </div>
          <ul className="space-y-1">
            {cons.map((p, i) => (
              <motion.li
                key={p.label}
                initial={{ opacity: 0, x: -4 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.06 + 0.32 }}
                className="flex items-baseline justify-between gap-1.5 text-[10px]"
              >
                <span className="text-foreground/80 truncate">{p.label}</span>
                <span className="text-rose-300/80 font-mono shrink-0">{p.count}</span>
              </motion.li>
            ))}
          </ul>
        </div>
      </div>

      <div className="flex items-center justify-between text-[9px] text-muted-foreground/60 font-mono">
        <span>Updated 2h ago · model v2.4</span>
        <button className="uppercase font-bold text-primary hover:underline focus-visible:underline">View sources</button>
      </div>
    </div>
  );
}

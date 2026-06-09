"use client";

import React, { useEffect, useRef, useState } from "react";
import { Sparkles, Square } from "lucide-react";
import { cn } from "../lib/cn";
import { usePrefersReducedMotion } from "../animation/hooks";

const FULL =
  "Sure — here's a quick plan. First, audit the current onboarding funnel to find the steepest drop-off. Then ship a guided checklist and measure activation week over week.";

export interface AiStreamingResponseSectionProps {
  className?: string;
}

export function AiStreamingResponseSection({ className }: AiStreamingResponseSectionProps) {
  const reduced = usePrefersReducedMotion();
  const [count, setCount] = useState(reduced ? FULL.length : 0);
  const [streaming, setStreaming] = useState(!reduced);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (reduced) {
      setCount(FULL.length);
      setStreaming(false);
      return;
    }
    timer.current = setInterval(() => {
      setCount((c) => {
        if (c >= FULL.length) {
          if (timer.current) clearInterval(timer.current);
          setStreaming(false);
          return c;
        }
        return c + 2;
      });
    }, 45);
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, [reduced]);

  const stop = () => {
    if (timer.current) clearInterval(timer.current);
    setStreaming(false);
    setCount(FULL.length);
  };

  return (
    <div
      className={cn(
        "w-full max-w-xl bg-card/45 backdrop-blur-xl border border-border/50 rounded-2xl shadow-xl p-5 font-sans text-foreground",
        className,
      )}
    >
      <div className="flex items-center gap-2 mb-3">
        <div className="h-8 w-8 rounded-lg bg-primary/15 text-primary grid place-items-center">
          <Sparkles className="w-4 h-4" />
        </div>
        <span className="text-sm font-bold">Assistant</span>
        {streaming && (
          <span className="flex items-center gap-1 text-xs text-sky-400">
            <span className="h-1.5 w-1.5 rounded-full bg-sky-400 animate-pulse" /> Generating…
          </span>
        )}
      </div>

      <p className="text-sm leading-relaxed text-foreground/90 min-h-[4.5rem]">
        {FULL.slice(0, count)}
        {streaming && (
          <span className="inline-block w-[2px] h-[1.05em] -mb-[0.15em] ml-0.5 bg-primary animate-pulse align-middle" />
        )}
      </p>

      <div className="mt-3 flex justify-end">
        <button
          type="button"
          onClick={stop}
          disabled={!streaming}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border border-foreground/[0.08] text-muted-foreground/80 hover:bg-foreground/[0.05] transition disabled:opacity-40 disabled:pointer-events-none"
        >
          <Square className="w-3.5 h-3.5 fill-current" /> Stop
        </button>
      </div>
    </div>
  );
}

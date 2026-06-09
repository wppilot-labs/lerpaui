"use client";

import React, { useState, useRef, useLayoutEffect } from "react";
import { motion } from "framer-motion";
import { cn } from "../lib/cn";

interface MorphingTabIndicatorProps {
  className?: string;
}

const TABS = [
  { id: "overview", label: "Overview" },
  { id: "engagement", label: "Engagement Metrics" },
  { id: "rev", label: "Revenue" },
  { id: "logs", label: "Logs" },
  { id: "settings", label: "Settings" },
];

export function MorphingTabIndicator({ className }: MorphingTabIndicatorProps) {
  const [active, setActive] = useState("engagement");
  const refs = useRef<Record<string, HTMLButtonElement | null>>({});
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [bar, setBar] = useState({ left: 0, width: 0 });

  useLayoutEffect(() => {
    const el = refs.current[active];
    const c = containerRef.current;
    if (!el || !c) return;
    const elRect = el.getBoundingClientRect();
    const cRect = c.getBoundingClientRect();
    setBar({ left: elRect.left - cRect.left, width: elRect.width });
  }, [active]);

  return (
    <div className={cn("flex flex-col items-center justify-center gap-4 p-6 border border-white/5 bg-zinc-950/40 rounded-2xl shadow-2xl w-full", className)}>
      <div className="flex flex-col gap-1 font-mono select-none w-full">
        <span className="text-[9px] uppercase tracking-widest font-bold text-primary">MORPHING_TAB_INDICATOR</span>
        <span className="text-[8px] text-white/40 uppercase font-semibold">Underline adapts width per tab via measure + spring</span>
      </div>

      <div ref={containerRef} role="tablist" className="relative flex w-full items-end justify-start gap-1 overflow-x-auto border-b border-white/10">
        {TABS.map((t) => {
          const isActive = active === t.id;
          return (
            <button
              key={t.id}
              ref={(el) => { refs.current[t.id] = el; }}
              role="tab"
              aria-selected={isActive}
              onClick={() => setActive(t.id)}
              className={cn(
                "relative whitespace-nowrap px-3 py-2 text-xs font-semibold transition-colors duration-200",
                isActive ? "text-white" : "text-white/50 hover:text-white/80",
              )}
            >
              {t.label}
            </button>
          );
        })}
        <motion.span
          aria-hidden="true"
          className="pointer-events-none absolute bottom-0 h-[2px] rounded-full bg-primary"
          initial={false}
          animate={{ left: bar.left, width: bar.width }}
          transition={{ type: "spring", stiffness: 420, damping: 36 }}
        />
      </div>

      <div className="self-start text-[10px] font-mono text-white/40 uppercase tracking-widest">
        view: <span className="text-primary">{active}</span>
      </div>
    </div>
  );
}

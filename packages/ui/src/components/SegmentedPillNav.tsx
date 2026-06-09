"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Inbox, Star, Send, Archive } from "lucide-react";
import { cn } from "../lib/cn";

interface SegmentedPillNavProps {
  className?: string;
}

const ITEMS = [
  { id: "inbox", label: "Inbox", icon: Inbox, count: 12 },
  { id: "starred", label: "Starred", icon: Star, count: 3 },
  { id: "sent", label: "Sent", icon: Send, count: null },
  { id: "archive", label: "Archive", icon: Archive, count: 84 },
];

export function SegmentedPillNav({ className }: SegmentedPillNavProps) {
  const [active, setActive] = useState("inbox");

  return (
    <div className={cn("flex flex-col items-center justify-center gap-4 p-6 border border-white/5 bg-zinc-950/40 rounded-2xl shadow-2xl", className)}>
      <div className="flex flex-col gap-1 font-mono select-none w-full">
        <span className="text-[9px] uppercase tracking-widest font-bold text-primary">SEGMENTED_PILL_NAV</span>
        <span className="text-[8px] text-white/40 uppercase font-semibold">Spring-morph indicator with shared layoutId</span>
      </div>

      <div
        role="tablist"
        aria-label="Mailbox folders"
        className="relative flex items-center gap-1 rounded-full border border-white/10 bg-black/40 p-1 backdrop-blur-md"
      >
        {ITEMS.map((it) => {
          const isActive = active === it.id;
          const Icon = it.icon;
          return (
            <button
              key={it.id}
              role="tab"
              aria-selected={isActive}
              onClick={() => setActive(it.id)}
              className={cn(
                "relative z-10 inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors duration-200",
                isActive ? "text-black" : "text-white/60 hover:text-white",
              )}
            >
              {isActive && (
                <motion.span
                  layoutId="segmented-pill"
                  className="absolute inset-0 rounded-full bg-white shadow-lg"
                  transition={{ type: "spring", stiffness: 380, damping: 32 }}
                />
              )}
              <span className="relative z-10 flex items-center gap-1.5">
                <Icon className="h-3.5 w-3.5" />
                {it.label}
                {it.count !== null && (
                  <span className={cn(
                    "rounded-full px-1.5 py-0.5 text-[9px] font-mono leading-none",
                    isActive ? "bg-black/15 text-black" : "bg-white/10 text-white/70",
                  )}>
                    {it.count}
                  </span>
                )}
              </span>
            </button>
          );
        })}
      </div>

      <div className="text-[10px] font-mono text-white/40 uppercase tracking-widest">
        active: <span className="text-primary">{active}</span>
      </div>
    </div>
  );
}

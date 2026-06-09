"use client";

import React from "react";
import { Clock, History } from "lucide-react";
import { cn } from "../lib/cn";

type Viewed = { id: string; name: string; price: number; seen: string; tone: string };

const VIEWED: Viewed[] = [
  { id: "v1", name: "Trail Sneaker", price: 119, seen: "Just now", tone: "from-sky-400/30 to-blue-500/20" },
  { id: "v2", name: "Field Watch", price: 245, seen: "5m ago", tone: "from-emerald-400/30 to-teal-500/20" },
  { id: "v3", name: "Canvas Belt", price: 38, seen: "1h ago", tone: "from-amber-400/30 to-orange-500/20" },
  { id: "v4", name: "Wool Socks 3pk", price: 22, seen: "Yesterday", tone: "from-rose-400/30 to-pink-500/20" },
  { id: "v5", name: "Leather Wallet", price: 64, seen: "Yesterday", tone: "from-violet-400/30 to-purple-500/20" },
];

export interface EcommerceRecentlyViewedProps {
  className?: string;
}

export function EcommerceRecentlyViewed({ className }: EcommerceRecentlyViewedProps) {
  return (
    <div className={cn("w-full max-w-md bg-card/45 backdrop-blur-xl border border-border/50 p-4 rounded-2xl shadow-xl font-sans text-foreground", className)}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="inline-flex items-center gap-1.5 text-base font-bold">
          <History className="w-4 h-4 text-muted-foreground/60" /> Recently viewed
        </h3>
        <button type="button" className="text-xs text-muted-foreground/55 hover:text-foreground transition">Clear</button>
      </div>

      <ul className="space-y-1.5">
        {VIEWED.map((v) => (
          <li key={v.id}>
            <button type="button" className="flex w-full items-center gap-3 rounded-lg p-2 hover:bg-foreground/[0.03] transition text-left">
              <div className={cn("h-12 w-12 shrink-0 rounded-lg bg-gradient-to-br border border-foreground/[0.05]", v.tone)} />
              <div className="min-w-0 flex-1">
                <div className="text-sm font-semibold truncate">{v.name}</div>
                <div className="inline-flex items-center gap-1 text-xs text-muted-foreground/45">
                  <Clock className="w-3 h-3" /> {v.seen}
                </div>
              </div>
              <span className="text-sm font-bold shrink-0">${v.price}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

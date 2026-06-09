"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, MapPin, CheckCircle2 } from "lucide-react";
import { cn } from "../lib/cn";
import { useShouldAnimate } from "../animation/hooks";

interface Purchase {
  id: number;
  name: string;
  city: string;
  product: string;
  ago: string;
  hue: number;
}

const POOL: Omit<Purchase, "id" | "ago">[] = [
  { name: "Jane", city: "Paris", product: "Linen Wrap Coat", hue: 320 },
  { name: "Hiro", city: "Tokyo", product: "Ceramic Pour-Over", hue: 195 },
  { name: "Liam", city: "Dublin", product: "Merino Crew", hue: 145 },
  { name: "Aïsha", city: "Casablanca", product: "Brass Hoops", hue: 38 },
  { name: "Sofia", city: "Lisbon", product: "Suede Loafer", hue: 280 },
  { name: "Noah", city: "Toronto", product: "Walnut Desk Tray", hue: 25 },
  { name: "Mira", city: "Bengaluru", product: "Silk Scrunchie 3-Pack", hue: 340 },
  { name: "Ben", city: "Sydney", product: "Field Cap Olive", hue: 105 },
];

const TIME_OPTIONS = ["just now", "1m ago", "2m ago", "4m ago"];

export interface LiveRecentPurchasesToastFeedProps {
  className?: string;
  intervalMs?: number;
  maxVisible?: number;
}

export function LiveRecentPurchasesToastFeed({
  className,
  intervalMs = 2600,
  maxVisible = 3,
}: LiveRecentPurchasesToastFeedProps) {
  const [containerRef, shouldAnimate] = useShouldAnimate<HTMLDivElement>();
  const [feed, setFeed] = useState<Purchase[]>(() =>
    POOL.slice(0, maxVisible).map((p, i) => ({ ...p, id: i, ago: TIME_OPTIONS[i % TIME_OPTIONS.length] })),
  );
  const [seq, setSeq] = useState(maxVisible);

  useEffect(() => {
    if (!shouldAnimate) return;
    const id = window.setInterval(() => {
      setFeed((prev) => {
        const pick = POOL[Math.floor(Math.random() * POOL.length)];
        const next: Purchase = {
          ...pick,
          id: seq + 1,
          ago: "just now",
        };
        setSeq((s) => s + 1);
        const updated = [next, ...prev.map((p, i) => ({ ...p, ago: TIME_OPTIONS[Math.min(i + 1, TIME_OPTIONS.length - 1)] }))];
        return updated.slice(0, maxVisible);
      });
    }, intervalMs);
    return () => window.clearInterval(id);
  }, [shouldAnimate, intervalMs, maxVisible, seq]);

  return (
    <div
      ref={containerRef}
      className={cn(
        "w-full max-w-sm bg-card/45 backdrop-blur-xl border border-border/50 p-5 rounded-2xl shadow-xl select-none font-sans text-foreground",
        className,
      )}
    >
      <div className="flex flex-col gap-1 font-mono select-none mb-3">
        <span className="text-[9px] uppercase tracking-widest font-bold text-primary">LIVE_PURCHASE_FEED</span>
        <span className="text-[8px] text-white/40 uppercase font-semibold">Bottom-corner social proof toasts</span>
      </div>

      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-1.5">
          <span className="relative flex w-2 h-2">
            <span
              className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"
              style={{ animation: "pulse-dot 1.4s ease-in-out infinite" }}
            />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
          </span>
          <span className="text-[10px] uppercase font-bold text-emerald-300 tracking-wider">Live · last hour</span>
        </div>
        <span className="text-[9px] font-mono text-muted-foreground tabular-nums">{seq} orders</span>
      </div>

      <div
        aria-live="polite"
        aria-label="Recent purchases"
        className="relative h-56 rounded-xl bg-black/30 border border-white/[0.04] overflow-hidden p-3"
      >
        <div className="absolute inset-x-0 top-0 h-6 bg-gradient-to-b from-card/70 to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-card/70 to-transparent z-10 pointer-events-none" />
        <ul className="flex flex-col-reverse gap-2 absolute inset-x-3 bottom-3">
          <AnimatePresence initial={false}>
            {feed.map((p) => (
              <motion.li
                key={p.id}
                layout
                initial={{ opacity: 0, y: 32, scale: 0.94 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, x: -24, scale: 0.94 }}
                transition={{ type: "spring", stiffness: 380, damping: 32, mass: 0.6 }}
                className="flex items-center gap-2.5 p-2 pr-3 rounded-xl bg-white/[0.04] border border-white/[0.06] backdrop-blur-sm shadow-lg"
              >
                <div
                  className="w-8 h-8 rounded-lg shrink-0 flex items-center justify-center border"
                  style={{
                    background: `linear-gradient(135deg, hsl(${p.hue} 70% 55% / 0.35), hsl(${(p.hue + 40) % 360} 70% 45% / 0.35))`,
                    borderColor: `hsl(${p.hue} 70% 55% / 0.4)`,
                  }}
                  aria-hidden="true"
                >
                  <ShoppingBag className="w-3.5 h-3.5 text-white/90" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] text-foreground leading-tight">
                    <span className="font-bold">{p.name}</span>
                    <span className="text-muted-foreground/70"> in </span>
                    <span className="inline-flex items-center gap-0.5 font-medium">
                      <MapPin className="w-2.5 h-2.5 inline-block" />
                      {p.city}
                    </span>
                  </p>
                  <p className="text-[10px] text-muted-foreground/80 truncate">
                    bought <span className="text-foreground/85 font-medium">{p.product}</span>
                  </p>
                </div>
                <div className="flex flex-col items-end shrink-0">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400 mb-0.5" />
                  <span className="text-[9px] text-muted-foreground/70 font-mono whitespace-nowrap">{p.ago}</span>
                </div>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      </div>
    </div>
  );
}

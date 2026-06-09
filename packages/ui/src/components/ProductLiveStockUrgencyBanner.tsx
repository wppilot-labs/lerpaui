"use client";

import React, { useEffect, useRef, useState } from "react";
import { Eye, Flame, ShoppingCart, Truck } from "lucide-react";
import { cn } from "../lib/cn";

export interface ProductLiveStockUrgencyBannerProps {
  className?: string;
  initialStock?: number;
  initialWatching?: number;
  productName?: string;
}

export function ProductLiveStockUrgencyBanner({
  className,
  initialStock = 4,
  initialWatching = 14,
  productName = "Aurora Studio Headphones",
}: ProductLiveStockUrgencyBannerProps) {
  const [stock, setStock] = useState(initialStock);
  const [watching, setWatching] = useState(initialWatching);
  const [recentBuy, setRecentBuy] = useState<string | null>(null);
  const buyTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const wTimer = window.setInterval(() => {
      setWatching((w) => {
        const drift = Math.round((Math.random() - 0.5) * 3);
        const next = w + drift;
        return Math.max(6, Math.min(28, next));
      });
    }, 2400);

    const bTimer = window.setInterval(() => {
      const cities = ["Berlin", "Osaka", "Austin", "Lagos", "Lima", "Oslo"];
      const city = cities[Math.floor(Math.random() * cities.length)];
      setRecentBuy(`${city} just bought one`);
      setStock((s) => Math.max(1, s - 1));
      if (buyTimer.current) clearTimeout(buyTimer.current);
      buyTimer.current = setTimeout(() => setRecentBuy(null), 3600);
    }, 7000);

    return () => {
      window.clearInterval(wTimer);
      window.clearInterval(bTimer);
      if (buyTimer.current) clearTimeout(buyTimer.current);
    };
  }, []);

  const critical = stock <= 3;

  return (
    <div
      className={cn(
        "w-full max-w-sm bg-card/45 backdrop-blur-xl border border-white/5 rounded-2xl shadow-2xl select-none overflow-hidden text-foreground p-4 flex flex-col gap-3",
        className,
      )}
      role="region"
      aria-label={`Stock urgency for ${productName}`}
    >
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1 font-mono select-none">
          <span className="text-[9px] uppercase tracking-widest font-bold text-primary">
            URGENCY_BANNER
          </span>
          <span className="text-[8px] text-white/40 uppercase font-semibold">
            Live social proof · auto-ticking
          </span>
        </div>
        <Flame
          className={cn(
            "w-4 h-4",
            critical ? "text-pink motion-safe:animate-pulse" : "text-amber",
          )}
          aria-hidden="true"
        />
      </div>

      <div
        className={cn(
          "rounded-xl p-3 border flex items-center justify-between gap-3 transition-colors",
          critical
            ? "bg-pink/10 border-pink/30"
            : "bg-amber/10 border-amber/30",
        )}
      >
        <div className="flex items-center gap-2.5">
          <span
            className={cn(
              "relative inline-flex w-2.5 h-2.5 rounded-full",
              critical ? "bg-pink" : "bg-amber",
            )}
            aria-hidden="true"
          >
            <span
              className={cn(
                "absolute inset-0 rounded-full opacity-60 motion-safe:animate-ping",
                critical ? "bg-pink" : "bg-amber",
              )}
            />
          </span>
          <div>
            <div
              className={cn(
                "text-[11.5px] font-extrabold",
                critical ? "text-pink" : "text-amber",
              )}
              aria-live="polite"
            >
              {critical ? `Only ${stock} left` : `${stock} in stock`}
            </div>
            <div className="text-[9.5px] text-white/50 font-mono">
              ships within 24 hours
            </div>
          </div>
        </div>
        <div className="text-right">
          <div
            className="flex items-center gap-1 text-[11px] font-bold text-foreground"
            aria-live="polite"
            aria-atomic="true"
          >
            <Eye className="w-3 h-3 text-white/60" aria-hidden="true" />
            <span className="tabular-nums">{watching}</span>
          </div>
          <div className="text-[9.5px] text-white/50 font-mono">
            watching now
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between text-[10px] font-mono text-white/60">
        <div className="flex items-center gap-1.5">
          <Truck className="w-3 h-3 text-primary" aria-hidden="true" />
          <span>Free 2-day shipping</span>
        </div>
        <div
          className="min-h-[14px] flex items-center gap-1.5"
          aria-live="polite"
        >
          {recentBuy && (
            <>
              <ShoppingCart
                className="w-3 h-3 text-primary"
                aria-hidden="true"
              />
              <span className="text-primary">{recentBuy}</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

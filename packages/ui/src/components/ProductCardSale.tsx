"use client";

import React, { useEffect, useState } from "react";
import { Sparkles, ArrowRight } from "lucide-react";

export interface ProductCardSaleProps {
  name?: string;
  salePrice?: number;
  regularPrice?: number;
  expiresInSeconds?: number;
  onClaim?: () => void;
}

function formatTime(sec: number) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${s < 10 ? "0" : ""}${s}`;
}

export function ProductCardSale({
  name = "Apex Starter Bundle",
  salePrice = 69.0,
  regularPrice = 129.0,
  expiresInSeconds = 3600,
  onClaim,
}: ProductCardSaleProps) {
  const [seconds, setSeconds] = useState(expiresInSeconds);

  useEffect(() => {
    if (seconds <= 0) return;
    const timer = window.setInterval(() => {
      setSeconds((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => window.clearInterval(timer);
  }, [seconds]);

  const expired = seconds === 0;

  return (
    <div
      className="w-full max-w-xs bg-card/45 backdrop-blur-xl border border-pink-500/20 rounded-2xl shadow-xl select-none font-sans overflow-hidden text-foreground"
      role="region"
      aria-label={`Flash sale: ${name}`}
    >
      <div className="p-4 relative">
        <div className="flex justify-between items-center mb-3">
          <span className="text-[9px] font-extrabold uppercase bg-pink-500/10 text-pink-400 px-2 py-0.5 rounded border border-pink-500/20">
            Flash Sale
          </span>
          <span
            className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded border ${expired
              ? "text-muted-foreground/60 bg-muted/20 border-muted/40"
              : "text-pink-300 bg-pink-500/5 border-pink-500/10"
              }`}
            aria-live="polite"
          >
            {expired ? "expired" : formatTime(seconds)}
          </span>
        </div>

        <div className="h-28 bg-secondary/20 rounded-xl mb-3 flex items-center justify-center">
          <Sparkles className="w-8 h-8 text-pink-400" aria-hidden="true" />
        </div>

        <div className="space-y-1">
          <h4 className="text-xs font-black">{name}</h4>
          <div className="flex justify-between items-center pt-2">
            <div className="flex items-baseline gap-1.5">
              <span className="text-sm font-black text-pink-400">${salePrice.toFixed(2)}</span>
              <span className="text-[10px] line-through text-muted-foreground/40">${regularPrice.toFixed(2)}</span>
            </div>
            <button
              type="button"
              onClick={onClaim}
              disabled={expired}
              aria-label={expired ? "Sale expired" : `Claim sale for ${name}`}
              className="px-3 py-1 bg-pink-600 hover:bg-pink-500 disabled:bg-muted disabled:cursor-not-allowed text-white text-[10px] font-bold rounded-lg flex items-center gap-0.5 transition-colors"
            >
              <span>{expired ? "Gone" : "Claim"}</span>
              {expired ? null : <ArrowRight className="w-3 h-3" aria-hidden="true" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

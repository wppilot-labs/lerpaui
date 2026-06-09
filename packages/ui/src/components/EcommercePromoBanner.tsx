"use client";

import React, { useState } from "react";
import { Tag, Copy, Check, X } from "lucide-react";
import { cn } from "../lib/cn";

const COUNTDOWN = [
  { label: "Hrs", value: "11" },
  { label: "Min", value: "42" },
  { label: "Sec", value: "07" },
];

export interface EcommercePromoBannerProps {
  className?: string;
}

export function EcommercePromoBanner({ className }: EcommercePromoBannerProps) {
  const [copied, setCopied] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  const copy = () => {
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className={cn("relative w-full max-w-2xl overflow-hidden bg-card/45 backdrop-blur-xl border border-border/50 rounded-2xl shadow-xl font-sans text-foreground", className)}>
      <div className="absolute inset-0 bg-gradient-to-r from-rose-500/25 via-orange-500/15 to-amber-400/10" aria-hidden />
      <button
        type="button"
        aria-label="Dismiss banner"
        onClick={() => setDismissed(true)}
        className="absolute right-3 top-3 z-10 text-muted-foreground/60 hover:text-foreground transition"
      >
        <X className="w-4 h-4" />
      </button>

      <div className="relative flex flex-col sm:flex-row sm:items-center gap-4 p-5">
        <div className="flex-1">
          <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider bg-red-500/20 text-red-400 px-2.5 py-1 rounded-full border border-red-500/25">
            <Tag className="w-3.5 h-3.5" /> Flash sale
          </span>
          <h2 className="text-xl font-bold mt-2">Extra 25% off everything</h2>
          <p className="text-sm text-muted-foreground/70 mt-0.5">Ends tonight at midnight. No minimum spend.</p>
        </div>

        <div className="flex flex-col items-start sm:items-end gap-2.5">
          <div className="flex items-center gap-1.5">
            {COUNTDOWN.map((c) => (
              <div key={c.label} className="text-center rounded-lg bg-background/50 backdrop-blur border border-foreground/[0.08] px-3 py-2">
                <div className="text-lg font-bold tabular-nums leading-none">{c.value}</div>
                <div className="text-[11px] uppercase text-muted-foreground/55 mt-0.5">{c.label}</div>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={copy}
            aria-label="Copy promo code SAVE25"
            className="inline-flex items-center gap-2 text-sm font-semibold rounded-lg border border-dashed border-foreground/25 bg-foreground/[0.04] px-3 py-2 hover:border-foreground/40 transition"
          >
            <span className="tracking-widest">SAVE25</span>
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-muted-foreground/70" />}
          </button>
        </div>
      </div>
    </div>
  );
}

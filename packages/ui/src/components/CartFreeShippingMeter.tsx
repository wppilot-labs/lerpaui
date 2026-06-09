"use client";

import React, { useState } from "react";
import { Truck, Check, Plus } from "lucide-react";
import { cn } from "../lib/cn";

const THRESHOLD = 75;

export interface CartFreeShippingMeterProps {
  className?: string;
}

export function CartFreeShippingMeter({
  className,
}: CartFreeShippingMeterProps) {
  const [subtotal, setSubtotal] = useState(48);

  const remaining = Math.max(0, THRESHOLD - subtotal);
  const unlocked = remaining === 0;
  const pct = Math.min(100, (subtotal / THRESHOLD) * 100);

  return (
    <div
      className={cn(
        "w-full max-w-sm bg-card/45 backdrop-blur-xl border border-border/50 p-6 rounded-2xl shadow-xl font-sans text-foreground",
        className,
      )}
    >
      <div className="mb-3 flex items-center gap-2">
        <span
          className={cn(
            "flex h-8 w-8 items-center justify-center rounded-lg transition-colors",
            unlocked
              ? "bg-emerald-500/15 text-emerald-400"
              : "bg-primary/10 text-primary",
          )}
        >
          {unlocked ? (
            <Check className="h-4 w-4" />
          ) : (
            <Truck className="h-4 w-4" />
          )}
        </span>
        <div className="min-w-0">
          <p className="text-sm font-semibold leading-tight">
            {unlocked ? (
              "Free shipping unlocked!"
            ) : (
              <>
                Add{" "}
                <span className="font-bold text-primary">
                  ${remaining.toFixed(0)}
                </span>{" "}
                for free shipping
              </>
            )}
          </p>
          <p className="text-xs text-muted-foreground/55">
            Cart total: ${subtotal.toFixed(0)}
          </p>
        </div>
      </div>

      <div
        className="relative h-2.5 overflow-hidden rounded-full bg-secondary/50"
        role="progressbar"
        aria-valuenow={Math.round(pct)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Progress toward free shipping"
      >
        <div
          className={cn(
            "h-full rounded-full transition-all duration-500",
            unlocked ? "bg-emerald-400" : "bg-primary",
          )}
          style={{ width: `${pct}%` }}
        />
      </div>

      <div className="mt-1.5 flex justify-between text-xs text-muted-foreground/45">
        <span>$0</span>
        <span>${THRESHOLD} goal</span>
      </div>

      <button
        type="button"
        onClick={() => setSubtotal((s) => Math.min(THRESHOLD + 12, s + 15))}
        className="mt-4 inline-flex w-full items-center justify-center gap-1.5 rounded-lg border border-border/60 bg-secondary/40 py-2 text-xs font-semibold text-muted-foreground transition-colors hover:text-foreground"
      >
        <Plus className="h-4 w-4" /> Add a $15 item
      </button>
    </div>
  );
}

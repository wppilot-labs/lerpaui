"use client";

import React, { useState } from "react";
import { Tag, Check, X } from "lucide-react";
import { cn } from "../lib/cn";

type Applied = { code: string; off: number };

const VALID: Record<string, number> = {
  SAVE10: 10,
  WELCOME15: 15,
  FREESHIP: 5,
};

export interface CartCouponCodeBoxProps {
  className?: string;
}

export function CartCouponCodeBox({ className }: CartCouponCodeBoxProps) {
  const [code, setCode] = useState("");
  const [applied, setApplied] = useState<Applied | null>(null);
  const [error, setError] = useState(false);

  const apply = () => {
    const key = code.trim().toUpperCase();
    if (VALID[key]) {
      setApplied({ code: key, off: VALID[key] });
      setError(false);
      setCode("");
    } else {
      setError(true);
      setApplied(null);
    }
  };

  return (
    <div
      className={cn(
        "w-full max-w-md bg-card/45 backdrop-blur-xl border border-border/50 p-6 rounded-2xl shadow-xl font-sans text-foreground",
        className,
      )}
    >
      <label
        htmlFor="coupon-code"
        className="flex items-center gap-1.5 text-sm font-semibold"
      >
        <Tag className="h-4 w-4 text-primary" />
        Promo code
      </label>

      {applied ? (
        <div className="mt-3 flex items-center justify-between rounded-xl border border-emerald-500/25 bg-emerald-500/10 px-3.5 py-2.5">
          <span className="flex items-center gap-2 text-sm font-semibold text-emerald-400">
            <Check className="h-4 w-4" />
            {applied.code} applied
          </span>
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-emerald-400">
              −{applied.off}%
            </span>
            <button
              type="button"
              onClick={() => setApplied(null)}
              aria-label="Remove promo code"
              className="text-emerald-400/70 transition-colors hover:text-emerald-300"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      ) : (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            apply();
          }}
          className="mt-3 flex gap-2"
        >
          <input
            id="coupon-code"
            value={code}
            onChange={(e) => {
              setCode(e.target.value);
              setError(false);
            }}
            placeholder="Enter code"
            aria-invalid={error}
            className={cn(
              "flex-1 rounded-lg border bg-secondary/30 px-3 py-2 text-sm uppercase tracking-wide text-foreground placeholder:normal-case placeholder:tracking-normal placeholder:text-muted-foreground/40 focus:outline-none focus:ring-1",
              error
                ? "border-rose-500/40 focus:ring-rose-500/30"
                : "border-border/60 focus:border-primary/40 focus:ring-primary/30",
            )}
          />
          <button
            type="submit"
            className="rounded-lg bg-primary px-4 text-sm font-bold text-primary-foreground transition-all hover:brightness-110"
          >
            Apply
          </button>
        </form>
      )}

      {error && (
        <p className="mt-2 text-xs font-medium text-rose-400">
          That code isn&apos;t valid. Try SAVE10 or WELCOME15.
        </p>
      )}
    </div>
  );
}

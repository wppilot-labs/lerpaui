"use client";

import React, { useState } from "react";
import { Plus, Minus, Trash2 } from "lucide-react";
import { cn } from "../lib/cn";

const UNIT_PRICE = 32;
const MAX_QTY = 9;

export interface CartQuantityStepperProps {
  className?: string;
}

export function CartQuantityStepper({ className }: CartQuantityStepperProps) {
  const [qty, setQty] = useState(2);

  const dec = () => setQty((q) => Math.max(1, q - 1));
  const inc = () => setQty((q) => Math.min(MAX_QTY, q + 1));

  return (
    <div
      className={cn(
        "w-full max-w-sm bg-card/45 backdrop-blur-xl border border-border/50 p-5 rounded-2xl shadow-xl font-sans text-foreground",
        className,
      )}
    >
      <div className="flex items-center gap-3">
        <div className="h-14 w-14 shrink-0 rounded-xl border border-border/50 bg-emerald-300/15" />
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-sm font-semibold">Ceramic Pour-Over</h3>
          <p className="text-xs text-muted-foreground/55">
            Matte white · 600ml
          </p>
          <p className="mt-0.5 text-xs font-bold tabular-nums text-foreground">
            ${UNIT_PRICE.toFixed(2)}{" "}
            <span className="font-normal text-muted-foreground/45">each</span>
          </p>
        </div>
        <button
          type="button"
          aria-label="Remove item"
          className="text-muted-foreground/40 transition-colors hover:text-rose-400"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div className="inline-flex items-center rounded-xl border border-border/60 bg-secondary/30">
          <button
            type="button"
            onClick={dec}
            disabled={qty <= 1}
            aria-label="Decrease quantity"
            className="flex h-9 w-9 items-center justify-center rounded-l-xl text-muted-foreground transition-colors hover:text-foreground disabled:cursor-not-allowed disabled:opacity-30"
          >
            <Minus className="h-4 w-4" />
          </button>
          <span
            aria-live="polite"
            className="w-10 text-center text-sm font-bold tabular-nums"
          >
            {qty}
          </span>
          <button
            type="button"
            onClick={inc}
            disabled={qty >= MAX_QTY}
            aria-label="Increase quantity"
            className="flex h-9 w-9 items-center justify-center rounded-r-xl text-muted-foreground transition-colors hover:text-foreground disabled:cursor-not-allowed disabled:opacity-30"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>

        <div className="text-right">
          <span className="block text-xs text-muted-foreground/50">
            Subtotal
          </span>
          <span className="text-base font-black tabular-nums">
            ${(qty * UNIT_PRICE).toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
}

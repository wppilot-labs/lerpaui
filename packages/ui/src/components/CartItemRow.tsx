"use client";

import React, { useState } from "react";
import { ShoppingBag, Trash2, Plus, Minus } from "lucide-react";

export interface CartItemRowProps {
  name?: string;
  variant?: string;
  price?: number;
  defaultQty?: number;
  onChange?: (qty: number) => void;
  onRemove?: () => void;
}

export function CartItemRow({
  name = "Studio Core React kit",
  variant = "Developer License",
  price = 129.0,
  defaultQty = 1,
  onChange,
  onRemove,
}: CartItemRowProps) {
  const [qty, setQty] = useState(defaultQty);

  const update = (next: number) => {
    const safe = Math.max(1, next);
    setQty(safe);
    onChange?.(safe);
  };

  return (
    <div
      className="w-full max-w-sm bg-card/45 backdrop-blur-xl border border-border/50 p-3.5 rounded-2xl shadow-xl select-none font-sans text-foreground flex items-center justify-between gap-3"
      role="group"
      aria-label={`Cart line item: ${name}`}
    >
      <div className="flex items-center gap-2.5 flex-1 min-w-0">
        <div className="w-14 h-14 bg-secondary/30 rounded-xl flex items-center justify-center border border-white/[0.04] shrink-0">
          <ShoppingBag className="w-6 h-6 text-primary" aria-hidden="true" />
        </div>
        <div className="min-w-0">
          <h4 className="text-xs font-black truncate">{name}</h4>
          <span className="block text-[10px] text-muted-foreground/50 leading-none mt-0.5">{variant}</span>
          <span className="block text-xs font-black text-primary mt-1">${price.toFixed(2)}</span>
        </div>
      </div>

      <div className="flex items-center gap-2.5">
        <div className="flex items-center bg-secondary/40 border border-white/[0.04] rounded-lg p-0.5">
          <button
            type="button"
            onClick={() => update(qty - 1)}
            disabled={qty <= 1}
            aria-label="Decrease quantity"
            className="p-1 hover:bg-white/[0.03] rounded text-muted-foreground disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Minus className="w-2.5 h-2.5" aria-hidden="true" />
          </button>
          <span className="px-2 text-xs font-bold w-4 text-center" aria-live="polite">{qty}</span>
          <button
            type="button"
            onClick={() => update(qty + 1)}
            aria-label="Increase quantity"
            className="p-1 hover:bg-white/[0.03] rounded text-muted-foreground"
          >
            <Plus className="w-2.5 h-2.5" aria-hidden="true" />
          </button>
        </div>

        <button
          type="button"
          onClick={onRemove}
          aria-label="Remove from cart"
          className="p-1.5 hover:bg-red-500/10 rounded-lg text-muted-foreground/60 hover:text-red-400 transition-colors"
        >
          <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}

"use client";

import React, { useMemo, useState } from "react";
import { ShoppingBag, ChevronDown, ChevronUp } from "lucide-react";

export interface CheckoutLineItem {
  label: string;
  price: number;
}

export interface CheckoutOrderSummaryProps {
  items?: CheckoutLineItem[];
  defaultOpen?: boolean;
}

const DEFAULT_ITEMS: CheckoutLineItem[] = [
  { label: "React Design Suite", price: 129.0 },
  { label: "Add-on: Extended SLA", price: 19.0 },
];

export function CheckoutOrderSummary({
  items = DEFAULT_ITEMS,
  defaultOpen = true,
}: CheckoutOrderSummaryProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const total = useMemo(
    () => items.reduce((acc, item) => acc + item.price, 0),
    [items],
  );

  return (
    <div className="w-full max-w-sm bg-card/45 backdrop-blur-xl border border-border/50 p-4 rounded-2xl shadow-xl select-none font-sans text-foreground">
      <button
        type="button"
        onClick={() => setIsOpen((v) => !v)}
        aria-expanded={isOpen}
        aria-controls="checkout-summary-body"
        className="w-full flex items-center justify-between text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3"
      >
        <span className="flex items-center gap-1.5">
          <ShoppingBag className="w-4 h-4 text-primary" aria-hidden="true" /> Order summary
        </span>
        {isOpen ? <ChevronUp className="w-4 h-4" aria-hidden="true" /> : <ChevronDown className="w-4 h-4" aria-hidden="true" />}
      </button>

      {isOpen ? (
        <div
          id="checkout-summary-body"
          className="space-y-2 bg-secondary/20 p-2.5 rounded-xl border border-white/[0.04] text-xs"
        >
          {items.map((item) => (
            <div className="flex justify-between" key={item.label}>
              <span className="text-muted-foreground">{item.label}</span>
              <span className="font-bold">${item.price.toFixed(2)}</span>
            </div>
          ))}
          <div className="h-px bg-white/[0.04] my-2" />
          <div className="flex justify-between text-sm font-black">
            <span>Total</span>
            <span className="text-primary">${total.toFixed(2)}</span>
          </div>
        </div>
      ) : null}
    </div>
  );
}

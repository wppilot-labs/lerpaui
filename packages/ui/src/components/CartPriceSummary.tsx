"use client";

import React, { useMemo, useState } from "react";
import { ArrowRight, Ticket, Check } from "lucide-react";

export interface CartPriceSummaryProps {
  subtotal?: number;
  taxRate?: number;
  couponCode?: string;
  couponDiscount?: number;
  onCheckout?: () => void;
}

export function CartPriceSummary({
  subtotal = 129.0,
  taxRate = 0.08,
  couponCode = "SAVE20",
  couponDiscount = 0.2,
  onCheckout,
}: CartPriceSummaryProps) {
  const [coupon, setCoupon] = useState("");
  const [applied, setApplied] = useState(false);

  const { tax, discount, total } = useMemo(() => {
    const t = subtotal * taxRate;
    const d = applied ? subtotal * couponDiscount : 0;
    return { tax: t, discount: d, total: subtotal + t - d };
  }, [subtotal, taxRate, applied, couponDiscount]);

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    if (coupon.trim().toUpperCase() === couponCode.toUpperCase()) {
      setApplied(true);
    }
  };

  return (
    <div
      className="w-full max-w-sm bg-card/45 backdrop-blur-xl border border-border/50 p-5 rounded-2xl shadow-xl select-none font-sans text-foreground"
      role="region"
      aria-label="Cart price summary"
    >
      <span className="block text-[9px] font-extrabold uppercase bg-primary/15 text-primary px-2 py-0.5 rounded border border-primary/30 tracking-wider mb-4 w-max">
        Price Breakdown
      </span>

      <div className="space-y-2.5 text-xs mb-4">
        <div className="flex justify-between">
          <span className="text-muted-foreground/60">Subtotal</span>
          <span className="font-semibold">${subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground/60">Estimated tax</span>
          <span className="font-semibold">${tax.toFixed(2)}</span>
        </div>
        {applied ? (
          <div className="flex justify-between text-primary">
            <span>Discount ({Math.round(couponDiscount * 100)}% off)</span>
            <span>−${discount.toFixed(2)}</span>
          </div>
        ) : null}
        <div className="h-px bg-white/[0.04] my-2" />
        <div className="flex justify-between text-sm font-black">
          <span>Total</span>
          <span aria-live="polite">${total.toFixed(2)}</span>
        </div>
      </div>

      <form onSubmit={handleApply} className="flex gap-2 mb-4">
        <label htmlFor="cart-coupon" className="sr-only">Promo code</label>
        <input
          id="cart-coupon"
          type="text"
          value={coupon}
          onChange={(e) => setCoupon(e.target.value)}
          placeholder={`Promo: ${couponCode}…`}
          className="flex-1 px-3 py-1.5 bg-secondary/30 border border-white/[0.04] rounded-xl text-xs focus:outline-none focus:border-primary/50"
        />
        <button
          type="submit"
          aria-label="Apply coupon"
          className="p-2 bg-secondary/40 hover:bg-secondary/60 rounded-xl transition-all"
        >
          {applied ? <Check className="w-3.5 h-3.5 text-primary" aria-hidden="true" /> : <Ticket className="w-3.5 h-3.5" aria-hidden="true" />}
        </button>
      </form>

      <button
        type="button"
        onClick={onCheckout}
        className="w-full py-2.5 bg-primary hover:brightness-110 text-primary-foreground font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all"
      >
        <span>Proceed to secure checkout</span>
        <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
      </button>
    </div>
  );
}

"use client";

import React from "react";
import { ShoppingCart, ArrowRight } from "lucide-react";
import { cn } from "../lib/cn";

export interface EcommerceEmptyCartProps {
  className?: string;
}

export function EcommerceEmptyCart({ className }: EcommerceEmptyCartProps) {
  return (
    <div className={cn("w-full max-w-md bg-card/45 backdrop-blur-xl border border-border/50 p-8 rounded-2xl shadow-xl font-sans text-foreground text-center", className)}>
      <div className="mx-auto h-20 w-20 rounded-full bg-secondary/40 flex items-center justify-center mb-4">
        <ShoppingCart className="w-9 h-9 text-muted-foreground/50" />
      </div>
      <h3 className="text-base font-bold">Your cart is empty</h3>
      <p className="text-xs text-muted-foreground/60 mt-1 mb-5 max-w-[260px] mx-auto">
        Looks like you haven&apos;t added anything yet. Let&apos;s fix that.
      </p>
      <button type="button" className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 text-sm font-bold rounded-xl bg-primary text-primary-foreground hover:brightness-110 transition-all">
        Start shopping <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
}

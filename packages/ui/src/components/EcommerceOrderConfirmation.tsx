"use client";

import React from "react";
import { CheckCircle2, Package } from "lucide-react";
import { cn } from "../lib/cn";

export interface EcommerceOrderConfirmationProps {
  className?: string;
}

export function EcommerceOrderConfirmation({ className }: EcommerceOrderConfirmationProps) {
  return (
    <div className={cn("w-full max-w-md bg-card/45 backdrop-blur-xl border border-border/50 p-6 rounded-2xl shadow-xl font-sans text-foreground text-center", className)}>
      <div className="mx-auto h-16 w-16 rounded-full bg-emerald-500/15 text-emerald-400 flex items-center justify-center mb-4">
        <CheckCircle2 className="w-8 h-8" />
      </div>
      <h3 className="text-base font-bold">Order confirmed</h3>
      <p className="text-xs text-muted-foreground/60 mt-1">Thanks! A receipt is on its way to your inbox.</p>

      <div className="mt-5 rounded-xl bg-foreground/[0.02] border border-foreground/[0.05] p-4 text-left">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs uppercase tracking-wide text-muted-foreground/50">Order number</span>
          <span className="text-sm font-bold font-mono">#AC-80412</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground/70">
          <Package className="w-4 h-4 text-primary" />
          Estimated delivery <span className="font-semibold text-foreground">Jun 9–11</span>
        </div>
      </div>

      <button type="button" className="w-full mt-4 py-2.5 text-sm font-bold rounded-xl bg-primary text-primary-foreground hover:brightness-110 transition-all">Track order</button>
    </div>
  );
}

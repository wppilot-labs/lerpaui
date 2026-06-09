"use client";

import React from "react";
import { CreditCard, Zap, ArrowUpRight } from "lucide-react";
import { cn } from "../lib/cn";

export interface AccountBillingSectionProps {
  className?: string;
}

export function AccountBillingSection({ className }: AccountBillingSectionProps) {
  const usagePct = 68;

  return (
    <div className={cn("w-full max-w-md bg-card/45 backdrop-blur-xl border border-border/50 p-5 rounded-2xl shadow-xl font-sans text-foreground", className)}>
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-base font-bold">Billing &amp; plan</h3>
          <p className="text-xs text-muted-foreground/70">Manage your subscription and payment</p>
        </div>
        <span className="text-[11px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full bg-primary/15 text-primary border border-primary/20">Pro</span>
      </div>

      <div className="rounded-xl bg-gradient-to-br from-primary/10 to-transparent border border-primary/15 p-4 mb-4">
        <div className="flex items-end justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-primary">
              <Zap className="w-3.5 h-3.5" />
              <span className="text-sm font-bold">Pro plan</span>
            </div>
            <p className="text-xs text-muted-foreground/60 mt-0.5">Renews Jul 1, 2026</p>
          </div>
          <div className="text-right">
            <span className="text-2xl font-black">$29</span>
            <span className="text-xs text-muted-foreground/60">/mo</span>
          </div>
        </div>
      </div>

      <div className="mb-4">
        <div className="flex justify-between text-xs mb-1.5">
          <span className="text-muted-foreground/70 font-medium">Seats used</span>
          <span className="font-semibold">17 / 25</span>
        </div>
        <div className="h-1.5 rounded-full bg-foreground/[0.06] overflow-hidden">
          <div className="h-full rounded-full bg-primary" style={{ width: `${usagePct}%` }} />
        </div>
      </div>

      <div className="flex items-center gap-2.5 p-3 rounded-xl bg-foreground/[0.02] border border-foreground/[0.04] mb-4">
        <CreditCard className="w-4 h-4 text-muted-foreground shrink-0" />
        <div className="flex-1 text-xs">
          <span className="font-semibold">Visa •••• 4242</span>
          <span className="block text-[11px] text-muted-foreground/50">Expires 09/27</span>
        </div>
        <button type="button" className="text-xs font-bold text-primary hover:underline">Update</button>
      </div>

      <div className="flex gap-2">
        <button type="button" className="flex-1 py-2 text-xs font-bold rounded-xl bg-secondary/50 border border-foreground/[0.05] text-muted-foreground hover:text-foreground transition-colors">
          View invoices
        </button>
        <button type="button" className="flex-1 inline-flex items-center justify-center gap-1 py-2 text-xs font-bold rounded-xl bg-primary text-primary-foreground hover:brightness-110 transition-all">
          Upgrade <ArrowUpRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

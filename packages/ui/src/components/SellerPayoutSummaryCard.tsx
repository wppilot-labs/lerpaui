"use client";

import React, { useState } from "react";
import { CreditCard, DollarSign, ArrowRight } from "lucide-react";

export function SellerPayoutSummaryCard() {
  const [isProcessing, setIsProcessing] = useState(false);

  return (
    <div className="w-full max-w-sm bg-card/45 backdrop-blur-xl border border-border/50 p-5 rounded-2xl shadow-xl select-none font-sans text-foreground">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-1.5">
          <DollarSign className="w-4 h-4 text-emerald-400" />
          <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Payout Management</span>
        </div>
        <span className="text-[9px] uppercase font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">Auto-Pay Enabled</span>
      </div>

      <div className="space-y-4">
        <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.03] relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/10 via-transparent to-transparent" />
          <span className="block text-[9px] text-muted-foreground/60 uppercase font-bold">Available Balance</span>
          <span className="text-2xl font-black text-foreground">$4,850.24</span>
        </div>

        <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.03] space-y-2 text-xs">
          <div className="flex justify-between">
            <span className="text-muted-foreground/60">Bank Account</span>
            <span className="font-bold flex items-center gap-1"><CreditCard className="w-3.5 h-3.5 text-violet-400" /> **** 9820</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground/60">Schedule Payout</span>
            <span className="font-bold">Every Friday</span>
          </div>
        </div>

        <button 
          onClick={() => {
            setIsProcessing(true);
            setTimeout(() => setIsProcessing(false), 1200);
          }}
          className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all"
        >
          <span>{isProcessing ? "Processing Transfer..." : "Request Instant Payout"}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
"use client";

import React, { useState } from "react";
import { Package, Check } from "lucide-react";

export function ReturnsExchangeStatusCard() {
  const [step, _setStep] = useState(2); // 2 = package dropped off

  return (
    <div className="w-full max-w-sm bg-card/45 backdrop-blur-xl border border-border/50 p-5 rounded-2xl shadow-xl select-none font-sans text-foreground">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-1.5">
          <Package className="w-4 h-4 text-emerald-400" />
          <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">RMA return status</span>
        </div>
        <span className="text-[9px] uppercase font-bold text-violet-400">RMA #847290</span>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs">
          {["Authorized", "Dropped Off", "Inspected", "Refunded"].map((label, idx) => (
            <div key={idx} className="flex flex-col items-center gap-1.5 relative flex-1">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold border transition-all ${
                step >= idx ? "bg-emerald-600 text-white border-emerald-500" : "bg-secondary text-muted-foreground border-border"
              }`}>
                {step > idx ? <Check className="w-3 h-3" /> : idx + 1}
              </div>
              <span className={`text-[8px] font-bold uppercase tracking-wide ${
                step >= idx ? "text-emerald-400" : "text-muted-foreground/60"
              }`}>{label}</span>
            </div>
          ))}
        </div>

        <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.03] text-xs">
          <div className="flex justify-between mb-1">
            <span className="text-muted-foreground/60">Carrier drop-off:</span>
            <span className="font-bold">FedEx Drop-box</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground/60">Estimated release:</span>
            <span className="font-bold">May 26, 2026</span>
          </div>
        </div>
      </div>
    </div>
  );
}
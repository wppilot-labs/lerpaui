"use client";

import React, { useState } from "react";
import { ShieldCheck, Check } from "lucide-react";

export function TeamApprovalWorkflowCard() {
  const [step, setStep] = useState(1);

  return (
    <div className="w-full max-w-sm bg-card/45 backdrop-blur-xl border border-border/50 p-5 rounded-2xl shadow-xl select-none font-sans text-foreground">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-violet-400" />
          <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Approval Stepper</span>
        </div>
        <span className="text-[9px] uppercase font-bold text-violet-400">Step {step} of 3</span>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs">
          {["Draft", "Review", "Approved"].map((label, idx) => (
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

        <button 
          onClick={() => setStep(Math.min(2, step + 1))}
          disabled={step === 2}
          className="w-full py-2 bg-violet-600 hover:bg-violet-500 disabled:opacity-40 disabled:hover:bg-violet-600 text-white font-bold text-xs rounded-xl transition-all"
        >
          {step === 2 ? "Workflow Complete" : "Approve Current Step"}
        </button>
      </div>
    </div>
  );
}
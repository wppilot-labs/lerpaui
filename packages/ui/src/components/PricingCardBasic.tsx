"use client";

import React, { useState } from "react";
import { Check, ArrowRight } from "lucide-react";

export function PricingCardBasic() {
  const [yearly, setYearly] = useState(false);

  return (
    <div className="w-full max-w-xs bg-card/45 backdrop-blur-xl border border-border/50 rounded-2xl shadow-xl select-none font-sans overflow-hidden text-foreground">
      <div className="p-5 relative space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-[9px] font-extrabold uppercase bg-violet-500/15 text-violet-300 px-2 py-0.5 rounded border border-violet-500/20 tracking-wider">Startup Tier</span>
          <button
            type="button"
            onClick={() => setYearly(!yearly)}
            aria-pressed={yearly}
            aria-label={yearly ? "Switch to monthly billing" : "Switch to yearly billing"}
            className="text-[9px] uppercase font-bold text-violet-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-400/60 rounded"
          >
            {yearly ? "Billing Yearly" : "Billing Monthly"}
          </button>
        </div>

        <div>
          <span className="block text-[8px] text-muted-foreground/50 uppercase font-bold">Standard Cost</span>
          <div className="flex items-baseline gap-1 mt-0.5">
            <span className="text-2xl font-black text-foreground">{yearly ? "$99.00" : "$9.00"}</span>
            <span className="text-[10px] text-muted-foreground">/{yearly ? "yr" : "mo"}</span>
          </div>
        </div>

        <div className="space-y-2 text-xs pt-2 border-t border-white/[0.04]">
          <div className="flex items-center gap-1.5">
            <Check className="w-3.5 h-3.5 text-emerald-400" />
            <span>Standard SLA routing channels</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Check className="w-3.5 h-3.5 text-emerald-400" />
            <span>Active token limits safety checks</span>
          </div>
        </div>

        <button className="w-full py-2 bg-primary hover:brightness-110 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1 transition-all">
          <span>Register Startup Plan</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
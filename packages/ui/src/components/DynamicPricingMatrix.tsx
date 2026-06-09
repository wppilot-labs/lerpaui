"use client";

import React, { useState } from "react";
import { Check, Shield } from "lucide-react";
import { cn } from "../lib/cn";

export function DynamicPricingMatrix({ className }: { className?: string }) {
  const [selectedPlan, setSelectedPlan] = useState("pro");

  return (
    <div className={cn("w-full max-w-sm rounded-2xl border border-border/80 bg-card/45 p-5 backdrop-blur-xl shadow-2xl space-y-4", className)}>
      <div className="flex items-center justify-between pb-2 border-b border-border/30">
        <div>
          <h3 className="text-sm font-bold text-foreground">Pricing Selection</h3>
          <p className="text-[10px] text-muted-foreground">Select a pricing plan option</p>
        </div>
        <Shield className="w-4 h-4 text-primary" />
      </div>

      <div className="space-y-2">
        {[
          { id: "starter", name: "Starter Tier", price: "$29" },
          { id: "pro", name: "Pro Tier", price: "$79" },
        ].map((plan) => {
          const isSelected = selectedPlan === plan.id;
          return (
            <button
              key={plan.id}
              onClick={() => setSelectedPlan(plan.id)}
              className={cn(
                "w-full flex items-center justify-between p-3 rounded-xl border text-left cursor-pointer transition-colors",
                isSelected
                  ? "bg-primary/20 border-primary text-primary"
                  : "bg-zinc-900/30 border-border/40 text-muted-foreground hover:bg-zinc-900/60 hover:text-foreground"
              )}
            >
              <div>
                <span className="text-xs font-bold text-foreground capitalize">{plan.name}</span>
                <p className="text-[9px] text-muted-foreground">Annual billing cycle</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm font-mono font-black text-foreground">{plan.price}</span>
                {isSelected && <Check className="w-4 h-4 text-primary" />}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

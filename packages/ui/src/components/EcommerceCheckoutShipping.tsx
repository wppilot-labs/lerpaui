"use client";

import React, { useState } from "react";
import { Truck } from "lucide-react";
import { cn } from "../lib/cn";

type Option = { id: string; name: string; eta: string; price: string };

const OPTIONS: Option[] = [
  { id: "standard", name: "Standard", eta: "5–7 business days", price: "Free" },
  { id: "express", name: "Express", eta: "2–3 business days", price: "$12" },
  { id: "overnight", name: "Overnight", eta: "Next business day", price: "$28" },
];

export interface EcommerceCheckoutShippingProps {
  className?: string;
}

export function EcommerceCheckoutShipping({ className }: EcommerceCheckoutShippingProps) {
  const [selected, setSelected] = useState("express");

  return (
    <div className={cn("w-full max-w-sm bg-card/45 backdrop-blur-xl border border-border/50 p-5 rounded-2xl shadow-xl font-sans text-foreground", className)}>
      <h3 className="text-base font-bold flex items-center gap-1.5 mb-4"><Truck className="w-4 h-4 text-primary" /> Shipping method</h3>

      <fieldset className="space-y-2">
        <legend className="sr-only">Choose a shipping method</legend>
        {OPTIONS.map((o) => {
          const on = selected === o.id;
          return (
            <label
              key={o.id}
              className={cn("flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-colors", on ? "border-primary/50 bg-primary/5" : "border-foreground/[0.06] bg-foreground/[0.02] hover:border-foreground/[0.12]")}
            >
              <input type="radio" name="shipping" value={o.id} checked={on} onChange={() => setSelected(o.id)} className="sr-only" />
              <span className={cn("h-4 w-4 rounded-full border flex items-center justify-center shrink-0", on ? "border-primary" : "border-foreground/25")}>
                {on && <span className="h-2 w-2 rounded-full bg-primary" />}
              </span>
              <div className="flex-1">
                <div className="text-sm font-semibold">{o.name}</div>
                <div className="text-xs text-muted-foreground/55">{o.eta}</div>
              </div>
              <span className="text-sm font-bold tabular-nums">{o.price}</span>
            </label>
          );
        })}
      </fieldset>
    </div>
  );
}

"use client";

import React, { useState } from "react";
import { Truck, Zap, Clock } from "lucide-react";
import { cn } from "../lib/cn";

type Method = {
  id: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  eta: string;
  price: string;
};

const METHODS: Method[] = [
  { id: "standard", icon: Truck, label: "Standard", eta: "5–7 business days", price: "Free" },
  { id: "express", icon: Clock, label: "Express", eta: "2–3 business days", price: "$9.99" },
  { id: "overnight", icon: Zap, label: "Overnight", eta: "Next business day", price: "$24.99" },
];

export interface CheckoutShippingMethodSelectorProps {
  className?: string;
}

export function CheckoutShippingMethodSelector({ className }: CheckoutShippingMethodSelectorProps) {
  const [selected, setSelected] = useState("express");

  return (
    <fieldset className={cn("w-full max-w-md bg-card backdrop-blur-xl border border-border p-5 rounded-2xl shadow-sm font-sans text-foreground", className)}>
      <legend className="mb-3 text-sm font-bold">Shipping method</legend>

      <div className="space-y-2">
        {METHODS.map((m) => {
          const active = selected === m.id;
          return (
            <label
              key={m.id}
              className={cn(
                "flex cursor-pointer items-center gap-3 rounded-xl border p-3.5 transition-colors",
                active ? "border-primary/40 bg-primary/[0.08]" : "border-border bg-foreground/[0.02] hover:bg-foreground/[0.04]"
              )}
            >
              <input
                type="radio"
                name="shipping-method"
                value={m.id}
                checked={active}
                onChange={() => setSelected(m.id)}
                className="sr-only"
              />
              <span
                className={cn(
                  "grid h-4 w-4 shrink-0 place-items-center rounded-full border",
                  active ? "border-primary" : "border-foreground/20"
                )}
              >
                {active && <span className="h-2 w-2 rounded-full bg-primary" />}
              </span>
              <m.icon className={cn("h-5 w-5 shrink-0", active ? "text-primary" : "text-muted-foreground")} />
              <div className="flex-1">
                <p className="text-sm font-semibold">{m.label}</p>
                <p className="text-xs text-muted-foreground">{m.eta}</p>
              </div>
              <span className={cn("text-sm font-bold", m.price === "Free" ? "text-emerald-600 dark:text-emerald-400" : "text-foreground")}>
                {m.price}
              </span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}

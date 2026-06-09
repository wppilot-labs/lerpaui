"use client";

import React, { useState } from "react";
import { MapPin, Truck, Zap } from "lucide-react";
import { cn } from "../lib/cn";

type Option = {
  id: string;
  label: string;
  eta: string;
  price: string;
  icon: React.ComponentType<{ className?: string }>;
};

const OPTIONS: Option[] = [
  { id: "std", label: "Standard", eta: "Jun 9 – Jun 12", price: "Free", icon: Truck },
  { id: "exp", label: "Express", eta: "Jun 6 – Jun 7", price: "$9.99", icon: Zap },
];

export interface ProductShippingEstimatorProps {
  className?: string;
}

export function ProductShippingEstimator({ className }: ProductShippingEstimatorProps) {
  const [zip, setZip] = useState("");
  const [estimated, setEstimated] = useState(false);
  const valid = /^\d{5}$/.test(zip);

  return (
    <div
      className={cn(
        "w-full max-w-md bg-card/45 backdrop-blur-xl border border-border/50 p-5 rounded-2xl shadow-xl font-sans text-foreground",
        className,
      )}
    >
      <h3 className="text-base font-bold mb-1">Estimate delivery</h3>
      <p className="text-xs text-muted-foreground/60 mb-4">
        Enter your ZIP to see arrival dates
      </p>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (valid) setEstimated(true);
        }}
        className="flex gap-2 mb-4"
      >
        <label htmlFor="ship-zip" className="sr-only">
          ZIP code
        </label>
        <div className="relative flex-1">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/35" />
          <input
            id="ship-zip"
            type="text"
            inputMode="numeric"
            maxLength={5}
            value={zip}
            onChange={(e) => {
              setZip(e.target.value.replace(/\D/g, ""));
              setEstimated(false);
            }}
            placeholder="ZIP code"
            className="w-full bg-foreground/[0.03] border border-foreground/[0.06] rounded-xl pl-9 pr-3 py-2.5 text-sm focus:outline-none focus:border-primary/40 transition-colors"
          />
        </div>
        <button
          type="submit"
          disabled={!valid}
          className="px-4 rounded-xl bg-primary text-primary-foreground text-sm font-bold hover:opacity-90 disabled:opacity-40 transition-opacity"
        >
          Check
        </button>
      </form>

      {estimated && valid ? (
        <ul className="space-y-2">
          {OPTIONS.map((o) => {
            const Icon = o.icon;
            return (
              <li
                key={o.id}
                className="flex items-center gap-3 p-3 rounded-xl bg-foreground/[0.02] border border-foreground/[0.05]"
              >
                <div className="h-9 w-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold">{o.label}</div>
                  <div className="text-xs text-muted-foreground/60">
                    Arrives {o.eta}
                  </div>
                </div>
                <span
                  className={cn(
                    "text-sm font-bold",
                    o.price === "Free" && "text-emerald-400",
                  )}
                >
                  {o.price}
                </span>
              </li>
            );
          })}
          <p className="text-xs text-muted-foreground/45 pt-1">
            Estimates for ZIP {zip}. Order within 4h for same-day dispatch.
          </p>
        </ul>
      ) : (
        <div className="rounded-xl border border-dashed border-foreground/10 py-6 text-center">
          <Truck className="w-5 h-5 text-muted-foreground/30 mx-auto mb-1.5" />
          <p className="text-xs text-muted-foreground/50">
            Delivery options will appear here
          </p>
        </div>
      )}
    </div>
  );
}

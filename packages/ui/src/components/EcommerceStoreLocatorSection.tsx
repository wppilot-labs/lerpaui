"use client";

import React, { useState } from "react";
import { Search, MapPin, Phone, Navigation } from "lucide-react";
import { cn } from "../lib/cn";

type Store = {
  id: string;
  name: string;
  address: string;
  distance: string;
  hours: string;
  open: boolean;
  phone: string;
};

const STORES: Store[] = [
  { id: "s1", name: "Flagship — SoHo", address: "412 Broadway, New York", distance: "0.8 mi", hours: "Open until 9 PM", open: true, phone: "(212) 555-0142" },
  { id: "s2", name: "Williamsburg", address: "88 Bedford Ave, Brooklyn", distance: "2.3 mi", hours: "Open until 8 PM", open: true, phone: "(718) 555-0190" },
  { id: "s3", name: "Upper West Side", address: "200 Columbus Ave, New York", distance: "4.1 mi", hours: "Closed · Opens 10 AM", open: false, phone: "(212) 555-0177" },
];

export interface EcommerceStoreLocatorSectionProps {
  className?: string;
}

export function EcommerceStoreLocatorSection({ className }: EcommerceStoreLocatorSectionProps) {
  const [active, setActive] = useState("s1");

  return (
    <div className={cn("w-full max-w-md bg-card/45 backdrop-blur-xl border border-border/50 p-4 rounded-2xl shadow-xl font-sans text-foreground", className)}>
      <h3 className="text-base font-bold mb-3">Find a store</h3>

      <div className="relative mb-3">
        <Search className="absolute left-2.5 top-2.5 w-4 h-4 text-muted-foreground/40" />
        <label htmlFor="store-search" className="sr-only">Search by city or ZIP</label>
        <input
          id="store-search"
          placeholder="City or ZIP code"
          className="w-full bg-foreground/[0.03] border border-foreground/[0.08] rounded-lg pl-9 pr-3 py-2 text-xs focus:ring-1 focus:ring-primary/50 focus:outline-none"
        />
      </div>

      <div className="relative h-24 rounded-xl border border-foreground/[0.06] bg-gradient-to-br from-emerald-500/15 to-sky-500/10 mb-3 overflow-hidden" aria-hidden>
        <div className="absolute inset-0 opacity-[0.15]" style={{ backgroundImage: "radial-gradient(circle, currentColor 1px, transparent 1px)", backgroundSize: "14px 14px" }} />
        <MapPin className="absolute left-1/3 top-1/2 -translate-y-full w-5 h-5 text-primary drop-shadow" />
        <MapPin className="absolute left-2/3 top-1/3 -translate-y-full w-4 h-4 text-muted-foreground/60" />
      </div>

      <ul className="space-y-2">
        {STORES.map((s) => (
          <li key={s.id}>
            <button
              type="button"
              aria-pressed={active === s.id}
              onClick={() => setActive(s.id)}
              className={cn(
                "w-full text-left rounded-xl border p-3 transition",
                active === s.id ? "border-primary/40 bg-primary/[0.06]" : "border-foreground/[0.05] bg-foreground/[0.02] hover:border-foreground/15",
              )}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm font-semibold truncate">{s.name}</span>
                <span className="text-xs text-muted-foreground/50 shrink-0">{s.distance}</span>
              </div>
              <div className="text-xs text-muted-foreground/60 mt-0.5">{s.address}</div>
              <div className="flex items-center justify-between mt-1.5">
                <span className={cn("text-xs font-medium", s.open ? "text-emerald-400" : "text-muted-foreground/50")}>{s.hours}</span>
                <span className="flex items-center gap-2.5">
                  <span className="inline-flex items-center gap-1 text-xs text-muted-foreground/55">
                    <Phone className="w-3.5 h-3.5" /> {s.phone}
                  </span>
                  <Navigation className="w-4 h-4 text-primary" />
                </span>
              </div>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

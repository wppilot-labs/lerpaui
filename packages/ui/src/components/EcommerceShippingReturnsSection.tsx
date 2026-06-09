"use client";

import React, { useState } from "react";
import { Truck, RotateCcw, Globe, ChevronDown, MapPin } from "lucide-react";
import { cn } from "../lib/cn";

type Method = {
  id: string;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  eta: string;
  cost: string;
  detail: string;
};

const METHODS: Method[] = [
  { id: "std", icon: Truck, title: "Standard shipping", eta: "3–5 business days", cost: "Free", detail: "Free on orders over $50. Tracked and insured door to door." },
  { id: "exp", icon: Globe, title: "Express shipping", eta: "1–2 business days", cost: "$12", detail: "Order before 2pm for same-day dispatch, Monday to Friday." },
  { id: "ret", icon: RotateCcw, title: "Returns & exchanges", eta: "Within 60 days", cost: "Free", detail: "Unworn items with tags. Prepaid label included in every box." },
];

export interface EcommerceShippingReturnsSectionProps {
  className?: string;
}

export function EcommerceShippingReturnsSection({ className }: EcommerceShippingReturnsSectionProps) {
  const [open, setOpen] = useState<string | null>("std");

  return (
    <div className={cn("w-full max-w-md bg-card/45 backdrop-blur-xl border border-border/50 p-4 rounded-2xl shadow-xl font-sans text-foreground", className)}>
      <h3 className="text-base font-bold mb-3">Shipping & returns</h3>

      <ul className="space-y-2">
        {METHODS.map((m) => {
          const Icon = m.icon;
          const isOpen = open === m.id;
          return (
            <li key={m.id} className="rounded-xl border border-foreground/[0.05] bg-foreground/[0.02] overflow-hidden">
              <button
                type="button"
                aria-expanded={isOpen}
                onClick={() => setOpen(isOpen ? null : m.id)}
                className="flex w-full items-center gap-3 p-3 text-left"
              >
                <div className="h-9 w-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <Icon className="w-4 h-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-semibold">{m.title}</div>
                  <div className="text-xs text-muted-foreground/55">{m.eta}</div>
                </div>
                <span className="text-xs font-semibold text-emerald-400 shrink-0">{m.cost}</span>
                <ChevronDown className={cn("w-4 h-4 text-muted-foreground/40 shrink-0 transition", isOpen && "rotate-180")} />
              </button>
              {isOpen && (
                <p className="px-3 pb-3 pl-[3.75rem] text-xs leading-relaxed text-muted-foreground/70">{m.detail}</p>
              )}
            </li>
          );
        })}
      </ul>

      <div className="mt-3 flex items-center gap-2 rounded-lg bg-foreground/[0.02] border border-foreground/[0.05] px-3 py-2.5 text-xs text-muted-foreground/70">
        <MapPin className="w-4 h-4 text-muted-foreground/50 shrink-0" />
        Delivering to <span className="font-semibold text-foreground">United States</span>
      </div>
    </div>
  );
}

"use client";

import React from "react";
import { CheckCircle2, Package, Truck, Home } from "lucide-react";
import { cn } from "../lib/cn";

type Step = { label: string; date: string; icon: React.ComponentType<{ className?: string }>; done: boolean; current?: boolean };

const STEPS: Step[] = [
  { label: "Order placed", date: "Jun 3", icon: CheckCircle2, done: true },
  { label: "Packed", date: "Jun 4", icon: Package, done: true },
  { label: "Shipped", date: "Jun 5", icon: Truck, done: true, current: true },
  { label: "Delivered", date: "Est. Jun 9", icon: Home, done: false },
];

export interface EcommerceOrderTrackingProps {
  className?: string;
}

export function EcommerceOrderTracking({ className }: EcommerceOrderTrackingProps) {
  return (
    <div className={cn("w-full max-w-md bg-card/45 backdrop-blur-xl border border-border/50 p-5 rounded-2xl shadow-xl font-sans text-foreground", className)}>
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-base font-bold">Track order</h3>
        <span className="text-xs font-mono text-muted-foreground/55">#AC-80412</span>
      </div>

      <ol className="relative space-y-5 before:absolute before:left-[13px] before:top-2 before:bottom-2 before:w-0.5 before:bg-foreground/[0.06]">
        {STEPS.map((s) => {
          const Icon = s.icon;
          return (
            <li key={s.label} className="relative flex items-center gap-3">
              <div
                className={cn(
                  "relative z-10 h-7 w-7 rounded-full flex items-center justify-center shrink-0 border",
                  s.done ? "bg-primary/15 border-primary/40 text-primary" : "bg-secondary/40 border-foreground/[0.08] text-muted-foreground/40",
                  s.current && "ring-2 ring-primary/30",
                )}
              >
                <Icon className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <div className={cn("text-sm font-semibold", !s.done && "text-muted-foreground/50")}>{s.label}</div>
              </div>
              <span className="text-xs text-muted-foreground/45">{s.date}</span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

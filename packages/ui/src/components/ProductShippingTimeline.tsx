"use client";

import React from "react";
import { Check, Package, Truck, Home, ClipboardCheck } from "lucide-react";
import { cn } from "../lib/cn";

type Stage = {
  id: string;
  label: string;
  detail: string;
  icon: React.ComponentType<{ className?: string }>;
};

const STAGES: Stage[] = [
  { id: "ordered", label: "Order placed", detail: "Jun 3 · 9:14 AM", icon: ClipboardCheck },
  { id: "packed", label: "Packed", detail: "Jun 3 · 4:30 PM", icon: Package },
  { id: "transit", label: "In transit", detail: "Out for delivery today", icon: Truck },
  { id: "delivered", label: "Delivered", detail: "Est. by 8:00 PM", icon: Home },
];

// 0-indexed: stages strictly before this are complete, this one is active
const CURRENT = 2;

export interface ProductShippingTimelineProps {
  className?: string;
}

export function ProductShippingTimeline({ className }: ProductShippingTimelineProps) {
  return (
    <div
      className={cn(
        "w-full max-w-md bg-card/45 backdrop-blur-xl border border-border/50 p-5 rounded-2xl shadow-xl font-sans text-foreground",
        className,
      )}
    >
      <div className="flex items-baseline justify-between mb-5">
        <h3 className="text-base font-bold">Order #LX-48213</h3>
        <span className="text-xs font-semibold text-sky-400">In transit</span>
      </div>

      <ol className="relative">
        {STAGES.map((s, i) => {
          const done = i < CURRENT;
          const active = i === CURRENT;
          const Icon = s.icon;
          const last = i === STAGES.length - 1;
          return (
            <li key={s.id} className="relative flex gap-3 pb-5 last:pb-0">
              {/* connector */}
              {!last && (
                <span
                  className={cn(
                    "absolute left-[15px] top-8 bottom-0 w-0.5",
                    done ? "bg-emerald-500/60" : "bg-foreground/10",
                  )}
                />
              )}
              <span
                className={cn(
                  "relative z-10 h-8 w-8 rounded-full flex items-center justify-center shrink-0 border",
                  done && "bg-emerald-500/15 border-emerald-500/40 text-emerald-400",
                  active && "bg-sky-500/15 border-sky-500/50 text-sky-400 ring-4 ring-sky-500/10",
                  !done && !active && "bg-foreground/[0.03] border-foreground/10 text-muted-foreground/40",
                )}
              >
                {done ? (
                  <Check className="w-4 h-4" strokeWidth={3} />
                ) : (
                  <Icon className="w-4 h-4" />
                )}
              </span>
              <div className="pt-1">
                <div
                  className={cn(
                    "text-sm font-semibold",
                    !done && !active && "text-muted-foreground/55",
                  )}
                >
                  {s.label}
                </div>
                <div
                  className={cn(
                    "text-xs",
                    active ? "text-sky-400/90" : "text-muted-foreground/50",
                  )}
                >
                  {s.detail}
                </div>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

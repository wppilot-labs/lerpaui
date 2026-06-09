"use client";

import React from "react";
import { Check, Package, Truck, Home, ScanLine } from "lucide-react";
import { cn } from "../lib/cn";

interface TrackStep {
  id: string;
  label: string;
  detail: string;
  timestamp: string;
  icon: React.ComponentType<{ className?: string }>;
}

const STEPS: TrackStep[] = [
  { id: "placed",    label: "Order placed",       detail: "Confirmed · payment captured",      timestamp: "Mon 10:14", icon: Check },
  { id: "packed",    label: "Packed",             detail: "Picker assigned · BOS-DC",          timestamp: "Mon 11:32", icon: Package },
  { id: "shipped",   label: "Shipped",            detail: "DHL · tracking 1Z-4231-8821",       timestamp: "Mon 17:08", icon: ScanLine },
  { id: "out",       label: "Out for delivery",   detail: "Courier en route · NYC final mile", timestamp: "Wed 09:12", icon: Truck },
  { id: "delivered", label: "Delivered",          detail: "Front door · signature on file",    timestamp: "—",         icon: Home },
];

export interface OrderTrackingTimelineLiveProps {
  className?: string;
  currentStepIndex?: number;
  orderId?: string;
}

export function OrderTrackingTimelineLive({
  className,
  currentStepIndex = 3,
  orderId = "ORD-29F4-8821",
}: OrderTrackingTimelineLiveProps) {
  const current = STEPS[currentStepIndex];

  return (
    <div
      className={cn(
        "w-full max-w-sm border border-white/5 bg-zinc-950/40 rounded-2xl shadow-2xl p-5 backdrop-blur-xl",
        className,
      )}
      role="region"
      aria-label="Live order tracking timeline"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex flex-col gap-1 font-mono select-none">
          <span className="text-[9px] uppercase tracking-widest font-bold text-primary">LIVE_TRACKING</span>
          <span className="text-[8px] text-white/40 uppercase font-semibold">{orderId}</span>
        </div>
        <span
          className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase text-emerald-400 bg-emerald-400/10 border border-emerald-400/25 rounded px-2 py-0.5 font-mono"
          aria-label={`Current status: ${current?.label ?? "unknown"}`}
        >
          <span
            aria-hidden="true"
            className="w-1.5 h-1.5 rounded-full bg-emerald-400"
            style={{ animation: "pulse-dot 1.6s ease-in-out infinite" }}
          />
          {current?.label ?? "—"}
        </span>
      </div>

      <ol className="relative space-y-3.5 pl-1">
        {STEPS.map((s, i) => {
          const done = i < currentStepIndex;
          const active = i === currentStepIndex;
          const Icon = s.icon;
          const last = i === STEPS.length - 1;

          return (
            <li
              key={s.id}
              aria-current={active ? "step" : undefined}
              className="relative flex items-start gap-3"
            >
              {!last ? (
                <span
                  aria-hidden="true"
                  className={cn(
                    "absolute left-[13px] top-7 w-px h-[calc(100%+6px)]",
                    done ? "bg-primary/60" : "bg-white/8",
                  )}
                />
              ) : null}
              <div
                aria-hidden="true"
                className={cn(
                  "relative shrink-0 w-7 h-7 rounded-full grid place-items-center border z-[1] transition-colors",
                  done && "bg-primary border-primary text-primary-foreground",
                  active && "bg-primary/15 border-primary text-primary",
                  !done && !active && "bg-white/[0.03] border-white/10 text-white/40",
                )}
              >
                {active ? (
                  <span
                    className="absolute inset-0 rounded-full border border-primary/60"
                    style={{
                      animation: "ai-glow-pulse 1.8s ease-in-out infinite",
                    }}
                  />
                ) : null}
                {done ? (
                  <Check className="w-3.5 h-3.5" />
                ) : (
                  <Icon className="w-3.5 h-3.5" />
                )}
              </div>
              <div className="flex-1 min-w-0 -mt-0.5">
                <div className="flex items-baseline justify-between gap-2">
                  <span
                    className={cn(
                      "text-xs font-bold",
                      active ? "text-white" : done ? "text-white/85" : "text-white/55",
                    )}
                  >
                    {s.label}
                  </span>
                  <span className="text-[10px] font-mono text-white/35 tabular-nums shrink-0">
                    {s.timestamp}
                  </span>
                </div>
                <p className="text-[11px] text-white/45 mt-0.5">{s.detail}</p>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

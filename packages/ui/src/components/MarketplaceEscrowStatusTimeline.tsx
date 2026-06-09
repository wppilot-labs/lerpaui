"use client";

import React from "react";
import { Check, Lock, Truck, PackageCheck, Banknote } from "lucide-react";
import { cn } from "../lib/cn";

type Step = { label: string; desc: string; time: string; Icon: React.ElementType };

const STEPS: Step[] = [
  { label: "Payment held", desc: "Funds secured in escrow", time: "May 28", Icon: Lock },
  { label: "Item shipped", desc: "Tracking #1Z998AA", time: "May 29", Icon: Truck },
  { label: "Delivered", desc: "Signed for by buyer", time: "Jun 2", Icon: PackageCheck },
  { label: "Funds released", desc: "Paid out to seller", time: "Pending", Icon: Banknote },
];

const CURRENT = 2; // index of in-progress step

export interface MarketplaceEscrowStatusTimelineProps {
  className?: string;
}

export function MarketplaceEscrowStatusTimeline({ className }: MarketplaceEscrowStatusTimelineProps) {
  return (
    <div className={cn("w-full max-w-md bg-card/45 backdrop-blur-xl border border-border/50 p-5 rounded-2xl shadow-xl font-sans text-foreground", className)}>
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-base font-bold">Escrow status</h3>
        <span className="text-xs tabular-nums font-semibold text-muted-foreground/60">$129.00 held</span>
      </div>

      <ol className="relative">
        {STEPS.map((s, i) => {
          const done = i < CURRENT;
          const active = i === CURRENT;
          const last = i === STEPS.length - 1;
          return (
            <li key={s.label} className="relative flex gap-3 pb-5 last:pb-0">
              {!last && (
                <span
                  aria-hidden="true"
                  className={cn("absolute left-[15px] top-8 bottom-0 w-px", done ? "bg-emerald-500/40" : "bg-foreground/[0.08]")}
                />
              )}
              <span
                className={cn(
                  "relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border",
                  done && "bg-emerald-500/15 border-emerald-500/40 text-emerald-600 dark:text-emerald-400",
                  active && "bg-primary/15 border-primary/50 text-primary",
                  !done && !active && "bg-foreground/[0.03] border-foreground/[0.1] text-muted-foreground/40",
                )}
              >
                {done ? <Check className="w-4 h-4" /> : <s.Icon className="w-4 h-4" />}
              </span>
              <div className="flex-1 -mt-0.5">
                <div className="flex items-center justify-between">
                  <span className={cn("text-sm font-semibold", !done && !active && "text-muted-foreground/55")}>{s.label}</span>
                  <span className="text-[11px] text-muted-foreground/45">{s.time}</span>
                </div>
                <p className="text-xs text-muted-foreground/55 mt-0.5">{s.desc}</p>
                {active && (
                  <span className="mt-1 inline-block text-[11px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded bg-primary/10 text-primary border border-primary/20">
                    In progress
                  </span>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

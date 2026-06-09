"use client";

import React from "react";
import { Coins, ArrowUp, ArrowDown } from "lucide-react";
import { cn } from "../lib/cn";

const RATE_IN = 0.0025; // per 1K
const RATE_OUT = 0.01;

const rows = [
  { id: "in", label: "Input tokens", tokens: 1840, rate: RATE_IN, icon: ArrowUp, tone: "text-sky-400" },
  { id: "out", label: "Output tokens", tokens: 612, rate: RATE_OUT, icon: ArrowDown, tone: "text-emerald-400" },
];

export interface AiTokenCostSectionProps {
  className?: string;
}

export function AiTokenCostSection({ className }: AiTokenCostSectionProps) {
  const total = rows.reduce((s, r) => s + (r.tokens / 1000) * r.rate, 0);
  const totalTokens = rows.reduce((s, r) => s + r.tokens, 0);

  return (
    <div
      className={cn(
        "w-full max-w-sm bg-card/45 backdrop-blur-xl border border-border/50 rounded-2xl shadow-xl p-5 font-sans text-foreground",
        className,
      )}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-bold flex items-center gap-1.5">
          <Coins className="w-4 h-4 text-amber-400" /> Token cost
        </h3>
        <span className="text-xs text-muted-foreground/45">This request</span>
      </div>

      <div className="rounded-xl border border-foreground/[0.06] bg-foreground/[0.02] divide-y divide-foreground/[0.05]">
        {rows.map((r) => {
          const Icon = r.icon;
          const cost = (r.tokens / 1000) * r.rate;
          return (
            <div key={r.id} className="flex items-center gap-3 px-3.5 py-3">
              <Icon className={cn("w-4 h-4 shrink-0", r.tone)} />
              <div className="min-w-0 flex-1">
                <div className="text-sm font-semibold">{r.label}</div>
                <div className="text-xs text-muted-foreground/50 tabular-nums">
                  {r.tokens.toLocaleString()} tok · ${r.rate.toFixed(4)}/1K
                </div>
              </div>
              <div className="text-sm font-bold tabular-nums">${cost.toFixed(4)}</div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 flex items-end justify-between border-t border-foreground/[0.06] pt-3">
        <div>
          <div className="text-xs uppercase tracking-wider text-muted-foreground/40 font-bold">Total</div>
          <div className="text-xs text-muted-foreground/50 tabular-nums">
            {totalTokens.toLocaleString()} tokens
          </div>
        </div>
        <div className="text-3xl font-black tabular-nums">${total.toFixed(4)}</div>
      </div>
    </div>
  );
}

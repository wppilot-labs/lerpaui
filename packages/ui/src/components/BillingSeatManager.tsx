"use client";

import { useState } from "react";
import { Minus, Plus, Users } from "lucide-react";
import { cn } from "../lib/cn";

const PRICE_PER_SEAT = 12;
const USED = 8;
const MIN = USED;
const MAX = 50;

export interface BillingSeatManagerProps {
  className?: string;
}

export function BillingSeatManager({ className }: BillingSeatManagerProps) {
  const [seats, setSeats] = useState(12);
  const dec = () => setSeats((s) => Math.max(MIN, s - 1));
  const inc = () => setSeats((s) => Math.min(MAX, s + 1));
  const usedPct = Math.round((USED / seats) * 100);

  return (
    <div className={cn("w-full max-w-md bg-card backdrop-blur-xl border border-border p-5 rounded-2xl shadow-sm font-sans text-foreground", className)}>
      <div className="mb-4 flex items-center gap-2">
        <Users className="w-4 h-4 text-primary" />
        <h3 className="text-sm font-bold">Manage seats</h3>
      </div>

      <div className="mb-4 flex items-center justify-between rounded-xl border border-border bg-foreground/[0.02] p-4">
        <div>
          <p className="text-sm font-semibold">Team seats</p>
          <p className="text-xs text-muted-foreground">{USED} in use · min {MIN}</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={dec}
            disabled={seats <= MIN}
            aria-label="Remove a seat"
            className="grid h-9 w-9 place-items-center rounded-lg border border-border bg-foreground/[0.03] text-foreground transition-colors hover:bg-foreground/[0.06] disabled:cursor-not-allowed disabled:opacity-30"
          >
            <Minus className="h-4 w-4" />
          </button>
          <span className="w-10 text-center text-2xl font-black tabular-nums" aria-live="polite">
            {seats}
          </span>
          <button
            type="button"
            onClick={inc}
            disabled={seats >= MAX}
            aria-label="Add a seat"
            className="grid h-9 w-9 place-items-center rounded-lg border border-border bg-foreground/[0.03] text-foreground transition-colors hover:bg-foreground/[0.06] disabled:cursor-not-allowed disabled:opacity-30"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="mb-4">
        <div className="mb-1.5 flex justify-between text-xs">
          <span className="font-medium text-muted-foreground">Seats used</span>
          <span className="font-semibold">
            {USED} / {seats}
          </span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-foreground/[0.06]">
          <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${usedPct}%` }} />
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-border pt-4">
        <span className="text-sm text-muted-foreground">
          {seats} seats × ${PRICE_PER_SEAT}
        </span>
        <span className="text-lg font-black">
          ${seats * PRICE_PER_SEAT}
          <span className="text-xs font-normal text-muted-foreground">/mo</span>
        </span>
      </div>
    </div>
  );
}

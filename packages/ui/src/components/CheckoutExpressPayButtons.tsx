"use client";

import React, { useEffect, useRef, useState } from "react";
import { Loader2, Check } from "lucide-react";
import { cn } from "../lib/cn";

type Wallet = "apple" | "google" | "paypal";
type Status = "idle" | "loading" | "ok";

export interface CheckoutExpressPayButtonsProps {
  className?: string;
  amountLabel?: string;
}

const WALLETS: { id: Wallet; label: string; bg: string; fg: string; brand: string }[] = [
  { id: "apple", label: "Pay", bg: "bg-white text-black", fg: "text-black", brand: "" },
  { id: "google", label: "Pay", bg: "bg-black text-white border border-white/15", fg: "text-white", brand: "" },
  { id: "paypal", label: "", bg: "bg-[#003087] text-white", fg: "text-white", brand: "" },
];

export function CheckoutExpressPayButtons({
  className,
  amountLabel = "$148.00",
}: CheckoutExpressPayButtonsProps) {
  const [state, setState] = useState<Record<Wallet, Status>>({
    apple: "idle",
    google: "idle",
    paypal: "idle",
  });
  const timers = useRef<number[]>([]);

  useEffect(() => () => {
    timers.current.forEach((t) => window.clearTimeout(t));
    timers.current = [];
  }, []);

  const press = (id: Wallet) => {
    if (state[id] !== "idle") return;
    setState((s) => ({ ...s, [id]: "loading" }));
    const t1 = window.setTimeout(() => {
      setState((s) => ({ ...s, [id]: "ok" }));
      const t2 = window.setTimeout(() => {
        setState((s) => ({ ...s, [id]: "idle" }));
      }, 1600);
      timers.current.push(t2);
    }, 1100);
    timers.current.push(t1);
  };

  return (
    <div
      className={cn(
        "w-full max-w-sm border border-white/5 bg-zinc-950/40 rounded-2xl shadow-2xl p-4 backdrop-blur-xl",
        className,
      )}
    >
      <div className="flex flex-col gap-1 font-mono select-none mb-3">
        <span className="text-[9px] uppercase tracking-widest font-bold text-primary">EXPRESS_PAY_BUTTONS</span>
        <span className="text-[8px] text-white/40 uppercase font-semibold">One-tap wallets · {amountLabel}</span>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {WALLETS.map((w) => {
          const s = state[w.id];
          return (
            <button
              key={w.id}
              type="button"
              aria-label={`Pay with ${w.id === "apple" ? "Apple Pay" : w.id === "google" ? "Google Pay" : "PayPal"} ${amountLabel}`}
              aria-busy={s === "loading"}
              disabled={s !== "idle"}
              onClick={() => press(w.id)}
              className={cn(
                "h-11 rounded-xl flex items-center justify-center gap-1 text-[12px] font-bold tracking-tight select-none",
                "transition-transform active:scale-[0.97] disabled:opacity-90 disabled:cursor-progress",
                w.bg,
              )}
            >
              {s === "loading" ? (
                <Loader2 aria-hidden="true" className="w-3.5 h-3.5 animate-spin" />
              ) : s === "ok" ? (
                <Check aria-hidden="true" className="w-3.5 h-3.5" />
              ) : (
                <WalletGlyph id={w.id} />
              )}
            </button>
          );
        })}
      </div>

      <div className="mt-3 flex items-center gap-2 text-[10px] text-white/40 font-mono">
        <span className="h-px flex-1 bg-white/5" />
        <span>or pay by card</span>
        <span className="h-px flex-1 bg-white/5" />
      </div>
    </div>
  );
}

function WalletGlyph({ id }: { id: Wallet }) {
  if (id === "apple") {
    return (
      <span className="flex items-center gap-0.5">
        <svg aria-hidden="true" viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current">
          <path d="M16.4 12.7c0-2.7 2.2-4 2.3-4-1.2-1.8-3.2-2-3.9-2-1.7-.2-3.2 1-4 1-.9 0-2.1-1-3.5-1-1.8 0-3.5 1-4.4 2.7-1.9 3.3-.5 8.1 1.3 10.8.9 1.3 2 2.7 3.4 2.7s1.9-.9 3.5-.9 2.1.9 3.5.9 2.4-1.3 3.3-2.6c1-1.5 1.4-3 1.4-3.1-.1-.1-2.7-1-2.9-4.5zM13.7 4.1c.7-.9 1.2-2.1 1.1-3.3-1 0-2.3.7-3 1.5-.7.8-1.3 2-1.1 3.2 1.2.1 2.3-.6 3-1.4z"/>
        </svg>
        <span>Pay</span>
      </span>
    );
  }
  if (id === "google") {
    return (
      <span className="flex items-center gap-1">
        <span className="text-[11px] tracking-tight">
          <span className="text-[#4285F4]">G</span>
          <span className="text-[#EA4335]">o</span>
          <span className="text-[#FBBC05]">o</span>
          <span className="text-[#4285F4]">g</span>
          <span className="text-[#34A853]">l</span>
          <span className="text-[#EA4335]">e</span>
        </span>
        <span>Pay</span>
      </span>
    );
  }
  return (
    <span className="flex items-center gap-0.5">
      <span className="italic font-extrabold">Pay</span>
      <span className="italic font-extrabold text-[#009cde]">Pal</span>
    </span>
  );
}

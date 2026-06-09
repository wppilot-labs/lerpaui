"use client";

import React, { useState } from "react";
import { Check } from "lucide-react";
import { cn } from "../lib/cn";

type Brand = "visa" | "mc" | "amex";

interface SavedCard {
  id: string;
  brand: Brand;
  last4: string;
  holder: string;
  exp: string;
}

const CARDS: SavedCard[] = [
  { id: "v-1", brand: "visa", last4: "4242", holder: "A. Marlow", exp: "08/28" },
  { id: "m-2", brand: "mc",   last4: "5577", holder: "A. Marlow", exp: "12/27" },
  { id: "a-3", brand: "amex", last4: "3782", holder: "A. Marlow", exp: "05/29" },
];

const BRAND: Record<Brand, { name: string; glow: string; gradient: string; accent: string }> = {
  visa: {
    name: "VISA",
    glow: "hover:shadow-[0_8px_30px_-8px_rgba(26,49,255,0.55)]",
    gradient: "from-[#0a1e7a] via-[#1a31ff] to-[#3357ff]",
    accent: "text-white",
  },
  mc: {
    name: "Mastercard",
    glow: "hover:shadow-[0_8px_30px_-8px_rgba(244,99,32,0.55)]",
    gradient: "from-[#1a0d05] via-[#cc4422] to-[#f49920]",
    accent: "text-white",
  },
  amex: {
    name: "AMEX",
    glow: "hover:shadow-[0_8px_30px_-8px_rgba(0,166,224,0.55)]",
    gradient: "from-[#003d5b] via-[#006fcf] to-[#00a6e0]",
    accent: "text-white",
  },
};

export interface PaymentMethodCardSelectorProps {
  className?: string;
  cards?: SavedCard[];
  defaultSelected?: string;
}

export function PaymentMethodCardSelector({
  className,
  cards = CARDS,
  defaultSelected = "v-1",
}: PaymentMethodCardSelectorProps) {
  const [sel, setSel] = useState(defaultSelected);

  return (
    <div
      className={cn(
        "w-full max-w-sm border border-white/5 bg-zinc-950/40 rounded-2xl shadow-2xl p-4 backdrop-blur-xl",
        className,
      )}
    >
      <div className="flex flex-col gap-1 font-mono select-none mb-3">
        <span className="text-[9px] uppercase tracking-widest font-bold text-primary">SAVED_CARDS</span>
        <span className="text-[8px] text-white/40 uppercase font-semibold">Tap a card to charge it</span>
      </div>

      <div
        role="radiogroup"
        aria-label="Select saved payment card"
        className="flex flex-col gap-2.5"
      >
        {cards.map((c) => {
          const active = c.id === sel;
          const brand = BRAND[c.brand];
          return (
            <button
              key={c.id}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => setSel(c.id)}
              className={cn(
                "group relative w-full overflow-hidden rounded-xl border text-left transition-all duration-300",
                "px-3 py-3 flex items-center gap-3",
                "bg-gradient-to-br",
                brand.gradient,
                brand.glow,
                active
                  ? "border-white/60 ring-1 ring-white/30"
                  : "border-white/10 hover:border-white/30",
              )}
            >
              <span
                aria-hidden="true"
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{
                  background:
                    "radial-gradient(120% 100% at 0% 0%, rgba(255,255,255,0.18), transparent 60%)",
                }}
              />
              <div className="relative w-9 h-6 rounded bg-white/10 flex items-center justify-center text-[8px] font-black tracking-wider text-white/90 ring-1 ring-white/15">
                {brand.name}
              </div>
              <div className="relative flex-1 min-w-0">
                <div className={cn("font-mono text-[12px] font-bold tracking-tight", brand.accent)}>
                  •••• {c.last4}
                </div>
                <div className="text-[10px] text-white/55 font-mono">
                  {c.holder} · exp {c.exp}
                </div>
              </div>
              <div
                className={cn(
                  "relative w-5 h-5 rounded-full grid place-items-center transition-all",
                  active
                    ? "bg-white text-black scale-100"
                    : "bg-white/10 text-transparent border border-white/20 scale-90",
                )}
                aria-hidden="true"
              >
                <Check className="w-3 h-3" />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

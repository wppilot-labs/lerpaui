"use client";

import React, { useState } from "react";
import { motion} from "framer-motion";
import { CreditCard } from "lucide-react";
import { cn } from "../lib/cn";

export function CreditCardVisualPay({ className }: { className?: string }) {
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [_focusedField, _setFocusedField] = useState<string | null>(null);

  const getCardType = () => {
    if (cardNumber.startsWith("4")) return "Visa";
    if (cardNumber.startsWith("5")) return "Mastercard";
    if (cardNumber.startsWith("3")) return "Amex";
    return "LaunchCard";
  };

  return (
    <div className={cn("w-full max-w-sm rounded-2xl border border-border/80 bg-card/40 p-5 backdrop-blur-xl shadow-2xl space-y-4", className)}>
      <div>
        <h3 className="text-sm font-bold text-foreground">Interactive Flat Pay</h3>
        <p className="text-[10px] text-muted-foreground">Modern coordinate tracking payment card</p>
      </div>

      {/* Modern Card Design */}
      <div className="relative w-full h-[160px] rounded-xl overflow-hidden bg-gradient-to-br from-zinc-900 via-neutral-900 to-zinc-950 border border-white/10 p-5 flex flex-col justify-between shadow-2xl">
        {/* Dynamic Glowing Accent Light */}
        <div className="absolute -top-10 -right-10 w-24 h-24 rounded-full bg-primary/20 blur-2xl pointer-events-none" />

        <div className="flex items-center justify-between">
          <CreditCard className="w-6 h-6 text-white/80" />
          <motion.span
            key={getCardType()}
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-[10px] font-bold text-white/90 uppercase tracking-widest font-mono bg-white/5 border border-white/10 px-2 py-0.5 rounded-md"
          >
            {getCardType()}
          </motion.span>
        </div>

        <div className="space-y-1">
          {/* Card Number display */}
          <div className="text-sm font-mono text-white/80 tracking-widest min-h-[20px] flex items-center">
            {cardNumber || "•••• •••• •••• ••••"}
          </div>
        </div>

        <div className="flex items-end justify-between">
          <div>
            <span className="text-[7px] text-muted-foreground uppercase font-semibold">Cardholder Name</span>
            <p className="text-[10px] font-mono text-white/70 tracking-wide uppercase truncate w-32 min-h-[15px]">
              {cardName || "YOUR NAME"}
            </p>
          </div>
          <div className="flex gap-4">
            <div>
              <span className="text-[7px] text-muted-foreground uppercase font-semibold">Expires</span>
              <p className="text-[10px] font-mono text-white/70 min-h-[15px]">{expiry || "MM/YY"}</p>
            </div>
            <div>
              <span className="text-[7px] text-muted-foreground uppercase font-semibold">CVV</span>
              <p className="text-[10px] font-mono text-white/70 min-h-[15px]">{"•••"}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Checkout Inputs */}
      <div className="space-y-2.5">
        <input
          type="text"
          maxLength={19}
          placeholder="Card Number"
          value={cardNumber}
          onChange={(e) => setCardNumber(e.target.value)}
          className="w-full bg-zinc-950/40 border border-border/50 rounded-xl px-3 py-1.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/60 transition-colors"
        />

        <input
          type="text"
          placeholder="Cardholder Name"
          value={cardName}
          onChange={(e) => setCardName(e.target.value)}
          className="w-full bg-zinc-950/40 border border-border/50 rounded-xl px-3 py-1.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/60 transition-colors"
        />

        <div className="grid grid-cols-2 gap-2">
          <input
            type="text"
            maxLength={5}
            placeholder="MM/YY"
            value={expiry}
            onChange={(e) => setExpiry(e.target.value)}
            className="w-full bg-zinc-950/40 border border-border/50 rounded-xl px-3 py-1.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/60 transition-colors text-center"
          />
          <input
            type="password"
            maxLength={3}
            placeholder="CVV"
            value={cvv}
            onChange={(e) => setCvv(e.target.value)}
            className="w-full bg-zinc-950/40 border border-border/50 rounded-xl px-3 py-1.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/60 transition-colors text-center"
          />
        </div>
      </div>
    </div>
  );
}

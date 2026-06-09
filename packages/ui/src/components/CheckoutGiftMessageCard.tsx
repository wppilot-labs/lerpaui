"use client";

import { useState } from "react";
import { Gift } from "lucide-react";
import { cn } from "../lib/cn";

const MAX = 200;

export interface CheckoutGiftMessageCardProps {
  className?: string;
}

export function CheckoutGiftMessageCard({ className }: CheckoutGiftMessageCardProps) {
  const [isGift, setIsGift] = useState(false);
  const [message, setMessage] = useState("");

  return (
    <div className={cn("w-full max-w-md bg-card backdrop-blur-xl border border-border p-5 rounded-2xl shadow-sm font-sans text-foreground", className)}>
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="grid h-11 w-11 place-items-center rounded-lg bg-primary/15 text-primary">
            <Gift className="h-5 w-5" />
          </span>
          <div>
            <p className="text-sm font-bold">This is a gift</p>
            <p className="text-xs text-muted-foreground">Add a message, hide the price</p>
          </div>
        </div>

        <button
          type="button"
          role="switch"
          aria-checked={isGift}
          aria-label="Mark order as a gift"
          onClick={() => setIsGift((v) => !v)}
          className={cn(
            "relative h-5 w-9 shrink-0 rounded-full transition-colors",
            isGift ? "bg-primary" : "bg-foreground/[0.12]"
          )}
        >
          <span
            className={cn(
              "absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform",
              isGift ? "translate-x-4" : "translate-x-0.5"
            )}
          />
        </button>
      </div>

      {isGift && (
        <div className="mt-4">
          <label htmlFor="gift-message" className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-muted-foreground">
            Gift message
          </label>
          <textarea
            id="gift-message"
            value={message}
            onChange={(e) => setMessage(e.target.value.slice(0, MAX))}
            rows={3}
            placeholder="Happy birthday! Hope you love it 🎉"
            className="w-full resize-none rounded-xl border border-border bg-foreground/[0.03] px-3 py-2.5 text-sm placeholder:text-muted-foreground/40 focus:outline-none focus:ring-1 focus:ring-primary/50"
          />
          <div className="mt-1 text-right text-xs text-muted-foreground">
            {message.length}/{MAX}
          </div>
        </div>
      )}
    </div>
  );
}

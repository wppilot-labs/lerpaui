"use client";

import React, { useState } from "react";
import { Mail } from "lucide-react";
import { cn } from "../lib/cn";

const field = "w-full bg-foreground/[0.03] border border-foreground/[0.06] rounded-xl px-3 py-2.5 text-sm focus:ring-1 focus:ring-primary/50 focus:border-primary/30 focus:outline-none";
const label = "block text-xs font-semibold text-muted-foreground/70 mb-1";

export interface EcommerceCheckoutContactProps {
  className?: string;
}

export function EcommerceCheckoutContact({ className }: EcommerceCheckoutContactProps) {
  const [news, setNews] = useState(true);

  return (
    <form onSubmit={(e) => e.preventDefault()} className={cn("w-full max-w-sm bg-card/45 backdrop-blur-xl border border-border/50 p-5 rounded-2xl shadow-xl font-sans text-foreground", className)}>
      <h3 className="text-base font-bold flex items-center gap-1.5 mb-4"><Mail className="w-4 h-4 text-primary" /> Contact</h3>

      <div className="mb-3">
        <label htmlFor="cc-email" className={label}>Email</label>
        <input id="cc-email" type="email" autoComplete="email" placeholder="you@example.com" className={field} />
      </div>
      <div className="mb-4">
        <label htmlFor="cc-phone" className={label}>Phone (for delivery updates)</label>
        <input id="cc-phone" type="tel" autoComplete="tel" placeholder="+1 (555) 000-0000" className={field} />
      </div>

      <label className="flex items-center gap-2.5 mb-4 cursor-pointer">
        <button
          type="button"
          role="checkbox"
          aria-checked={news}
          onClick={() => setNews((n) => !n)}
          className={cn("h-4 w-4 rounded-[5px] border flex items-center justify-center shrink-0 transition-colors", news ? "bg-primary border-primary" : "border-foreground/20")}
        >
          {news && <svg viewBox="0 0 12 12" className="w-2.5 h-2.5 text-primary-foreground" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M2.5 6.5L5 9l4.5-5" strokeLinecap="round" strokeLinejoin="round" /></svg>}
        </button>
        <span className="text-xs text-muted-foreground/75">Email me with news and offers</span>
      </label>

      <button type="submit" className="w-full py-2.5 text-sm font-bold rounded-xl bg-primary text-primary-foreground hover:brightness-110 transition-all">Continue</button>
    </form>
  );
}

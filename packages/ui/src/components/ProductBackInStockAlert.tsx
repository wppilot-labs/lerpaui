"use client";

import React, { useEffect, useRef, useState } from "react";
import { BellRing, Check, Mail } from "lucide-react";
import { cn } from "../lib/cn";

export interface ProductBackInStockAlertProps {
  className?: string;
}

export function ProductBackInStockAlert({ className }: ProductBackInStockAlertProps) {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setDone(true);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      setDone(false);
      setEmail("");
    }, 3000);
  };

  return (
    <div
      className={cn(
        "w-full max-w-md bg-card/45 backdrop-blur-xl border border-border/50 p-5 rounded-2xl shadow-xl font-sans text-foreground",
        className,
      )}
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-amber-500/30 to-orange-500/15 flex items-center justify-center shrink-0">
          <BellRing className="w-5 h-5 text-amber-400" />
        </div>
        <div>
          <h3 className="text-base font-bold">Out of stock</h3>
          <p className="text-xs text-muted-foreground/60">
            Aero Pro · Cobalt · EU 42
          </p>
        </div>
      </div>

      <p className="text-sm text-muted-foreground/70 mb-3">
        Get an email the moment this size is back.
      </p>

      {done ? (
        <div className="flex items-center gap-2 rounded-xl bg-emerald-500/10 border border-emerald-500/25 px-3.5 py-3 text-emerald-400">
          <Check className="w-4 h-4 shrink-0" />
          <p className="text-sm font-semibold">
            We&apos;ll notify you when it&apos;s back in stock.
          </p>
        </div>
      ) : (
        <form onSubmit={submit} className="space-y-2.5">
          <label htmlFor="bis-email" className="sr-only">
            Email address
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/35" />
            <input
              id="bis-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full bg-foreground/[0.03] border border-foreground/[0.06] rounded-xl pl-9 pr-3 py-2.5 text-sm focus:outline-none focus:border-primary/40 transition-colors"
            />
          </div>
          <button
            type="submit"
            className="w-full h-10 rounded-xl bg-primary text-primary-foreground text-sm font-bold hover:opacity-90 transition-opacity"
          >
            Notify me
          </button>
        </form>
      )}

      <p className="mt-3 text-xs text-muted-foreground/45">
        We&apos;ll only email you once. No spam, ever.
      </p>
    </div>
  );
}

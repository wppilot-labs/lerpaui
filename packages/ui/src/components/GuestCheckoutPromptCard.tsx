"use client";

import React, { useId, useState } from "react";
import { ArrowRight, Mail, ShieldCheck, UserRound, Zap } from "lucide-react";
import { cn } from "../lib/cn";

export interface GuestCheckoutPromptCardProps {
  className?: string;
}

export function GuestCheckoutPromptCard({ className }: GuestCheckoutPromptCardProps) {
  const [mode, setMode] = useState<"guest" | "signin">("guest");
  const emailId = useId();
  const pwId = useId();

  return (
    <div
      className={cn(
        "w-full max-w-sm border border-white/5 bg-zinc-950/40 rounded-2xl shadow-2xl p-5 backdrop-blur-xl",
        className,
      )}
    >
      <div className="flex flex-col gap-1 font-mono select-none mb-4">
        <span className="text-[9px] uppercase tracking-widest font-bold text-primary">CHECKOUT_AS</span>
        <span className="text-[8px] text-white/40 uppercase font-semibold">Faster · order history saved</span>
      </div>

      <div
        role="tablist"
        aria-label="Choose checkout mode"
        className="flex bg-white/[0.03] border border-white/5 rounded-xl p-0.5 mb-4"
      >
        <ModeTab id="guest" active={mode === "guest"} onSelect={() => setMode("guest")}>
          <Zap aria-hidden="true" className="w-3 h-3" />
          Continue as guest
        </ModeTab>
        <ModeTab id="signin" active={mode === "signin"} onSelect={() => setMode("signin")}>
          <UserRound aria-hidden="true" className="w-3 h-3" />
          Sign in
        </ModeTab>
      </div>

      {mode === "guest" ? (
        <form
          className="space-y-3"
          onSubmit={(e) => e.preventDefault()}
          aria-labelledby={`${emailId}-tab`}
        >
          <div>
            <label htmlFor={emailId} className="block text-[10px] font-bold text-white/55 uppercase tracking-wider mb-1">
              Email for receipt
            </label>
            <div className="relative">
              <Mail aria-hidden="true" className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/40" />
              <input
                id={emailId}
                type="email"
                autoComplete="email"
                required
                placeholder="you@lerpaui.com"
                className="w-full pl-9 pr-3 py-2.5 text-xs bg-white/[0.03] border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:ring-1 focus:ring-primary/50 focus:border-primary/40"
              />
            </div>
          </div>
          <button
            type="submit"
            className="w-full h-10 rounded-xl bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center gap-1.5 hover:brightness-110 transition-all"
          >
            <span>Continue to shipping</span>
            <ArrowRight aria-hidden="true" className="w-3.5 h-3.5" />
          </button>
        </form>
      ) : (
        <form className="space-y-3" onSubmit={(e) => e.preventDefault()}>
          <div>
            <label htmlFor={`${emailId}-si`} className="block text-[10px] font-bold text-white/55 uppercase tracking-wider mb-1">
              Email
            </label>
            <input
              id={`${emailId}-si`}
              type="email"
              autoComplete="email"
              placeholder="you@lerpaui.com"
              className="w-full px-3 py-2.5 text-xs bg-white/[0.03] border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:ring-1 focus:ring-primary/50 focus:border-primary/40"
            />
          </div>
          <div>
            <label htmlFor={pwId} className="block text-[10px] font-bold text-white/55 uppercase tracking-wider mb-1">
              Password
            </label>
            <input
              id={pwId}
              type="password"
              autoComplete="current-password"
              placeholder="••••••••"
              className="w-full px-3 py-2.5 text-xs bg-white/[0.03] border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:ring-1 focus:ring-primary/50 focus:border-primary/40"
            />
          </div>
          <button
            type="submit"
            className="w-full h-10 rounded-xl bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center gap-1.5 hover:brightness-110 transition-all"
          >
            <span>Sign in &amp; checkout</span>
            <ArrowRight aria-hidden="true" className="w-3.5 h-3.5" />
          </button>
        </form>
      )}

      <ul className="mt-4 space-y-1.5">
        {[
          "No password required · just an email",
          "Track your order in real time",
          "256-bit SSL · PCI-DSS compliant",
        ].map((t) => (
          <li key={t} className="flex items-center gap-2 text-[10px] text-white/50">
            <ShieldCheck aria-hidden="true" className="w-3 h-3 text-emerald-400 shrink-0" />
            <span>{t}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ModeTab({
  id,
  active,
  onSelect,
  children,
}: {
  id: string;
  active: boolean;
  onSelect: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      role="tab"
      id={`${id}-tab`}
      aria-selected={active}
      onClick={onSelect}
      className={cn(
        "flex-1 inline-flex items-center justify-center gap-1.5 h-8 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all",
        active
          ? "bg-white/10 text-white shadow-sm"
          : "text-white/55 hover:text-white",
      )}
    >
      {children}
    </button>
  );
}

"use client";

import React, { useState } from "react";
import { Laptop, MapPin, Clock, Check, ShieldX, ShieldCheck } from "lucide-react";
import { cn } from "../lib/cn";

export interface AuthDeviceApprovalCardProps {
  className?: string;
}

type Decision = "pending" | "approved" | "denied";

export function AuthDeviceApprovalCard({ className }: AuthDeviceApprovalCardProps) {
  const [decision, setDecision] = useState<Decision>("pending");

  return (
    <div
      className={cn(
        "w-full max-w-md bg-card/45 backdrop-blur-xl border border-border/50 p-5 rounded-2xl shadow-xl font-sans text-foreground",
        className,
      )}
    >
      <div className="flex items-center gap-2 mb-1">
        <ShieldCheck className="w-5 h-5 text-primary" aria-hidden />
        <h3 className="text-base font-bold">New sign-in attempt</h3>
      </div>
      <p className="text-sm text-muted-foreground/65 mb-4">
        Someone is trying to sign in to your account. Was this you?
      </p>

      <div className="rounded-xl bg-foreground/[0.02] border border-foreground/[0.05] p-4 mb-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <Laptop className="w-5 h-5" aria-hidden />
          </div>
          <div className="min-w-0">
            <div className="text-sm font-semibold truncate">MacBook Pro · Chrome</div>
            <div className="text-xs text-muted-foreground/55">macOS Sonoma 14.5</div>
          </div>
        </div>
        <ul className="space-y-1.5">
          <li className="flex items-center gap-2 text-xs text-muted-foreground/70">
            <MapPin className="w-3.5 h-3.5 text-muted-foreground/40 shrink-0" aria-hidden />
            San Francisco, CA · 192.0.2.14
          </li>
          <li className="flex items-center gap-2 text-xs text-muted-foreground/70">
            <Clock className="w-3.5 h-3.5 text-muted-foreground/40 shrink-0" aria-hidden />
            Just now · 2:14 PM PDT
          </li>
        </ul>
      </div>

      {decision === "pending" ? (
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => setDecision("approved")}
            className="flex-1 py-2.5 text-xs font-bold rounded-xl bg-primary text-primary-foreground hover:brightness-110 transition-all inline-flex items-center justify-center gap-1.5"
          >
            <Check className="w-4 h-4" aria-hidden /> Yes, it&apos;s me
          </button>
          <button
            type="button"
            onClick={() => setDecision("denied")}
            className="flex-1 py-2.5 text-xs font-bold rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/15 transition-all inline-flex items-center justify-center gap-1.5"
          >
            <ShieldX className="w-4 h-4" aria-hidden /> No, deny
          </button>
        </div>
      ) : (
        <div
          className={cn(
            "flex items-center gap-2 p-3 rounded-xl text-xs font-semibold",
            decision === "approved"
              ? "bg-emerald-500/10 border border-emerald-500/25 text-emerald-400"
              : "bg-red-500/10 border border-red-500/25 text-red-400",
          )}
          role="status"
        >
          {decision === "approved" ? <Check className="w-4 h-4 shrink-0" aria-hidden /> : <ShieldX className="w-4 h-4 shrink-0" aria-hidden />}
          {decision === "approved"
            ? "Device approved. You can continue signing in."
            : "Sign-in denied. We've secured your account."}
        </div>
      )}
    </div>
  );
}

"use client";

import React from "react";
import { ShieldCheck, KeyRound, Fingerprint, Clock, ChevronRight } from "lucide-react";
import { cn } from "../lib/cn";

type Factor = {
  id: string;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  status: string;
  ok: boolean;
};

const FACTORS: Factor[] = [
  { id: "2fa", icon: Fingerprint, title: "Two-factor authentication", status: "Enabled · Authenticator app", ok: true },
  { id: "recovery", icon: KeyRound, title: "Recovery codes", status: "8 of 10 remaining", ok: true },
  { id: "password", icon: Clock, title: "Password", status: "Changed 3 months ago", ok: false },
];

export interface AccountSecuritySectionProps {
  className?: string;
}

export function AccountSecuritySection({ className }: AccountSecuritySectionProps) {
  const score = 82;
  const r = 22;
  const circ = 2 * Math.PI * r;

  return (
    <div className={cn("w-full max-w-md bg-card/45 backdrop-blur-xl border border-border/50 p-5 rounded-2xl shadow-xl font-sans text-foreground", className)}>
      <div className="flex items-center gap-4 mb-5">
        <div className="relative h-14 w-14 shrink-0">
          <svg viewBox="0 0 56 56" className="h-14 w-14 -rotate-90">
            <circle cx="28" cy="28" r={r} fill="none" stroke="currentColor" strokeWidth="5" className="text-foreground/[0.08]" />
            <circle
              cx="28" cy="28" r={r} fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round"
              className="text-emerald-400" strokeDasharray={circ} strokeDashoffset={circ - (score / 100) * circ}
            />
          </svg>
          <span className="absolute inset-0 flex items-center justify-center text-lg font-black">{score}</span>
        </div>
        <div>
          <h3 className="text-base font-bold flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" /> Security
          </h3>
          <p className="text-xs text-muted-foreground/65 mt-0.5">Your account is well protected</p>
        </div>
      </div>

      <ul className="space-y-2">
        {FACTORS.map((f) => {
          const Icon = f.icon;
          return (
            <li key={f.id} className="flex items-center gap-3 p-3 rounded-xl bg-foreground/[0.02] border border-foreground/[0.04]">
              <div className={cn("h-8 w-8 rounded-lg flex items-center justify-center shrink-0", f.ok ? "bg-emerald-500/10 text-emerald-400" : "bg-amber-500/10 text-amber-400")}>
                <Icon className="w-4 h-4" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-sm font-semibold">{f.title}</div>
                <div className="text-xs text-muted-foreground/55">{f.status}</div>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground/30 shrink-0" />
            </li>
          );
        })}
      </ul>
    </div>
  );
}

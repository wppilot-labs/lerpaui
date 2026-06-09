"use client";

import React, { useState } from "react";
import { Fingerprint, Mail, Smartphone, ArrowRight, Check } from "lucide-react";
import { cn } from "../lib/cn";

export interface AuthPasswordlessLoginProps {
  className?: string;
}

const METHODS = [
  { id: "passkey", icon: Fingerprint, title: "Use a passkey", desc: "Fingerprint, face, or device PIN" },
  { id: "email", icon: Mail, title: "Email me a link", desc: "Sign in via a one-time magic link" },
  { id: "sms", icon: Smartphone, title: "Text me a code", desc: "6-digit code to •••• 4821" },
];

export function AuthPasswordlessLogin({ className }: AuthPasswordlessLoginProps) {
  const [selected, setSelected] = useState("passkey");

  return (
    <div
      className={cn(
        "w-full max-w-sm bg-card/45 backdrop-blur-xl border border-border/50 p-5 rounded-2xl shadow-xl font-sans text-foreground",
        className,
      )}
    >
      <div className="text-center mb-5">
        <h3 className="text-lg font-bold">Choose how to sign in</h3>
        <p className="text-sm text-muted-foreground/65 mt-0.5">Pick a passwordless method to continue.</p>
      </div>

      <div role="radiogroup" aria-label="Sign-in method" className="space-y-2">
        {METHODS.map((m) => {
          const Icon = m.icon;
          const active = selected === m.id;
          return (
            <button
              key={m.id}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => setSelected(m.id)}
              className={cn(
                "w-full flex items-center gap-3 p-3 rounded-xl border text-left transition-all",
                active
                  ? "bg-primary/10 border-primary/40"
                  : "bg-foreground/[0.02] border-foreground/[0.06] hover:bg-foreground/[0.04] hover:border-foreground/[0.12]",
              )}
            >
              <span
                className={cn(
                  "h-9 w-9 rounded-lg flex items-center justify-center shrink-0",
                  active ? "bg-primary/15 text-primary" : "bg-foreground/[0.04] text-muted-foreground/60",
                )}
              >
                <Icon className="w-4 h-4" aria-hidden />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-semibold">{m.title}</span>
                <span className="block text-xs text-muted-foreground/55">{m.desc}</span>
              </span>
              <span
                className={cn(
                  "h-4 w-4 rounded-full border flex items-center justify-center shrink-0",
                  active ? "border-primary bg-primary text-primary-foreground" : "border-foreground/20",
                )}
                aria-hidden
              >
                {active && <Check className="w-2.5 h-2.5" />}
              </span>
            </button>
          );
        })}
      </div>

      <button
        type="button"
        className="w-full mt-4 py-2.5 text-xs font-bold rounded-xl bg-primary text-primary-foreground hover:brightness-110 transition-all inline-flex items-center justify-center gap-1.5"
      >
        Continue
        <ArrowRight className="w-4 h-4" aria-hidden />
      </button>

      <p className="text-center text-xs text-muted-foreground/60 mt-4">
        Prefer a password?{" "}
        <a href="/" className="font-semibold text-primary hover:underline">
          Sign in the classic way
        </a>
      </p>
    </div>
  );
}

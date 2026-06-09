"use client";

import React from "react";
import { KeyRound, Fingerprint, Zap, ShieldCheck, ChevronRight } from "lucide-react";
import { cn } from "../lib/cn";

export interface AuthPasskeyLoginSectionProps {
  className?: string;
}

const STEPS = [
  { icon: Fingerprint, title: "Verify it's you", text: "Confirm with your device biometrics or PIN." },
  { icon: Zap, title: "Sign in instantly", text: "No passwords to type or remember." },
  { icon: ShieldCheck, title: "Stay protected", text: "Passkeys can't be phished or reused." },
];

export function AuthPasskeyLoginSection({ className }: AuthPasskeyLoginSectionProps) {
  return (
    <div
      className={cn(
        "w-full max-w-2xl bg-card/45 backdrop-blur-xl border border-border/50 rounded-2xl shadow-xl font-sans text-foreground overflow-hidden grid md:grid-cols-[1.1fr_1fr]",
        className,
      )}
    >
      <div className="p-7">
        <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-primary mb-3">
          <KeyRound className="w-4 h-4" aria-hidden /> Passkey
        </div>
        <h2 className="text-3xl font-black leading-tight">Sign in faster with a passkey</h2>
        <p className="text-sm text-muted-foreground/65 mt-2 leading-relaxed">
          Skip the password. Authenticate with the same fingerprint, face, or PIN you use to unlock your device.
        </p>

        <button
          type="button"
          className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold rounded-xl bg-primary text-primary-foreground hover:brightness-110 transition-all"
        >
          <Fingerprint className="w-4 h-4" aria-hidden /> Continue with passkey
        </button>

        <p className="text-xs text-muted-foreground/55 mt-3">
          New here?{" "}
          <a href="/" className="font-semibold text-primary hover:underline">Create an account</a>
        </p>
      </div>

      <div className="p-7 bg-gradient-to-br from-primary/[0.07] to-transparent border-t md:border-t-0 md:border-l border-foreground/[0.06]">
        <ol className="space-y-4">
          {STEPS.map((step, i) => {
            const Icon = step.icon;
            return (
              <li key={step.title} className="flex items-start gap-3">
                <span className="relative h-9 w-9 shrink-0 rounded-lg bg-primary/10 border border-primary/20 text-primary flex items-center justify-center">
                  <Icon className="w-4 h-4" aria-hidden />
                  <span className="absolute -top-1.5 -right-1.5 h-4 w-4 rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center">
                    {i + 1}
                  </span>
                </span>
                <div>
                  <div className="text-sm font-semibold">{step.title}</div>
                  <div className="text-xs text-muted-foreground/60 mt-0.5 leading-snug">{step.text}</div>
                </div>
              </li>
            );
          })}
        </ol>

        <a
          href="/"
          className="mt-6 inline-flex items-center gap-1 text-sm font-semibold text-muted-foreground/60 hover:text-foreground transition-colors"
        >
          Learn how passkeys work <ChevronRight className="w-4 h-4" aria-hidden />
        </a>
      </div>
    </div>
  );
}

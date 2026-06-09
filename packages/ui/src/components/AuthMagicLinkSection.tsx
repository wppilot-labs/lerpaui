"use client";

import React, { useState } from "react";
import { Mail, Sparkles, MailCheck, Zap, ShieldCheck, Clock } from "lucide-react";
import { cn } from "../lib/cn";

export interface AuthMagicLinkSectionProps {
  className?: string;
}

const BENEFITS = [
  { icon: Zap, text: "No password to remember" },
  { icon: ShieldCheck, text: "Phishing-resistant by design" },
  { icon: Clock, text: "Links expire after 10 minutes" },
];

export function AuthMagicLinkSection({ className }: AuthMagicLinkSectionProps) {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSent(true);
  };

  return (
    <div
      className={cn(
        "w-full max-w-2xl bg-card/45 backdrop-blur-xl border border-border/50 p-7 rounded-2xl shadow-xl font-sans text-foreground",
        className,
      )}
    >
      <div className="text-center max-w-md mx-auto">
        <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-primary mb-3">
          <Sparkles className="w-4 h-4" aria-hidden /> Passwordless
        </div>
        <h2 className="text-3xl font-black leading-tight">Sign in without a password</h2>
        <p className="text-sm text-muted-foreground/65 mt-2 leading-relaxed">
          We&apos;ll email you a one-time magic link. Tap it on any device to sign in securely.
        </p>
      </div>

      <div className="max-w-md mx-auto mt-6">
        {sent ? (
          <div className="flex items-center gap-3 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/25">
            <MailCheck className="w-5 h-5 text-emerald-400 shrink-0" aria-hidden />
            <p className="text-sm text-emerald-300/90 leading-relaxed">
              A magic link is on its way to <span className="font-semibold text-emerald-200">{email}</span>. Check your inbox to
              finish signing in.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <label className="sr-only" htmlFor="mls-email">Email address</label>
              <Mail className="absolute left-3 top-3 w-4 h-4 text-muted-foreground/40" aria-hidden />
              <input
                id="mls-email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                className="w-full bg-foreground/[0.03] border border-foreground/[0.06] rounded-xl pl-9 pr-3 py-2.5 text-sm placeholder:text-muted-foreground/30 focus:ring-1 focus:ring-primary/50 focus:border-primary/30 focus:outline-none"
              />
            </div>
            <button
              type="submit"
              className="py-2.5 px-5 text-xs font-bold rounded-xl bg-primary text-primary-foreground hover:brightness-110 transition-all inline-flex items-center justify-center gap-1.5 whitespace-nowrap"
            >
              <Sparkles className="w-4 h-4" aria-hidden /> Email me a link
            </button>
          </form>
        )}

        <ul className="grid sm:grid-cols-3 gap-3 mt-6">
          {BENEFITS.map((b) => {
            const Icon = b.icon;
            return (
              <li key={b.text} className="flex flex-col items-center text-center gap-1.5 p-3 rounded-xl bg-foreground/[0.02] border border-foreground/[0.05]">
                <span className="h-7 w-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                  <Icon className="w-3.5 h-3.5" aria-hidden />
                </span>
                <span className="text-xs text-muted-foreground/70 leading-snug">{b.text}</span>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

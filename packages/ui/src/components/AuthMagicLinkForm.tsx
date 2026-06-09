"use client";

import React, { useState } from "react";
import { Mail, Sparkles, MailCheck, ArrowLeft, RotateCw } from "lucide-react";
import { cn } from "../lib/cn";

export interface AuthMagicLinkFormProps {
  className?: string;
}

export function AuthMagicLinkForm({ className }: AuthMagicLinkFormProps) {
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
        "w-full max-w-sm bg-card/45 backdrop-blur-xl border border-border/50 p-6 rounded-2xl shadow-xl font-sans text-foreground text-center",
        className,
      )}
    >
      {sent ? (
        <>
          <div className="mx-auto h-12 w-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 flex items-center justify-center mb-4">
            <MailCheck className="w-6 h-6" aria-hidden />
          </div>
          <h3 className="text-lg font-bold">Magic link sent</h3>
          <p className="text-sm text-muted-foreground/65 mt-1.5 leading-relaxed">
            We emailed a sign-in link to <span className="font-semibold text-foreground">{email}</span>. Click it to log in
            instantly — no password needed.
          </p>
          <button
            type="button"
            className="mt-5 w-full py-2.5 text-xs font-bold rounded-xl bg-secondary border border-foreground/[0.06] hover:brightness-110 transition-all inline-flex items-center justify-center gap-1.5"
          >
            <RotateCw className="w-4 h-4" aria-hidden /> Resend link
          </button>
          <button
            type="button"
            onClick={() => setSent(false)}
            className="inline-flex items-center gap-1 text-xs font-semibold text-muted-foreground/60 hover:text-foreground mt-3 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" aria-hidden /> Use a different email
          </button>
        </>
      ) : (
        <>
          <div className="mx-auto h-12 w-12 rounded-2xl bg-primary/10 border border-primary/25 text-primary flex items-center justify-center mb-4">
            <Sparkles className="w-6 h-6" aria-hidden />
          </div>
          <h3 className="text-lg font-bold">Sign in with a magic link</h3>
          <p className="text-sm text-muted-foreground/65 mt-1.5 leading-relaxed">
            Enter your email and we&apos;ll send you a secure link to sign in instantly.
          </p>
          <form onSubmit={handleSubmit} className="mt-5 text-left space-y-3">
            <div>
              <label className="block text-xs font-semibold text-muted-foreground/80 mb-1.5" htmlFor="ml-email">
                Email address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground/40" aria-hidden />
                <input
                  id="ml-email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full bg-foreground/[0.03] border border-foreground/[0.06] rounded-xl pl-9 pr-3 py-2 text-sm placeholder:text-muted-foreground/30 focus:ring-1 focus:ring-primary/50 focus:border-primary/30 focus:outline-none"
                />
              </div>
            </div>
            <button
              type="submit"
              className="w-full py-2.5 text-xs font-bold rounded-xl bg-primary text-primary-foreground hover:brightness-110 transition-all inline-flex items-center justify-center gap-1.5"
            >
              <Sparkles className="w-4 h-4" aria-hidden /> Send magic link
            </button>
          </form>
        </>
      )}
    </div>
  );
}

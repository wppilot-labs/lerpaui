"use client";

import React, { useState } from "react";
import { Mail, KeyRound, ArrowLeft, LifeBuoy } from "lucide-react";
import { cn } from "../lib/cn";

export interface AuthForgotPasswordSectionProps {
  className?: string;
}

export function AuthForgotPasswordSection({ className }: AuthForgotPasswordSectionProps) {
  const [email, setEmail] = useState("");

  return (
    <div
      className={cn(
        "w-full max-w-xl bg-card/45 backdrop-blur-xl border border-border/50 p-7 rounded-2xl shadow-xl font-sans text-foreground",
        className,
      )}
    >
      <div className="flex items-start gap-3 mb-6">
        <div className="h-10 w-10 rounded-xl bg-primary/10 border border-primary/25 flex items-center justify-center text-primary shrink-0">
          <KeyRound className="w-5 h-5" aria-hidden />
        </div>
        <div>
          <h2 className="text-2xl font-black leading-tight">Reset your password</h2>
          <p className="text-sm text-muted-foreground/65 mt-1 leading-relaxed">
            No worries — it happens. Enter the email associated with your account and we&apos;ll send instructions to
            create a new password.
          </p>
        </div>
      </div>

      <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-muted-foreground/80 mb-1.5" htmlFor="fps-email">
            Email address
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground/40" aria-hidden />
            <input
              id="fps-email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
              className="w-full bg-foreground/[0.03] border border-foreground/[0.06] rounded-xl pl-9 pr-3 py-2.5 text-sm placeholder:text-muted-foreground/30 focus:ring-1 focus:ring-primary/50 focus:border-primary/30 focus:outline-none"
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="submit"
            className="px-6 py-2.5 text-xs font-bold rounded-xl bg-primary text-primary-foreground hover:brightness-110 transition-all"
          >
            Send reset instructions
          </button>
          <a href="/" className="inline-flex items-center gap-1 text-xs font-semibold text-muted-foreground/60 hover:text-foreground transition-colors">
            <ArrowLeft className="w-4 h-4" aria-hidden /> Back to sign in
          </a>
        </div>
      </form>

      <div className="mt-6 flex items-start gap-2.5 p-3 rounded-xl bg-foreground/[0.02] border border-foreground/[0.05]">
        <LifeBuoy className="w-4 h-4 text-muted-foreground/50 mt-0.5 shrink-0" aria-hidden />
        <p className="text-xs text-muted-foreground/60 leading-relaxed">
          Didn&apos;t get the email within a few minutes? Check your spam folder, or{" "}
          <a href="/" className="font-semibold text-primary hover:underline">contact support</a>.
        </p>
      </div>
    </div>
  );
}

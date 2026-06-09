"use client";

import React, { useState } from "react";
import { User, Mail, Lock, Building2, Rocket } from "lucide-react";
import { cn } from "../lib/cn";

export interface AuthRegisterSectionProps {
  className?: string;
}

export function AuthRegisterSection({ className }: AuthRegisterSectionProps) {
  const [agree, setAgree] = useState(false);

  return (
    <div
      className={cn(
        "w-full max-w-2xl bg-card/45 backdrop-blur-xl border border-border/50 p-7 rounded-2xl shadow-xl font-sans text-foreground",
        className,
      )}
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="h-10 w-10 rounded-xl bg-primary/10 border border-primary/25 flex items-center justify-center text-primary shrink-0">
          <Rocket className="w-5 h-5" aria-hidden />
        </div>
        <div>
          <h2 className="text-2xl font-black leading-tight">Get started for free</h2>
          <p className="text-sm text-muted-foreground/65 mt-0.5">
            Set up your workspace in minutes — invite your team and ship your first project today.
          </p>
        </div>
      </div>

      <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-muted-foreground/80 mb-1.5" htmlFor="rs-first">
              First name
            </label>
            <div className="relative">
              <User className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground/40" aria-hidden />
              <input
                id="rs-first"
                type="text"
                autoComplete="given-name"
                placeholder="Jane"
                className="w-full bg-foreground/[0.03] border border-foreground/[0.06] rounded-xl pl-9 pr-3 py-2 text-sm placeholder:text-muted-foreground/30 focus:ring-1 focus:ring-primary/50 focus:border-primary/30 focus:outline-none"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-muted-foreground/80 mb-1.5" htmlFor="rs-last">
              Last name
            </label>
            <input
              id="rs-last"
              type="text"
              autoComplete="family-name"
              placeholder="Cooper"
              className="w-full bg-foreground/[0.03] border border-foreground/[0.06] rounded-xl px-3 py-2 text-sm placeholder:text-muted-foreground/30 focus:ring-1 focus:ring-primary/50 focus:border-primary/30 focus:outline-none"
            />
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-muted-foreground/80 mb-1.5" htmlFor="rs-email">
              Work email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground/40" aria-hidden />
              <input
                id="rs-email"
                type="email"
                autoComplete="email"
                placeholder="jane@company.com"
                className="w-full bg-foreground/[0.03] border border-foreground/[0.06] rounded-xl pl-9 pr-3 py-2 text-sm placeholder:text-muted-foreground/30 focus:ring-1 focus:ring-primary/50 focus:border-primary/30 focus:outline-none"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-muted-foreground/80 mb-1.5" htmlFor="rs-company">
              Company
            </label>
            <div className="relative">
              <Building2 className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground/40" aria-hidden />
              <input
                id="rs-company"
                type="text"
                autoComplete="organization"
                placeholder="Acme Inc."
                className="w-full bg-foreground/[0.03] border border-foreground/[0.06] rounded-xl pl-9 pr-3 py-2 text-sm placeholder:text-muted-foreground/30 focus:ring-1 focus:ring-primary/50 focus:border-primary/30 focus:outline-none"
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-muted-foreground/80 mb-1.5" htmlFor="rs-password">
            Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground/40" aria-hidden />
            <input
              id="rs-password"
              type="password"
              autoComplete="new-password"
              placeholder="At least 8 characters"
              className="w-full bg-foreground/[0.03] border border-foreground/[0.06] rounded-xl pl-9 pr-3 py-2 text-sm placeholder:text-muted-foreground/30 focus:ring-1 focus:ring-primary/50 focus:border-primary/30 focus:outline-none"
            />
          </div>
        </div>

        <label className="flex items-start gap-2 text-xs text-muted-foreground/70 cursor-pointer" htmlFor="rs-terms">
          <input
            id="rs-terms"
            type="checkbox"
            checked={agree}
            onChange={(e) => setAgree(e.target.checked)}
            className="mt-0.5 h-3.5 w-3.5 rounded border-foreground/20 bg-transparent accent-primary"
          />
          <span>
            I agree to the <a href="/" className="font-semibold text-primary hover:underline">Terms of Service</a> and acknowledge the{" "}
            <a href="/" className="font-semibold text-primary hover:underline">Privacy Policy</a>.
          </span>
        </label>

        <div className="flex items-center gap-3 pt-1">
          <button
            type="submit"
            disabled={!agree}
            className="px-6 py-2.5 text-xs font-bold rounded-xl bg-primary text-primary-foreground hover:brightness-110 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          >
            Create workspace
          </button>
          <span className="text-xs text-muted-foreground/55">
            Already registered?{" "}
            <a href="/" className="font-semibold text-primary hover:underline">Sign in</a>
          </span>
        </div>
      </form>
    </div>
  );
}

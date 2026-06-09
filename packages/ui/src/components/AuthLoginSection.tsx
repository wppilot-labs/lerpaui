"use client";

import React, { useState } from "react";
import { Mail, Lock, Eye, EyeOff, ShieldCheck, Zap, Users } from "lucide-react";
import { cn } from "../lib/cn";

export interface AuthLoginSectionProps {
  className?: string;
}

const PERKS = [
  { icon: Zap, text: "Lightning-fast deploys in under a minute" },
  { icon: ShieldCheck, text: "SOC 2 Type II compliant infrastructure" },
  { icon: Users, text: "Trusted by 40,000+ engineering teams" },
];

export function AuthLoginSection({ className }: AuthLoginSectionProps) {
  const [show, setShow] = useState(false);

  return (
    <div
      className={cn(
        "w-full max-w-3xl bg-card/45 backdrop-blur-xl border border-border/50 rounded-2xl shadow-xl font-sans text-foreground overflow-hidden grid md:grid-cols-2",
        className,
      )}
    >
      <div className="hidden md:flex flex-col justify-between p-7 bg-gradient-to-br from-primary/10 to-transparent border-r border-foreground/[0.06]">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-primary mb-3">
            <ShieldCheck className="w-4 h-4" aria-hidden /> Acme Cloud
          </div>
          <h2 className="text-2xl font-black leading-tight">Ship faster with confidence.</h2>
          <p className="text-sm text-muted-foreground/65 mt-2 leading-relaxed">
            The platform built for modern teams that move quickly without breaking things.
          </p>
        </div>
        <ul className="space-y-3 mt-6">
          {PERKS.map((perk) => {
            const Icon = perk.icon;
            return (
              <li key={perk.text} className="flex items-start gap-2.5 text-sm text-muted-foreground/75">
                <span className="mt-0.5 h-5 w-5 shrink-0 rounded-md bg-primary/15 text-primary flex items-center justify-center">
                  <Icon className="w-3.5 h-3.5" aria-hidden />
                </span>
                {perk.text}
              </li>
            );
          })}
        </ul>
      </div>

      <div className="p-7">
        <h3 className="text-xl font-bold">Sign in</h3>
        <p className="text-sm text-muted-foreground/65 mt-0.5 mb-5">Welcome back. Enter your details below.</p>

        <form onSubmit={(e) => e.preventDefault()} className="space-y-3.5">
          <div>
            <label className="block text-xs font-semibold text-muted-foreground/80 mb-1.5" htmlFor="ls-email">
              Email address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground/40" aria-hidden />
              <input
                id="ls-email"
                type="email"
                autoComplete="email"
                placeholder="you@company.com"
                className="w-full bg-foreground/[0.03] border border-foreground/[0.06] rounded-xl pl-9 pr-3 py-2 text-sm placeholder:text-muted-foreground/30 focus:ring-1 focus:ring-primary/50 focus:border-primary/30 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-muted-foreground/80 mb-1.5" htmlFor="ls-password">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground/40" aria-hidden />
              <input
                id="ls-password"
                type={show ? "text" : "password"}
                autoComplete="current-password"
                placeholder="Enter your password"
                className="w-full bg-foreground/[0.03] border border-foreground/[0.06] rounded-xl pl-9 pr-9 py-2 text-sm placeholder:text-muted-foreground/30 focus:ring-1 focus:ring-primary/50 focus:border-primary/30 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShow((s) => !s)}
                aria-label={show ? "Hide password" : "Show password"}
                className="absolute right-2.5 top-2.5 text-muted-foreground/50 hover:text-foreground transition-colors"
              >
                {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-sm text-muted-foreground/75 cursor-pointer" htmlFor="ls-remember">
              <input id="ls-remember" type="checkbox" className="h-3.5 w-3.5 rounded border-foreground/20 bg-transparent accent-primary" />
              Remember me
            </label>
            <a href="/" className="text-sm font-semibold text-primary hover:underline">
              Forgot password?
            </a>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 text-xs font-bold rounded-xl bg-primary text-primary-foreground hover:brightness-110 transition-all"
          >
            Sign in to your account
          </button>

          <div className="flex items-center gap-3 py-0.5">
            <div className="h-px flex-1 bg-foreground/[0.07]" />
            <span className="text-xs uppercase tracking-wider text-muted-foreground/45">or continue with</span>
            <div className="h-px flex-1 bg-foreground/[0.07]" />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button type="button" className="flex items-center justify-center gap-2 py-2 text-xs font-semibold rounded-xl bg-secondary border border-foreground/[0.06] hover:brightness-110 transition-all">
              <svg viewBox="0 0 24 24" aria-hidden className="w-4 h-4">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.1A6.5 6.5 0 0 1 5.5 12c0-.73.12-1.44.34-2.1V7.07H2.18A11 11 0 0 0 1 12c0 1.77.43 3.45 1.18 4.93l3.66-2.83z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.83C6.71 7.31 9.14 5.38 12 5.38z" />
              </svg>
              Google
            </button>
            <button type="button" className="flex items-center justify-center gap-2 py-2 text-xs font-semibold rounded-xl bg-secondary border border-foreground/[0.06] hover:brightness-110 transition-all">
              <svg viewBox="0 0 24 24" aria-hidden className="w-4 h-4 fill-foreground">
                <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.9.58.11.79-.25.79-.56v-2c-3.2.7-3.88-1.36-3.88-1.36-.52-1.33-1.27-1.69-1.27-1.69-1.04-.71.08-.69.08-.69 1.15.08 1.76 1.18 1.76 1.18 1.02 1.75 2.68 1.25 3.34.95.1-.74.4-1.25.72-1.54-2.55-.29-5.24-1.28-5.24-5.7 0-1.26.45-2.29 1.18-3.1-.12-.29-.51-1.46.11-3.04 0 0 .97-.31 3.18 1.19a11 11 0 0 1 5.78 0c2.2-1.5 3.17-1.19 3.17-1.19.63 1.58.24 2.75.12 3.04.74.81 1.18 1.84 1.18 3.1 0 4.43-2.7 5.4-5.27 5.69.41.36.78 1.06.78 2.14V22.34c0 .31.21.67.79.55C20.21 21.39 23.5 17.08 23.5 12 23.5 5.65 18.35.5 12 .5z" />
              </svg>
              GitHub
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

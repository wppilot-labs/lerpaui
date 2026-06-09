"use client";

import React, { useMemo, useState } from "react";
import { User, Mail, Lock, Eye, EyeOff, Check } from "lucide-react";
import { cn } from "../lib/cn";

export interface AuthRegisterCardProps {
  className?: string;
}

const RULES = [
  { label: "8+ characters", test: (v: string) => v.length >= 8 },
  { label: "Number", test: (v: string) => /[0-9]/.test(v) },
  { label: "Symbol", test: (v: string) => /[^A-Za-z0-9]/.test(v) },
];

export function AuthRegisterCard({ className }: AuthRegisterCardProps) {
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [agree, setAgree] = useState(false);

  const passed = useMemo(() => RULES.filter((r) => r.test(password)).length, [password]);
  const barColor = passed <= 1 ? "bg-red-400" : passed === 2 ? "bg-amber-400" : "bg-emerald-400";

  return (
    <div
      className={cn(
        "w-full max-w-sm bg-card/45 backdrop-blur-xl border border-border/50 p-5 rounded-2xl shadow-xl font-sans text-foreground",
        className,
      )}
    >
      <div className="text-center mb-5">
        <h3 className="text-lg font-bold">Create your account</h3>
        <p className="text-sm text-muted-foreground/65 mt-0.5">Start your 14-day free trial. No card required.</p>
      </div>

      <form onSubmit={(e) => e.preventDefault()} className="space-y-3">
        <div>
          <label className="block text-xs font-semibold text-muted-foreground/80 mb-1.5" htmlFor="reg-name">
            Full name
          </label>
          <div className="relative">
            <User className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground/40" aria-hidden />
            <input
              id="reg-name"
              type="text"
              autoComplete="name"
              placeholder="Jane Cooper"
              className="w-full bg-foreground/[0.03] border border-foreground/[0.06] rounded-xl pl-9 pr-3 py-2 text-sm placeholder:text-muted-foreground/30 focus:ring-1 focus:ring-primary/50 focus:border-primary/30 focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-muted-foreground/80 mb-1.5" htmlFor="reg-email">
            Work email
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground/40" aria-hidden />
            <input
              id="reg-email"
              type="email"
              autoComplete="email"
              placeholder="jane@company.com"
              className="w-full bg-foreground/[0.03] border border-foreground/[0.06] rounded-xl pl-9 pr-3 py-2 text-sm placeholder:text-muted-foreground/30 focus:ring-1 focus:ring-primary/50 focus:border-primary/30 focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-muted-foreground/80 mb-1.5" htmlFor="reg-password">
            Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground/40" aria-hidden />
            <input
              id="reg-password"
              type={show ? "text" : "password"}
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Create a password"
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
          <div className="flex items-center gap-1 mt-2">
            {[0, 1, 2].map((i) => (
              <div key={i} className="h-1 flex-1 rounded-full bg-foreground/[0.06] overflow-hidden">
                <div className={cn("h-full rounded-full transition-all", i < passed ? barColor : "")} />
              </div>
            ))}
          </div>
          <div className="flex flex-wrap gap-x-3 gap-y-0.5 mt-1.5">
            {RULES.map((r) => {
              const ok = r.test(password);
              return (
                <span key={r.label} className={cn("inline-flex items-center gap-1 text-xs", ok ? "text-emerald-400" : "text-muted-foreground/45")}>
                  <Check className="w-3.5 h-3.5" /> {r.label}
                </span>
              );
            })}
          </div>
        </div>

        <label className="flex items-start gap-2 text-xs text-muted-foreground/70 cursor-pointer" htmlFor="reg-terms">
          <input
            id="reg-terms"
            type="checkbox"
            checked={agree}
            onChange={(e) => setAgree(e.target.checked)}
            className="mt-0.5 h-3.5 w-3.5 rounded border-foreground/20 bg-transparent accent-primary"
          />
          <span>
            I agree to the <a href="/" className="font-semibold text-primary hover:underline">Terms</a> and{" "}
            <a href="/" className="font-semibold text-primary hover:underline">Privacy Policy</a>.
          </span>
        </label>

        <button
          type="submit"
          disabled={!agree}
          className="w-full py-2.5 text-xs font-bold rounded-xl bg-primary text-primary-foreground hover:brightness-110 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
        >
          Create account
        </button>
      </form>

      <p className="text-center text-xs text-muted-foreground/60 mt-4">
        Already have an account?{" "}
        <a href="/" className="font-semibold text-primary hover:underline">
          Sign in
        </a>
      </p>
    </div>
  );
}

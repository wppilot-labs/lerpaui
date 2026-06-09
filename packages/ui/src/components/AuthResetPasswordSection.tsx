"use client";

import React, { useMemo, useState } from "react";
import { Lock, Eye, EyeOff, Check, ShieldCheck } from "lucide-react";
import { cn } from "../lib/cn";

export interface AuthResetPasswordSectionProps {
  className?: string;
}

const RULES = [
  { label: "At least 8 characters", test: (v: string) => v.length >= 8 },
  { label: "Upper & lowercase letters", test: (v: string) => /[a-z]/.test(v) && /[A-Z]/.test(v) },
  { label: "At least one number", test: (v: string) => /[0-9]/.test(v) },
  { label: "At least one symbol", test: (v: string) => /[^A-Za-z0-9]/.test(v) },
];

export function AuthResetPasswordSection({ className }: AuthResetPasswordSectionProps) {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [show, setShow] = useState(false);

  const passed = useMemo(() => RULES.filter((r) => r.test(password)).length, [password]);
  const strength = (passed / RULES.length) * 100;
  const label = ["Weak", "Fair", "Good", "Strong"][Math.max(0, passed - 1)] ?? "Weak";
  const barColor = passed <= 1 ? "bg-red-400" : passed <= 2 ? "bg-amber-400" : passed === 3 ? "bg-yellow-300" : "bg-emerald-400";
  const matches = confirm.length > 0 && confirm === password;
  const canSubmit = passed === RULES.length && matches;

  return (
    <div
      className={cn(
        "w-full max-w-xl bg-card/45 backdrop-blur-xl border border-border/50 p-7 rounded-2xl shadow-xl font-sans text-foreground",
        className,
      )}
    >
      <div className="flex items-start gap-3 mb-6">
        <div className="h-10 w-10 rounded-xl bg-primary/10 border border-primary/25 flex items-center justify-center text-primary shrink-0">
          <ShieldCheck className="w-5 h-5" aria-hidden />
        </div>
        <div>
          <h2 className="text-2xl font-black leading-tight">Create a new password</h2>
          <p className="text-sm text-muted-foreground/65 mt-1 leading-relaxed">
            Your new password must be different from previously used passwords and meet the requirements below.
          </p>
        </div>
      </div>

      <form onSubmit={(e) => e.preventDefault()} className="grid md:grid-cols-2 gap-x-6 gap-y-4">
        <div>
          <label className="block text-xs font-semibold text-muted-foreground/80 mb-1.5" htmlFor="rps-new">
            New password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground/40" aria-hidden />
            <input
              id="rps-new"
              type={show ? "text" : "password"}
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-foreground/[0.03] border border-foreground/[0.06] rounded-xl pl-9 pr-9 py-2 text-sm focus:ring-1 focus:ring-primary/50 focus:border-primary/30 focus:outline-none"
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
          <div className="mt-2.5 h-1 rounded-full bg-foreground/[0.06] overflow-hidden">
            <div className={cn("h-full rounded-full transition-all duration-300", barColor)} style={{ width: `${strength}%` }} />
          </div>
          <div className="text-xs text-muted-foreground/60 mt-1">
            Strength: <span className="font-semibold text-foreground/80">{password ? label : "—"}</span>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-muted-foreground/80 mb-1.5" htmlFor="rps-confirm">
            Confirm new password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground/40" aria-hidden />
            <input
              id="rps-confirm"
              type={show ? "text" : "password"}
              autoComplete="new-password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className={cn(
                "w-full bg-foreground/[0.03] border rounded-xl pl-9 pr-3 py-2 text-sm focus:ring-1 focus:outline-none",
                confirm.length === 0
                  ? "border-foreground/[0.06] focus:ring-primary/50 focus:border-primary/30"
                  : matches
                    ? "border-emerald-500/40 focus:ring-emerald-500/40"
                    : "border-red-500/40 focus:ring-red-500/40",
              )}
            />
          </div>
          <p className={cn("text-xs mt-1.5", confirm.length === 0 ? "text-muted-foreground/55" : matches ? "text-emerald-400" : "text-red-400")}>
            {confirm.length === 0 ? "Re-enter your password to confirm." : matches ? "Passwords match." : "Passwords don't match yet."}
          </p>
        </div>

        <ul className="md:col-span-2 grid sm:grid-cols-2 gap-x-4 gap-y-1.5">
          {RULES.map((r) => {
            const ok = r.test(password);
            return (
              <li key={r.label} className={cn("flex items-center gap-2 text-xs", ok ? "text-emerald-400" : "text-muted-foreground/55")}>
                <span className={cn("h-4 w-4 rounded-full flex items-center justify-center shrink-0", ok ? "bg-emerald-500/15" : "bg-foreground/[0.05]")}>
                  <Check className="w-2.5 h-2.5" />
                </span>
                {r.label}
              </li>
            );
          })}
        </ul>

        <div className="md:col-span-2">
          <button
            type="submit"
            disabled={!canSubmit}
            className="px-6 py-2.5 text-xs font-bold rounded-xl bg-primary text-primary-foreground hover:brightness-110 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          >
            Update password
          </button>
        </div>
      </form>
    </div>
  );
}

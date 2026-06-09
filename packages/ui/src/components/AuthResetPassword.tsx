"use client";

import React, { useMemo, useState } from "react";
import { Lock, Eye, EyeOff, Check, X, ShieldCheck } from "lucide-react";
import { cn } from "../lib/cn";

export interface AuthResetPasswordProps {
  className?: string;
}

const RULES = [
  { label: "At least 8 characters", test: (v: string) => v.length >= 8 },
  { label: "One uppercase letter", test: (v: string) => /[A-Z]/.test(v) },
  { label: "One number", test: (v: string) => /[0-9]/.test(v) },
  { label: "One symbol", test: (v: string) => /[^A-Za-z0-9]/.test(v) },
];

export function AuthResetPassword({ className }: AuthResetPasswordProps) {
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
        "w-full max-w-sm bg-card/45 backdrop-blur-xl border border-border/50 p-5 rounded-2xl shadow-xl font-sans text-foreground",
        className,
      )}
    >
      <div className="flex items-center gap-2 mb-1">
        <ShieldCheck className="w-5 h-5 text-primary" aria-hidden />
        <h3 className="text-base font-bold">Set a new password</h3>
      </div>
      <p className="text-sm text-muted-foreground/65 mb-4">Choose a strong password you haven&apos;t used before.</p>

      <form onSubmit={(e) => e.preventDefault()}>
        <label className="block text-xs font-semibold text-muted-foreground/80 mb-1.5" htmlFor="rp-new">
          New password
        </label>
        <div className="relative">
          <Lock className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground/40" aria-hidden />
          <input
            id="rp-new"
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
        <div className="text-xs text-muted-foreground/60 mt-1 mb-3">
          Strength: <span className="font-semibold text-foreground/80">{password ? label : "—"}</span>
        </div>

        <ul className="grid grid-cols-2 gap-x-3 gap-y-1 mb-4">
          {RULES.map((r) => {
            const ok = r.test(password);
            return (
              <li key={r.label} className={cn("flex items-center gap-1.5 text-xs", ok ? "text-emerald-400" : "text-muted-foreground/50")}>
                {ok ? <Check className="w-3.5 h-3.5 shrink-0" /> : <X className="w-3.5 h-3.5 shrink-0" />}
                {r.label}
              </li>
            );
          })}
        </ul>

        <label className="block text-xs font-semibold text-muted-foreground/80 mb-1.5" htmlFor="rp-confirm">
          Confirm password
        </label>
        <div className="relative">
          <Lock className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground/40" aria-hidden />
          <input
            id="rp-confirm"
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
        {confirm.length > 0 && !matches && (
          <p className="text-xs text-red-400 mt-1.5">Passwords don&apos;t match</p>
        )}

        <button
          type="submit"
          disabled={!canSubmit}
          className="w-full mt-4 py-2.5 text-xs font-bold rounded-xl bg-primary text-primary-foreground hover:brightness-110 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
        >
          Reset password
        </button>
      </form>
    </div>
  );
}

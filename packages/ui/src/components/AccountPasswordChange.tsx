"use client";

import React, { useMemo, useState } from "react";
import { Lock, Eye, EyeOff, Check, X } from "lucide-react";
import { cn } from "../lib/cn";

const RULES = [
  { label: "At least 8 characters", test: (v: string) => v.length >= 8 },
  { label: "One uppercase letter", test: (v: string) => /[A-Z]/.test(v) },
  { label: "One number", test: (v: string) => /[0-9]/.test(v) },
  { label: "One symbol", test: (v: string) => /[^A-Za-z0-9]/.test(v) },
];

export interface AccountPasswordChangeProps {
  className?: string;
}

export function AccountPasswordChange({ className }: AccountPasswordChangeProps) {
  const [next, setNext] = useState("");
  const [show, setShow] = useState(false);

  const passed = useMemo(() => RULES.filter((r) => r.test(next)).length, [next]);
  const strength = (passed / RULES.length) * 100;
  const label = ["Weak", "Fair", "Good", "Strong"][Math.max(0, passed - 1)] ?? "Weak";
  const barColor = passed <= 1 ? "bg-red-400" : passed <= 2 ? "bg-amber-400" : passed === 3 ? "bg-yellow-300" : "bg-emerald-400";

  return (
    <div className={cn("w-full max-w-md bg-card/45 backdrop-blur-xl border border-border/50 p-5 rounded-2xl shadow-xl font-sans text-foreground", className)}>
      <div className="flex items-center gap-2 mb-4">
        <Lock className="w-4 h-4 text-primary" />
        <h3 className="text-base font-bold">Change password</h3>
      </div>

      <label className="block text-xs font-semibold text-muted-foreground/80 mb-1.5" htmlFor="cpw-current">Current password</label>
      <input
        id="cpw-current"
        type="password"
        autoComplete="current-password"
        className="w-full mb-3 bg-foreground/[0.03] border border-foreground/[0.06] rounded-xl px-3 py-2 text-sm focus:ring-1 focus:ring-primary/50 focus:border-primary/30 focus:outline-none"
      />

      <label className="block text-xs font-semibold text-muted-foreground/80 mb-1.5" htmlFor="cpw-new">New password</label>
      <div className="relative">
        <input
          id="cpw-new"
          type={show ? "text" : "password"}
          autoComplete="new-password"
          value={next}
          onChange={(e) => setNext(e.target.value)}
          className="w-full bg-foreground/[0.03] border border-foreground/[0.06] rounded-xl px-3 py-2 pr-9 text-sm focus:ring-1 focus:ring-primary/50 focus:border-primary/30 focus:outline-none"
        />
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          aria-label={show ? "Hide password" : "Show password"}
          className="absolute right-2.5 top-2 text-muted-foreground/50 hover:text-foreground transition-colors"
        >
          {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </div>

      <div className="mt-2.5 h-1 rounded-full bg-foreground/[0.06] overflow-hidden">
        <div className={cn("h-full rounded-full transition-all duration-300", barColor)} style={{ width: `${strength}%` }} />
      </div>
      <div className="text-xs text-muted-foreground/60 mt-1 mb-3">Strength: <span className="font-semibold text-foreground/80">{next ? label : "—"}</span></div>

      <ul className="space-y-1 mb-4">
        {RULES.map((r) => {
          const ok = r.test(next);
          return (
            <li key={r.label} className={cn("flex items-center gap-1.5 text-xs", ok ? "text-emerald-400" : "text-muted-foreground/50")}>
              {ok ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
              {r.label}
            </li>
          );
        })}
      </ul>

      <button
        type="button"
        disabled={passed < RULES.length}
        className="w-full py-2 text-xs font-bold rounded-xl bg-primary text-primary-foreground hover:brightness-110 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
      >
        Update password
      </button>
    </div>
  );
}

"use client";

import React, { useState } from "react";
import { Smartphone, Copy, Check, Download, ShieldCheck } from "lucide-react";
import { cn } from "../lib/cn";

export interface AuthTwoFactorSetupProps {
  className?: string;
}

const SECRET = "JBSW Y3DP EHPK 3PXP";
const RECOVERY = ["4f9a-1c2e", "8b7d-3a05", "e21c-9f48", "0d6b-7e13", "a3f8-2b91", "c50e-4d77"];

// Deterministic pseudo-QR pattern so SSR and client render identically.
const QR_CELLS = Array.from({ length: 13 * 13 }, (_, i) => {
  const x = i % 13;
  const y = Math.floor(i / 13);
  const finder = (x < 3 && y < 3) || (x > 9 && y < 3) || (x < 3 && y > 9);
  return finder || ((x * 7 + y * 13 + x * y) % 3 === 0);
});

export function AuthTwoFactorSetup({ className }: AuthTwoFactorSetupProps) {
  const [copied, setCopied] = useState(false);

  const copySecret = () => {
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div
      className={cn(
        "w-full max-w-md bg-card/45 backdrop-blur-xl border border-border/50 p-6 rounded-2xl shadow-xl font-sans text-foreground",
        className,
      )}
    >
      <div className="flex items-center gap-2 mb-1">
        <ShieldCheck className="w-5 h-5 text-primary" aria-hidden />
        <h3 className="text-base font-bold">Set up two-factor authentication</h3>
      </div>
      <p className="text-sm text-muted-foreground/65 mb-5">
        Scan the QR code with an authenticator app like 1Password or Google Authenticator.
      </p>

      <div className="flex gap-4 items-center mb-5">
        <div
          className="grid bg-white p-2 rounded-xl shrink-0"
          style={{ gridTemplateColumns: "repeat(13, 1fr)" }}
          role="img"
          aria-label="Two-factor authentication QR code"
        >
          {QR_CELLS.map((on, i) => (
            <span key={i} className={cn("h-[7px] w-[7px]", on ? "bg-black" : "bg-white")} />
          ))}
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-1.5 text-sm font-semibold text-muted-foreground/80 mb-1.5">
            <Smartphone className="w-4 h-4" aria-hidden /> Can&apos;t scan?
          </div>
          <p className="text-xs text-muted-foreground/55 mb-2">Enter this setup key manually:</p>
          <div className="flex items-center gap-2">
            <code className="text-xs font-mono font-semibold tracking-wide bg-foreground/[0.04] border border-foreground/[0.06] rounded-lg px-2 py-1.5">
              {SECRET}
            </code>
            <button
              type="button"
              onClick={copySecret}
              aria-label="Copy setup key"
              className="h-7 w-7 shrink-0 rounded-lg bg-secondary border border-foreground/[0.06] flex items-center justify-center hover:brightness-110 transition-all text-muted-foreground hover:text-foreground"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>
      </div>

      <label className="block text-xs font-semibold text-muted-foreground/80 mb-1.5" htmlFor="tfs-code">
        Verification code
      </label>
      <div className="flex gap-2 mb-5">
        <input
          id="tfs-code"
          type="text"
          inputMode="numeric"
          autoComplete="one-time-code"
          maxLength={6}
          placeholder="000000"
          className="flex-1 bg-foreground/[0.03] border border-foreground/[0.06] rounded-xl px-3 py-2 text-sm font-mono tracking-[0.3em] text-center placeholder:text-muted-foreground/25 focus:ring-1 focus:ring-primary/50 focus:border-primary/30 focus:outline-none"
        />
        <button
          type="button"
          className="px-4 py-2 text-xs font-bold rounded-xl bg-primary text-primary-foreground hover:brightness-110 transition-all whitespace-nowrap"
        >
          Verify
        </button>
      </div>

      <div className="rounded-xl bg-foreground/[0.02] border border-foreground/[0.05] p-3.5">
        <div className="flex items-center justify-between mb-2.5">
          <span className="text-xs font-semibold">Recovery codes</span>
          <button
            type="button"
            className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
          >
            <Download className="w-3.5 h-3.5" aria-hidden /> Download
          </button>
        </div>
        <div className="grid grid-cols-3 gap-1.5">
          {RECOVERY.map((code) => (
            <code key={code} className="text-xs font-mono text-muted-foreground/75 bg-foreground/[0.03] rounded-md px-1.5 py-1 text-center">
              {code}
            </code>
          ))}
        </div>
        <p className="text-xs text-amber-400/80 mt-2.5">
          Store these somewhere safe. Each code can be used once if you lose your device.
        </p>
      </div>
    </div>
  );
}

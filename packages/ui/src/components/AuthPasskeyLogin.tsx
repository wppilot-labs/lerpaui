"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Fingerprint, ScanFace, Check, Loader2 } from "lucide-react";
import { cn } from "../lib/cn";
import { usePrefersReducedMotion } from "../animation/hooks";

export interface AuthPasskeyLoginProps {
  className?: string;
}

type Status = "idle" | "scanning" | "success";

export function AuthPasskeyLogin({ className }: AuthPasskeyLoginProps) {
  const reduced = usePrefersReducedMotion();
  const [status, setStatus] = useState<Status>("idle");

  const authenticate = () => {
    if (status !== "idle") return;
    setStatus("scanning");
    window.setTimeout(() => {
      setStatus("success");
      window.setTimeout(() => setStatus("idle"), 2400);
    }, 1800);
  };

  return (
    <div
      className={cn(
        "w-full max-w-xs bg-card/45 backdrop-blur-xl border border-border/50 p-6 rounded-2xl shadow-xl font-sans text-foreground text-center",
        className,
      )}
    >
      <h3 className="text-base font-bold flex items-center justify-center gap-1.5">
        <ScanFace className="w-5 h-5 text-primary" aria-hidden /> Sign in with passkey
      </h3>
      <p className="text-sm text-muted-foreground/65 mt-1 mb-5">
        Use your fingerprint, face, or device PIN.
      </p>

      <button
        type="button"
        onClick={authenticate}
        disabled={status !== "idle"}
        aria-label="Authenticate with passkey"
        className={cn(
          "relative mx-auto h-20 w-20 rounded-full flex items-center justify-center border transition-all overflow-hidden",
          status === "success"
            ? "bg-emerald-500/10 border-emerald-500/40 text-emerald-400 shadow-lg shadow-emerald-500/15"
            : status === "scanning"
              ? "bg-primary/10 border-primary/40 text-primary"
              : "bg-foreground/[0.03] border-foreground/[0.1] text-muted-foreground/70 hover:border-primary/40 hover:text-primary",
        )}
      >
        {status === "scanning" ? (
          <Loader2 className="w-8 h-8 animate-spin" aria-hidden />
        ) : status === "success" ? (
          <Check className="w-8 h-8" aria-hidden />
        ) : (
          <Fingerprint className="w-9 h-9" aria-hidden />
        )}
        {status === "scanning" && !reduced && (
          <motion.span
            initial={{ y: -28 }}
            animate={{ y: 28 }}
            transition={{ repeat: Infinity, repeatType: "reverse", duration: 0.85, ease: "easeInOut" }}
            className="absolute left-2 right-2 h-0.5 bg-primary/80 shadow shadow-primary/50 pointer-events-none"
            aria-hidden
          />
        )}
      </button>

      <p className="mt-4 text-sm font-semibold" aria-live="polite">
        {status === "scanning" ? (
          <span className="text-primary">Verifying passkey…</span>
        ) : status === "success" ? (
          <span className="text-emerald-400">Authenticated</span>
        ) : (
          <span className="text-muted-foreground/70">Tap to authenticate</span>
        )}
      </p>

      <div className="mt-5 pt-4 border-t border-foreground/[0.06]">
        <button type="button" className="text-sm font-semibold text-muted-foreground/60 hover:text-foreground transition-colors">
          Use password instead
        </button>
      </div>
    </div>
  );
}

"use client";

import React, { useState } from "react";
import { ShieldCheck, Check, X, Lock } from "lucide-react";
import { cn } from "../lib/cn";

type Decision = "idle" | "approved" | "denied";

export interface TeamPermissionRequestCardProps {
  className?: string;
}

export function TeamPermissionRequestCard({
  className,
}: TeamPermissionRequestCardProps) {
  const [decision, setDecision] = useState<Decision>("idle");

  return (
    <div
      className={cn(
        "w-full max-w-md bg-card/45 backdrop-blur-xl border border-border/50 p-6 rounded-2xl shadow-xl font-sans text-foreground",
        className,
      )}
    >
      <div className="flex items-center gap-2">
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-500/10 text-amber-400">
          <ShieldCheck className="h-4 w-4" />
        </span>
        <div className="flex-1">
          <h3 className="text-base font-bold">Access request</h3>
          <p className="text-xs text-muted-foreground/55">5 minutes ago</p>
        </div>
        {decision === "idle" && (
          <span className="rounded-full border border-amber-500/20 bg-amber-500/10 px-2 py-0.5 text-xs font-semibold text-amber-400">
            Pending
          </span>
        )}
      </div>

      <div className="mt-4 flex items-center gap-3 rounded-xl border border-border/50 bg-secondary/25 p-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-sky-500/15 text-xs font-bold text-sky-300">
          ML
        </span>
        <div className="min-w-0 text-xs leading-snug">
          <p className="text-muted-foreground">
            <span className="font-semibold text-foreground">Marcus Lee</span> is
            requesting access to
          </p>
          <p className="mt-0.5 inline-flex items-center gap-1 font-semibold text-foreground/90">
            <Lock className="h-3.5 w-3.5 text-muted-foreground/50" />
            Production database — read/write
          </p>
        </div>
      </div>

      <p className="mt-3 rounded-lg bg-secondary/20 px-3 py-2 text-xs italic leading-snug text-muted-foreground/80">
        &ldquo;Need to debug the billing migration that failed overnight.&rdquo;
      </p>

      {decision === "idle" ? (
        <div className="mt-4 flex gap-2">
          <button
            type="button"
            onClick={() => setDecision("denied")}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-border/60 bg-secondary/40 py-2 text-sm font-semibold text-muted-foreground transition-colors hover:border-rose-500/30 hover:text-rose-400"
          >
            <X className="h-4 w-4" /> Deny
          </button>
          <button
            type="button"
            onClick={() => setDecision("approved")}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-emerald-500 py-2 text-sm font-bold text-white transition-all hover:brightness-110"
          >
            <Check className="h-4 w-4" /> Approve
          </button>
        </div>
      ) : (
        <div
          className={cn(
            "mt-4 flex items-center justify-center gap-1.5 rounded-lg border py-2 text-sm font-semibold",
            decision === "approved"
              ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-400"
              : "border-rose-500/20 bg-rose-500/10 text-rose-400",
          )}
        >
          {decision === "approved" ? (
            <Check className="h-4 w-4" />
          ) : (
            <X className="h-4 w-4" />
          )}
          Access {decision}
        </div>
      )}
    </div>
  );
}

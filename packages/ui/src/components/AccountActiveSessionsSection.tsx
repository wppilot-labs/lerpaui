"use client";

import React from "react";
import { Laptop, Globe, LogOut } from "lucide-react";
import { cn } from "../lib/cn";

export interface AccountActiveSessionsSectionProps {
  className?: string;
}

export function AccountActiveSessionsSection({ className }: AccountActiveSessionsSectionProps) {
  return (
    <div className={cn("w-full max-w-md bg-card/45 backdrop-blur-xl border border-border/50 p-5 rounded-2xl shadow-xl font-sans text-foreground", className)}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-bold">Where you&apos;re signed in</h3>
          <p className="text-xs text-muted-foreground/65">3 active sessions across 2 locations</p>
        </div>
        <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" aria-hidden="true" />
      </div>

      <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/[0.04] p-3.5 mb-3">
        <div className="flex items-center gap-2.5">
          <div className="h-9 w-9 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
            <Laptop className="w-4 h-4" />
          </div>
          <div className="flex-1">
            <div className="text-sm font-semibold flex items-center gap-1.5">
              MacBook Pro
              <span className="text-[11px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-400">Current</span>
            </div>
            <div className="text-xs text-muted-foreground/55">Chrome · San Francisco · Active now</div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2.5 px-1 py-1 mb-4 text-xs text-muted-foreground/65">
        <Globe className="w-3.5 h-3.5 shrink-0" />
        <span>2 other devices — last seen 2h and 1d ago</span>
      </div>

      <button
        type="button"
        className="w-full inline-flex items-center justify-center gap-1.5 py-2 text-xs font-bold rounded-xl bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition-colors"
      >
        <LogOut className="w-3.5 h-3.5" /> Sign out all other devices
      </button>
    </div>
  );
}

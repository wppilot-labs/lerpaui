"use client";

import React, { useState } from "react";
import { Wrench, Globe, ShieldAlert } from "lucide-react";
import { cn } from "../lib/cn";

export interface AdminMaintenanceModeCardProps {
  className?: string;
}

export function AdminMaintenanceModeCard({ className }: AdminMaintenanceModeCardProps) {
  const [enabled, setEnabled] = useState(false);
  const [allowAdmins, setAllowAdmins] = useState(true);

  return (
    <div
      className={cn(
        "w-full max-w-md bg-card border p-5 rounded-2xl shadow-sm font-sans text-foreground transition-colors",
        enabled ? "border-amber-500/40" : "border-border",
        className,
      )}
    >
      <div className="flex items-start gap-3">
        <div
          className={cn(
            "w-10 h-10 rounded-xl grid place-items-center shrink-0 transition-colors",
            enabled ? "bg-amber-500/15 text-amber-600 dark:text-amber-400" : "bg-muted text-muted-foreground",
          )}
        >
          <Wrench className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-bold">Maintenance mode</h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            {enabled
              ? "Site is offline. Visitors see a maintenance page."
              : "Site is live and serving all traffic."}
          </p>
        </div>
        <button
          type="button"
          role="switch"
          aria-checked={enabled}
          aria-label="Toggle maintenance mode"
          onClick={() => setEnabled((v) => !v)}
          className={cn(
            "relative w-10 h-5.5 rounded-full transition-colors shrink-0",
            enabled ? "bg-amber-500/80" : "bg-muted-foreground/25",
          )}
        >
          <span
            className={cn(
              "absolute top-0.5 h-4.5 w-4.5 rounded-full bg-background shadow-sm transition-transform",
              enabled ? "translate-x-4.5" : "translate-x-0.5",
            )}
          />
        </button>
      </div>

      <div
        className={cn(
          "mt-4 flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs border",
          enabled
            ? "bg-amber-500/10 border-amber-500/20 text-amber-700 dark:text-amber-300"
            : "bg-emerald-500/[0.07] border-emerald-500/20 text-emerald-600 dark:text-emerald-400",
        )}
      >
        {enabled ? <ShieldAlert className="w-4 h-4" /> : <Globe className="w-4 h-4" />}
        <span>{enabled ? "Active since just now" : "All systems operational"}</span>
      </div>

      <label className="mt-4 flex items-center gap-2.5 cursor-pointer">
        <button
          type="button"
          role="checkbox"
          aria-checked={allowAdmins}
          onClick={() => setAllowAdmins((v) => !v)}
          className={cn(
            "w-4 h-4 rounded border grid place-items-center transition-colors shrink-0",
            allowAdmins ? "bg-primary border-primary" : "border-border bg-background",
          )}
        >
          {allowAdmins && (
            <svg viewBox="0 0 12 12" className="w-3 h-3 text-primary-foreground" fill="none">
              <path d="M2.5 6.5L5 9L9.5 3.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </button>
        <span className="text-xs text-muted-foreground">
          Allow admins to bypass and access the site
        </span>
      </label>
    </div>
  );
}

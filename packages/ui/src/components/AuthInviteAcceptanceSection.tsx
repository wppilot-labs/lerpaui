"use client";

import React from "react";
import { Users, Check, X, Shield, FolderGit2 } from "lucide-react";
import { cn } from "../lib/cn";

export interface AuthInviteAcceptanceSectionProps {
  className?: string;
}

const MEMBERS = ["Maya", "Leo", "Priya", "Sam"];

export function AuthInviteAcceptanceSection({ className }: AuthInviteAcceptanceSectionProps) {
  return (
    <div
      className={cn(
        "w-full max-w-md bg-card/45 backdrop-blur-xl border border-border/50 p-7 rounded-2xl shadow-xl font-sans text-foreground text-center",
        className,
      )}
    >
      <div className="flex items-center justify-center mb-5">
        <div className="flex -space-x-2.5">
          {MEMBERS.map((name, i) => (
            <span
              key={name}
              className={cn(
                "h-9 w-9 rounded-full border-2 border-card flex items-center justify-center text-xs font-bold text-white",
                ["bg-primary", "bg-emerald-500", "bg-amber-500", "bg-rose-500"][i],
              )}
              aria-hidden
            >
              {name[0]}
            </span>
          ))}
          <span className="h-9 w-9 rounded-full border-2 border-card bg-secondary flex items-center justify-center text-xs font-bold text-muted-foreground">
            +8
          </span>
        </div>
      </div>

      <h2 className="text-2xl font-black leading-tight">
        Maya Chen invited you to <span className="text-primary">Northwind</span>
      </h2>
      <p className="text-sm text-muted-foreground/65 mt-1.5">
        Join the workspace to collaborate with the team on shared projects.
      </p>

      <div className="mt-5 grid grid-cols-2 gap-2.5 text-left">
        <div className="p-3 rounded-xl bg-foreground/[0.02] border border-foreground/[0.05]">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground/55 mb-1">
            <Shield className="w-3.5 h-3.5" aria-hidden /> Your role
          </div>
          <div className="text-sm font-semibold">Editor</div>
        </div>
        <div className="p-3 rounded-xl bg-foreground/[0.02] border border-foreground/[0.05]">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground/55 mb-1">
            <Users className="w-3.5 h-3.5" aria-hidden /> Team
          </div>
          <div className="text-sm font-semibold">12 members</div>
        </div>
        <div className="col-span-2 p-3 rounded-xl bg-foreground/[0.02] border border-foreground/[0.05]">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground/55 mb-1">
            <FolderGit2 className="w-3.5 h-3.5" aria-hidden /> Access to
          </div>
          <div className="text-sm font-semibold">4 projects · Billing · Analytics</div>
        </div>
      </div>

      <div className="mt-6 flex items-center gap-2.5">
        <button
          type="button"
          className="flex-1 py-2.5 text-xs font-bold rounded-xl bg-primary text-primary-foreground hover:brightness-110 transition-all inline-flex items-center justify-center gap-1.5"
        >
          <Check className="w-4 h-4" aria-hidden /> Accept invite
        </button>
        <button
          type="button"
          className="px-4 py-2.5 text-xs font-semibold rounded-xl bg-secondary border border-foreground/[0.06] hover:brightness-110 transition-all inline-flex items-center justify-center gap-1.5 text-muted-foreground hover:text-foreground"
        >
          <X className="w-4 h-4" aria-hidden /> Decline
        </button>
      </div>

      <p className="text-xs text-muted-foreground/55 mt-4">This invitation expires in 7 days.</p>
    </div>
  );
}

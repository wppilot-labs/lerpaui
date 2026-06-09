"use client";

import React from "react";
import { Building2, ShieldCheck } from "lucide-react";
import { cn } from "../lib/cn";

export interface AuthInviteAcceptancePageProps {
  className?: string;
}

export function AuthInviteAcceptancePage({ className }: AuthInviteAcceptancePageProps) {
  return (
    <div
      className={cn(
        "w-full max-w-md rounded-2xl border border-border bg-card p-8 text-card-foreground shadow-sm",
        className,
      )}
    >
      <div className="flex flex-col items-center text-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <Building2 className="h-7 w-7" />
        </span>
        <h2 className="mt-5 text-xl font-semibold text-foreground">You&apos;re invited to join</h2>
        <p className="mt-1 text-2xl font-bold tracking-tight text-foreground">Northwind Labs</p>
        <p className="mt-2 text-sm text-muted-foreground">
          <span className="font-medium text-foreground">Priya Sharma</span> invited you to collaborate on
          their workspace.
        </p>
      </div>

      <div className="mt-6 flex items-center justify-between rounded-xl border border-border bg-muted/50 px-4 py-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <ShieldCheck className="h-4 w-4 text-primary" />
          Your role
        </div>
        <span className="rounded-full bg-primary/10 px-3 py-1 text-sm font-semibold text-primary">
          Editor
        </span>
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          className="inline-flex flex-1 items-center justify-center rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          Accept invitation
        </button>
        <button
          type="button"
          className="inline-flex flex-1 items-center justify-center rounded-lg border border-border bg-background px-4 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          Decline
        </button>
      </div>

      <p className="mt-5 text-center text-xs text-muted-foreground">
        This invitation expires in 7 days.
      </p>
    </div>
  );
}

export default AuthInviteAcceptancePage;

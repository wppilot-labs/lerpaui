"use client";

import React from "react";
import { X, Home, LayoutGrid, CreditCard, LifeBuoy, ArrowRight } from "lucide-react";
import { cn } from "../lib/cn";

export interface MobileMenuDrawerProps {
  className?: string;
}

interface NavLink {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  active?: boolean;
}

const LINKS: NavLink[] = [
  { label: "Home", icon: Home, active: true },
  { label: "Features", icon: LayoutGrid },
  { label: "Pricing", icon: CreditCard },
  { label: "Support", icon: LifeBuoy },
];

export function MobileMenuDrawer({ className }: MobileMenuDrawerProps) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Mobile navigation"
      className={cn(
        "flex h-[32rem] w-full max-w-xs flex-col rounded-2xl border border-border bg-card text-card-foreground shadow-xl",
        className,
      )}
    >
      <div className="flex items-center justify-between border-b border-border px-5 py-4">
        <div className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-md bg-primary text-sm font-bold text-primary-foreground">
            N
          </span>
          <span className="text-base font-semibold text-foreground">Nimbus</span>
        </div>
        <button
          type="button"
          aria-label="Close menu"
          className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <nav aria-label="Primary" className="flex-1 overflow-y-auto px-3 py-4">
        <ul className="space-y-1">
          {LINKS.map(({ label, icon: Icon, active }) => (
            <li key={label}>
              <a
                href="/"
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                  active
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                <Icon className="h-5 w-5" />
                {label}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <div className="border-t border-border p-4">
        <button
          type="button"
          className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          Get started
          <ArrowRight className="h-4 w-4" />
        </button>
        <p className="mt-3 text-center text-xs text-muted-foreground">
          Already have an account?{" "}
          <a
            href="/"
            className="font-medium text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            Log in
          </a>
        </p>
      </div>
    </div>
  );
}

export default MobileMenuDrawer;

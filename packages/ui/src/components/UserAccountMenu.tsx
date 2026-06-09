"use client";

import React, { useState } from "react";
import {
  User,
  Settings,
  CreditCard,
  Keyboard,
  LogOut,
  ChevronDown,
} from "lucide-react";
import { cn } from "../lib/cn";

type Item = { icon: React.ElementType; label: string; shortcut?: string };

const ITEMS: Item[] = [
  { icon: User, label: "Profile", shortcut: "⌘P" },
  { icon: CreditCard, label: "Billing" },
  { icon: Settings, label: "Settings", shortcut: "⌘," },
  { icon: Keyboard, label: "Keyboard shortcuts", shortcut: "?" },
];

export interface UserAccountMenuProps {
  className?: string;
}

export function UserAccountMenu({ className }: UserAccountMenuProps) {
  const [open, setOpen] = useState(true);

  return (
    <div className={cn("relative w-full max-w-[240px] font-sans text-foreground", className)}>
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center gap-2.5 rounded-xl border border-border/50 bg-card/60 p-2 pr-3 backdrop-blur-xl transition-colors hover:bg-card"
      >
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary to-violet-500 text-xs font-bold text-primary-foreground">
          AL
        </span>
        <span className="min-w-0 flex-1 text-left">
          <span className="block truncate text-sm font-semibold leading-tight">Ava Lindqvist</span>
          <span className="block truncate text-xs text-muted-foreground/55">ava@studio.io</span>
        </span>
        <ChevronDown className={cn("h-4 w-4 text-muted-foreground transition-transform", open && "rotate-180")} />
      </button>

      {open && (
        <div
          role="menu"
          aria-label="Account menu"
          className="absolute left-0 z-50 mt-2 w-full overflow-hidden rounded-2xl border border-border/50 bg-card/95 p-1.5 shadow-2xl backdrop-blur-2xl"
        >
          {ITEMS.map((it) => (
            <button
              key={it.label}
              type="button"
              role="menuitem"
              className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-sm font-medium transition-colors hover:bg-foreground/[0.04]"
            >
              <it.icon className="h-4 w-4 text-muted-foreground/70" />
              <span className="flex-1">{it.label}</span>
              {it.shortcut && (
                <span className="text-xs text-muted-foreground/40">{it.shortcut}</span>
              )}
            </button>
          ))}

          <div className="my-1 border-t border-foreground/[0.06]" />

          <button
            type="button"
            role="menuitem"
            className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-sm font-medium text-rose-600 transition-colors hover:bg-rose-500/10 dark:text-rose-400"
          >
            <LogOut className="h-4 w-4" />
            <span className="flex-1">Sign out</span>
          </button>
        </div>
      )}
    </div>
  );
}

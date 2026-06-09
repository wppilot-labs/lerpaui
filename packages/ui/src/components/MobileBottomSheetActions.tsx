"use client";

import React from "react";
import { Share2, Pencil, Copy, Star, Trash2 } from "lucide-react";
import { cn } from "../lib/cn";

type Action = {
  id: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  destructive?: boolean;
};

const ACTIONS: Action[] = [
  { id: "share", icon: Share2, label: "Share" },
  { id: "edit", icon: Pencil, label: "Edit" },
  { id: "duplicate", icon: Copy, label: "Duplicate" },
  { id: "favorite", icon: Star, label: "Add to favorites" },
  { id: "delete", icon: Trash2, label: "Delete", destructive: true },
];

export interface MobileBottomSheetActionsProps {
  className?: string;
}

export function MobileBottomSheetActions({ className }: MobileBottomSheetActionsProps) {
  return (
    <div
      className={cn(
        "w-full max-w-xs bg-card/80 backdrop-blur-xl border border-border/50 rounded-t-2xl shadow-2xl font-sans text-foreground pb-2",
        className,
      )}
    >
      <div className="flex justify-center pt-2.5 pb-1">
        <span className="h-1 w-9 rounded-full bg-foreground/15" aria-hidden />
      </div>

      <div className="px-4 pb-2 pt-1">
        <h3 className="text-base font-bold">Project options</h3>
        <p className="text-xs text-muted-foreground/60">Q3 marketing plan</p>
      </div>

      <ul className="px-2">
        {ACTIONS.map((action, idx) => {
          const Icon = action.icon;
          return (
            <li key={action.id}>
              <button
                type="button"
                className={cn(
                  "flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-medium transition-colors",
                  action.destructive
                    ? "text-red-600 dark:text-red-400 hover:bg-red-500/10"
                    : "text-foreground/90 hover:bg-foreground/[0.05]",
                )}
              >
                <Icon
                  className={cn(
                    "w-4 h-4 shrink-0",
                    action.destructive ? "text-red-600 dark:text-red-400" : "text-muted-foreground/70",
                  )}
                />
                {action.label}
              </button>
              {idx === ACTIONS.length - 2 && (
                <div className="my-1 h-px bg-foreground/[0.05]" aria-hidden />
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

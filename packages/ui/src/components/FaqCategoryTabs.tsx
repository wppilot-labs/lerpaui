"use client";

import React, { useState } from "react";
import { CreditCard, LifeBuoy, Settings, Shield } from "lucide-react";
import { cn } from "../lib/cn";

type Category = {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  count: number;
};

const CATEGORIES: Category[] = [
  { id: "billing", label: "Billing", icon: CreditCard, count: 12 },
  { id: "account", label: "Account", icon: Settings, count: 9 },
  { id: "security", label: "Security", icon: Shield, count: 7 },
  { id: "support", label: "Support", icon: LifeBuoy, count: 5 },
];

export interface FaqCategoryTabsProps {
  className?: string;
}

export function FaqCategoryTabs({ className }: FaqCategoryTabsProps) {
  const [active, setActive] = useState(CATEGORIES[0].id);

  return (
    <div
      className={cn(
        "w-full max-w-lg bg-card/45 backdrop-blur-xl border border-border/50 p-2 rounded-2xl shadow-xl font-sans text-foreground",
        className,
      )}
      role="tablist"
      aria-label="FAQ categories"
    >
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
        {CATEGORIES.map((cat) => {
          const Icon = cat.icon;
          const isActive = active === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => setActive(cat.id)}
              className={cn(
                "flex flex-col items-center gap-1.5 py-3 px-2 rounded-xl border text-center transition-colors",
                isActive
                  ? "bg-primary/15 border-primary/30 text-foreground"
                  : "bg-foreground/[0.02] border-foreground/[0.05] text-muted-foreground/70 hover:bg-foreground/[0.04]",
              )}
            >
              <Icon className={cn("w-4 h-4", isActive ? "text-primary" : "text-muted-foreground/60")} />
              <span className="text-xs font-semibold">{cat.label}</span>
              <span
                className={cn(
                  "text-[11px] font-medium rounded-full px-1.5 py-0.5",
                  isActive ? "bg-primary/20 text-primary" : "bg-foreground/[0.04] text-muted-foreground/50",
                )}
              >
                {cat.count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

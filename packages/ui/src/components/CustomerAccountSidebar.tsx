"use client";

import React, { useState } from "react";
import { LayoutDashboard, Package, Heart, MapPin, CreditCard, Settings, LogOut } from "lucide-react";
import { cn } from "../lib/cn";

type NavItem = {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
};

const ITEMS: NavItem[] = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "orders", label: "Orders", icon: Package, badge: "3" },
  { id: "wishlist", label: "Wishlist", icon: Heart },
  { id: "addresses", label: "Addresses", icon: MapPin },
  { id: "payment", label: "Payment methods", icon: CreditCard },
  { id: "settings", label: "Settings", icon: Settings },
];

export interface CustomerAccountSidebarProps {
  className?: string;
}

export function CustomerAccountSidebar({ className }: CustomerAccountSidebarProps) {
  const [active, setActive] = useState("orders");

  return (
    <nav
      aria-label="Account navigation"
      className={cn("w-full max-w-xs bg-card backdrop-blur-xl border border-border p-3 rounded-2xl shadow-sm font-sans text-foreground", className)}
    >
      <div className="mb-3 flex items-center gap-2.5 px-2 py-2">
        <span className="grid h-10 w-10 place-items-center rounded-full bg-primary/15 text-sm font-bold text-primary">
          JD
        </span>
        <div className="min-w-0">
          <p className="truncate text-sm font-bold">Jane Doe</p>
          <p className="truncate text-xs text-muted-foreground">jane@acme.co</p>
        </div>
      </div>

      <ul className="space-y-0.5">
        {ITEMS.map((item) => {
          const isActive = active === item.id;
          return (
            <li key={item.id}>
              <button
                type="button"
                aria-current={isActive ? "page" : undefined}
                onClick={() => setActive(item.id)}
                className={cn(
                  "flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2.5 text-left text-sm transition-colors",
                  isActive ? "bg-primary/15 font-semibold text-foreground" : "text-muted-foreground hover:bg-foreground/[0.03] hover:text-foreground"
                )}
              >
                <item.icon className={cn("h-4 w-4 shrink-0", isActive ? "text-primary" : "text-muted-foreground")} />
                <span className="flex-1">{item.label}</span>
                {item.badge && (
                  <span className="rounded-full bg-primary/20 px-1.5 py-0.5 text-[11px] font-bold text-primary">{item.badge}</span>
                )}
              </button>
            </li>
          );
        })}
      </ul>

      <div className="mt-2 border-t border-border pt-2">
        <button
          type="button"
          className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2.5 text-left text-sm text-muted-foreground transition-colors hover:bg-foreground/[0.03] hover:text-rose-600 dark:hover:text-rose-400"
        >
          <LogOut className="h-4 w-4 shrink-0" />
          Sign out
        </button>
      </div>
    </nav>
  );
}

"use client";

import React, { useState } from "react";
import {
  Home,
  Inbox,
  Users,
  FileText,
  CreditCard,
  Cog,
  LifeBuoy,
} from "lucide-react";
import { cn } from "../lib/cn";

type Item = { icon: React.ElementType; label: string; badge?: number };
type Group = { heading: string; items: Item[] };

const GROUPS: Group[] = [
  {
    heading: "Workspace",
    items: [
      { icon: Home, label: "Home" },
      { icon: Inbox, label: "Inbox", badge: 8 },
      { icon: FileText, label: "Documents" },
    ],
  },
  {
    heading: "Team",
    items: [
      { icon: Users, label: "Members" },
      { icon: CreditCard, label: "Billing" },
    ],
  },
  {
    heading: "Support",
    items: [
      { icon: Cog, label: "Settings" },
      { icon: LifeBuoy, label: "Help center" },
    ],
  },
];

export interface SidebarNavigationProps {
  className?: string;
}

export function SidebarNavigation({ className }: SidebarNavigationProps) {
  const [active, setActive] = useState("Home");

  return (
    <nav
      aria-label="Sidebar"
      className={cn(
        "flex w-60 flex-col gap-4 rounded-2xl border border-border/50 bg-card/60 p-3 font-sans text-foreground shadow-xl backdrop-blur-xl",
        className,
      )}
    >
      {GROUPS.map((group) => (
        <div key={group.heading}>
          <div className="mb-1.5 px-2.5 text-[11px] font-bold uppercase tracking-wider text-muted-foreground/45">
            {group.heading}
          </div>
          <ul className="space-y-0.5">
            {group.items.map((item) => {
              const isActive = active === item.label;
              return (
                <li key={item.label}>
                  <button
                    type="button"
                    aria-current={isActive ? "page" : undefined}
                    onClick={() => setActive(item.label)}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-xl px-2.5 py-2 text-sm font-medium transition-colors",
                      isActive
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground/70 hover:bg-foreground/[0.04] hover:text-foreground",
                    )}
                  >
                    <item.icon className="h-4 w-4 shrink-0" />
                    <span className="flex-1 truncate text-left">{item.label}</span>
                    {item.badge != null && (
                      <span
                        className={cn(
                          "flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-[10px] font-bold",
                          isActive ? "bg-primary text-primary-foreground" : "bg-foreground/[0.08] text-muted-foreground",
                        )}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}

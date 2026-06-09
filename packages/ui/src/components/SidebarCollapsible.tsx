"use client";

import React, { useState } from "react";
import {
  LayoutDashboard,
  FolderKanban,
  Calendar,
  BarChart3,
  Settings,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import { cn } from "../lib/cn";

type Nav = { icon: React.ElementType; label: string };

const NAV: Nav[] = [
  { icon: LayoutDashboard, label: "Overview" },
  { icon: FolderKanban, label: "Projects" },
  { icon: Calendar, label: "Schedule" },
  { icon: BarChart3, label: "Reports" },
  { icon: Settings, label: "Settings" },
];

export interface SidebarCollapsibleProps {
  className?: string;
}

export function SidebarCollapsible({ className }: SidebarCollapsibleProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [active, setActive] = useState("Overview");

  return (
    <nav
      aria-label="Main"
      className={cn(
        "flex flex-col rounded-2xl border border-border/50 bg-card/60 p-2.5 font-sans text-foreground shadow-xl backdrop-blur-xl transition-all duration-300",
        collapsed ? "w-16" : "w-56",
        className,
      )}
    >
      <div className={cn("mb-3 flex items-center px-1.5", collapsed ? "justify-center" : "justify-between")}>
        {!collapsed && (
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-xs font-black text-primary-foreground">
              N
            </span>
            <span className="text-sm font-bold">Nimbus</span>
          </div>
        )}
        <button
          type="button"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          aria-expanded={!collapsed}
          onClick={() => setCollapsed((c) => !c)}
          className="rounded-lg p-1.5 text-muted-foreground/60 transition-colors hover:bg-foreground/[0.05] hover:text-foreground"
        >
          {collapsed ? <PanelLeftOpen className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
        </button>
      </div>

      <ul className="space-y-1">
        {NAV.map((item) => {
          const isActive = active === item.label;
          return (
            <li key={item.label}>
              <button
                type="button"
                aria-current={isActive ? "page" : undefined}
                aria-label={collapsed ? item.label : undefined}
                title={collapsed ? item.label : undefined}
                onClick={() => setActive(item.label)}
                className={cn(
                  "flex w-full items-center gap-3 rounded-xl px-2.5 py-2 text-sm font-medium transition-colors",
                  collapsed && "justify-center",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground/70 hover:bg-foreground/[0.04] hover:text-foreground",
                )}
              >
                <item.icon className="h-4 w-4 shrink-0" />
                {!collapsed && <span className="truncate">{item.label}</span>}
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

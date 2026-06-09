"use client";

import React, { useState } from "react";
import { User, Bell, CreditCard, Shield, ChevronRight } from "lucide-react";
import { cn } from "../lib/cn";

const NAV = [
  { id: "profile", label: "Profile", icon: User },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "billing", label: "Billing", icon: CreditCard },
  { id: "security", label: "Security", icon: Shield },
];

export interface DashboardSettingsLayoutProps {
  className?: string;
}

export function DashboardSettingsLayout({ className }: DashboardSettingsLayoutProps) {
  const [active, setActive] = useState("profile");
  const current = NAV.find((n) => n.id === active)!;

  return (
    <div className={cn("w-full max-w-xl bg-card/45 backdrop-blur-xl border border-border/50 rounded-2xl shadow-xl font-sans text-foreground overflow-hidden grid grid-cols-[40%_60%]", className)}>
      <nav className="border-r border-foreground/[0.05] p-2.5 space-y-0.5" aria-label="Settings">
        {NAV.map((n) => {
          const Icon = n.icon;
          const on = n.id === active;
          return (
            <button
              key={n.id}
              type="button"
              onClick={() => setActive(n.id)}
              aria-current={on ? "page" : undefined}
              className={cn(
                "w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-colors",
                on ? "bg-primary/10 text-primary" : "text-muted-foreground/70 hover:text-foreground hover:bg-foreground/[0.03]",
              )}
            >
              <Icon className="w-4 h-4" />
              {n.label}
              <ChevronRight className={cn("w-4 h-4 ml-auto transition-opacity", on ? "opacity-100" : "opacity-0")} />
            </button>
          );
        })}
      </nav>

      <div className="p-5">
        <h3 className="text-base font-bold flex items-center gap-1.5 mb-1">
          <current.icon className="w-4 h-4 text-primary" /> {current.label}
        </h3>
        <p className="text-xs text-muted-foreground/60 mb-4">Manage your {current.label.toLowerCase()} settings</p>
        <div className="space-y-2.5">
          <div className="h-9 rounded-lg bg-foreground/[0.03] border border-foreground/[0.06]" />
          <div className="h-9 rounded-lg bg-foreground/[0.03] border border-foreground/[0.06]" />
          <button type="button" className="w-full py-2 text-xs font-bold rounded-lg bg-primary text-primary-foreground hover:brightness-110 transition-all">Save</button>
        </div>
      </div>
    </div>
  );
}

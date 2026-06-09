"use client";

import React, { useState } from "react";
import { LayoutGrid, Search, Bell, Plus, ChevronDown } from "lucide-react";
import { cn } from "../lib/cn";

const NAV = ["Overview", "Projects", "Reports", "Team"];

export interface NavbarDashboardProps {
  className?: string;
}

export function NavbarDashboard({ className }: NavbarDashboardProps) {
  const [active, setActive] = useState("Overview");

  return (
    <header
      className={cn(
        "w-full max-w-3xl bg-card/45 backdrop-blur-xl border border-border/50 rounded-2xl shadow-xl font-sans text-foreground",
        className,
      )}
    >
      <div className="flex items-center gap-3 px-4 py-3">
        <a href="/" className="flex shrink-0 items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <LayoutGrid className="h-4 w-4" />
          </span>
          <span className="hidden text-base font-bold sm:block">Console</span>
        </a>

        <nav aria-label="Primary" className="hidden flex-1 md:block">
          <ul className="flex items-center gap-1">
            {NAV.map((n) => {
              const isActive = active === n;
              return (
                <li key={n}>
                  <button
                    type="button"
                    aria-current={isActive ? "page" : undefined}
                    onClick={() => setActive(n)}
                    className={cn(
                      "rounded-lg px-3 py-1.5 text-sm font-medium transition-colors",
                      isActive
                        ? "bg-secondary/60 text-foreground"
                        : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    {n}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="relative hidden lg:block">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/40" />
          <label htmlFor="dash-search" className="sr-only">
            Search
          </label>
          <input
            id="dash-search"
            placeholder="Search…"
            className="w-44 rounded-lg border border-border/60 bg-secondary/30 py-1.5 pl-8 pr-3 text-sm text-foreground placeholder:text-muted-foreground/40 focus:border-primary/40 focus:outline-none focus:ring-1 focus:ring-primary/30"
          />
        </div>

        <div className="ml-auto flex items-center gap-1.5 md:ml-0">
          <button
            type="button"
            className="hidden items-center gap-1 rounded-lg bg-primary px-2.5 py-1.5 text-sm font-bold text-primary-foreground transition-all hover:brightness-110 sm:inline-flex"
          >
            <Plus className="h-4 w-4" /> New
          </button>
          <button
            type="button"
            aria-label="Notifications"
            className="relative flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary/50 hover:text-foreground"
          >
            <Bell className="h-4 w-4" />
            <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-rose-500" />
          </button>
          <button
            type="button"
            className="flex items-center gap-1 rounded-full pl-0.5 pr-1.5 transition-colors hover:bg-secondary/50"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-violet-500/20 text-[11px] font-bold text-violet-300">
              JD
            </span>
            <ChevronDown className="h-3.5 w-3.5 text-muted-foreground/50" />
          </button>
        </div>
      </div>
    </header>
  );
}

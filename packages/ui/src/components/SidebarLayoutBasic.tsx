"use client";

import React, { useState } from "react";
import {
  Sparkles, LayoutDashboard, Folder, BarChart3, Inbox, Users, Settings,
  Search, ChevronDown, Plus, ChevronsLeft,
} from "lucide-react";
import { cn } from "../lib/cn";

const NAV = [
  { label: "Dashboard", icon: LayoutDashboard, badge: null },
  { label: "Projects", icon: Folder, badge: "24" },
  { label: "Analytics", icon: BarChart3, badge: null },
  { label: "Inbox", icon: Inbox, badge: "3" },
  { label: "Team", icon: Users, badge: null },
];

const RECENT = ["acme-marketing", "internal-tools", "billing-v2"];

export function SidebarLayoutBasic({ className }: { className?: string }) {
  const [active, setActive] = useState("Dashboard");
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className={cn("w-full max-w-3xl mx-auto h-[440px] rounded-2xl border border-white/[0.07] bg-bg overflow-hidden font-sans text-foreground grid", className)} style={{ gridTemplateColumns: collapsed ? "60px 1fr" : "220px 1fr" }}>
      <aside aria-label="Primary" className="border-r border-white/[0.06] bg-bg-2/60 flex flex-col">
        {/* brand + collapse */}
        <div className="flex items-center justify-between px-3 py-3 border-b border-white/[0.06]">
          <a href="/" className="flex items-center gap-2 min-w-0">
            <span className="grid h-7 w-7 place-items-center rounded-md bg-primary text-bg flex-shrink-0">
              <Sparkles className="h-3.5 w-3.5" />
            </span>
            {!collapsed && <span className="text-sm font-semibold truncate">Console</span>}
          </a>
          <button
            onClick={() => setCollapsed((c) => !c)}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            aria-expanded={!collapsed}
            className="grid h-6 w-6 place-items-center rounded-md text-muted-foreground hover:bg-white/[0.05] hover:text-foreground"
          >
            <ChevronsLeft className={cn("h-3.5 w-3.5 transition-transform", collapsed && "rotate-180")} />
          </button>
        </div>

        {/* search */}
        {!collapsed && (
          <div className="px-3 py-2">
            <label htmlFor="sb-search" className="sr-only">Search</label>
            <div className="relative">
              <Search className="absolute left-2 top-1.5 h-3.5 w-3.5 text-muted-foreground" />
              <input
                id="sb-search"
                type="search"
                placeholder="Search..."
                autoComplete="off"
                className="w-full h-7 rounded-md border border-white/10 bg-white/[0.03] pl-7 pr-2 text-[11px] text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-primary/40"
              />
            </div>
          </div>
        )}

        {/* nav */}
        <nav className="flex-1 overflow-y-auto px-2 py-2">
          <ul className="flex flex-col gap-0.5">
            {NAV.map((it) => {
              const isActive = active === it.label;
              return (
                <li key={it.label}>
                  <button
                    onClick={() => setActive(it.label)}
                    aria-current={isActive ? "page" : undefined}
                    title={collapsed ? it.label : undefined}
                    className={cn(
                      "group w-full flex items-center gap-2.5 rounded-md px-2 py-1.5 text-[12.5px] transition-colors",
                      isActive ? "bg-primary/10 text-foreground" : "text-muted-foreground hover:bg-white/[0.04] hover:text-foreground",
                      collapsed && "justify-center",
                    )}
                  >
                    <it.icon className={cn("h-4 w-4", isActive && "text-primary")} />
                    {!collapsed && (
                      <>
                        <span className="flex-1 text-left">{it.label}</span>
                        {it.badge && <span className="rounded-md bg-white/[0.05] px-1.5 py-px text-[10px] font-mono text-muted-foreground">{it.badge}</span>}
                      </>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>

          {!collapsed && (
            <div className="mt-4">
              <div className="flex items-center justify-between px-2 mb-1">
                <span className="text-[10px] font-mono uppercase tracking-[0.18em] text-muted-foreground/60">Recent</span>
                <button aria-label="New project" className="grid h-5 w-5 place-items-center rounded text-muted-foreground hover:bg-white/[0.05] hover:text-foreground">
                  <Plus className="h-3 w-3" />
                </button>
              </div>
              <ul className="flex flex-col gap-0.5">
                {RECENT.map((r) => (
                  <li key={r}>
                    <button className="w-full text-left rounded-md px-2 py-1 text-[11.5px] font-mono text-muted-foreground hover:bg-white/[0.04] hover:text-foreground truncate">
                      {r}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </nav>

        {/* account */}
        <div className="border-t border-white/[0.06] p-2">
          <button className={cn("w-full flex items-center gap-2 rounded-md p-1.5 hover:bg-white/[0.05]", collapsed && "justify-center")}>
            <span className="grid h-7 w-7 place-items-center rounded-full bg-gradient-to-br from-cyan to-violet text-[10px] font-bold text-bg flex-shrink-0">AB</span>
            {!collapsed && (
              <span className="flex-1 text-left min-w-0">
                <span className="block text-[11.5px] font-medium truncate">Aisha B.</span>
                <span className="block text-[10px] text-muted-foreground/60 truncate">Owner · acme-prod</span>
              </span>
            )}
            {!collapsed && <ChevronDown className="h-3 w-3 text-muted-foreground/60" />}
          </button>
        </div>
      </aside>

      {/* main canvas */}
      <main className="flex flex-col">
        <header className="flex items-center justify-between px-5 py-3 border-b border-white/[0.06]">
          <div>
            <h2 className="text-[15px] font-semibold tracking-tight">{active}</h2>
            <p className="text-[11px] text-muted-foreground/70 mt-0.5">Live workspace view</p>
          </div>
          <button className="h-8 rounded-md bg-primary px-3 text-[12px] font-semibold text-bg">+ New</button>
        </header>
        <div className="flex-1 grid place-items-center p-6">
          <div className="text-center text-muted-foreground/70">
            <Settings className="h-6 w-6 mx-auto mb-2 opacity-50" />
            <p className="text-[12px]">Sidebar layout content goes here.</p>
          </div>
        </div>
      </main>
    </div>
  );
}

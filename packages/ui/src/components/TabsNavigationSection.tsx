"use client";

import React, { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Activity, BarChart3, Inbox, Settings, Users } from "lucide-react";
import { cn } from "../lib/cn";

const TABS = [
  { id: "overview", label: "Overview", icon: Activity, count: null },
  { id: "metrics", label: "Metrics", icon: BarChart3, count: 12 },
  { id: "inbox", label: "Inbox", icon: Inbox, count: 3 },
  { id: "team", label: "Team", icon: Users, count: null },
  { id: "settings", label: "Settings", icon: Settings, count: null },
];

export function TabsNavigationSection({ className }: { className?: string }) {
  const [active, setActive] = useState("overview");
  const reduced = useReducedMotion();

  const onKey = (e: React.KeyboardEvent, idx: number) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      setActive(TABS[(idx + 1) % TABS.length].id);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      setActive(TABS[(idx - 1 + TABS.length) % TABS.length].id);
    } else if (e.key === "Home") {
      e.preventDefault();
      setActive(TABS[0].id);
    } else if (e.key === "End") {
      e.preventDefault();
      setActive(TABS[TABS.length - 1].id);
    }
  };

  return (
    <section className={cn("w-full max-w-2xl mx-auto font-sans text-foreground", className)} aria-label="Tabs navigation section">
      {/* underline variant */}
      <div className="rounded-xl border border-white/[0.07] bg-bg-2/80 backdrop-blur-xl">
        <div role="tablist" aria-label="Workspace sections" className="flex items-center gap-0 border-b border-white/[0.06] px-2">
          {TABS.map((t, i) => {
            const isActive = active === t.id;
            return (
              <button
                key={t.id}
                role="tab"
                aria-selected={isActive}
                aria-controls={`tab-${t.id}-panel`}
                id={`tab-${t.id}`}
                tabIndex={isActive ? 0 : -1}
                onKeyDown={(e) => onKey(e, i)}
                onClick={() => setActive(t.id)}
                className={cn(
                  "relative inline-flex items-center gap-1.5 px-3 py-2.5 text-[12.5px] font-medium transition-colors",
                  isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground",
                )}
              >
                <t.icon className="h-3.5 w-3.5" />
                {t.label}
                {t.count !== null && (
                  <span className={cn("rounded-md px-1.5 py-px text-[10px] font-mono", isActive ? "bg-primary/15 text-primary" : "bg-white/[0.05] text-muted-foreground")}>{t.count}</span>
                )}
                {isActive && (
                  <motion.span
                    layoutId="tabsnav-underline"
                    transition={reduced ? { duration: 0 } : { type: "spring", stiffness: 360, damping: 30 }}
                    aria-hidden
                    className="absolute -bottom-px left-2 right-2 h-px bg-primary shadow-[0_0_8px_var(--accent-glow)]"
                  />
                )}
              </button>
            );
          })}
        </div>
        <div id={`tab-${active}-panel`} role="tabpanel" aria-labelledby={`tab-${active}`} className="p-4">
          <p className="text-[12.5px] text-muted-foreground/80">
            Showing <span className="text-foreground font-medium">{TABS.find((t) => t.id === active)?.label}</span> panel. Use ←/→ to switch tabs.
          </p>
        </div>
      </div>

      {/* pill variant */}
      <div className="mt-3 inline-flex items-center gap-1 rounded-xl border border-white/[0.07] bg-bg-3/50 backdrop-blur-xl p-1">
        {TABS.slice(0, 4).map((t) => {
          const isActive = active === t.id;
          return (
            <button
              key={`pill-${t.id}`}
              onClick={() => setActive(t.id)}
              aria-pressed={isActive}
              className={cn(
                "relative rounded-lg px-3 py-1.5 text-[12px] font-medium transition-colors",
                isActive ? "text-bg" : "text-muted-foreground hover:text-foreground",
              )}
            >
              {isActive && (
                <motion.span
                  layoutId="tabsnav-pill"
                  transition={reduced ? { duration: 0 } : { type: "spring", stiffness: 380, damping: 32 }}
                  className="absolute inset-0 rounded-lg bg-primary shadow-[0_0_18px_-4px_var(--accent-glow)]"
                  aria-hidden
                />
              )}
              <span className="relative">{t.label}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
}

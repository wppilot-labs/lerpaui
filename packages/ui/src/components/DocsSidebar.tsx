"use client";

import React, { useState } from "react";
import { cn } from "../lib/cn";

export interface DocsSidebarProps {
  className?: string;
}

type NavSection = { label: string; items: string[] };

const NAV: NavSection[] = [
  { label: "Getting Started", items: ["Introduction", "Installation", "Quickstart"] },
  { label: "Customization", items: ["Theming", "Dark mode", "Tokens"] },
  { label: "Components", items: ["Button", "Input", "Dialog", "Toast"] },
];

export function DocsSidebar({ className }: DocsSidebarProps) {
  const [active, setActive] = useState("Installation");

  return (
    <nav
      aria-label="Documentation"
      className={cn(
        "w-full max-w-[16rem] bg-card/45 backdrop-blur-xl border border-border/50 p-5 rounded-2xl shadow-xl font-sans text-foreground",
        className,
      )}
    >
      {NAV.map((section) => (
        <div key={section.label} className="mb-4 last:mb-0">
          <p className="px-2 mb-1 text-[11px] uppercase font-bold tracking-wider text-muted-foreground/45">
            {section.label}
          </p>
          <ul className="space-y-0.5">
            {section.items.map((item) => {
              const isActive = item === active;
              return (
                <li key={item}>
                  <button
                    type="button"
                    aria-current={isActive ? "page" : undefined}
                    onClick={() => setActive(item)}
                    className={cn(
                      "w-full text-left px-2 py-2 rounded-lg text-sm transition-colors",
                      isActive
                        ? "bg-primary/10 text-primary font-medium"
                        : "text-muted-foreground/65 hover:text-foreground hover:bg-foreground/[0.03]",
                    )}
                  >
                    {item}
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

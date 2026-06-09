"use client";

import React, { useState } from "react";
import { cn } from "../lib/cn";

export interface DocsTocSidebarProps {
  className?: string;
}

type Heading = { id: string; title: string; depth: 2 | 3 };

const HEADINGS: Heading[] = [
  { id: "overview", title: "Overview", depth: 2 },
  { id: "install", title: "Installation", depth: 2 },
  { id: "npm", title: "Using npm", depth: 3 },
  { id: "pnpm", title: "Using pnpm", depth: 3 },
  { id: "config", title: "Configuration", depth: 2 },
  { id: "faq", title: "FAQ", depth: 2 },
];

export function DocsTocSidebar({ className }: DocsTocSidebarProps) {
  const [active, setActive] = useState("install");

  return (
    <nav
      aria-label="On this page"
      className={cn(
        "w-full max-w-[16rem] bg-card/45 backdrop-blur-xl border border-border/50 p-5 rounded-2xl shadow-xl font-sans text-foreground",
        className,
      )}
    >
      <p className="mb-2 text-[11px] uppercase font-bold tracking-wider text-muted-foreground/45">On this page</p>
      <ul className="space-y-0.5 border-l border-foreground/[0.08]">
        {HEADINGS.map((h) => {
          const isActive = h.id === active;
          return (
            <li key={h.id}>
              <button
                type="button"
                aria-current={isActive ? "location" : undefined}
                onClick={() => setActive(h.id)}
                className={cn(
                  "block w-full text-left -ml-px border-l-2 py-1 text-sm transition-colors",
                  h.depth === 3 ? "pl-6" : "pl-3",
                  isActive
                    ? "border-primary text-primary font-medium"
                    : "border-transparent text-muted-foreground/60 hover:text-foreground",
                )}
              >
                {h.title}
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

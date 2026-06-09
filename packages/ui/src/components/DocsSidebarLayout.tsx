"use client";

import React, { useState } from "react";
import { cn } from "../lib/cn";

export interface DocsSidebarLayoutProps {
  className?: string;
}

const NAV: { label: string; items: { id: string; title: string }[] }[] = [
  {
    label: "Guides",
    items: [
      { id: "intro", title: "Introduction" },
      { id: "install", title: "Installation" },
    ],
  },
  {
    label: "Concepts",
    items: [
      { id: "routing", title: "Routing" },
      { id: "data", title: "Data fetching" },
    ],
  },
];

const CONTENT: Record<string, { title: string; body: string }> = {
  intro: { title: "Introduction", body: "A quick overview of what the library offers and how it fits your stack." },
  install: { title: "Installation", body: "Install the package and add the provider to start using components." },
  routing: { title: "Routing", body: "File-based routing maps each file in the app directory to a URL." },
  data: { title: "Data fetching", body: "Fetch on the server by default; opt into client fetching when needed." },
};

export function DocsSidebarLayout({ className }: DocsSidebarLayoutProps) {
  const [active, setActive] = useState("install");
  const page = CONTENT[active];

  return (
    <div
      className={cn(
        "w-full max-w-3xl bg-card/45 backdrop-blur-xl border border-border/50 rounded-2xl shadow-xl font-sans text-foreground overflow-hidden flex",
        className,
      )}
    >
      <nav aria-label="Documentation" className="w-48 shrink-0 border-r border-foreground/[0.06] p-4">
        {NAV.map((section) => (
          <div key={section.label} className="mb-3 last:mb-0">
            <p className="px-2 mb-1 text-[11px] uppercase font-bold tracking-wider text-muted-foreground/45">
              {section.label}
            </p>
            <ul className="space-y-0.5">
              {section.items.map((item) => {
                const isActive = item.id === active;
                return (
                  <li key={item.id}>
                    <button
                      type="button"
                      aria-current={isActive ? "page" : undefined}
                      onClick={() => setActive(item.id)}
                      className={cn(
                        "w-full text-left px-2 py-2 rounded-lg text-sm transition-colors",
                        isActive
                          ? "bg-primary/10 text-primary font-medium"
                          : "text-muted-foreground/65 hover:text-foreground hover:bg-foreground/[0.03]",
                      )}
                    >
                      {item.title}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      <main className="flex-1 p-6 min-w-0">
        <p className="text-[11px] uppercase font-bold tracking-wider text-muted-foreground/45">Documentation</p>
        <h3 className="text-base font-bold mt-1">{page.title}</h3>
        <p className="mt-2 text-sm text-muted-foreground/70 leading-relaxed">{page.body}</p>
        <div className="mt-4 h-px bg-foreground/[0.06]" />
        <p className="mt-4 text-sm text-muted-foreground/45">
          Was this page helpful? Edit it on GitHub.
        </p>
      </main>
    </div>
  );
}

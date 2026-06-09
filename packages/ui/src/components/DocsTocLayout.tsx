"use client";

import React, { useState } from "react";
import { List } from "lucide-react";
import { cn } from "../lib/cn";

export interface DocsTocLayoutProps {
  className?: string;
}

type Section = { id: string; title: string; body: string };

const SECTIONS: Section[] = [
  { id: "overview", title: "Overview", body: "The toolkit ships accessible primitives styled with design tokens." },
  { id: "setup", title: "Setup", body: "Install the package and wrap your tree with the provider component." },
  { id: "usage", title: "Usage", body: "Import any component and compose it with your own layout." },
];

export function DocsTocLayout({ className }: DocsTocLayoutProps) {
  const [active, setActive] = useState("overview");

  return (
    <div
      className={cn(
        "w-full max-w-3xl bg-card/45 backdrop-blur-xl border border-border/50 rounded-2xl shadow-xl font-sans text-foreground overflow-hidden flex",
        className,
      )}
    >
      <article className="flex-1 p-6 min-w-0 space-y-5">
        <header>
          <p className="text-[11px] uppercase font-bold tracking-wider text-muted-foreground/45">Guide</p>
          <h3 className="text-base font-bold mt-1">Getting started</h3>
        </header>
        {SECTIONS.map((s) => (
          <section key={s.id} onMouseEnter={() => setActive(s.id)}>
            <h4 className="text-base font-semibold scroll-mt-4">{s.title}</h4>
            <p className="mt-1 text-sm text-muted-foreground/65 leading-relaxed">{s.body}</p>
          </section>
        ))}
      </article>

      <nav
        aria-label="On this page"
        className="hidden sm:block w-48 shrink-0 border-l border-foreground/[0.06] p-4"
      >
        <div className="sticky top-4">
          <p className="flex items-center gap-1.5 mb-2 text-[11px] uppercase font-bold tracking-wider text-muted-foreground/45">
            <List className="w-3.5 h-3.5" />
            On this page
          </p>
          <ul className="space-y-0.5 border-l border-foreground/[0.08]">
            {SECTIONS.map((s) => {
              const isActive = s.id === active;
              return (
                <li key={s.id}>
                  <button
                    type="button"
                    aria-current={isActive ? "location" : undefined}
                    onClick={() => setActive(s.id)}
                    className={cn(
                      "block w-full text-left -ml-px border-l-2 pl-3 py-1 text-sm transition-colors",
                      isActive
                        ? "border-primary text-primary font-medium"
                        : "border-transparent text-muted-foreground/60 hover:text-foreground",
                    )}
                  >
                    {s.title}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </nav>
    </div>
  );
}

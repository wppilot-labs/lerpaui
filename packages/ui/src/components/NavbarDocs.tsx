"use client";

import React, { useState } from "react";
import { BookText, Search, ChevronDown, Github } from "lucide-react";
import { cn } from "../lib/cn";

const NAV = ["Docs", "Guides", "API", "Changelog"];
const VERSIONS = ["v3.2", "v3.1", "v2.x"];

export interface NavbarDocsProps {
  className?: string;
}

export function NavbarDocs({ className }: NavbarDocsProps) {
  const [active, setActive] = useState("Docs");
  const [version, setVersion] = useState("v3.2");

  return (
    <header
      className={cn(
        "w-full max-w-3xl bg-card/45 backdrop-blur-xl border border-border/50 rounded-2xl shadow-xl font-sans text-foreground",
        className,
      )}
    >
      <div className="flex items-center gap-3 px-4 py-3">
        <a href="/" className="flex shrink-0 items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary/70 text-primary">
            <BookText className="h-4 w-4" />
          </span>
          <span className="text-base font-bold">Docs</span>
        </a>

        <div className="relative">
          <label htmlFor="docs-version" className="sr-only">
            Version
          </label>
          <select
            id="docs-version"
            value={version}
            onChange={(e) => setVersion(e.target.value)}
            className="cursor-pointer appearance-none rounded-md border border-border/60 bg-secondary/40 py-1 pl-2 pr-6 text-xs font-semibold text-foreground focus:border-primary/40 focus:outline-none"
          >
            {VERSIONS.map((v) => (
              <option key={v} value={v}>
                {v}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-1.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground/50" />
        </div>

        <nav aria-label="Primary" className="hidden md:block">
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
                      "rounded-lg px-2.5 py-1.5 text-sm font-medium transition-colors",
                      isActive
                        ? "text-foreground"
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

        <div className="ml-auto flex items-center gap-2">
          <div className="relative hidden sm:block">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/40" />
            <label htmlFor="docs-search" className="sr-only">
              Search docs
            </label>
            <input
              id="docs-search"
              placeholder="Search docs…"
              className="w-40 rounded-lg border border-border/60 bg-secondary/30 py-1.5 pl-8 pr-8 text-sm text-foreground placeholder:text-muted-foreground/40 focus:border-primary/40 focus:outline-none focus:ring-1 focus:ring-primary/30"
            />
            <kbd className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 rounded border border-border/60 bg-secondary/60 px-1 text-[11px] font-semibold text-muted-foreground/60">
              ⌘K
            </kbd>
          </div>
          <a
            href="/"
            aria-label="GitHub repository"
            className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary/50 hover:text-foreground"
          >
            <Github className="h-4 w-4" />
          </a>
        </div>
      </div>
    </header>
  );
}

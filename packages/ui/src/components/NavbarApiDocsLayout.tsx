"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Search, Book, Code2, Terminal, ChevronRight, Github, ExternalLink } from "lucide-react";
import { cn } from "../lib/cn";

export interface NavbarApiDocsLayoutProps {
  className?: string;
  version?: string;
  activeSlug?: string;
}

const NAV_GROUPS = [
  {
    label: "Getting started",
    items: [
      { slug: "intro", label: "Introduction" },
      { slug: "auth", label: "Authentication" },
      { slug: "quickstart", label: "Quickstart" },
    ],
  },
  {
    label: "Core resources",
    items: [
      { slug: "users", label: "Users", method: "GET" },
      { slug: "users-create", label: "Create user", method: "POST" },
      { slug: "users-update", label: "Update user", method: "PATCH" },
      { slug: "events", label: "Events", method: "GET" },
      { slug: "webhooks", label: "Webhooks", method: "POST" },
    ],
  },
];

const METHOD_TONE: Record<string, string> = {
  GET: "text-sky-500 bg-sky-500/10",
  POST: "text-emerald-500 bg-emerald-500/10",
  PATCH: "text-amber-500 bg-amber-500/10",
};

export function NavbarApiDocsLayout({ className, version = "v2.4", activeSlug = "users" }: NavbarApiDocsLayoutProps) {
  const reduced = useReducedMotion() ?? false;

  return (
    <section
      aria-label="API docs navigation"
      className={cn(
        "w-full overflow-hidden rounded-2xl border bg-card shadow-sm transition-shadow hover:shadow-md",
        className
      )}
    >
      <header className="flex items-center justify-between gap-3 border-b bg-muted/20 px-4 py-3">
        <div className="flex items-center gap-3">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-primary/15 text-primary">
            <Book className="h-4 w-4" aria-hidden />
          </span>
          <div>
            <p className="text-sm font-semibold text-foreground">API Reference</p>
            <p className="text-[10px] text-muted-foreground">{version} · REST · OpenAPI 3.1</p>
          </div>
        </div>
        <div className="hidden items-center gap-2 sm:flex">
          <button type="button" className="inline-flex items-center gap-1.5 rounded-md border bg-card px-2.5 py-1 text-[11px] font-medium text-muted-foreground hover:text-foreground">
            <Github className="h-3 w-3" aria-hidden /> SDKs
          </button>
          <button type="button" className="inline-flex items-center gap-1.5 rounded-md bg-primary px-2.5 py-1 text-[11px] font-semibold text-primary-foreground shadow-sm shadow-primary/25 hover:brightness-110">
            <Terminal className="h-3 w-3" aria-hidden /> Try in playground
            <ExternalLink className="h-3 w-3 opacity-70" aria-hidden />
          </button>
        </div>
      </header>

      <div className="grid items-start md:grid-cols-[260px_1fr]">
        <nav className="space-y-5 border-b p-4 md:border-b-0 md:border-r" aria-label="API sections">
          <label className="flex items-center gap-2 rounded-lg border bg-muted/20 px-2.5 py-1.5">
            <Search className="h-3.5 w-3.5 text-muted-foreground" aria-hidden />
            <input
              type="text"
              placeholder="Search endpoints…"
              className="flex-1 bg-transparent text-xs text-foreground placeholder:text-muted-foreground focus:outline-none"
              aria-label="Search endpoints"
            />
            <kbd className="rounded border bg-card px-1.5 py-0.5 font-mono text-[9px] text-muted-foreground">⌘K</kbd>
          </label>

          {NAV_GROUPS.map((g, gi) => (
            <motion.div
              key={g.label}
              initial={reduced ? false : { opacity: 0, x: -4 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.35, delay: gi * 0.06 }}
            >
              <p className="mb-1.5 px-2 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">{g.label}</p>
              <ul className="space-y-0.5">
                {g.items.map((it) => {
                  const isActive = it.slug === activeSlug;
                  return (
                    <li key={it.slug}>
                      <a
                        href={`#${it.slug}`}
                        aria-current={isActive ? "page" : undefined}
                        className={cn(
                          "flex items-center justify-between gap-2 rounded-md px-2 py-1.5 text-[12px] font-medium transition-colors",
                          isActive ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted/30 hover:text-foreground"
                        )}
                      >
                        <span className="truncate">{it.label}</span>
                        {"method" in it && it.method && (
                          <span className={cn("rounded px-1.5 py-0.5 font-mono text-[8px] font-bold tracking-wider", METHOD_TONE[it.method])}>
                            {it.method}
                          </span>
                        )}
                      </a>
                    </li>
                  );
                })}
              </ul>
            </motion.div>
          ))}
        </nav>

        <div className="p-5">
          <nav aria-label="Breadcrumb" className="mb-3 flex items-center gap-1 text-[11px] text-muted-foreground">
            <span>Docs</span>
            <ChevronRight className="h-3 w-3" aria-hidden />
            <span>Core resources</span>
            <ChevronRight className="h-3 w-3" aria-hidden />
            <span className="text-foreground">Users</span>
          </nav>

          <h2 className="text-xl font-semibold text-foreground">List users</h2>
          <p className="mt-1 text-sm text-muted-foreground">Returns a paginated list of every user in the workspace.</p>

          <div className="mt-4 overflow-hidden rounded-xl border bg-zinc-950 text-zinc-100">
            <div className="flex items-center justify-between border-b border-white/10 bg-white/[0.03] px-3 py-1.5">
              <span className="inline-flex items-center gap-1.5 text-[10px] font-mono text-zinc-400">
                <Code2 className="h-3 w-3" aria-hidden /> curl
              </span>
              <button type="button" className="rounded text-[10px] text-zinc-400 hover:text-zinc-200">Copy</button>
            </div>
            <pre className="overflow-x-auto px-3 py-3 font-mono text-[11px] leading-relaxed">
              <code><span className="text-emerald-400">curl</span> https://api.example.com/v2/users \{"\n"}  -H <span className="text-amber-300">&quot;Authorization: Bearer $TOKEN&quot;</span></code>
            </pre>
          </div>
        </div>
      </div>
    </section>
  );
}

export default NavbarApiDocsLayout;

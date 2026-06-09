"use client";

import React from "react";
import { BookOpen, Code2, Terminal, Users } from "lucide-react";
import { cn } from "../lib/cn";

type DocLink = { label: string; badge?: string };

type DocColumn = {
  heading: string;
  icon: React.ComponentType<{ className?: string }>;
  links: DocLink[];
};

const COLUMNS: DocColumn[] = [
  {
    heading: "Documentation",
    icon: BookOpen,
    links: [
      { label: "Quickstart" },
      { label: "Authentication" },
      { label: "Webhooks" },
      { label: "Rate limits" },
      { label: "Errors" },
    ],
  },
  {
    heading: "API reference",
    icon: Code2,
    links: [
      { label: "REST API", badge: "v3" },
      { label: "GraphQL" },
      { label: "Streaming", badge: "Beta" },
      { label: "Pagination" },
      { label: "SDKs" },
    ],
  },
  {
    heading: "Tooling",
    icon: Terminal,
    links: [
      { label: "CLI reference" },
      { label: "Config files" },
      { label: "Plugins" },
      { label: "Local dev" },
      { label: "Migrations" },
    ],
  },
  {
    heading: "Community",
    icon: Users,
    links: [
      { label: "Discord" },
      { label: "GitHub Discussions" },
      { label: "Changelog" },
      { label: "Office hours", badge: "Thu" },
      { label: "Status" },
    ],
  },
];

export interface FooterDeveloperDocsLinksProps {
  className?: string;
}

export function FooterDeveloperDocsLinks({ className }: FooterDeveloperDocsLinksProps) {
  return (
    <footer
      className={cn(
        "w-full bg-card/45 backdrop-blur-xl border border-border/50 rounded-2xl shadow-xl p-6 font-sans text-foreground",
        className,
      )}
    >
      <div className="grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-4">
        {COLUMNS.map((col) => {
          const Icon = col.icon;
          return (
            <nav key={col.heading} aria-label={col.heading}>
              <h3 className="mb-3 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-foreground">
                <Icon className="w-4 h-4 text-primary" />
                {col.heading}
              </h3>
              <ul className="space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href="/"
                      className="inline-flex items-center gap-1.5 text-sm text-muted-foreground/70 transition-colors hover:text-foreground"
                    >
                      {link.label}
                      {link.badge && (
                        <span className="rounded bg-foreground/[0.06] px-1.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground/80">
                          {link.badge}
                        </span>
                      )}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          );
        })}
      </div>

      <div className="mt-8 border-t border-foreground/[0.05] pt-4 text-xs text-muted-foreground/55">
        © {new Date().getFullYear()} Developer Platform · Built for builders.
      </div>
    </footer>
  );
}

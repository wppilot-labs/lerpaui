"use client";

import React from "react";
import { BookOpen } from "lucide-react";
import { cn } from "../lib/cn";

export interface FooterDocsBasicProps {
  className?: string;
}

interface Column {
  title: string;
  links: string[];
}

const COLUMNS: Column[] = [
  { title: "Docs", links: ["Introduction", "Installation", "Quick start", "Changelog"] },
  { title: "Guides", links: ["Authentication", "Theming", "Deployment", "Migrations"] },
  { title: "API", links: ["REST reference", "Webhooks", "Rate limits", "SDKs"] },
  { title: "Community", links: ["GitHub", "Discord", "Stack Overflow", "Roadmap"] },
];

export function FooterDocsBasic({ className }: FooterDocsBasicProps) {
  return (
    <footer
      aria-label="Documentation footer"
      className={cn("w-full border-t border-border bg-background text-foreground", className)}
    >
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {COLUMNS.map((column) => (
            <nav key={column.title} aria-label={column.title}>
              <h3 className="text-sm font-semibold text-foreground">{column.title}</h3>
              <ul className="mt-4 space-y-3">
                {column.links.map((link) => (
                  <li key={link}>
                    <a
                      href="/"
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-border pt-6 sm:flex-row">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <BookOpen className="h-4 w-4" />
            </span>
            <span className="text-sm font-semibold text-foreground">Acme Docs</span>
          </div>
          <p className="text-sm text-muted-foreground">© 2026 Acme Inc. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default FooterDocsBasic;

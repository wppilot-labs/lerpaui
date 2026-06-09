"use client";

import React from "react";
import { cn } from "../lib/cn";

export interface DocsQuickstartSectionProps {
  className?: string;
}

type Step = { title: string; desc: string; code?: string };

const STEPS: Step[] = [
  { title: "Install the package", desc: "Add the library to your project.", code: "npm install @acme/ui" },
  { title: "Add the provider", desc: "Wrap your app so components inherit the theme.", code: "<AcmeProvider>{children}</AcmeProvider>" },
  { title: "Import a component", desc: "Drop it into any page or route.", code: 'import { Button } from "@acme/ui";' },
  { title: "Ship it", desc: "Build and deploy — you're done." },
];

export function DocsQuickstartSection({ className }: DocsQuickstartSectionProps) {
  return (
    <div
      className={cn(
        "w-full max-w-xl bg-card/45 backdrop-blur-xl border border-border/50 p-6 rounded-2xl shadow-xl font-sans text-foreground",
        className,
      )}
    >
      <header className="mb-5">
        <p className="text-[11px] uppercase font-bold tracking-wider text-muted-foreground/45">Get started</p>
        <h3 className="text-base font-bold mt-0.5">Quickstart</h3>
      </header>

      <ol className="space-y-5">
        {STEPS.map((s, i) => (
          <li key={s.title} className="flex gap-3.5">
            <span className="grid place-items-center shrink-0 h-7 w-7 rounded-full bg-primary/15 text-primary text-xs font-bold">
              {i + 1}
            </span>
            <div className="min-w-0 flex-1 pt-0.5">
              <h4 className="text-sm font-semibold">{s.title}</h4>
              <p className="text-sm text-muted-foreground/60 mt-0.5 leading-relaxed">{s.desc}</p>
              {s.code && (
                <div className="mt-2 rounded-lg bg-muted border border-foreground/[0.05] px-3 py-2 font-mono text-sm text-emerald-400/90 overflow-x-auto">
                  {s.code}
                </div>
              )}
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

"use client";

import React, { useState } from "react";
import {
  ChevronDown,
  LayoutGrid,
  BarChart3,
  Workflow,
  ShieldCheck,
  Boxes,
  FileText,
  LifeBuoy,
  Sparkles,
} from "lucide-react";
import { cn } from "../lib/cn";

type Link = { icon: React.ElementType; title: string; desc: string };

const COLUMNS: { heading: string; links: Link[] }[] = [
  {
    heading: "Platform",
    links: [
      { icon: LayoutGrid, title: "Dashboard", desc: "Unified control center" },
      { icon: Workflow, title: "Automations", desc: "No-code workflows" },
      { icon: Boxes, title: "Integrations", desc: "120+ native apps" },
    ],
  },
  {
    heading: "Solutions",
    links: [
      { icon: BarChart3, title: "Analytics", desc: "Real-time reporting" },
      { icon: ShieldCheck, title: "Security", desc: "SOC 2 & SSO" },
      { icon: Sparkles, title: "AI Assist", desc: "Smart suggestions" },
    ],
  },
  {
    heading: "Resources",
    links: [
      { icon: FileText, title: "Documentation", desc: "Guides & API refs" },
      { icon: LifeBuoy, title: "Support", desc: "24/7 help center" },
    ],
  },
];

export interface MegaMenuProps {
  className?: string;
}

export function MegaMenu({ className }: MegaMenuProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className={cn("relative w-full max-w-2xl font-sans text-foreground", className)}>
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="true"
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1.5 rounded-xl border border-border/50 bg-card/60 px-4 py-2 text-sm font-bold backdrop-blur-xl transition-colors hover:bg-card"
      >
        Products
        <ChevronDown className={cn("h-4 w-4 text-muted-foreground transition-transform", open && "rotate-180")} />
      </button>

      {open && (
        <div className="absolute left-0 z-50 mt-2 w-full rounded-2xl border border-border/50 bg-card/95 p-5 shadow-2xl backdrop-blur-2xl">
          <div className="grid grid-cols-3 gap-5">
            {COLUMNS.map((col) => (
              <div key={col.heading}>
                <div className="mb-2.5 text-[11px] font-bold uppercase tracking-wider text-muted-foreground/50">
                  {col.heading}
                </div>
                <ul className="space-y-1">
                  {col.links.map((link) => (
                    <li key={link.title}>
                      <a
                        href="/"
                        className="group flex items-start gap-2.5 rounded-xl p-2 transition-colors hover:bg-foreground/[0.04]"
                      >
                        <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                          <link.icon className="h-4 w-4" />
                        </span>
                        <span className="min-w-0">
                          <span className="block text-sm font-semibold leading-tight group-hover:text-primary">
                            {link.title}
                          </span>
                          <span className="block text-xs text-muted-foreground/55">{link.desc}</span>
                        </span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-4 flex items-center justify-between rounded-xl border border-primary/15 bg-primary/[0.06] px-4 py-2.5">
            <span className="text-xs font-medium text-muted-foreground">
              New: AI-powered insights are now in beta
            </span>
            <a href="/" className="text-xs font-bold text-primary hover:underline">
              Learn more
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

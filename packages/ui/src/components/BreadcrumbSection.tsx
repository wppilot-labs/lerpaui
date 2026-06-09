"use client";

import * as React from "react";
import { Home, ChevronRight, Slash, MoreHorizontal, Folder, FileText, Star } from "lucide-react";
import { cn } from "../lib/cn";

export interface BreadcrumbCrumb {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  current?: boolean;
}

export interface BreadcrumbSectionProps {
  className?: string;
  trail?: BreadcrumbCrumb[];
}

const DEFAULT_TRAIL: BreadcrumbCrumb[] = [
  { label: "Docs", href: "#", icon: Home },
  { label: "Components", href: "#", icon: Folder },
  { label: "Forms", href: "#", icon: Folder },
  { label: "Input field", href: "#", icon: FileText, current: true },
];

export function BreadcrumbSection({ className, trail = DEFAULT_TRAIL }: BreadcrumbSectionProps) {
  return (
    <section className={cn("w-full max-w-2xl mx-auto font-sans text-foreground", className)} aria-label="Breadcrumb section">
      {/* main breadcrumb */}
      <nav aria-label="Breadcrumb" className="rounded-xl border border-white/[0.07] bg-bg-2/80 backdrop-blur-xl px-4 py-3">
        <ol className="flex items-center gap-1.5 text-[12.5px]">
          {trail.map((c, i) => {
            const isLast = i === trail.length - 1;
            return (
              <li key={c.label} className="flex items-center gap-1.5 min-w-0">
                {i > 0 && <ChevronRight aria-hidden className="h-3 w-3 text-muted-foreground/50 flex-shrink-0" />}
                {isLast ? (
                  <span aria-current="page" className="inline-flex items-center gap-1.5 rounded-md bg-primary/10 px-2 py-1 text-foreground font-medium">
                    <c.icon className="h-3.5 w-3.5 text-primary" />
                    {c.label}
                  </span>
                ) : (
                  <a href={c.href} className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-muted-foreground hover:bg-white/[0.04] hover:text-foreground transition-colors">
                    <c.icon className="h-3.5 w-3.5" />
                    {c.label}
                  </a>
                )}
              </li>
            );
          })}
        </ol>
      </nav>

      {/* secondary "slash" variant */}
      <nav aria-label="Breadcrumb compact" className="mt-3 rounded-xl border border-white/[0.07] bg-bg-2/60 backdrop-blur-xl px-4 py-2.5 flex items-center justify-between gap-3">
        <ol className="flex items-center gap-0.5 text-[12px] font-mono">
          <li><a href="/" className="text-muted-foreground hover:text-foreground">~</a></li>
          <li className="flex items-center gap-0.5"><Slash className="h-3 w-3 text-muted-foreground/40" /><a href="/" className="text-muted-foreground hover:text-foreground">workspace</a></li>
          <li className="flex items-center gap-0.5"><Slash className="h-3 w-3 text-muted-foreground/40" />
            <button aria-label="More" className="grid h-5 w-5 place-items-center rounded text-muted-foreground hover:bg-white/[0.05]">
              <MoreHorizontal className="h-3 w-3" />
            </button>
          </li>
          <li className="flex items-center gap-0.5"><Slash className="h-3 w-3 text-muted-foreground/40" /><a href="/" className="text-muted-foreground hover:text-foreground">apps</a></li>
          <li className="flex items-center gap-0.5"><Slash className="h-3 w-3 text-muted-foreground/40" /><span aria-current="page" className="text-primary">docs.tsx</span></li>
        </ol>
        <button aria-label="Star path" className="grid h-7 w-7 place-items-center rounded-md text-muted-foreground hover:bg-white/[0.05] hover:text-amber">
          <Star className="h-3.5 w-3.5" />
        </button>
      </nav>
    </section>
  );
}

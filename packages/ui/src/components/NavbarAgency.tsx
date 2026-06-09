"use client";

import React, { useState } from "react";
import { Hexagon, ArrowUpRight, Menu, X } from "lucide-react";
import { cn } from "../lib/cn";

const LINKS = ["Work", "Services", "Studio", "Journal"];

export interface NavbarAgencyProps {
  className?: string;
}

export function NavbarAgency({ className }: NavbarAgencyProps) {
  const [open, setOpen] = useState(false);

  return (
    <header
      className={cn(
        "w-full max-w-3xl bg-card/45 backdrop-blur-xl border border-border/50 rounded-2xl shadow-xl font-sans text-foreground",
        className,
      )}
    >
      <div className="flex items-center justify-between px-5 py-3.5">
        <a href="/" className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-foreground text-background">
            <Hexagon className="h-4 w-4" />
          </span>
          <span className="text-base font-black tracking-tight">Fold&amp;Co</span>
        </a>

        <nav aria-label="Primary" className="hidden md:block">
          <ul className="flex items-center gap-1">
            {LINKS.map((l) => (
              <li key={l}>
                <a
                  href="/"
                  className="rounded-lg px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                >
                  {l}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <a
            href="/"
            className="hidden items-center gap-1.5 rounded-full bg-foreground px-4 py-2 text-sm font-bold text-background transition-opacity hover:opacity-90 sm:inline-flex"
          >
            Start a project <ArrowUpRight className="h-4 w-4" />
          </a>
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:hidden"
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {open && (
        <nav
          aria-label="Mobile"
          className="border-t border-border/50 px-3 py-2 md:hidden"
        >
          <ul className="flex flex-col">
            {LINKS.map((l) => (
              <li key={l}>
                <a
                  href="/"
                  className="block rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary/50 hover:text-foreground"
                >
                  {l}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}

"use client";

import React, { useState } from "react";
import { Zap, ChevronDown, Menu, X } from "lucide-react";
import { cn } from "../lib/cn";

const LINKS = ["Product", "Solutions", "Pricing", "Customers"];

export interface NavbarSaasProps {
  className?: string;
}

export function NavbarSaas({ className }: NavbarSaasProps) {
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
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Zap className="h-4 w-4" />
          </span>
          <span className="text-base font-black tracking-tight">Flowbase</span>
        </a>

        <nav aria-label="Primary" className="hidden md:block">
          <ul className="flex items-center gap-0.5">
            {LINKS.map((l) => (
              <li key={l}>
                <a
                  href="/"
                  className="inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                >
                  {l}
                  {l === "Product" && (
                    <ChevronDown className="h-3.5 w-3.5 opacity-60" />
                  )}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <a
            href="/"
            className="hidden text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground sm:block"
          >
            Log in
          </a>
          <a
            href="/"
            className="hidden rounded-lg bg-primary px-4 py-2 text-sm font-bold text-primary-foreground transition-all hover:brightness-110 sm:block"
          >
            Start free trial
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
            <li className="mt-1 border-t border-border/40 pt-2">
              <a
                href="/"
                className="block rounded-lg bg-primary px-3 py-2 text-center text-sm font-bold text-primary-foreground"
              >
                Start free trial
              </a>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}

"use client";

import React, { useState } from "react";
import { ArrowUpDown, Check, ChevronDown } from "lucide-react";
import { cn } from "../lib/cn";

type Option = { id: string; label: string };

const OPTIONS: Option[] = [
  { id: "relevant", label: "Most relevant" },
  { id: "recent", label: "Most recent" },
  { id: "highest", label: "Highest rated" },
  { id: "lowest", label: "Lowest rated" },
  { id: "helpful", label: "Most helpful" },
];

export interface ReviewSortDropdownProps {
  className?: string;
}

export function ReviewSortDropdown({ className }: ReviewSortDropdownProps) {
  const [open, setOpen] = useState(true);
  const [selected, setSelected] = useState("relevant");
  const current = OPTIONS.find((o) => o.id === selected)!;

  return (
    <div className={cn("relative w-full max-w-[240px] font-sans text-foreground", className)}>
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center gap-2 rounded-xl border border-border/50 bg-card/60 px-3 py-2.5 text-sm font-semibold backdrop-blur-xl transition-colors hover:bg-card"
      >
        <ArrowUpDown className="h-4 w-4 text-muted-foreground/60" />
        <span className="flex-1 text-left">
          <span className="text-muted-foreground/50">Sort: </span>
          {current.label}
        </span>
        <ChevronDown className={cn("h-4 w-4 text-muted-foreground/60 transition-transform", open && "rotate-180")} />
      </button>

      {open && (
        <ul
          role="listbox"
          aria-label="Sort reviews"
          className="absolute left-0 z-50 mt-2 w-full overflow-hidden rounded-2xl border border-border/50 bg-card/95 p-1.5 shadow-2xl backdrop-blur-2xl"
        >
          {OPTIONS.map((opt) => {
            const isSel = opt.id === selected;
            return (
              <li key={opt.id}>
                <button
                  type="button"
                  role="option"
                  aria-selected={isSel}
                  onClick={() => {
                    setSelected(opt.id);
                    setOpen(false);
                  }}
                  className={cn(
                    "flex w-full items-center justify-between rounded-lg px-2.5 py-2 text-left text-sm transition-colors hover:bg-foreground/[0.04]",
                    isSel ? "font-bold text-primary" : "font-medium text-muted-foreground/80",
                  )}
                >
                  {opt.label}
                  {isSel && <Check className="h-4 w-4" />}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

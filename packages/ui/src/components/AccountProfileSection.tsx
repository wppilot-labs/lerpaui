"use client";

import React from "react";
import { MapPin, Link2, Pencil } from "lucide-react";
import { cn } from "../lib/cn";

export interface AccountProfileSectionProps {
  className?: string;
}

const STATS = [
  { label: "Projects", value: "24" },
  { label: "Followers", value: "1.2k" },
  { label: "Following", value: "318" },
];

export function AccountProfileSection({ className }: AccountProfileSectionProps) {
  return (
    <div className={cn("w-full max-w-md bg-card/45 backdrop-blur-xl border border-border/50 rounded-2xl shadow-xl font-sans text-foreground overflow-hidden", className)}>
      <div className="h-16 bg-gradient-to-r from-primary/30 via-primary/10 to-transparent" />

      <div className="px-5 pb-5 -mt-8">
        <div className="flex items-end justify-between">
          <div className="h-16 w-16 rounded-2xl border-2 border-card bg-secondary/60 flex items-center justify-center text-xl font-black">JD</div>
          <button type="button" className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-lg bg-secondary/50 border border-foreground/[0.06] text-muted-foreground hover:text-foreground transition-colors mb-1">
            <Pencil className="w-3.5 h-3.5" /> Edit
          </button>
        </div>

        <h3 className="text-base font-bold mt-2">Jane Doe</h3>
        <p className="text-xs text-muted-foreground/70">Senior Product Designer</p>
        <p className="text-xs text-muted-foreground/60 leading-snug mt-2">Designing calm interfaces for complex systems. Coffee, type, and long walks.</p>

        <div className="flex items-center gap-3 mt-2.5 text-xs text-muted-foreground/55">
          <span className="inline-flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> San Francisco</span>
          <span className="inline-flex items-center gap-1"><Link2 className="w-3.5 h-3.5" /> jane.design</span>
        </div>

        <div className="grid grid-cols-3 gap-2 mt-4">
          {STATS.map((s) => (
            <div key={s.label} className="rounded-xl bg-foreground/[0.02] border border-foreground/[0.04] py-2 text-center">
              <div className="text-lg font-black">{s.value}</div>
              <div className="text-[11px] uppercase tracking-wide text-muted-foreground/50">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

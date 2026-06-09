"use client";

import React, { useState } from "react";
import { CalendarClock, Check } from "lucide-react";
import { cn } from "../lib/cn";

export interface DemoRequestFormSectionProps {
  className?: string;
}

export function DemoRequestFormSection({ className }: DemoRequestFormSectionProps) {
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div className={cn("w-full max-w-md bg-card/45 backdrop-blur-xl border border-border/50 p-5 rounded-2xl shadow-xl font-sans text-foreground text-left", className)}>
      <div className="flex items-center gap-2 mb-1">
        <CalendarClock className="w-5 h-5 text-primary" />
        <h3 className="text-base font-bold">Book a demo</h3>
      </div>
      <p className="text-sm text-muted-foreground/60 mb-4">See the product in action with a 30-minute walkthrough.</p>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="dr-name" className="block text-xs font-semibold text-muted-foreground/70 mb-1">Full name</label>
            <input id="dr-name" type="text" required placeholder="Jane Doe" className="w-full bg-foreground/[0.03] border border-foreground/[0.08] rounded-lg px-3 py-2.5 text-sm focus:ring-1 focus:ring-primary/50 focus:outline-none" />
          </div>
          <div>
            <label htmlFor="dr-company" className="block text-xs font-semibold text-muted-foreground/70 mb-1">Company</label>
            <input id="dr-company" type="text" placeholder="Acme Inc" className="w-full bg-foreground/[0.03] border border-foreground/[0.08] rounded-lg px-3 py-2.5 text-sm focus:ring-1 focus:ring-primary/50 focus:outline-none" />
          </div>
        </div>

        <div>
          <label htmlFor="dr-email" className="block text-xs font-semibold text-muted-foreground/70 mb-1">Work email</label>
          <input id="dr-email" type="email" required placeholder="jane@acme.co" className="w-full bg-foreground/[0.03] border border-foreground/[0.08] rounded-lg px-3 py-2.5 text-sm focus:ring-1 focus:ring-primary/50 focus:outline-none" />
        </div>

        <div>
          <label htmlFor="dr-size" className="block text-xs font-semibold text-muted-foreground/70 mb-1">Team size</label>
          <select id="dr-size" className="w-full bg-foreground/[0.03] border border-foreground/[0.08] rounded-lg px-3 py-2.5 text-sm focus:ring-1 focus:ring-primary/50 focus:outline-none">
            <option>1–10</option>
            <option>11–50</option>
            <option>51–200</option>
            <option>200+</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={sent}
          className="w-full py-2.5 bg-primary hover:brightness-110 disabled:opacity-80 text-primary-foreground text-sm font-bold rounded-lg flex items-center justify-center gap-1.5 transition-all"
        >
          {sent ? (
            <>
              <Check className="w-4 h-4" /> Request received
            </>
          ) : (
            "Request demo"
          )}
        </button>
      </form>
    </div>
  );
}

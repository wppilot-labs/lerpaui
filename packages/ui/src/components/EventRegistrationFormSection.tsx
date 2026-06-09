"use client";

import React, { useState } from "react";
import { Ticket, MapPin, CalendarDays, Check } from "lucide-react";
import { cn } from "../lib/cn";

const PASSES = [
  { id: "general", label: "General", price: "$0" },
  { id: "pro", label: "Pro", price: "$149" },
  { id: "vip", label: "VIP", price: "$349" },
];

export interface EventRegistrationFormSectionProps {
  className?: string;
}

export function EventRegistrationFormSection({ className }: EventRegistrationFormSectionProps) {
  const [pass, setPass] = useState("pro");
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div className={cn("w-full max-w-md bg-card/45 backdrop-blur-xl border border-border/50 p-5 rounded-2xl shadow-xl font-sans text-foreground text-left", className)}>
      <div className="flex items-center gap-2">
        <Ticket className="w-5 h-5 text-primary" />
        <h3 className="text-base font-bold">Register for DevConf 2026</h3>
      </div>
      <div className="flex items-center gap-4 mt-1.5 mb-4 text-xs text-muted-foreground/60">
        <span className="inline-flex items-center gap-1"><CalendarDays className="w-3.5 h-3.5" /> Sep 18–19</span>
        <span className="inline-flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> Berlin</span>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="ev-name" className="block text-xs font-semibold text-muted-foreground/70 mb-1">Name</label>
            <input id="ev-name" type="text" required placeholder="Jane Doe" className="w-full bg-foreground/[0.03] border border-foreground/[0.08] rounded-lg px-3 py-2.5 text-sm focus:ring-1 focus:ring-primary/50 focus:outline-none" />
          </div>
          <div>
            <label htmlFor="ev-email" className="block text-xs font-semibold text-muted-foreground/70 mb-1">Email</label>
            <input id="ev-email" type="email" required placeholder="jane@acme.co" className="w-full bg-foreground/[0.03] border border-foreground/[0.08] rounded-lg px-3 py-2.5 text-sm focus:ring-1 focus:ring-primary/50 focus:outline-none" />
          </div>
        </div>

        <fieldset>
          <legend className="block text-xs font-semibold text-muted-foreground/70 mb-1.5">Select pass</legend>
          <div className="grid grid-cols-3 gap-2">
            {PASSES.map((p) => {
              const on = pass === p.id;
              return (
                <label
                  key={p.id}
                  className={cn(
                    "cursor-pointer rounded-lg border px-2 py-2.5 text-center transition-colors",
                    on ? "border-primary bg-primary/10" : "border-foreground/[0.08] hover:bg-foreground/[0.03]",
                  )}
                >
                  <input type="radio" name="pass" value={p.id} checked={on} onChange={() => setPass(p.id)} className="sr-only" />
                  <span className="block text-sm font-semibold">{p.label}</span>
                  <span className={cn("block text-xs tabular-nums", on ? "text-primary" : "text-muted-foreground/55")}>{p.price}</span>
                </label>
              );
            })}
          </div>
        </fieldset>

        <button
          type="submit"
          disabled={sent}
          className="w-full py-2.5 bg-primary hover:brightness-110 disabled:opacity-80 text-primary-foreground text-sm font-bold rounded-lg flex items-center justify-center gap-1.5 transition-all"
        >
          {sent ? (
            <>
              <Check className="w-4 h-4" /> You&apos;re registered
            </>
          ) : (
            "Complete registration"
          )}
        </button>
      </form>
    </div>
  );
}

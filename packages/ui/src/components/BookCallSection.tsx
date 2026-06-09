"use client";

import React, { useState } from "react";
import { Phone, Video, Check } from "lucide-react";
import { cn } from "../lib/cn";

type CallType = "phone" | "video";

const SLOTS = ["Today 3:00 PM", "Today 4:30 PM", "Tomorrow 11:00 AM", "Tomorrow 2:00 PM"];

export interface BookCallSectionProps {
  className?: string;
}

export function BookCallSection({ className }: BookCallSectionProps) {
  const [callType, setCallType] = useState<CallType>("video");
  const [slot, setSlot] = useState(SLOTS[0]);
  const [scheduled, setScheduled] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setScheduled(true);
    window.setTimeout(() => setScheduled(false), 2500);
  };

  return (
    <section
      className={cn(
        "w-full max-w-md bg-card/45 backdrop-blur-xl border border-border/50 p-6 rounded-2xl shadow-xl font-sans text-foreground",
        className,
      )}
    >
      <h2 className="text-base font-bold">Schedule a call</h2>
      <p className="mt-1 text-sm text-muted-foreground/65">
        Pick a format and a time that works for you.
      </p>

      <form onSubmit={handleSubmit} className="mt-5 space-y-5">
        <fieldset>
          <legend className="mb-2 block text-sm font-medium text-foreground/80">Call type</legend>
          <div className="grid grid-cols-2 gap-2">
            {([
              { id: "video", label: "Video call", icon: Video },
              { id: "phone", label: "Phone call", icon: Phone },
            ] as const).map((opt) => {
              const Icon = opt.icon;
              const isActive = callType === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  role="radio"
                  aria-checked={isActive}
                  onClick={() => setCallType(opt.id)}
                  className={cn(
                    "flex items-center justify-center gap-2 rounded-lg border py-2.5 text-sm font-medium transition-colors",
                    isActive
                      ? "border-primary/40 bg-primary/15 text-primary"
                      : "border-foreground/[0.08] bg-foreground/[0.02] text-muted-foreground/70 hover:bg-foreground/[0.04]",
                  )}
                >
                  <Icon className="w-4 h-4" />
                  {opt.label}
                </button>
              );
            })}
          </div>
        </fieldset>

        <div>
          <label htmlFor="bc-name" className="mb-1.5 block text-sm font-medium text-foreground/80">
            Your name
          </label>
          <input
            id="bc-name"
            type="text"
            required
            placeholder="Jane Cooper"
            className="w-full rounded-lg border border-foreground/[0.08] bg-foreground/[0.02] px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/40 outline-none focus:border-primary/40 focus:ring-1 focus:ring-primary/30"
          />
        </div>

        <fieldset>
          <legend className="mb-2 block text-sm font-medium text-foreground/80">Available slots</legend>
          <div className="grid grid-cols-2 gap-1.5">
            {SLOTS.map((s) => {
              const isActive = slot === s;
              return (
                <button
                  key={s}
                  type="button"
                  role="radio"
                  aria-checked={isActive}
                  onClick={() => setSlot(s)}
                  className={cn(
                    "rounded-lg border px-2 py-2.5 text-xs font-medium transition-colors",
                    isActive
                      ? "border-primary/40 bg-primary/15 text-primary"
                      : "border-foreground/[0.08] bg-foreground/[0.02] text-muted-foreground/70 hover:bg-foreground/[0.04]",
                  )}
                >
                  {s}
                </button>
              );
            })}
          </div>
        </fieldset>

        <button
          type="submit"
          className={cn(
            "flex w-full items-center justify-center gap-1.5 rounded-lg px-4 py-2.5 text-sm font-semibold transition",
            scheduled
              ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
              : "bg-primary text-primary-foreground hover:brightness-110",
          )}
        >
          {scheduled ? (
            <>
              <Check className="w-4 h-4" />
              Call scheduled
            </>
          ) : (
            "Schedule call"
          )}
        </button>
      </form>
    </section>
  );
}

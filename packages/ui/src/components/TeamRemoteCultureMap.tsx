"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Globe2, Sun, Moon } from "lucide-react";
import { cn } from "../lib/cn";

export interface TeamRemoteCultureMapProps {
  className?: string;
}

type Member = {
  name: string;
  role: string;
  initials: string;
  tone: string;
  city: string;
  timezone: string;
  local: string;
  daylight: "day" | "night";
};

const MEMBERS: Member[] = [
  { name: "Sara Brennan", role: "Co-founder, CEO", initials: "SB", tone: "bg-primary/80", city: "Dublin", timezone: "GMT", local: "10:24", daylight: "day" },
  { name: "Ravi Iyer", role: "Eng Lead", initials: "RI", tone: "bg-emerald-500/80", city: "Bengaluru", timezone: "IST", local: "15:54", daylight: "day" },
  { name: "Tomás Vargas", role: "Design", initials: "TV", tone: "bg-amber-500/80", city: "Buenos Aires", timezone: "ART", local: "07:24", daylight: "day" },
  { name: "Akiko Mori", role: "PM", initials: "AM", tone: "bg-sky-500/80", city: "Tokyo", timezone: "JST", local: "19:24", daylight: "night" },
  { name: "Jules Renaud", role: "DX", initials: "JR", tone: "bg-violet-500/80", city: "Berlin", timezone: "CET", local: "11:24", daylight: "day" },
  { name: "Maya Okafor", role: "Growth", initials: "MO", tone: "bg-rose-500/80", city: "Lagos", timezone: "WAT", local: "11:24", daylight: "day" },
];

export function TeamRemoteCultureMap({ className }: TeamRemoteCultureMapProps) {
  const reduced = useReducedMotion() ?? false;

  return (
    <section
      aria-label="Remote team map"
      className={cn(
        "w-full max-w-5xl rounded-2xl border bg-card p-6 shadow-sm transition-shadow hover:shadow-md md:p-8",
        className
      )}
    >
      <header className="mb-6 flex flex-col items-start justify-between gap-3 md:flex-row md:items-center">
        <div className="flex items-center gap-2">
          <Globe2 className="h-4 w-4 text-primary" aria-hidden />
          <div>
            <h3 className="text-base font-semibold tracking-tight text-foreground">A team that follows the sun</h3>
            <p className="mt-0.5 text-xs text-muted-foreground">42 people · 18 cities · 11 timezones</p>
          </div>
        </div>
        <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
          <span className="inline-flex items-center gap-1"><Sun className="h-3 w-3 text-amber-500" /> Daytime</span>
          <span className="inline-flex items-center gap-1"><Moon className="h-3 w-3 text-sky-500" /> Asleep</span>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {MEMBERS.map((m, i) => (
          <motion.article
            key={m.name}
            initial={reduced ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.05 }}
            className="flex items-center gap-3 rounded-xl border bg-muted/20 p-4 transition-colors hover:bg-muted/30"
          >
            <span className={cn("relative grid h-11 w-11 flex-shrink-0 place-items-center rounded-full text-sm font-semibold text-white", m.tone)}>
              {m.initials}
              <span className={cn("absolute -bottom-0.5 -right-0.5 grid h-4 w-4 place-items-center rounded-full border-2 border-card", m.daylight === "day" ? "bg-amber-500" : "bg-sky-500")}>
                {m.daylight === "day" ? <Sun className="h-2 w-2 text-white" aria-hidden /> : <Moon className="h-2 w-2 text-white" aria-hidden />}
              </span>
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-foreground">{m.name}</p>
              <p className="truncate text-[11px] text-muted-foreground">{m.role}</p>
            </div>
            <div className="text-right">
              <p className="text-xs font-semibold tabular-nums text-foreground">{m.local}</p>
              <p className="text-[10px] text-muted-foreground">{m.city} · {m.timezone}</p>
            </div>
          </motion.article>
        ))}
      </div>

      <div className="mt-6 rounded-xl border bg-muted/10 px-4 py-3 text-center">
        <p className="text-xs text-muted-foreground">
          Async-first · 4-day week · home office stipend · annual offsite somewhere warm.
        </p>
      </div>
    </section>
  );
}

export default TeamRemoteCultureMap;

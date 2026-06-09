"use client";

import React from "react";
import { Linkedin, Twitter, Mail } from "lucide-react";
import { cn } from "../lib/cn";

type Member = {
  name: string;
  role: string;
  initials: string;
  tint: string;
};

const MEMBERS: Member[] = [
  { name: "Jane Doe", role: "Co-founder & CEO", initials: "JD", tint: "bg-violet-500/15 text-violet-300" },
  { name: "Marcus Lee", role: "Head of Engineering", initials: "ML", tint: "bg-sky-500/15 text-sky-300" },
  { name: "Priya Patel", role: "Lead Product Designer", initials: "PP", tint: "bg-emerald-500/15 text-emerald-300" },
  { name: "Alex Kim", role: "Staff Engineer", initials: "AK", tint: "bg-amber-500/15 text-amber-300" },
  { name: "Sofia Reyes", role: "Growth Marketer", initials: "SR", tint: "bg-rose-500/15 text-rose-300" },
  { name: "Tom Nguyen", role: "Support Lead", initials: "TN", tint: "bg-teal-500/15 text-teal-300" },
];

export interface TeamSectionProps {
  className?: string;
}

export function TeamSection({ className }: TeamSectionProps) {
  return (
    <div
      className={cn(
        "w-full max-w-2xl bg-card/45 backdrop-blur-xl border border-border/50 p-6 rounded-2xl shadow-xl font-sans text-foreground",
        className,
      )}
    >
      <div className="mb-5 text-center">
        <span className="text-xs font-bold uppercase tracking-widest text-primary">
          Our team
        </span>
        <h3 className="mt-1 text-lg font-bold">Meet the people behind it</h3>
      </div>

      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {MEMBERS.map((m) => (
          <li
            key={m.name}
            className="group flex flex-col items-center rounded-xl border border-border/50 bg-secondary/25 p-4 text-center transition-colors hover:border-border"
          >
            <span
              className={cn(
                "flex h-14 w-14 items-center justify-center rounded-full text-sm font-bold",
                m.tint,
              )}
            >
              {m.initials}
            </span>
            <span className="mt-2.5 text-sm font-semibold">{m.name}</span>
            <span className="text-xs text-muted-foreground/55">
              {m.role}
            </span>
            <div className="mt-2 flex items-center gap-2 opacity-60 transition-opacity group-hover:opacity-100">
              <a
                href="/"
                aria-label={`${m.name} on LinkedIn`}
                className="text-muted-foreground/70 transition-colors hover:text-primary"
              >
                <Linkedin className="h-4 w-4" />
              </a>
              <a
                href="/"
                aria-label={`${m.name} on Twitter`}
                className="text-muted-foreground/70 transition-colors hover:text-primary"
              >
                <Twitter className="h-4 w-4" />
              </a>
              <a
                href="/"
                aria-label={`Email ${m.name}`}
                className="text-muted-foreground/70 transition-colors hover:text-primary"
              >
                <Mail className="h-4 w-4" />
              </a>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

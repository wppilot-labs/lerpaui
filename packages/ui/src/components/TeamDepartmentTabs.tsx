"use client";

import React, { useState, useMemo } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Users } from "lucide-react";
import { cn } from "../lib/cn";

export interface TeamDepartmentTabsProps {
  className?: string;
}

const DEPTS = ["Engineering", "Design", "Product", "Go-to-market"] as const;
type Dept = (typeof DEPTS)[number];

interface Member {
  id: string;
  name: string;
  role: string;
  initials: string;
  dept: Dept;
  tone: string;
}

const MEMBERS: Member[] = [
  { id: "1", name: "Luis Romero", role: "Co-founder, CTO", initials: "LR", dept: "Engineering", tone: "from-cyan-500 to-blue-500" },
  { id: "2", name: "Milo Chen", role: "Staff Engineer", initials: "MC", dept: "Engineering", tone: "from-amber-500 to-orange-500" },
  { id: "3", name: "Daniela Ferreira", role: "Frontend Architect", initials: "DF", dept: "Engineering", tone: "from-pink-500 to-rose-500" },
  { id: "4", name: "Henrik Olsen", role: "Backend Engineer", initials: "HO", dept: "Engineering", tone: "from-red-500 to-orange-500" },
  { id: "5", name: "Saanvi Rao", role: "Head of Design", initials: "SR", dept: "Design", tone: "from-emerald-500 to-teal-500" },
  { id: "6", name: "Reza Hosseini", role: "Senior Designer", initials: "RH", dept: "Design", tone: "from-violet-500 to-fuchsia-500" },
  { id: "7", name: "Maya Rivera", role: "Brand Designer", initials: "MR", dept: "Design", tone: "from-amber-500 to-orange-500" },
  { id: "8", name: "Jonas Lim", role: "Product Manager", initials: "JL", dept: "Product", tone: "from-emerald-500 to-teal-500" },
  { id: "9", name: "Theo Banks", role: "Co-founder, Product", initials: "TB", dept: "Product", tone: "from-indigo-500 to-purple-500" },
  { id: "10", name: "Naomi Park", role: "Marketing Lead", initials: "NP", dept: "Go-to-market", tone: "from-pink-500 to-rose-500" },
  { id: "11", name: "Mei Wong", role: "DevRel", initials: "MW", dept: "Go-to-market", tone: "from-cyan-500 to-blue-500" },
  { id: "12", name: "Tobias Klein", role: "COO", initials: "TK", dept: "Go-to-market", tone: "from-sky-500 to-blue-500" },
];

export function TeamDepartmentTabs({ className }: TeamDepartmentTabsProps) {
  const reduced = useReducedMotion();
  const headingId = React.useId();
  const [active, setActive] = useState<Dept>("Engineering");

  const filtered = useMemo(
    () => MEMBERS.filter((m) => m.dept === active),
    [active],
  );
  const counts = useMemo(() => {
    const c: Record<Dept, number> = {
      Engineering: 0,
      Design: 0,
      Product: 0,
      "Go-to-market": 0,
    };
    MEMBERS.forEach((m) => {
      c[m.dept] += 1;
    });
    return c;
  }, []);

  return (
    <section
      aria-labelledby={headingId}
      className={cn(
        "relative w-full overflow-hidden rounded-3xl border border-border/50 bg-card/30 px-6 py-16 backdrop-blur-xl sm:px-10 sm:py-24",
        className,
      )}
    >
      <div className="relative mx-auto max-w-6xl">
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
            <Users className="h-3.5 w-3.5" aria-hidden />
            Departments
          </span>
          <h2
            id={headingId}
            className="mt-5 text-balance text-3xl font-semibold tracking-tight sm:text-4xl md:text-5xl"
          >
            Meet the team by function
          </h2>
        </div>

        <div
          role="tablist"
          aria-label="Departments"
          className="mt-10 flex flex-wrap justify-center gap-2"
        >
          {DEPTS.map((d) => (
            <button
              key={d}
              role="tab"
              type="button"
              aria-selected={active === d}
              onClick={() => setActive(d)}
              className={cn(
                "inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]",
                active === d
                  ? "border-primary bg-primary text-primary-foreground shadow"
                  : "border-border bg-background text-muted-foreground hover:bg-accent hover:text-foreground",
              )}
            >
              {d}
              <span
                className={cn(
                  "rounded-full px-1.5 py-0.5 font-mono text-[10px]",
                  active === d
                    ? "bg-primary-foreground/20 text-primary-foreground"
                    : "bg-muted text-muted-foreground",
                )}
              >
                {counts[d]}
              </span>
            </button>
          ))}
        </div>

        <ul className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {filtered.map((m, i) => (
            <motion.li
              key={m.id}
              layout={!reduced}
              initial={reduced ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: i * 0.04 }}
              className="flex items-center gap-3 rounded-2xl border bg-card p-4 shadow-sm transition-shadow hover:shadow-md"
            >
              <div
                className={cn(
                  "grid h-12 w-12 flex-shrink-0 place-items-center rounded-xl bg-gradient-to-br font-bold text-white",
                  m.tone,
                )}
                aria-hidden
              >
                {m.initials}
              </div>
              <div className="min-w-0">
                <div className="truncate font-semibold text-foreground">
                  {m.name}
                </div>
                <div className="truncate text-xs text-muted-foreground">
                  {m.role}
                </div>
              </div>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export default TeamDepartmentTabs;

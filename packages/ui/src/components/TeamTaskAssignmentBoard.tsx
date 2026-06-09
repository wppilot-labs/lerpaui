"use client";

import React from "react";
import { cn } from "../lib/cn";

type Card = {
  id: string;
  title: string;
  tag: string;
  tagCls: string;
  assignee: string;
  tint: string;
};

type Column = {
  key: string;
  title: string;
  dot: string;
  cards: Card[];
};

const COLUMNS: Column[] = [
  {
    key: "todo",
    title: "To do",
    dot: "bg-muted-foreground/50",
    cards: [
      {
        id: "t1",
        title: "Draft Q3 launch checklist",
        tag: "Docs",
        tagCls: "bg-sky-500/10 text-sky-400",
        assignee: "PP",
        tint: "bg-violet-500/15 text-violet-300",
      },
      {
        id: "t2",
        title: "Audit onboarding emails",
        tag: "Growth",
        tagCls: "bg-rose-500/10 text-rose-400",
        assignee: "SR",
        tint: "bg-rose-500/15 text-rose-300",
      },
    ],
  },
  {
    key: "doing",
    title: "In progress",
    dot: "bg-amber-400",
    cards: [
      {
        id: "d1",
        title: "Build billing webhook retry",
        tag: "Backend",
        tagCls: "bg-violet-500/10 text-violet-400",
        assignee: "ML",
        tint: "bg-sky-500/15 text-sky-300",
      },
    ],
  },
  {
    key: "done",
    title: "Done",
    dot: "bg-emerald-400",
    cards: [
      {
        id: "x1",
        title: "Ship dark-mode tokens",
        tag: "Design",
        tagCls: "bg-emerald-500/10 text-emerald-400",
        assignee: "JD",
        tint: "bg-emerald-500/15 text-emerald-300",
      },
      {
        id: "x2",
        title: "Migrate to Postgres 16",
        tag: "Infra",
        tagCls: "bg-amber-500/10 text-amber-400",
        assignee: "AK",
        tint: "bg-amber-500/15 text-amber-300",
      },
    ],
  },
];

export interface TeamTaskAssignmentBoardProps {
  className?: string;
}

export function TeamTaskAssignmentBoard({
  className,
}: TeamTaskAssignmentBoardProps) {
  return (
    <div
      className={cn(
        "w-full max-w-2xl bg-card/45 backdrop-blur-xl border border-border/50 p-6 rounded-2xl shadow-xl font-sans text-foreground",
        className,
      )}
    >
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-base font-bold">Sprint board</h3>
        <span className="text-xs text-muted-foreground/50">Sprint 24</span>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {COLUMNS.map((col) => (
          <div key={col.key} className="min-w-0">
            <div className="mb-2 flex items-center gap-1.5 px-1">
              <span className={cn("h-2 w-2 rounded-full", col.dot)} />
              <span className="text-xs font-semibold">{col.title}</span>
              <span className="text-xs text-muted-foreground/45">
                {col.cards.length}
              </span>
            </div>
            <ul className="space-y-2">
              {col.cards.map((c) => (
                <li
                  key={c.id}
                  className="rounded-xl border border-border/50 bg-secondary/25 p-3 transition-colors hover:border-border"
                >
                  <span
                    className={cn(
                      "inline-block rounded px-1.5 py-0.5 text-[11px] font-bold uppercase tracking-wide",
                      c.tagCls,
                    )}
                  >
                    {c.tag}
                  </span>
                  <p className="mt-1.5 text-xs font-medium leading-snug">
                    {c.title}
                  </p>
                  <div className="mt-2 flex items-center justify-between">
                    <span
                      className={cn(
                        "flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-bold",
                        c.tint,
                      )}
                    >
                      {c.assignee}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

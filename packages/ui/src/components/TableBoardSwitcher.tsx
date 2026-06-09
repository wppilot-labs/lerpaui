"use client";

import React, { useState } from "react";
import { LayoutGrid, Rows3, User } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "../lib/cn";

type Status = "todo" | "doing" | "review" | "done";

interface Card {
  id: string;
  title: string;
  assignee: string;
  points: number;
  status: Status;
}

const CARDS: Card[] = [
  { id: "c1", title: "Theme tokens audit", assignee: "Aria", points: 5, status: "todo" },
  { id: "c2", title: "Registry coverage gate", assignee: "Damon", points: 8, status: "todo" },
  { id: "c3", title: "Pivot table primitive", assignee: "Celia", points: 5, status: "doing" },
  { id: "c4", title: "Reduced-motion sweep", assignee: "Elena", points: 3, status: "doing" },
  { id: "c5", title: "Static export fix", assignee: "Benton", points: 2, status: "review" },
  { id: "c6", title: "Docs lighthouse pass", assignee: "Aria", points: 5, status: "done" },
  { id: "c7", title: "A11y axe sweep", assignee: "Celia", points: 3, status: "done" },
];

const STATUSES: { key: Status; label: string; color: string }[] = [
  { key: "todo", label: "To-do", color: "text-zinc-300 border-zinc-500/30" },
  { key: "doing", label: "Doing", color: "text-sky-300 border-sky-500/30" },
  { key: "review", label: "Review", color: "text-amber-300 border-amber-500/30" },
  { key: "done", label: "Done", color: "text-emerald-300 border-emerald-500/30" },
];

export function TableBoardSwitcher({ className }: { className?: string }) {
  const [mode, setMode] = useState<"table" | "board">("table");

  return (
    <div
      className={cn(
        "relative w-full max-w-[620px] rounded-2xl bg-zinc-950/80 border border-white/10 p-5 flex flex-col gap-3 overflow-hidden shadow-2xl backdrop-blur-xl select-none text-white",
        className
      )}
    >
      <div className="absolute -top-12 left-10 w-40 h-40 rounded-full bg-violet-500/5 blur-3xl pointer-events-none" />

      <div className="relative z-10 flex items-center justify-between">
        <div className="flex flex-col gap-1 font-mono">
          <span className="text-[9px] uppercase tracking-widest font-bold text-primary">DUAL_VIEW</span>
          <span className="text-[8px] text-white/40 uppercase font-semibold">table ↔ board · shared layoutId morph</span>
        </div>
        <div className="flex items-center p-0.5 rounded-lg bg-white/5 border border-white/10 relative">
          {(["table", "board"] as const).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              aria-pressed={mode === m}
              className={cn(
                "relative z-10 px-2 py-1 text-[10px] font-mono uppercase tracking-wider rounded-md transition-colors flex items-center gap-1",
                mode === m ? "text-white" : "text-zinc-400 hover:text-white"
              )}
            >
              {m === "table" ? <Rows3 className="w-3 h-3" /> : <LayoutGrid className="w-3 h-3" />}
              {m}
              {mode === m && (
                <motion.span
                  layoutId="view-toggle"
                  className="absolute inset-0 -z-0 bg-violet-500/20 border border-violet-500/30 rounded-md"
                  transition={{ type: "spring", stiffness: 320, damping: 28 }}
                />
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="relative z-10 min-h-[280px]">
        <AnimatePresence mode="wait">
          {mode === "table" ? (
            <motion.div
              key="table"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="border border-white/5 rounded-xl overflow-hidden bg-white/[0.01]"
            >
              <table className="w-full border-collapse">
                <thead>
                  <tr className="text-[9px] uppercase tracking-wider font-mono text-zinc-500 border-b border-white/5 bg-white/[0.02]">
                    <th className="text-left py-2 px-3">Title</th>
                    <th className="text-left py-2 px-3">Owner</th>
                    <th className="text-left py-2 px-3">Status</th>
                    <th className="text-right py-2 px-3">Pts</th>
                  </tr>
                </thead>
                <tbody>
                  {CARDS.map((c) => {
                    const s = STATUSES.find((x) => x.key === c.status)!;
                    return (
                      <motion.tr
                        key={c.id}
                        layoutId={`card-${c.id}`}
                        layout
                        className="border-b border-white/[0.03] hover:bg-white/[0.03] text-[11px]"
                      >
                        <td className="py-2 px-3 text-white">{c.title}</td>
                        <td className="py-2 px-3 text-zinc-300 font-mono">{c.assignee}</td>
                        <td className="py-2 px-3">
                          <span className={cn("px-1.5 py-0.5 rounded-full text-[8px] border font-mono uppercase", s.color)}>
                            {s.label}
                          </span>
                        </td>
                        <td className="py-2 px-3 text-right font-mono text-violet-300">{c.points}</td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            </motion.div>
          ) : (
            <motion.div
              key="board"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="grid grid-cols-4 gap-2"
            >
              {STATUSES.map((col) => {
                const items = CARDS.filter((c) => c.status === col.key);
                return (
                  <div key={col.key} className="rounded-xl border border-white/5 bg-white/[0.02] p-2 flex flex-col gap-2 min-h-[260px]">
                    <div className="flex items-center justify-between px-1 pb-1 border-b border-white/5">
                      <span className={cn("text-[9px] font-mono uppercase tracking-wider", col.color.split(" ")[0])}>
                        {col.label}
                      </span>
                      <span className="text-[9px] font-mono text-zinc-500">{items.length}</span>
                    </div>
                    {items.map((c) => (
                      <motion.div
                        key={c.id}
                        layoutId={`card-${c.id}`}
                        layout
                        className="rounded-lg bg-zinc-900/60 border border-white/5 p-2 flex flex-col gap-1.5"
                      >
                        <span className="text-[10px] font-medium text-white leading-tight">{c.title}</span>
                        <div className="flex items-center justify-between text-[9px] font-mono">
                          <span className="flex items-center gap-1 text-zinc-400">
                            <User className="w-2.5 h-2.5" />
                            {c.assignee}
                          </span>
                          <span className="text-violet-300">{c.points}pt</span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="relative z-10 flex items-center justify-between text-[10px] font-mono text-zinc-400 pt-1 border-t border-white/5">
        <span>{CARDS.length} cards · shared layout transitions</span>
        <span className="text-violet-300">{CARDS.reduce((s, c) => s + c.points, 0)} pts total</span>
      </div>
    </div>
  );
}

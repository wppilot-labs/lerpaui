"use client";

import React, { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronRight, Layers, TrendingUp } from "lucide-react";
import { cn } from "../lib/cn";

interface Deal {
  id: string;
  region: "AMER" | "EMEA" | "APAC";
  rep: string;
  account: string;
  amount: number;
  stage: "qualify" | "demo" | "negotiate" | "won";
}

const DEALS: Deal[] = [
  { id: "d1", region: "AMER", rep: "K. Hale", account: "Northwind", amount: 48000, stage: "won" },
  { id: "d2", region: "AMER", rep: "K. Hale", account: "Vandelay", amount: 26500, stage: "negotiate" },
  { id: "d3", region: "AMER", rep: "M. Cruz", account: "Initech", amount: 88000, stage: "demo" },
  { id: "d4", region: "EMEA", rep: "L. Bauer", account: "Globex DE", amount: 67200, stage: "negotiate" },
  { id: "d5", region: "EMEA", rep: "L. Bauer", account: "Aperture UK", amount: 35000, stage: "qualify" },
  { id: "d6", region: "EMEA", rep: "S. Okafor", account: "Hooli EU", amount: 124000, stage: "won" },
  { id: "d7", region: "APAC", rep: "R. Tanaka", account: "Pied Piper JP", amount: 53000, stage: "demo" },
  { id: "d8", region: "APAC", rep: "R. Tanaka", account: "Stark AU", amount: 71000, stage: "negotiate" },
];

const STAGE_BADGE: Record<Deal["stage"], string> = {
  qualify: "bg-zinc-500/10 text-zinc-300 border-zinc-500/20",
  demo: "bg-sky-500/10 text-sky-300 border-sky-500/20",
  negotiate: "bg-amber-500/10 text-amber-300 border-amber-500/20",
  won: "bg-emerald-500/10 text-emerald-300 border-emerald-500/20",
};

export function PivotGroupByTable({ className }: { className?: string }) {
  const [groupBy, setGroupBy] = useState<"region" | "rep" | "stage">("region");
  const [open, setOpen] = useState<Record<string, boolean>>({ AMER: true, EMEA: true, APAC: true });

  const groups = useMemo(() => {
    const map = new Map<string, Deal[]>();
    for (const d of DEALS) {
      const key = String(d[groupBy]);
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(d);
    }
    return Array.from(map.entries()).sort((a, b) => a[0].localeCompare(b[0]));
  }, [groupBy]);

  const toggle = (key: string) => setOpen((p) => ({ ...p, [key]: !p[key] }));

  return (
    <div
      className={cn(
        "relative w-full max-w-[560px] rounded-2xl bg-zinc-950/80 border border-white/10 p-5 flex flex-col gap-3 overflow-hidden shadow-2xl backdrop-blur-xl select-none text-white",
        className
      )}
    >
      <div className="absolute -top-10 left-10 w-40 h-40 rounded-full bg-amber-500/5 blur-3xl pointer-events-none" />

      <div className="relative z-10 flex items-center justify-between">
        <div className="flex flex-col gap-1 font-mono">
          <span className="text-[9px] uppercase tracking-widest font-bold text-primary">PIVOT_GROUP</span>
          <span className="text-[8px] text-white/40 uppercase font-semibold">collapsible group-by · spring expand</span>
        </div>
        <div className="flex items-center gap-1 p-0.5 rounded-lg bg-white/5 border border-white/10">
          {(["region", "rep", "stage"] as const).map((k) => (
            <button
              key={k}
              onClick={() => setGroupBy(k)}
              className={cn(
                "px-2 py-1 text-[9px] font-mono uppercase tracking-wider rounded-md transition-colors",
                groupBy === k ? "bg-amber-500/20 text-amber-300" : "text-zinc-400 hover:text-white"
              )}
            >
              {k}
            </button>
          ))}
        </div>
      </div>

      <div className="relative z-10 grid grid-cols-[1fr_90px_90px] gap-2 px-3 py-2 text-[9px] uppercase tracking-wider font-mono text-zinc-500 border border-white/5 rounded-t-lg bg-white/[0.02]">
        <span>Account / Group</span>
        <span className="text-right">Stage</span>
        <span className="text-right">Amount</span>
      </div>

      <div className="relative z-10 -mt-3 border-x border-b border-white/5 rounded-b-lg bg-white/[0.01] divide-y divide-white/5 max-h-[340px] overflow-y-auto">
        {groups.map(([key, items]) => {
          const sum = items.reduce((s, d) => s + d.amount, 0);
          const isOpen = open[key] ?? true;
          return (
            <div key={key}>
              <button
                onClick={() => toggle(key)}
                aria-expanded={isOpen}
                className="w-full grid grid-cols-[1fr_90px_90px] gap-2 items-center px-3 py-2 text-left hover:bg-white/[0.03] transition-colors"
              >
                <span className="flex items-center gap-1.5 text-[11px] font-bold text-white">
                  <motion.span animate={{ rotate: isOpen ? 90 : 0 }} transition={{ type: "spring", stiffness: 220, damping: 20 }}>
                    <ChevronRight className="w-3.5 h-3.5 text-amber-400" />
                  </motion.span>
                  <Layers className="w-3 h-3 text-zinc-500" />
                  {key}
                  <span className="text-[9px] font-mono text-zinc-500">({items.length})</span>
                </span>
                <span className="text-right text-[9px] font-mono text-zinc-500">—</span>
                <span className="text-right text-[11px] font-mono font-bold text-amber-300">
                  ${sum.toLocaleString()}
                </span>
              </button>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    key="content"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 180, damping: 24, mass: 0.6 }}
                    className="overflow-hidden bg-black/30"
                  >
                    {items.map((d) => (
                      <div
                        key={d.id}
                        className="grid grid-cols-[1fr_90px_90px] gap-2 items-center px-3 py-1.5 pl-9 text-[11px] font-mono border-t border-white/[0.03]"
                      >
                        <span className="text-zinc-200 truncate">
                          {d.account} <span className="text-zinc-500">· {d.rep}</span>
                        </span>
                        <span className="text-right">
                          <span className={cn("px-1.5 py-0.5 rounded-full text-[8px] border uppercase", STAGE_BADGE[d.stage])}>
                            {d.stage}
                          </span>
                        </span>
                        <span className="text-right text-emerald-300">${d.amount.toLocaleString()}</span>
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      <div className="relative z-10 flex items-center justify-between text-[10px] font-mono text-zinc-400 pt-1">
        <span className="flex items-center gap-1">
          <TrendingUp className="w-3 h-3 text-amber-400" />
          pipeline_total
        </span>
        <span className="text-emerald-300 font-bold">
          ${DEALS.reduce((s, d) => s + d.amount, 0).toLocaleString()}
        </span>
      </div>
    </div>
  );
}

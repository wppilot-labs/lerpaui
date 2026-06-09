"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Kanban, MoreHorizontal, Tag } from "lucide-react";
import { cn } from "../lib/cn";

export interface DashboardSalesPipelineBoardProps {
  className?: string;
}

type Deal = { name: string; company: string; value: string; tag?: string };

const COLUMNS: Array<{ title: string; count: number; total: string; tone: string; deals: Deal[] }> = [
  {
    title: "Prospecting",
    count: 4,
    total: "$48k",
    tone: "bg-sky-500/10 text-sky-500 border-sky-500/20",
    deals: [
      { name: "Acme Co", company: "Software", value: "$12k", tag: "Inbound" },
      { name: "Northwind", company: "Logistics", value: "$8k" },
      { name: "Initech", company: "Finance", value: "$18k", tag: "Referral" },
    ],
  },
  {
    title: "Qualified",
    count: 3,
    total: "$96k",
    tone: "bg-violet-500/10 text-violet-500 border-violet-500/20",
    deals: [
      { name: "Globex", company: "Manufacturing", value: "$42k", tag: "Warm" },
      { name: "Soylent", company: "Food & Bev", value: "$28k" },
      { name: "Umbrella", company: "Pharma", value: "$26k" },
    ],
  },
  {
    title: "Negotiation",
    count: 2,
    total: "$142k",
    tone: "bg-amber-500/10 text-amber-500 border-amber-500/20",
    deals: [
      { name: "Hooli", company: "Tech", value: "$78k", tag: "Hot" },
      { name: "Cyberdyne", company: "Robotics", value: "$64k" },
    ],
  },
  {
    title: "Won",
    count: 3,
    total: "$184k",
    tone: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    deals: [
      { name: "Stark Industries", company: "Defense", value: "$96k", tag: "Closed" },
      { name: "Wayne Ent.", company: "Conglomerate", value: "$58k" },
      { name: "Wonka", company: "CPG", value: "$30k" },
    ],
  },
];

export function DashboardSalesPipelineBoard({ className }: DashboardSalesPipelineBoardProps) {
  const reduced = useReducedMotion() ?? false;

  return (
    <section
      aria-label="Sales pipeline"
      className={cn(
        "w-full max-w-5xl rounded-2xl border bg-card p-6 shadow-sm transition-shadow hover:shadow-md",
        className
      )}
    >
      <header className="mb-5 flex items-start justify-between">
        <div className="flex items-center gap-2">
          <Kanban className="h-4 w-4 text-primary" aria-hidden />
          <div>
            <h3 className="text-base font-semibold tracking-tight text-foreground">Sales pipeline</h3>
            <p className="mt-0.5 text-xs text-muted-foreground">12 active deals · $470k weighted</p>
          </div>
        </div>
        <button type="button" className="rounded-md border bg-muted/40 px-2.5 py-1 text-[11px] font-medium text-muted-foreground hover:text-foreground">
          This quarter
        </button>
      </header>

      <div className="grid gap-3 lg:grid-cols-4">
        {COLUMNS.map((col, ci) => (
          <motion.div
            key={col.title}
            initial={reduced ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: ci * 0.06 }}
            className="flex flex-col rounded-xl border bg-muted/20 p-3"
          >
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className={cn("rounded-full border px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider", col.tone)}>{col.title}</span>
                <span className="text-[10px] text-muted-foreground">{col.count}</span>
              </div>
              <span className="text-[11px] font-semibold tabular-nums text-foreground">{col.total}</span>
            </div>

            <div className="flex-1 space-y-2">
              {col.deals.map((d, i) => (
                <motion.article
                  key={d.name}
                  initial={reduced ? false : { opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: ci * 0.06 + i * 0.04 }}
                  className="cursor-grab rounded-lg border bg-card p-3 transition-colors hover:border-primary/30 hover:bg-muted/30"
                >
                  <div className="mb-1 flex items-start justify-between">
                    <span className="text-xs font-semibold text-foreground">{d.name}</span>
                    <MoreHorizontal className="h-3 w-3 text-muted-foreground" aria-hidden />
                  </div>
                  <p className="text-[11px] text-muted-foreground">{d.company}</p>
                  <div className="mt-2 flex items-center justify-between">
                    {d.tag ? (
                      <span className="inline-flex items-center gap-1 rounded bg-primary/10 px-1.5 py-0.5 text-[9px] font-medium text-primary">
                        <Tag className="h-2.5 w-2.5" /> {d.tag}
                      </span>
                    ) : <span />}
                    <span className="text-xs font-semibold tabular-nums text-foreground">{d.value}</span>
                  </div>
                </motion.article>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

export default DashboardSalesPipelineBoard;

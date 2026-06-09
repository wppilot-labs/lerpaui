"use client";

import React from "react";
import { cn } from "../lib/cn";

type Deal = {
  id: string;
  company: string;
  amount: string;
  owner: string;
};

type Column = {
  id: string;
  title: string;
  accent: string;
  deals: Deal[];
};

const COLUMNS: Column[] = [
  {
    id: "lead",
    title: "Lead",
    accent: "bg-sky-400",
    deals: [
      { id: "d1", company: "Northwind", amount: "$8.5k", owner: "JL" },
      { id: "d2", company: "Globex", amount: "$12k", owner: "AM" },
    ],
  },
  {
    id: "proposal",
    title: "Proposal",
    accent: "bg-violet-400",
    deals: [
      { id: "d3", company: "Acme Corp", amount: "$42k", owner: "DW" },
      { id: "d4", company: "Initech", amount: "$19k", owner: "PR" },
    ],
  },
  {
    id: "negotiation",
    title: "Negotiation",
    accent: "bg-amber-400",
    deals: [{ id: "d5", company: "Umbrella", amount: "$67k", owner: "KS" }],
  },
  {
    id: "won",
    title: "Won",
    accent: "bg-emerald-400",
    deals: [
      { id: "d6", company: "Soylent", amount: "$31k", owner: "JL" },
      { id: "d7", company: "Hooli", amount: "$54k", owner: "AM" },
    ],
  },
];

export interface CRMPipelineBoardProps {
  className?: string;
}

export function CRMPipelineBoard({ className }: CRMPipelineBoardProps) {
  return (
    <div
      className={cn(
        "w-full max-w-2xl bg-card/45 backdrop-blur-xl border border-border/50 p-5 rounded-2xl shadow-xl font-sans text-foreground",
        className,
      )}
    >
      <h3 className="text-sm font-bold mb-4 px-1">Deal pipeline</h3>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {COLUMNS.map((col) => (
          <div key={col.id} className="flex flex-col gap-2">
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-1.5">
                <span className={cn("h-2 w-2 rounded-full", col.accent)} />
                <span className="text-xs font-semibold">{col.title}</span>
              </div>
              <span className="text-[11px] text-muted-foreground/50">{col.deals.length}</span>
            </div>

            <div className="flex flex-col gap-2">
              {col.deals.map((deal) => (
                <div
                  key={deal.id}
                  className="rounded-xl border border-foreground/[0.05] bg-foreground/[0.02] p-2.5"
                >
                  <div className="text-sm font-semibold truncate">{deal.company}</div>
                  <div className="mt-1.5 flex items-center justify-between">
                    <span className="text-xs font-bold text-primary">{deal.amount}</span>
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-foreground/[0.06] text-[11px] font-bold text-muted-foreground/80">
                      {deal.owner}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

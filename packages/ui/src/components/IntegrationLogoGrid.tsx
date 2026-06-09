"use client";

import React, { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  Boxes,
  Cloud,
  Cpu,
  Database,
  GitBranch,
  Globe,
  Layers,
  MessageSquare,
  Search,
  Sparkles,
  Workflow,
  Zap,
} from "lucide-react";
import { cn } from "../lib/cn";

interface IntegrationLogoGridProps {
  className?: string;
}

interface Integration {
  name: string;
  Icon: React.ComponentType<{ className?: string }>;
  category: "comms" | "data" | "infra" | "ai";
  status: "live" | "beta";
}

const INTEGRATIONS: Integration[] = [
  { name: "Slacknext", Icon: MessageSquare, category: "comms", status: "live" },
  { name: "Datastrand", Icon: Database, category: "data", status: "live" },
  { name: "Branchlet", Icon: GitBranch, category: "infra", status: "live" },
  { name: "Helix AI", Icon: Cpu, category: "ai", status: "beta" },
  { name: "Cumulus", Icon: Cloud, category: "infra", status: "live" },
  { name: "Pangea", Icon: Globe, category: "data", status: "live" },
  { name: "Workfly", Icon: Workflow, category: "comms", status: "live" },
  { name: "Volt", Icon: Zap, category: "infra", status: "live" },
  { name: "Stackline", Icon: Layers, category: "data", status: "beta" },
];

const FILTERS: { id: Integration["category"] | "all"; label: string }[] = [
  { id: "all", label: "All" },
  { id: "comms", label: "Comms" },
  { id: "data", label: "Data" },
  { id: "infra", label: "Infra" },
  { id: "ai", label: "AI" },
];

export function IntegrationLogoGrid({ className }: IntegrationLogoGridProps) {
  const reduced = useReducedMotion();
  const [filter, setFilter] = useState<(typeof FILTERS)[number]["id"]>("all");
  const [search, setSearch] = useState("");

  const visible = INTEGRATIONS.filter((i) => {
    const f = filter === "all" || i.category === filter;
    const s = search.trim().length === 0 || i.name.toLowerCase().includes(search.trim().toLowerCase());
    return f && s;
  });

  return (
    <section
      className={cn(
        "w-full max-w-xl rounded-3xl border border-border/50 bg-card/30 px-6 py-10 backdrop-blur-xl",
        "relative overflow-hidden font-sans text-foreground",
        className,
      )}
      aria-labelledby="integration-grid-heading"
    >
      <div className="pointer-events-none absolute inset-0 opacity-60">
        <div className="absolute -top-20 left-1/4 h-44 w-56 rounded-full bg-primary/15 blur-3xl" />
      </div>

      <div className="relative space-y-5">
        <div className="space-y-2">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-white/[0.06] bg-white/[0.03] px-2.5 py-1 text-[9px] font-black uppercase tracking-[0.18em] text-primary">
            <Boxes className="h-3 w-3" />
            Integrations
          </span>
          <h2 id="integration-grid-heading" className="text-base font-black tracking-tight">
            Plug into your <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">whole stack</span>
          </h2>
          <p className="text-[11px] leading-relaxed text-muted-foreground/70">
            Native, two-way syncs with the tools you already use.
          </p>
        </div>

        <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center">
          <label className="relative flex-1">
            <span className="sr-only">Search integrations</span>
            <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground/50" aria-hidden="true" />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search 200+ integrations…"
              className="w-full rounded-xl border border-white/[0.06] bg-white/[0.03] py-1.5 pl-7 pr-2.5 text-[11px] text-foreground placeholder:text-muted-foreground/40 focus:border-primary/50 focus:outline-none"
            />
          </label>

          <div className="flex flex-wrap items-center gap-1" role="tablist" aria-label="Filter integrations">
            {FILTERS.map((f) => (
              <button
                key={f.id}
                type="button"
                role="tab"
                aria-selected={filter === f.id}
                onClick={() => setFilter(f.id)}
                className={cn(
                  "rounded-lg px-2 py-1 text-[10px] font-bold transition-colors",
                  filter === f.id
                    ? "bg-primary text-white"
                    : "bg-white/[0.04] text-muted-foreground/70 hover:bg-white/[0.08] hover:text-foreground",
                )}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        <ul className="grid grid-cols-3 gap-2.5">
          {visible.map((i, idx) => (
            <motion.li
              key={i.name}
              initial={reduced ? false : { opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.25, delay: reduced ? 0 : idx * 0.03 }}
              className="group flex items-center gap-2 rounded-xl border border-white/[0.06] bg-white/[0.02] px-2.5 py-2 transition-colors hover:border-primary/30 hover:bg-primary/5"
            >
              <i.Icon className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
              <div className="min-w-0 flex-1 leading-tight">
                <div className="truncate text-[10px] font-bold text-foreground">{i.name}</div>
                <div className="text-[8px] uppercase tracking-wider text-muted-foreground/55">{i.category}</div>
              </div>
              {i.status === "beta" ? (
                <span className="rounded bg-amber-500/15 px-1 py-0.5 text-[7px] font-black uppercase tracking-wider text-amber-300">
                  Beta
                </span>
              ) : (
                <span className="rounded bg-emerald-500/15 px-1 py-0.5 text-[7px] font-black uppercase tracking-wider text-emerald-300">
                  Live
                </span>
              )}
            </motion.li>
          ))}
          {visible.length === 0 ? (
            <li className="col-span-3 rounded-xl border border-dashed border-white/10 bg-white/[0.02] p-4 text-center text-[10px] text-muted-foreground/60">
              No integrations match that filter.
            </li>
          ) : null}
        </ul>

        <div className="flex items-center gap-2 rounded-2xl border border-white/[0.05] bg-white/[0.02] p-3 text-[10px] text-muted-foreground/75">
          <Sparkles className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
          <span>
            Don&apos;t see yours? Build a custom integration with our <a href="/" className="font-bold text-primary underline-offset-2 hover:underline">REST API</a>.
          </span>
        </div>
      </div>
    </section>
  );
}

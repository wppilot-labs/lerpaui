"use client";

import React, { useState } from "react";
import { ArrowUpDown, Users, Search } from "lucide-react";
import { cn } from "../lib/cn";

interface TeamMember {
  id: string;
  name: string;
  role: string;
  status: "active" | "away";
}

export function DynamicSortableTeamTable({ className }: { className?: string }) {
  const [members, setMembers] = useState<TeamMember[]>([
    { id: "1", name: "Sarah Connor", role: "Security Architect", status: "active" },
    { id: "2", name: "John Doe", role: "Effects Developer", status: "away" },
    { id: "3", name: "Alex Mercer", role: "Core Designer", status: "active" },
  ]);
  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const toggleSort = () => {
    const nextOrder = sortOrder === "asc" ? "desc" : "asc";
    setSortOrder(nextOrder);
    const sorted = [...members].sort((a, b) => {
      if (nextOrder === "asc") return a.name.localeCompare(b.name);
      return b.name.localeCompare(a.name);
    });
    setMembers(sorted);
  };

  const filtered = members.filter(m => m.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className={cn("w-full max-w-sm rounded-2xl border border-border/80 bg-card/40 p-5 backdrop-blur-xl shadow-2xl space-y-4", className)}>
      <div className="flex items-center justify-between pb-2 border-b border-border/30">
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-primary" />
          <div>
            <h3 className="text-sm font-bold text-foreground">Sortable Team</h3>
            <p className="text-[10px] text-muted-foreground">Dynamic filter and search roster table</p>
          </div>
        </div>
      </div>

      <div className="flex gap-2 bg-zinc-950/40 p-1.5 rounded-xl border border-border/40 items-center">
        <Search className="w-3.5 h-3.5 text-muted-foreground ml-1" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Filter team..."
          className="flex-1 bg-transparent text-xs text-foreground focus:outline-none placeholder:text-muted-foreground"
        />
      </div>

      <div className="space-y-1.5">
        <div className="flex items-center justify-between px-3 py-1 text-[9px] font-bold text-muted-foreground uppercase">
          <button onClick={toggleSort} className="flex items-center gap-1 hover:text-foreground cursor-pointer transition-colors">
            Name
            <ArrowUpDown className="w-3 h-3" />
          </button>
          <span>Status</span>
        </div>

        {filtered.map((m) => (
          <div
            key={m.id}
            className="flex items-center justify-between p-2.5 bg-zinc-900/30 border border-border/20 rounded-xl"
          >
            <div>
              <span className="text-xs font-bold text-foreground block">{m.name}</span>
              <span className="text-[9px] text-muted-foreground">{m.role}</span>
            </div>
            <span className={cn(
              "px-1.5 py-0.5 rounded text-[8px] font-bold uppercase",
              m.status === "active" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-zinc-800 text-muted-foreground border border-zinc-700"
            )}>
              {m.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

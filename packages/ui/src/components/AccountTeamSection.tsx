"use client";

import React from "react";
import { Users, UserPlus, Crown } from "lucide-react";
import { cn } from "../lib/cn";

type Member = { id: string; name: string; email: string; role: string; initials: string; owner?: boolean };

const MEMBERS: Member[] = [
  { id: "1", name: "Jane Doe", email: "jane@acme.co", role: "Owner", initials: "JD", owner: true },
  { id: "2", name: "Marcus Lee", email: "marcus@acme.co", role: "Admin", initials: "ML" },
  { id: "3", name: "Priya Patel", email: "priya@acme.co", role: "Member", initials: "PP" },
];

export interface AccountTeamSectionProps {
  className?: string;
}

export function AccountTeamSection({ className }: AccountTeamSectionProps) {
  return (
    <div className={cn("w-full max-w-md bg-card/45 backdrop-blur-xl border border-border/50 p-5 rounded-2xl shadow-xl font-sans text-foreground", className)}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-bold flex items-center gap-1.5">
          <Users className="w-4 h-4 text-primary" /> Team
          <span className="text-xs font-medium text-muted-foreground/50">3 members</span>
        </h3>
        <button type="button" className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-lg bg-primary text-primary-foreground hover:brightness-110 transition-all">
          <UserPlus className="w-3.5 h-3.5" /> Invite
        </button>
      </div>

      <ul className="space-y-1.5">
        {MEMBERS.map((m) => (
          <li key={m.id} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-foreground/[0.02] transition-colors">
            <div className="h-9 w-9 rounded-full bg-secondary/60 flex items-center justify-center text-xs font-bold shrink-0">{m.initials}</div>
            <div className="min-w-0 flex-1">
              <div className="text-sm font-semibold flex items-center gap-1">
                {m.name}
                {m.owner && <Crown className="w-3.5 h-3.5 text-amber-400" />}
              </div>
              <div className="text-xs text-muted-foreground/50 truncate">{m.email}</div>
            </div>
            <span className="text-xs font-medium text-muted-foreground/70 px-2 py-0.5 rounded-md bg-foreground/[0.03] border border-foreground/[0.05] shrink-0">{m.role}</span>
          </li>
        ))}
      </ul>

      <div className="mt-3 pt-3 border-t border-foreground/[0.05] flex items-center justify-between text-xs text-muted-foreground/55">
        <span>1 pending invitation</span>
        <button type="button" className="font-bold text-primary hover:underline">Manage</button>
      </div>
    </div>
  );
}

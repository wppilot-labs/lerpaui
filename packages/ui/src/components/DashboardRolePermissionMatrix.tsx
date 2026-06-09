"use client";

import React, { useState } from "react";
import { ShieldCheck } from "lucide-react";
import { cn } from "../lib/cn";

const ROLES = ["Admin", "Editor", "Viewer"];
const PERMS = ["View", "Edit", "Delete", "Invite"];

const DEFAULT: boolean[][] = [
  [true, true, true, true],
  [true, true, false, false],
  [true, false, false, false],
];

export interface DashboardRolePermissionMatrixProps {
  className?: string;
}

export function DashboardRolePermissionMatrix({ className }: DashboardRolePermissionMatrixProps) {
  const [grid, setGrid] = useState(DEFAULT);

  const toggle = (r: number, c: number) =>
    setGrid((g) => g.map((row, ri) => (ri === r ? row.map((v, ci) => (ci === c ? !v : v)) : row)));

  return (
    <div className={cn("w-full max-w-md bg-card/45 backdrop-blur-xl border border-border/50 p-5 rounded-2xl shadow-xl font-sans text-foreground", className)}>
      <h3 className="text-base font-bold flex items-center gap-1.5 mb-4">
        <ShieldCheck className="w-4 h-4 text-primary" /> Roles &amp; permissions
      </h3>

      <div className="grid items-center gap-y-1" style={{ gridTemplateColumns: `5rem repeat(${PERMS.length}, 1fr)` }}>
        <span />
        {PERMS.map((p) => (
          <span key={p} className="text-[11px] uppercase font-bold tracking-wide text-muted-foreground/50 text-center">{p}</span>
        ))}

        {ROLES.map((role, r) => (
          <React.Fragment key={role}>
            <span className="text-xs font-semibold py-1.5">{role}</span>
            {PERMS.map((p, c) => (
              <div key={p} className="flex justify-center">
                <button
                  type="button"
                  role="checkbox"
                  aria-checked={grid[r][c]}
                  aria-label={`${role} can ${p}`}
                  onClick={() => toggle(r, c)}
                  className={cn(
                    "h-4 w-4 rounded-[5px] border flex items-center justify-center transition-colors",
                    grid[r][c] ? "bg-primary border-primary" : "bg-foreground/[0.03] border-foreground/15 hover:border-foreground/30",
                  )}
                >
                  {grid[r][c] && (
                    <svg viewBox="0 0 12 12" className="w-2.5 h-2.5 text-primary-foreground" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M2.5 6.5L5 9l4.5-5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </button>
              </div>
            ))}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

"use client";

import React, { useCallback, useRef, useState } from "react";
import { GripVertical } from "lucide-react";
import { cn } from "../lib/cn";

type Row = { name: string; role: string; team: string };

const ROWS: Row[] = [
  { name: "Jane Doe", role: "Owner", team: "Platform" },
  { name: "Marcus Lee", role: "Admin", team: "Growth" },
  { name: "Priya Patel", role: "Member", team: "Design" },
];

const MIN = 70;
const MAX = 240;

export interface DataTableColumnResizeProps {
  className?: string;
}

export function DataTableColumnResize({ className }: DataTableColumnResizeProps) {
  const [widths, setWidths] = useState<[number, number]>([150, 110]);
  const drag = useRef<{ col: 0 | 1; startX: number; startW: number } | null>(null);

  const onMove = useCallback((e: PointerEvent) => {
    const d = drag.current;
    if (!d) return;
    const delta = e.clientX - d.startX;
    const w = Math.max(MIN, Math.min(MAX, d.startW + delta));
    setWidths((prev) => {
      const next: [number, number] = [...prev] as [number, number];
      next[d.col] = w;
      return next;
    });
  }, []);

  const onUp = useCallback(() => {
    drag.current = null;
    window.removeEventListener("pointermove", onMove);
    window.removeEventListener("pointerup", onUp);
  }, [onMove]);

  const startDrag = (col: 0 | 1) => (e: React.PointerEvent) => {
    e.preventDefault();
    drag.current = { col, startX: e.clientX, startW: widths[col] };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
  };

  const nudge = (col: 0 | 1, dir: -1 | 1) =>
    setWidths((prev) => {
      const next: [number, number] = [...prev] as [number, number];
      next[col] = Math.max(MIN, Math.min(MAX, next[col] + dir * 12));
      return next;
    });

  const ResizeHandle = ({ col }: { col: 0 | 1 }) => (
    <button
      type="button"
      aria-label="Resize column"
      onPointerDown={startDrag(col)}
      onKeyDown={(e) => {
        if (e.key === "ArrowLeft") { e.preventDefault(); nudge(col, -1); }
        if (e.key === "ArrowRight") { e.preventDefault(); nudge(col, 1); }
      }}
      className="absolute right-0 top-0 h-full w-4 flex items-center justify-center cursor-col-resize text-muted-foreground/20 hover:text-primary group"
    >
      <GripVertical className="w-3.5 h-3.5" />
      <span className="absolute right-1.5 top-1 bottom-1 w-px bg-foreground/[0.06] group-hover:bg-primary/50" />
    </button>
  );

  return (
    <div className={cn("w-full max-w-md bg-card/45 backdrop-blur-xl border border-border/50 p-5 rounded-2xl shadow-xl font-sans text-foreground select-none", className)}>
      <h3 className="text-base font-bold mb-4">Members</h3>
      <div className="overflow-hidden rounded-xl border border-foreground/[0.05]">
        <table className="w-full text-left border-collapse table-fixed">
          <thead>
            <tr className="bg-foreground/[0.02] text-[11px] uppercase font-bold text-muted-foreground/50 tracking-wider">
              <th scope="col" className="px-4 py-2.5 relative" style={{ width: widths[0] }}>
                Name
                <ResizeHandle col={0} />
              </th>
              <th scope="col" className="px-4 py-2.5 relative" style={{ width: widths[1] }}>
                Role
                <ResizeHandle col={1} />
              </th>
              <th scope="col" className="px-4 py-2.5">Team</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-foreground/[0.04] text-sm">
            {ROWS.map((r) => (
              <tr key={r.name} className="hover:bg-foreground/[0.02] transition-colors">
                <td className="px-4 py-3 font-semibold truncate" style={{ width: widths[0] }}>{r.name}</td>
                <td className="px-4 py-3 text-muted-foreground/70 truncate" style={{ width: widths[1] }}>{r.role}</td>
                <td className="px-4 py-3 text-muted-foreground/55 truncate">{r.team}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-2 text-xs text-muted-foreground/40">Drag the handles to resize columns.</p>
    </div>
  );
}

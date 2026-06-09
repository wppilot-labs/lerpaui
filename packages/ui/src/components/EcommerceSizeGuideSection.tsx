"use client";

import React, { useState } from "react";
import { Ruler } from "lucide-react";
import { cn } from "../lib/cn";

type Unit = "in" | "cm";

const ROWS: { size: string; chest: [number, number]; waist: [number, number]; sleeve: [number, number] }[] = [
  { size: "XS", chest: [34, 86], waist: [28, 71], sleeve: [32, 81] },
  { size: "S", chest: [36, 91], waist: [30, 76], sleeve: [33, 84] },
  { size: "M", chest: [40, 102], waist: [33, 84], sleeve: [34, 86] },
  { size: "L", chest: [44, 112], waist: [36, 91], sleeve: [35, 89] },
  { size: "XL", chest: [48, 122], waist: [40, 102], sleeve: [36, 91] },
];

export interface EcommerceSizeGuideSectionProps {
  className?: string;
}

export function EcommerceSizeGuideSection({ className }: EcommerceSizeGuideSectionProps) {
  const [unit, setUnit] = useState<Unit>("in");
  const pick = (pair: [number, number]) => (unit === "in" ? pair[0] : pair[1]);

  return (
    <div className={cn("w-full max-w-md bg-card/45 backdrop-blur-xl border border-border/50 p-4 rounded-2xl shadow-xl font-sans text-foreground", className)}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="inline-flex items-center gap-1.5 text-base font-bold">
          <Ruler className="w-4 h-4 text-muted-foreground/60" /> Size guide
        </h3>
        <div className="inline-flex rounded-lg border border-foreground/[0.1] bg-foreground/[0.03] p-0.5" role="group" aria-label="Units">
          {(["in", "cm"] as Unit[]).map((u) => (
            <button
              key={u}
              type="button"
              aria-pressed={unit === u}
              onClick={() => setUnit(u)}
              className={cn(
                "text-xs font-semibold rounded-md px-2.5 py-1 transition uppercase",
                unit === u ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground",
              )}
            >
              {u}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-foreground/[0.05]">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-foreground/[0.02] text-[11px] uppercase font-bold text-muted-foreground/50 tracking-wider">
              <th className="px-3 py-2.5">Size</th>
              <th className="px-3 py-2.5">Chest</th>
              <th className="px-3 py-2.5">Waist</th>
              <th className="px-3 py-2.5">Sleeve</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-foreground/[0.04] text-xs">
            {ROWS.map((r) => (
              <tr key={r.size} className="hover:bg-foreground/[0.02] transition-colors">
                <td className="px-3 py-2.5 font-bold">{r.size}</td>
                <td className="px-3 py-2.5 text-muted-foreground/75 tabular-nums">{pick(r.chest)}{unit}</td>
                <td className="px-3 py-2.5 text-muted-foreground/75 tabular-nums">{pick(r.waist)}{unit}</td>
                <td className="px-3 py-2.5 text-muted-foreground/75 tabular-nums">{pick(r.sleeve)}{unit}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="text-xs text-muted-foreground/50 mt-2.5">
        Measurements are body dimensions. For a relaxed fit, size up.
      </p>
    </div>
  );
}

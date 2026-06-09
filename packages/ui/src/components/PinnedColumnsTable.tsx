"use client";

import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Pin as PinIcon, PinOff, Columns3 } from "lucide-react";
import { cn } from "../lib/cn";

type PinState = "left" | "right" | "none";

interface ColDef {
  key: string;
  label: string;
  width: number;
  align?: "left" | "right";
  format?: (v: unknown) => string;
}

interface Row {
  ticker: string;
  name: string;
  sector: string;
  price: number;
  change: number;
  vol: number;
  mcap: number;
  pe: number;
  yld: number;
}

const ROWS: Row[] = [
  { ticker: "AAPL", name: "Apple Inc.", sector: "Tech", price: 198.21, change: 1.42, vol: 52_300_000, mcap: 3_010_000_000_000, pe: 32.1, yld: 0.45 },
  { ticker: "MSFT", name: "Microsoft", sector: "Tech", price: 437.04, change: -0.61, vol: 18_900_000, mcap: 3_250_000_000_000, pe: 36.5, yld: 0.72 },
  { ticker: "NVDA", name: "NVIDIA Corp", sector: "Semi", price: 1207.6, change: 3.18, vol: 41_200_000, mcap: 2_970_000_000_000, pe: 76.2, yld: 0.03 },
  { ticker: "AMZN", name: "Amazon.com", sector: "Retail", price: 186.32, change: 0.94, vol: 33_400_000, mcap: 1_940_000_000_000, pe: 51.8, yld: 0 },
  { ticker: "GOOGL", name: "Alphabet A", sector: "Tech", price: 178.55, change: -1.21, vol: 22_700_000, mcap: 2_180_000_000_000, pe: 27.4, yld: 0.21 },
  { ticker: "TSLA", name: "Tesla Inc.", sector: "Auto", price: 182.11, change: -2.85, vol: 88_100_000, mcap: 580_000_000_000, pe: 64.0, yld: 0 },
];

const COLS: ColDef[] = [
  { key: "ticker", label: "Ticker", width: 70 },
  { key: "name", label: "Name", width: 130 },
  { key: "sector", label: "Sector", width: 80 },
  { key: "price", label: "Price", width: 80, align: "right", format: (v) => `$${(v as number).toFixed(2)}` },
  { key: "change", label: "Chg %", width: 70, align: "right", format: (v) => `${(v as number).toFixed(2)}%` },
  { key: "vol", label: "Volume", width: 100, align: "right", format: (v) => (v as number).toLocaleString() },
  { key: "mcap", label: "Mkt Cap", width: 110, align: "right", format: (v) => `$${((v as number) / 1e9).toFixed(0)}B` },
  { key: "pe", label: "P/E", width: 60, align: "right", format: (v) => (v as number).toFixed(1) },
  { key: "yld", label: "Yield", width: 60, align: "right", format: (v) => `${(v as number).toFixed(2)}%` },
];

export function PinnedColumnsTable({ className }: { className?: string }) {
  const [pins, setPins] = useState<Record<string, PinState>>({ ticker: "left", yld: "right" });

  const togglePin = (key: string) => {
    setPins((prev) => {
      const cur = prev[key] ?? "none";
      const next: PinState = cur === "none" ? "left" : cur === "left" ? "right" : "none";
      return { ...prev, [key]: next };
    });
  };

  const ordered = useMemo(() => {
    const left = COLS.filter((c) => pins[c.key] === "left");
    const right = COLS.filter((c) => pins[c.key] === "right");
    const mid = COLS.filter((c) => (pins[c.key] ?? "none") === "none");
    return [...left, ...mid, ...right];
  }, [pins]);

  const leftCount = ordered.filter((c) => pins[c.key] === "left").length;
  const rightStartIdx = ordered.length - ordered.filter((c) => pins[c.key] === "right").length;

  const leftOffsets = useMemo(() => {
    const map: Record<string, number> = {};
    let acc = 0;
    for (let i = 0; i < leftCount; i++) {
      map[ordered[i].key] = acc;
      acc += ordered[i].width;
    }
    return map;
  }, [ordered, leftCount]);

  const rightOffsets = useMemo(() => {
    const map: Record<string, number> = {};
    let acc = 0;
    for (let i = ordered.length - 1; i >= rightStartIdx; i--) {
      map[ordered[i].key] = acc;
      acc += ordered[i].width;
    }
    return map;
  }, [ordered, rightStartIdx]);

  const cellBg = (rowIdx: number) => (rowIdx % 2 ? "bg-zinc-950/95" : "bg-zinc-900/95");

  return (
    <div
      className={cn(
        "relative w-full max-w-[620px] rounded-2xl bg-zinc-950/80 border border-white/10 p-5 flex flex-col gap-3 overflow-hidden shadow-2xl backdrop-blur-xl select-none text-white",
        className
      )}
    >
      <div className="absolute -top-12 right-10 w-40 h-40 rounded-full bg-emerald-500/5 blur-3xl pointer-events-none" />

      <div className="relative z-10 flex items-center justify-between">
        <div className="flex flex-col gap-1 font-mono">
          <span className="text-[9px] uppercase tracking-widest font-bold text-primary">FROZEN_COLS</span>
          <span className="text-[8px] text-white/40 uppercase font-semibold">pin left / right · tap pin icon to cycle</span>
        </div>
        <div className="flex items-center gap-1 text-[9px] font-mono text-emerald-300/80">
          <Columns3 className="w-3 h-3" />
          <span>{leftCount}L · {COLS.length - leftCount - (ordered.length - rightStartIdx)}M · {ordered.length - rightStartIdx}R</span>
        </div>
      </div>

      <div className="relative z-10 overflow-x-auto border border-white/5 rounded-xl bg-white/[0.01]">
        <table className="border-collapse text-[10px] font-mono" style={{ minWidth: ordered.reduce((s, c) => s + c.width, 0) }}>
          <thead>
            <tr className="text-[9px] uppercase tracking-wider text-zinc-400 bg-zinc-900/95 border-b border-white/5">
              {ordered.map((col, i) => {
                const pin = pins[col.key] ?? "none";
                const isLeftPin = pin === "left";
                const isRightPin = pin === "right";
                const sticky = isLeftPin || isRightPin;
                return (
                  <th
                    key={col.key}
                    style={{
                      width: col.width,
                      minWidth: col.width,
                      ...(isLeftPin ? { position: "sticky", left: leftOffsets[col.key], zIndex: 20 } : {}),
                      ...(isRightPin ? { position: "sticky", right: rightOffsets[col.key], zIndex: 20 } : {}),
                    }}
                    className={cn(
                      "py-2 px-2 align-middle bg-zinc-900/95",
                      col.align === "right" ? "text-right" : "text-left",
                      sticky && "shadow-[inset_-1px_0_0_0_rgba(255,255,255,0.05)]",
                      isLeftPin && i === leftCount - 1 && "border-r border-emerald-500/30",
                      isRightPin && i === rightStartIdx && "border-l border-emerald-500/30"
                    )}
                  >
                    <span className="inline-flex items-center gap-1">
                      <span>{col.label}</span>
                      <button
                        aria-label={`pin column ${col.label}`}
                        onClick={() => togglePin(col.key)}
                        className={cn(
                          "p-0.5 rounded transition-colors",
                          pin === "none" ? "text-zinc-600 hover:text-white" : "text-emerald-300"
                        )}
                      >
                        <motion.span
                          key={pin}
                          initial={{ scale: 0.6, rotate: -45 }}
                          animate={{ scale: 1, rotate: 0 }}
                          transition={{ type: "spring", stiffness: 320, damping: 22 }}
                          className="inline-block"
                        >
                          {pin === "none" ? (
                            <PinOff className="w-2.5 h-2.5" />
                          ) : (
                            <PinIcon className={cn("w-2.5 h-2.5", pin === "right" && "rotate-90")} />
                          )}
                        </motion.span>
                      </button>
                    </span>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {ROWS.map((row, rIdx) => (
              <tr key={row.ticker} className="border-b border-white/[0.03] hover:bg-white/[0.03]">
                {ordered.map((col, i) => {
                  const pin = pins[col.key] ?? "none";
                  const isLeftPin = pin === "left";
                  const isRightPin = pin === "right";
                  const v = row[col.key as keyof Row];
                  const formatted = col.format ? col.format(v) : String(v);
                  const isChange = col.key === "change";
                  return (
                    <td
                      key={col.key}
                      style={{
                        width: col.width,
                        minWidth: col.width,
                        ...(isLeftPin ? { position: "sticky", left: leftOffsets[col.key], zIndex: 10 } : {}),
                        ...(isRightPin ? { position: "sticky", right: rightOffsets[col.key], zIndex: 10 } : {}),
                      }}
                      className={cn(
                        "py-2 px-2 align-middle",
                        cellBg(rIdx),
                        col.align === "right" ? "text-right" : "text-left",
                        isLeftPin && i === leftCount - 1 && "border-r border-emerald-500/20",
                        isRightPin && i === rightStartIdx && "border-l border-emerald-500/20",
                        col.key === "ticker" && "text-white font-bold",
                        isChange && (row.change >= 0 ? "text-emerald-300" : "text-rose-300")
                      )}
                    >
                      {formatted}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="relative z-10 flex items-center justify-between text-[10px] font-mono text-zinc-400">
        <span>scroll horizontally to test pins</span>
        <span className="text-emerald-300">{ROWS.length} symbols</span>
      </div>
    </div>
  );
}

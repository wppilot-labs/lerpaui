"use client";

import React, { useState } from "react";
import { Users, Database, Zap } from "lucide-react";
import { cn } from "../lib/cn";

const BASE = 12;
const PER_SEAT = 8;
const PER_GB = 0.4;

export interface PricingCalculatorSectionProps {
  className?: string;
}

export function PricingCalculatorSection({
  className,
}: PricingCalculatorSectionProps) {
  const [seats, setSeats] = useState(5);
  const [storage, setStorage] = useState(50);

  const total = Math.round(BASE + seats * PER_SEAT + storage * PER_GB);

  return (
    <section
      className={cn(
        "w-full max-w-md bg-card border border-border p-5 rounded-2xl shadow-sm font-sans text-foreground",
        className,
      )}
    >
      <div className="flex items-center gap-2 mb-1">
        <Zap className="w-4 h-4 text-primary" />
        <h2 className="text-base font-bold">Estimate your cost</h2>
      </div>
      <p className="text-xs text-muted-foreground mb-5">
        Pay only for what you use
      </p>

      {/* seats */}
      <div className="mb-5">
        <div className="flex items-center justify-between mb-2">
          <label
            htmlFor="calc-seats"
            className="inline-flex items-center gap-1.5 text-sm font-semibold"
          >
            <Users className="w-4 h-4 text-muted-foreground" /> Team seats
          </label>
          <span className="text-sm font-bold tabular-nums">{seats}</span>
        </div>
        <input
          id="calc-seats"
          type="range"
          min={1}
          max={50}
          value={seats}
          onChange={(e) => setSeats(Number(e.target.value))}
          className="w-full accent-primary"
        />
        <div className="flex justify-between text-xs text-muted-foreground mt-1">
          <span>1</span>
          <span>50</span>
        </div>
      </div>

      {/* storage */}
      <div className="mb-5">
        <div className="flex items-center justify-between mb-2">
          <label
            htmlFor="calc-storage"
            className="inline-flex items-center gap-1.5 text-sm font-semibold"
          >
            <Database className="w-4 h-4 text-muted-foreground" /> Storage
          </label>
          <span className="text-sm font-bold tabular-nums">{storage} GB</span>
        </div>
        <input
          id="calc-storage"
          type="range"
          min={10}
          max={1000}
          step={10}
          value={storage}
          onChange={(e) => setStorage(Number(e.target.value))}
          className="w-full accent-primary"
        />
        <div className="flex justify-between text-xs text-muted-foreground mt-1">
          <span>10 GB</span>
          <span>1 TB</span>
        </div>
      </div>

      {/* total */}
      <div className="rounded-xl bg-primary/[0.08] border border-primary/20 p-4 flex items-baseline justify-between">
        <span className="text-sm font-semibold text-muted-foreground">
          Estimated total
        </span>
        <span className="text-3xl font-black tabular-nums">
          ${total}
          <span className="text-sm font-normal text-muted-foreground">/mo</span>
        </span>
      </div>

      <button
        type="button"
        className="mt-3 w-full h-11 rounded-xl bg-primary text-primary-foreground text-sm font-bold hover:opacity-90 transition-opacity"
      >
        Get started
      </button>
    </section>
  );
}

"use client";

import React, { useState } from "react";
import { TrendingUp } from "lucide-react";
import { cn } from "../lib/cn";

export interface RoiCalculatorBasicProps {
  className?: string;
}

export function RoiCalculatorBasic({ className }: RoiCalculatorBasicProps) {
  const [seats, setSeats] = useState(25);
  const [hoursPerWeek, setHoursPerWeek] = useState(4);
  const [hourlyRate, setHourlyRate] = useState(60);

  const weeklySaved = seats * hoursPerWeek;
  const monthlyValue = Math.round(weeklySaved * 4.33 * hourlyRate);
  const annualValue = monthlyValue * 12;

  const fields = [
    { id: "seats", label: "Team members", value: seats, set: setSeats, min: 1, max: 200, suffix: "" },
    { id: "hours", label: "Hours saved / person / week", value: hoursPerWeek, set: setHoursPerWeek, min: 1, max: 20, suffix: "h" },
    { id: "rate", label: "Avg. hourly cost", value: hourlyRate, set: setHourlyRate, min: 20, max: 200, suffix: "$" },
  ];

  return (
    <div
      className={cn(
        "w-full max-w-md rounded-2xl border border-border/50 bg-card/60 p-5 font-sans text-foreground shadow-xl backdrop-blur-xl",
        className,
      )}
    >
      <div className="mb-4 flex items-center gap-1.5">
        <TrendingUp className="h-5 w-5 text-primary" />
        <h3 className="text-base font-bold">ROI calculator</h3>
      </div>

      <div className="space-y-4">
        {fields.map((f) => (
          <div key={f.id}>
            <div className="mb-1.5 flex items-center justify-between">
              <label htmlFor={f.id} className="text-xs font-medium text-muted-foreground/80">
                {f.label}
              </label>
              <span className="text-sm font-bold tabular-nums text-foreground">
                {f.suffix === "$" ? `$${f.value}` : `${f.value}${f.suffix}`}
              </span>
            </div>
            <input
              id={f.id}
              type="range"
              min={f.min}
              max={f.max}
              value={f.value}
              onChange={(e) => f.set(Number(e.target.value))}
              className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-foreground/10 accent-primary"
            />
          </div>
        ))}
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3 border-t border-foreground/[0.06] pt-4">
        <div className="rounded-xl bg-foreground/[0.03] p-3">
          <div className="text-xs uppercase tracking-wide text-muted-foreground/55">Hours / week</div>
          <div className="text-2xl font-black">{weeklySaved.toLocaleString()}h</div>
        </div>
        <div className="rounded-xl bg-primary/10 p-3 ring-1 ring-inset ring-primary/20">
          <div className="text-xs uppercase tracking-wide text-primary/70">Saved / year</div>
          <div className="text-2xl font-black text-primary">${annualValue.toLocaleString()}</div>
        </div>
      </div>
    </div>
  );
}

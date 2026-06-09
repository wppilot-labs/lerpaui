"use client";

import React, { useState } from "react";
import { Plus, X, Repeat } from "lucide-react";
import { cn } from "../lib/cn";

type Plan = { id: string; label: string; slots: number; price: number };
type Choice = { id: string; name: string; tint: string };

const PLANS: Plan[] = [
  { id: "mini", label: "Mini", slots: 3, price: 24 },
  { id: "classic", label: "Classic", slots: 5, price: 38 },
  { id: "deluxe", label: "Deluxe", slots: 8, price: 56 },
];

const CHOICES: Choice[] = [
  { id: "coffee", name: "Single-origin coffee", tint: "bg-amber-600" },
  { id: "tea", name: "Loose-leaf tea", tint: "bg-emerald-600" },
  { id: "choc", name: "Dark chocolate", tint: "bg-orange-800" },
  { id: "gran", name: "Granola", tint: "bg-yellow-700" },
  { id: "honey", name: "Wildflower honey", tint: "bg-amber-400" },
];

const CADENCES = ["Monthly", "Every 2 mo", "Quarterly"];

export interface ProductSubscriptionBoxBuilderProps {
  className?: string;
}

export function ProductSubscriptionBoxBuilder({
  className,
}: ProductSubscriptionBoxBuilderProps) {
  const [planId, setPlanId] = useState("classic");
  const [cadence, setCadence] = useState("Monthly");
  const [box, setBox] = useState<string[]>(["coffee", "choc"]);

  const plan = PLANS.find((p) => p.id === planId)!;

  const add = (id: string) => {
    if (box.length >= plan.slots || box.includes(id)) return;
    setBox((b) => [...b, id]);
  };
  const removeAt = (i: number) => setBox((b) => b.filter((_, idx) => idx !== i));

  const slots = Array.from({ length: plan.slots }, (_, i) => box[i]);

  return (
    <div
      className={cn(
        "w-full max-w-md bg-card/45 backdrop-blur-xl border border-border/50 p-5 rounded-2xl shadow-xl font-sans text-foreground",
        className,
      )}
    >
      <h3 className="text-base font-bold mb-3">Build your box</h3>

      {/* plan size */}
      <div
        className="grid grid-cols-3 gap-2 mb-4"
        role="radiogroup"
        aria-label="Box size"
      >
        {PLANS.map((p) => {
          const on = p.id === planId;
          return (
            <button
              key={p.id}
              type="button"
              role="radio"
              aria-checked={on}
              onClick={() => {
                setPlanId(p.id);
                setBox((b) => b.slice(0, p.slots));
              }}
              className={cn(
                "rounded-xl border p-2 text-center transition-all",
                on
                  ? "border-primary bg-primary/10"
                  : "border-foreground/[0.06] bg-foreground/[0.02] hover:border-foreground/25",
              )}
            >
              <div className="text-sm font-bold">{p.label}</div>
              <div className="text-xs text-muted-foreground/60">
                {p.slots} items
              </div>
              <div className="text-xs font-semibold mt-0.5">${p.price}</div>
            </button>
          );
        })}
      </div>

      {/* slots */}
      <div className="mb-2 flex items-center justify-between">
        <span className="text-xs uppercase tracking-wider text-muted-foreground/60 font-bold">
          Your box
        </span>
        <span className="text-xs text-muted-foreground/55 tabular-nums">
          {box.length}/{plan.slots} filled
        </span>
      </div>
      <div className="grid grid-cols-4 gap-2 mb-4">
        {slots.map((id, i) => {
          const choice = CHOICES.find((c) => c.id === id);
          return choice ? (
            <button
              key={i}
              type="button"
              aria-label={`Remove ${choice.name}`}
              onClick={() => removeAt(i)}
              className={cn(
                "relative h-14 rounded-xl flex items-center justify-center group",
                choice.tint,
              )}
            >
              <span className="absolute inset-0 rounded-xl bg-transparent group-hover:bg-muted/60 transition-colors flex items-center justify-center">
                <X className="w-4 h-4 text-foreground opacity-0 group-hover:opacity-100" />
              </span>
            </button>
          ) : (
            <div
              key={i}
              className="h-14 rounded-xl border border-dashed border-foreground/15 flex items-center justify-center text-muted-foreground/30"
            >
              <Plus className="w-4 h-4" />
            </div>
          );
        })}
      </div>

      {/* picker */}
      <div className="flex flex-wrap gap-1.5 mb-4">
        {CHOICES.map((c) => {
          const inBox = box.includes(c.id);
          const full = box.length >= plan.slots;
          return (
            <button
              key={c.id}
              type="button"
              onClick={() => add(c.id)}
              disabled={inBox || full}
              className={cn(
                "inline-flex items-center gap-1.5 pl-1.5 pr-2.5 py-1 rounded-full border text-xs font-medium transition-all",
                inBox || full
                  ? "border-foreground/[0.04] text-muted-foreground/35 cursor-not-allowed"
                  : "border-foreground/[0.08] hover:border-foreground/30",
              )}
            >
              <span className={cn("h-3.5 w-3.5 rounded-full", c.tint)} />
              {c.name}
            </button>
          );
        })}
      </div>

      {/* cadence */}
      <div className="flex items-center gap-2 mb-4">
        <Repeat className="w-3.5 h-3.5 text-muted-foreground/55 shrink-0" />
        <div className="flex gap-1 bg-secondary/40 p-0.5 rounded-lg flex-1">
          {CADENCES.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCadence(c)}
              className={cn(
                "flex-1 py-1 rounded-md text-xs font-semibold transition-all",
                cadence === c
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground/60 hover:text-foreground",
              )}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <button
        type="button"
        disabled={box.length < plan.slots}
        className="w-full h-10 rounded-xl bg-primary text-primary-foreground text-sm font-bold hover:opacity-90 disabled:opacity-40 transition-opacity"
      >
        {box.length < plan.slots
          ? `Add ${plan.slots - box.length} more to subscribe`
          : `Subscribe · $${plan.price}/${cadence === "Monthly" ? "mo" : "box"}`}
      </button>
    </div>
  );
}

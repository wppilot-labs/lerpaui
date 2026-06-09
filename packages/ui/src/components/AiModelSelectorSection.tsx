"use client";

import React, { useState } from "react";
import { Check, Zap, Brain, Feather, Gauge } from "lucide-react";
import { cn } from "../lib/cn";

type Model = {
  id: string;
  name: string;
  desc: string;
  icon: React.ComponentType<{ className?: string }>;
  speed: string;
  badge?: string;
};

const MODELS: Model[] = [
  { id: "gpt4o", name: "GPT-4o", desc: "Most capable, multimodal", icon: Brain, speed: "Fast", badge: "Default" },
  { id: "sonnet", name: "Claude 3.5 Sonnet", desc: "Strong reasoning & code", icon: Zap, speed: "Fast" },
  { id: "haiku", name: "Claude 3.5 Haiku", desc: "Lightweight & cheap", icon: Feather, speed: "Fastest" },
  { id: "gemini", name: "Gemini 1.5 Pro", desc: "Huge context window", icon: Gauge, speed: "Medium" },
];

export interface AiModelSelectorSectionProps {
  className?: string;
}

export function AiModelSelectorSection({ className }: AiModelSelectorSectionProps) {
  const [selected, setSelected] = useState("gpt4o");

  return (
    <div
      className={cn(
        "w-full max-w-sm bg-card/45 backdrop-blur-xl border border-border/50 rounded-2xl shadow-xl p-2 font-sans text-foreground",
        className,
      )}
      role="radiogroup"
      aria-label="Select model"
    >
      <div className="px-2 py-2 text-xs uppercase font-bold tracking-wider text-muted-foreground/40">
        Model
      </div>
      <ul className="space-y-0.5">
        {MODELS.map((m) => {
          const Icon = m.icon;
          const active = selected === m.id;
          return (
            <li key={m.id}>
              <button
                type="button"
                role="radio"
                aria-checked={active}
                onClick={() => setSelected(m.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-2.5 py-2.5 rounded-xl text-left transition-colors",
                  active ? "bg-primary/10" : "hover:bg-foreground/[0.04]",
                )}
              >
                <div
                  className={cn(
                    "h-8 w-8 shrink-0 rounded-lg grid place-items-center",
                    active ? "bg-primary/20 text-primary" : "bg-foreground/[0.04] text-muted-foreground/70",
                  )}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-semibold truncate">{m.name}</span>
                    {m.badge && (
                      <span className="text-[11px] font-bold px-1.5 py-0.5 rounded bg-secondary text-muted-foreground/70">
                        {m.badge}
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground/55 truncate">{m.desc}</div>
                </div>
                <span className="text-xs text-muted-foreground/45 shrink-0">{m.speed}</span>
                {active && <Check className="w-4 h-4 text-primary shrink-0" />}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

"use client";

import React, { useState } from "react";
import { AlignLeft, List, Table2, Code2, FileJson, Check } from "lucide-react";
import { cn } from "../lib/cn";

type Format = { id: string; label: string; desc: string; icon: React.ComponentType<{ className?: string }> };

const FORMATS: Format[] = [
  { id: "prose", label: "Prose", desc: "Flowing paragraphs", icon: AlignLeft },
  { id: "bullets", label: "Bullet list", desc: "Scannable points", icon: List },
  { id: "table", label: "Table", desc: "Rows & columns", icon: Table2 },
  { id: "code", label: "Code block", desc: "Syntax highlighted", icon: Code2 },
  { id: "json", label: "JSON", desc: "Structured data", icon: FileJson },
];

const TONES = ["Concise", "Balanced", "Detailed"];

export interface AiOutputFormatSectionProps {
  className?: string;
}

export function AiOutputFormatSection({ className }: AiOutputFormatSectionProps) {
  const [format, setFormat] = useState("bullets");
  const [tone, setTone] = useState("Balanced");

  return (
    <div
      className={cn(
        "w-full max-w-md bg-card/45 backdrop-blur-xl border border-border/50 rounded-2xl shadow-xl p-5 font-sans text-foreground",
        className,
      )}
    >
      <h3 className="text-sm font-bold mb-3">Output format</h3>

      <div role="radiogroup" aria-label="Output format" className="grid grid-cols-1 gap-1.5 mb-4">
        {FORMATS.map((f) => {
          const Icon = f.icon;
          const active = format === f.id;
          return (
            <button
              key={f.id}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => setFormat(f.id)}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-left transition border",
                active
                  ? "bg-primary/10 border-primary/30"
                  : "bg-foreground/[0.02] border-foreground/[0.06] hover:bg-foreground/[0.04]",
              )}
            >
              <div
                className={cn(
                  "h-8 w-8 shrink-0 grid place-items-center rounded-lg",
                  active ? "bg-primary/20 text-primary" : "bg-foreground/[0.04] text-muted-foreground/70",
                )}
              >
                <Icon className="w-4 h-4" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-sm font-semibold">{f.label}</div>
                <div className="text-xs text-muted-foreground/55">{f.desc}</div>
              </div>
              {active && <Check className="w-4 h-4 text-primary shrink-0" />}
            </button>
          );
        })}
      </div>

      <div className="text-xs uppercase font-bold tracking-wider text-muted-foreground/40 mb-2">Length</div>
      <div className="flex items-center gap-1 rounded-xl bg-foreground/[0.03] p-1">
        {TONES.map((t) => (
          <button
            key={t}
            type="button"
            aria-pressed={tone === t}
            onClick={() => setTone(t)}
            className={cn(
              "flex-1 rounded-lg py-1.5 text-xs font-medium transition",
              tone === t ? "bg-primary text-primary-foreground shadow" : "text-muted-foreground/60 hover:text-foreground",
            )}
          >
            {t}
          </button>
        ))}
      </div>
    </div>
  );
}

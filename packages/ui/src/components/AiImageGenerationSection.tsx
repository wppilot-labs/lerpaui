"use client";

import React, { useState } from "react";
import { ImagePlus, Sparkles, Download, RefreshCw } from "lucide-react";
import { cn } from "../lib/cn";

const GRADIENTS = [
  "from-violet-500/40 via-fuchsia-500/30 to-sky-500/40",
  "from-amber-500/40 via-rose-500/30 to-purple-500/40",
  "from-emerald-500/40 via-teal-500/30 to-cyan-500/40",
  "from-sky-500/40 via-indigo-500/30 to-blue-500/40",
];

const RATIOS = ["1:1", "16:9", "9:16"];

export interface AiImageGenerationSectionProps {
  className?: string;
}

export function AiImageGenerationSection({ className }: AiImageGenerationSectionProps) {
  const [prompt, setPrompt] = useState("A neon city skyline reflected in rain, cinematic");
  const [ratio, setRatio] = useState("1:1");

  return (
    <div
      className={cn(
        "w-full max-w-md bg-card/45 backdrop-blur-xl border border-border/50 rounded-2xl shadow-xl p-5 font-sans text-foreground",
        className,
      )}
    >
      <h3 className="text-sm font-bold flex items-center gap-1.5 mb-3">
        <ImagePlus className="w-4 h-4 text-primary" /> Image generation
      </h3>

      <div className="grid grid-cols-2 gap-2 mb-3">
        {GRADIENTS.map((g, i) => (
          <div
            key={i}
            className={cn(
              "group relative aspect-square rounded-xl bg-gradient-to-br overflow-hidden border border-foreground/[0.06]",
              g,
            )}
          >
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 grid place-items-center">
              <button
                type="button"
                aria-label={`Download variation ${i + 1}`}
                className="h-8 w-8 grid place-items-center rounded-lg bg-foreground/15 backdrop-blur text-white hover:bg-foreground/25 transition"
              >
                <Download className="w-4 h-4" />
              </button>
            </div>
            <span className="absolute bottom-1.5 left-1.5 text-[11px] font-mono text-white/70 bg-black/30 rounded px-1">
              v{i + 1}
            </span>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-1.5 mb-2">
        {RATIOS.map((r) => (
          <button
            key={r}
            type="button"
            aria-pressed={ratio === r}
            onClick={() => setRatio(r)}
            className={cn(
              "px-2.5 py-1 rounded-lg text-xs font-medium transition",
              ratio === r ? "bg-primary/15 text-primary" : "text-muted-foreground/60 hover:bg-foreground/[0.05]",
            )}
          >
            {r}
          </button>
        ))}
      </div>

      <div className="flex items-end gap-2">
        <div className="flex-1">
          <label htmlFor="img-prompt" className="sr-only">
            Image prompt
          </label>
          <textarea
            id="img-prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            rows={2}
            placeholder="Describe an image…"
            className="w-full resize-none bg-foreground/[0.04] border border-foreground/[0.06] rounded-xl px-3 py-2 text-sm leading-relaxed placeholder:text-muted-foreground/40 focus:outline-none focus:border-primary/45"
          />
        </div>
        <button
          type="submit"
          className="h-9 flex items-center gap-1.5 px-3 bg-primary text-primary-foreground rounded-xl text-sm font-semibold hover:brightness-110 transition shrink-0"
        >
          <Sparkles className="w-4 h-4" /> Generate
        </button>
      </div>

      <button
        type="button"
        className="mt-2 flex items-center gap-1 text-xs text-muted-foreground/50 hover:text-foreground transition"
      >
        <RefreshCw className="w-3.5 h-3.5" /> Regenerate all variations
      </button>
    </div>
  );
}

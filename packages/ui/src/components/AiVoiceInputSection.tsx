"use client";

import React, { useState } from "react";
import { Mic, Square, Send, Trash2 } from "lucide-react";
import { cn } from "../lib/cn";
import { usePrefersReducedMotion } from "../animation/hooks";

const BARS = [40, 70, 30, 90, 55, 80, 35, 65, 50, 95, 45, 75, 25, 60, 85, 40, 70, 50];

export interface AiVoiceInputSectionProps {
  className?: string;
}

export function AiVoiceInputSection({ className }: AiVoiceInputSectionProps) {
  const reduced = usePrefersReducedMotion();
  const [recording, setRecording] = useState(true);

  return (
    <div
      className={cn(
        "w-full max-w-md bg-card/45 backdrop-blur-xl border border-border/50 rounded-2xl shadow-xl p-5 font-sans text-foreground",
        className,
      )}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold flex items-center gap-1.5">
          <Mic className="w-4 h-4 text-primary" /> Voice input
        </h3>
        <span
          className={cn(
            "flex items-center gap-1.5 text-xs font-medium",
            recording ? "text-red-400" : "text-muted-foreground/50",
          )}
        >
          <span className={cn("h-2 w-2 rounded-full", recording ? "bg-red-400 animate-pulse" : "bg-muted-foreground/40")} />
          {recording ? "Recording 0:12" : "Paused"}
        </span>
      </div>

      <div className="flex items-center justify-center gap-[3px] h-16 rounded-xl bg-foreground/[0.02] border border-foreground/[0.05] px-4 mb-4">
        {BARS.map((h, i) => (
          <span
            key={i}
            className={cn(
              "w-1 rounded-full",
              recording ? "bg-primary/70" : "bg-muted-foreground/25",
              recording && !reduced && "animate-pulse",
            )}
            style={{
              height: `${recording ? h : Math.max(15, h * 0.3)}%`,
              animationDelay: `${i * 60}ms`,
            }}
          />
        ))}
      </div>

      <div className="flex items-center justify-center gap-3">
        <button
          type="button"
          aria-label="Discard recording"
          className="h-10 w-10 grid place-items-center rounded-full border border-foreground/[0.08] text-muted-foreground/70 hover:bg-foreground/[0.05] transition"
        >
          <Trash2 className="w-4 h-4" />
        </button>
        <button
          type="button"
          aria-label={recording ? "Stop recording" : "Start recording"}
          aria-pressed={recording}
          onClick={() => setRecording((r) => !r)}
          className={cn(
            "h-14 w-14 grid place-items-center rounded-full transition shadow-lg",
            recording ? "bg-red-500 text-white hover:bg-red-600" : "bg-primary text-primary-foreground hover:brightness-110",
          )}
        >
          {recording ? <Square className="w-5 h-5 fill-current" /> : <Mic className="w-5 h-5" />}
        </button>
        <button
          type="button"
          aria-label="Send voice message"
          className="h-10 w-10 grid place-items-center rounded-full bg-primary/15 text-primary hover:bg-primary/25 transition"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>

      <p className="text-center text-xs text-muted-foreground/45 mt-3">Transcribing with Whisper · English</p>
    </div>
  );
}

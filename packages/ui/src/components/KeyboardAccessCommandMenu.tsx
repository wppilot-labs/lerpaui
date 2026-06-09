"use client";

import React, { useState } from "react";
import { Terminal } from "lucide-react";
import { cn } from "../lib/cn";

export function KeyboardAccessCommandMenu({ className }: { className?: string }) {
  const [typed, setTyped] = useState("");
  const [result, setResult] = useState<string | null>(null);

  const handleCommand = (cmd: string) => {
    if (cmd.toLowerCase() === "help") {
      setResult("Available: help, secure, theme");
    } else if (cmd.toLowerCase() === "secure") {
      setResult("System status: 100% Protected.");
    } else if (cmd.toLowerCase() === "theme") {
      setResult("Luxury Darkmode Active.");
    } else {
      setResult(`Command not found: ${cmd}`);
    }
  };

  return (
    <div className={cn("w-full max-w-sm rounded-2xl border border-border/80 bg-card/45 p-5 backdrop-blur-xl shadow-2xl space-y-4", className)}>
      <div className="flex items-center justify-between pb-2 border-b border-border/30">
        <div>
          <h3 className="text-sm font-bold text-foreground">Interactive Keyboard Hub</h3>
          <p className="text-[10px] text-muted-foreground">Type commands: help, secure, theme</p>
        </div>
        <Terminal className="w-4 h-4 text-primary" />
      </div>

      <div className="space-y-3">
        <div className="flex gap-2">
          <input
            type="text"
            value={typed}
            onChange={(e) => setTyped(e.target.value)}
            placeholder="Type 'help' and press Enter..."
            className="flex-1 bg-zinc-950/60 border border-border/50 rounded-xl px-3 py-1.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/60 transition-colors"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleCommand(typed);
                setTyped("");
              }
            }}
          />
        </div>

        {result && (
          <div className="bg-zinc-950/80 p-3 rounded-xl border border-border/30 font-mono text-[10px] text-emerald-400 space-y-1">
            <span className="text-muted-foreground">$ output:</span>
            <p className="font-bold">{result}</p>
          </div>
        )}
      </div>
    </div>
  );
}

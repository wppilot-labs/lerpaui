"use client";

import React, { useState } from "react";
import { Cpu, HelpCircle, CheckCircle2 } from "lucide-react";
import { cn } from "../lib/cn";

export function WorkflowNodePulseLink({ className }: { className?: string }) {
  const [activePort, setActivePort] = useState<"input" | "output">("input");

  return (
    <div className={cn("w-full max-w-sm rounded-2xl border border-border/80 bg-card/40 p-5 backdrop-blur-xl shadow-2xl space-y-4", className)}>
      <div className="flex items-center justify-between pb-2 border-b border-border/30">
        <div>
          <h3 className="text-sm font-bold text-foreground">Workflow Connector</h3>
          <p className="text-[10px] text-muted-foreground">Interactive connected pulse node</p>
        </div>
        <Cpu className="w-4 h-4 text-primary animate-pulse" />
      </div>

      <div className="flex justify-around items-center bg-zinc-950/60 p-4 rounded-xl border border-border/30">
        <button
          onClick={() => setActivePort("input")}
          className={cn(
            "flex flex-col items-center gap-1.5 px-3 py-2 rounded-xl border transition-colors cursor-pointer",
            activePort === "input" ? "bg-primary/20 border-primary text-primary" : "bg-zinc-900 border-border/30 text-muted-foreground"
          )}
        >
          <HelpCircle className="w-4 h-4 shrink-0" />
          <span className="text-[9px] font-bold uppercase tracking-wider">Input Port</span>
        </button>

        <div className="h-0.5 w-10 bg-zinc-800 relative">
          {/* Pulsing visual trail between nodes */}
          <div className="absolute top-1/2 -translate-y-1/2 left-0 w-2 h-2 rounded-full bg-primary animate-ping" />
        </div>

        <button
          onClick={() => setActivePort("output")}
          className={cn(
            "flex flex-col items-center gap-1.5 px-3 py-2 rounded-xl border transition-colors cursor-pointer",
            activePort === "output" ? "bg-emerald-500/20 border-emerald-500 text-emerald-400" : "bg-zinc-900 border-border/30 text-muted-foreground"
          )}
        >
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span className="text-[9px] font-bold uppercase tracking-wider">Output Port</span>
        </button>
      </div>
    </div>
  );
}

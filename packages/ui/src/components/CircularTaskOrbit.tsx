"use client";

import React, { useState } from "react";
import { Sparkles } from "lucide-react";
import { cn } from "../lib/cn";

export function CircularTaskOrbit({ className }: { className?: string }) {
  const [activeTask, setActiveTask] = useState(1);

  const tasks = [
    { id: 1, label: "A" },
    { id: 2, label: "B" },
    { id: 3, label: "C" },
    { id: 4, label: "D" },
  ];

  return (
    <div className={cn("w-full max-w-[280px] rounded-2xl border border-border/80 bg-card/45 p-5 backdrop-blur-xl shadow-2xl flex flex-col items-center", className)}>
      <div className="w-full flex items-center justify-between pb-2 border-b border-border/30 mb-4">
        <div>
          <h3 className="text-sm font-bold text-foreground">Task Orbit</h3>
          <p className="text-[10px] text-muted-foreground">Radial scheduler segments mapping</p>
        </div>
        <Sparkles className="w-4 h-4 text-primary" />
      </div>

      <div className="relative w-36 h-36 rounded-full border border-border/40 bg-zinc-950/60 flex items-center justify-center shadow-lg">
        {/* Central Hub */}
        <div className="z-10 w-12 h-12 rounded-full bg-zinc-900 border border-border/60 flex flex-col items-center justify-center text-center shadow-inner">
          <span className="text-[9px] font-bold text-muted-foreground uppercase leading-none">Task</span>
          <span className="text-xs font-black text-primary font-mono mt-0.5">{activeTask}</span>
        </div>

        {/* Orbit Tasks */}
        {tasks.map((task, idx) => {
          const angle = (idx * 90 * Math.PI) / 180 - Math.PI / 2;
          const radius = 50; // distance from center
          const x = radius * Math.cos(angle);
          const y = radius * Math.sin(angle);
          const isActive = activeTask === task.id;

          return (
            <button
              key={task.id}
              onClick={() => setActiveTask(task.id)}
              style={{ transform: `translate(${x}px, ${y}px)` }}
              className={cn(
                "absolute h-6 w-6 rounded-full text-[9px] font-bold font-mono transition-all flex items-center justify-center border cursor-pointer",
                isActive
                  ? "bg-primary border-primary/50 text-white shadow-lg shadow-primary/20 scale-110"
                  : "bg-zinc-900 border-border/30 text-muted-foreground hover:text-foreground hover:bg-zinc-800"
              )}
            >
              {task.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

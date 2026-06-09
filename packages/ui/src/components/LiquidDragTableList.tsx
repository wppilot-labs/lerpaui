"use client";

import React, { useState } from "react";
import { Reorder, motion} from "framer-motion";
import { GripVertical, Award, ArrowUpRight, Flame } from "lucide-react";
import { cn } from "../lib/cn";

interface TaskItem {
  id: string;
  name: string;
  category: string;
  load: "low" | "medium" | "high";
  progress: number;
}

const INITIAL_TASKS: TaskItem[] = [
  { id: "task-1", name: "Synthesize LLM Embedding Models", category: "Core AI", load: "high", progress: 92 },
  { id: "task-2", name: "Audit Smart-Contract Liquidity Pools", category: "Security", load: "medium", progress: 68 },
  { id: "task-3", name: "Coordinate Visual Theme Studio Mockups", category: "UX Design", load: "low", progress: 85 },
  { id: "task-4", name: "Accelerate Production Bundle Optimization", category: "DevOps", load: "high", progress: 45 },
];

export function LiquidDragTableList({ className }: { className?: string }) {
  const [tasks, setTasks] = useState<TaskItem[]>(INITIAL_TASKS);

  const loadBadges = {
    low: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    medium: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    high: "bg-rose-500/10 text-rose-400 border-rose-500/20",
  };

  return (
    <div
      className={cn(
        "relative w-full max-w-[420px] rounded-2xl bg-zinc-950/80 border border-white/10 p-5 flex flex-col justify-between overflow-hidden shadow-2xl backdrop-blur-xl select-none text-white",
        className
      )}
    >
      {/* Background Radial Sheen */}
      <div className="absolute top-0 left-1/4 w-32 h-32 rounded-full bg-indigo-500/5 blur-3xl pointer-events-none" />

      {/* Header Info */}
      <div className="relative z-10 flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-bold tracking-tight">Priority Queue</h3>
          <p className="text-[10px] text-zinc-400 font-mono">DRAG_REORDER_TABLE_V1</p>
        </div>

        <div className="flex items-center gap-1 text-[9px] font-mono text-zinc-500">
          <Flame className="w-3.5 h-3.5 text-amber-500" />
          <span>DRAG_ROWS_TO_PRIORITIZE</span>
        </div>
      </div>

      {/* Reorder List Wrapper */}
      <Reorder.Group
        axis="y"
        values={tasks}
        onReorder={setTasks}
        className="relative z-10 space-y-2 w-full"
      >
        {tasks.map((task) => (
          <Reorder.Item
            key={task.id}
            value={task}
            className="w-full rounded-xl bg-white/[0.02] border border-white/5 p-3 flex items-center gap-3 hover:border-white/10 transition-colors duration-150 cursor-grab active:cursor-grabbing"
          >
            {/* Drag Handle Icon */}
            <div className="p-1 rounded bg-white/5 border border-white/5 text-zinc-500 hover:text-white transition-colors">
              <GripVertical className="w-3.5 h-3.5" />
            </div>

            {/* Task Info details */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2 mb-1">
                <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-wider">{task.category}</span>
                <span
                  className={cn(
                    "px-1.5 py-0.5 rounded-full text-[8px] font-mono border uppercase tracking-wider",
                    loadBadges[task.load]
                  )}
                >
                  {task.load}_load
                </span>
              </div>
              <h4 className="text-xs font-bold text-white truncate">{task.name}</h4>

              {/* Progress track bar */}
              <div className="w-full h-1 bg-white/5 rounded-full mt-2 overflow-hidden relative">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${task.progress}%` }}
                  className="absolute left-0 top-0 bottom-0 bg-indigo-500 rounded-full"
                  transition={{ duration: 0.8, ease: "easeOut" }}
                />
              </div>
            </div>

            {/* Progress metric text */}
            <div className="text-right pl-2">
              <p className="text-[11px] font-mono font-bold text-indigo-400">{task.progress}%</p>
              <span className="text-[7px] text-zinc-500 font-mono block">COMPLETE</span>
            </div>
          </Reorder.Item>
        ))}
      </Reorder.Group>

      {/* Footer Metrics */}
      <div className="relative z-10 border-t border-white/5 pt-3 mt-4 flex items-center justify-between text-[11px] font-mono text-zinc-400">
        <span className="flex items-center gap-1">
          <Award className="w-4.5 h-4.5 text-zinc-500" />
          <span>Queue Load Factor:</span>
        </span>
        <span className="text-white font-bold flex items-center gap-0.5">
          <span>HIGH_DENSITY</span>
          <ArrowUpRight className="w-3.5 h-3.5 text-rose-500" />
        </span>
      </div>
    </div>
  );
}

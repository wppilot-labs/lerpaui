"use client";

import React, { useState } from "react";
import { motion, AnimatePresence} from "framer-motion";
import { Plus, Trash2, GripVertical, Check } from "lucide-react";
import { cn } from "../lib/cn";

interface Task {
  id: string;
  title: string;
  priority: "low" | "medium" | "high";
}

export function DraggableKanbanColumn({ className }: { className?: string }) {
  const [tasks, setTasks] = useState<Task[]>([
    { id: "1", title: "Implement Auth Flow", priority: "high" },
    { id: "2", title: "Design Bento Layout", priority: "medium" },
    { id: "3", title: "Add Tailwind CSS v4 variables", priority: "low" },
  ]);
  const [newTaskTitle, setNewTaskTitle] = useState("");

  const addTask = () => {
    if (!newTaskTitle.trim()) return;
    const newTask: Task = {
      id: Date.now().toString(),
      title: newTaskTitle,
      priority: "medium",
    };
    setTasks([...tasks, newTask]);
    setNewTaskTitle("");
  };

  const removeTask = (id: string) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  return (
    <div className={cn("w-full max-w-sm rounded-2xl border border-border/80 bg-card/40 p-5 backdrop-blur-xl shadow-2xl", className)}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-bold text-foreground">In Progress</h3>
          <p className="text-[10px] text-muted-foreground">Spring-animated task board</p>
        </div>
        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-primary/20 text-primary border border-primary/30">
          {tasks.length}
        </span>
      </div>

      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          placeholder="New task..."
          className="flex-1 bg-zinc-900/50 border border-border/50 rounded-xl px-3 py-1.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/60 transition-colors"
          onKeyDown={(e) => e.key === "Enter" && addTask()}
        />
        <button
          onClick={addTask}
          className="p-1.5 bg-primary/20 hover:bg-primary/30 border border-primary/30 rounded-xl text-primary transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-2.5 min-h-[150px]">
        <AnimatePresence initial={false}>
          {tasks.map((task) => (
            <motion.div
              key={task.id}
              layout
              initial={{ opacity: 0, y: 15, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.15 } }}
              whileDrag={{ scale: 1.03, boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.3)" }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
              className="flex items-center gap-3 p-3 bg-zinc-900/40 border border-border/50 hover:border-border rounded-xl cursor-grab active:cursor-grabbing group transition-all"
            >
              <GripVertical className="w-3.5 h-3.5 text-muted-foreground/60 group-hover:text-muted-foreground" />
              <div className="flex-1">
                <p className="text-xs text-foreground font-medium leading-none mb-1.5">{task.title}</p>
                <span className={cn(
                  "px-1.5 py-0.5 rounded text-[8px] font-bold uppercase",
                  task.priority === "high" && "bg-rose-500/10 text-rose-400 border border-rose-500/20",
                  task.priority === "medium" && "bg-amber-500/10 text-amber-400 border border-amber-500/20",
                  task.priority === "low" && "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                )}>
                  {task.priority}
                </span>
              </div>
              <button
                onClick={() => removeTask(task.id)}
                className="opacity-0 group-hover:opacity-100 p-1 hover:bg-rose-500/10 hover:text-rose-400 border border-transparent hover:border-rose-500/20 rounded-lg text-muted-foreground transition-all cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>

        {tasks.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-8 text-center"
          >
            <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 mb-2">
              <Check className="w-4 h-4 text-emerald-400" />
            </div>
            <p className="text-xs text-muted-foreground">All caught up!</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}

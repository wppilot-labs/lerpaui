"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence} from "framer-motion";
import { Search, Command, CornerDownLeft, Shield, Terminal } from "lucide-react";
import { cn } from "../lib/cn";

interface CommandItem {
  id: string;
  title: string;
  shortcut: string;
  category: "Actions" | "Settings" | "Systems";
}

const ITEMS: CommandItem[] = [
  { id: "1", title: "Synthesize LLM Vector Embeddings", shortcut: "⌘E", category: "Actions" },
  { id: "2", title: "Clear Dynamic Active Memory Caches", shortcut: "⌘K", category: "Actions" },
  { id: "3", title: "Toggle Deep Dark-Luxury Theming Modifiers", shortcut: "⌘T", category: "Settings" },
  { id: "4", title: "Configure Cloud Storage Credentials", shortcut: "⌘S", category: "Settings" },
  { id: "5", title: "Inspect Processing Server Connectivity", shortcut: "⌘I", category: "Systems" },
];

export function FloatingCommandFormPalette({ className }: { className?: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [activeIdx, setActiveIdx] = useState(0);
  const [executed, setExecuted] = useState<string | null>(null);

  const _containerRef = useRef<HTMLDivElement>(null);

  // Toggle Command Dialog on keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const filteredItems = ITEMS.filter((item) =>
    item.title.toLowerCase().includes(search.toLowerCase())
  );

  const handleExecute = (title: string) => {
    setExecuted(title);
    setTimeout(() => {
      setExecuted(null);
      setIsOpen(false);
      setSearch("");
    }, 1200);
  };

  return (
    <div className={cn("w-full max-w-[340px] flex flex-col items-center", className)}>
      
      {/* Visual trigger input field */}
      <button
        onClick={() => setIsOpen(true)}
        className="w-full px-4 py-3 rounded-2xl bg-zinc-950/80 border border-white/10 hover:border-white/20 flex items-center justify-between text-zinc-400 hover:text-white transition-all shadow-xl backdrop-blur-xl cursor-pointer"
      >
        <div className="flex items-center gap-2">
          <Search className="w-4 h-4 text-purple-400" />
          <span className="text-xs font-sans">Open command hub...</span>
        </div>
        <div className="flex items-center gap-0.5 text-[10px] font-mono bg-white/5 border border-white/5 px-2 py-0.5 rounded-md">
          <Command className="w-3 h-3" />
          <span>K</span>
        </div>
      </button>

      {/* Glassmorphic Command Palette Overlay Modal */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-start justify-center pt-24 px-4">
            
            {/* Modal backdrop closer clicker */}
            <div className="absolute inset-0" onClick={() => setIsOpen(false)} role="button" tabIndex={0} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setIsOpen(false); } }} />

            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: -20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: -20 }}
              transition={{ type: "spring", damping: 20, stiffness: 220 }}
              className="relative w-full max-w-[480px] rounded-2xl bg-zinc-950/90 border border-white/15 shadow-2xl overflow-hidden flex flex-col text-white"
            >
              {/* Floating laser sheen */}
              <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-purple-500 to-transparent" />

              {/* Header input bar */}
              <div className="relative border-b border-white/5 flex items-center px-4">
                <Search className="w-4 h-4 text-purple-400 mr-3" />
                <input
                  type="text"

                  placeholder="Type an command or action parameter..."
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setActiveIdx(0);
                  }}
                  className="flex-1 py-4 bg-transparent border-none text-xs focus:outline-none focus:ring-0 text-white placeholder-zinc-600 font-sans"
                />
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-[9px] font-mono text-zinc-500 bg-white/5 border border-white/5 px-1.5 py-0.5 rounded"
                >
                  ESC
                </button>
              </div>

              {/* Commands execution list container */}
              <div className="max-h-[260px] overflow-y-auto p-2 space-y-1">
                <AnimatePresence mode="wait">
                  {executed ? (
                    <motion.div
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="py-12 flex flex-col items-center justify-center text-center gap-2"
                    >
                      <div className="w-8 h-8 rounded-full bg-purple-500/20 border border-purple-500/50 flex items-center justify-center">
                        <Terminal className="w-4 h-4 text-purple-400" />
                      </div>
                      <p className="text-[11px] font-mono text-white font-bold">{executed}</p>
                      <p className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest">EXECUTING_SHELL_COMMAND</p>
                    </motion.div>
                  ) : filteredItems.length > 0 ? (
                    filteredItems.map((item, idx) => {
                      const isActive = idx === activeIdx;

                      return (
                        <button
                          key={item.id}
                          onClick={() => handleExecute(item.title)}
                          onMouseEnter={() => setActiveIdx(idx)}
                          className={cn(
                            "w-full px-3 py-2 rounded-xl flex items-center justify-between transition-colors text-left cursor-pointer",
                            isActive ? "bg-white/5 text-white" : "bg-transparent text-zinc-400"
                          )}
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-[8px] font-mono text-purple-400 bg-purple-950/40 border border-purple-500/20 px-1.5 py-0.5 rounded">
                              {item.category}
                            </span>
                            <span className="text-xs font-sans font-medium">{item.title}</span>
                          </div>
                          
                          <div className="flex items-center gap-1.5">
                            {isActive && <CornerDownLeft className="w-3.5 h-3.5 text-zinc-500" />}
                            <span className="text-[9px] font-mono text-zinc-600 bg-white/5 border border-white/5 px-1 rounded">
                              {item.shortcut}
                            </span>
                          </div>
                        </button>
                      );
                    })
                  ) : (
                    <div className="py-8 text-center text-zinc-600 font-mono text-[9px]">
                      NO COMMAND MATCHES PRESET LIST
                    </div>
                  )}
                </AnimatePresence>
              </div>

              {/* Status footer banner */}
              <div className="border-t border-white/5 bg-white/[0.01] px-4 py-2 flex items-center justify-between text-[9px] font-mono text-zinc-500">
                <span className="flex items-center gap-1">
                  <Shield className="w-3 h-3" />
                  <span>SECURE_SHELL_ACTIVE</span>
                </span>
                <span>CTRL+K TO TOGGLE</span>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

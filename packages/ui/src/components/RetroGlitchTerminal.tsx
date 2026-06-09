"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence} from "framer-motion";
import { cn } from "../lib/cn";

interface TerminalLine {
  text: string;
  type: "system" | "input" | "error" | "success";
}

interface RetroGlitchTerminalProps {
  title?: string;
  welcomeMessage?: string;
  className?: string;
}

export function RetroGlitchTerminal({
  title = "LAUNCH_OS v4.26.1",
  welcomeMessage = "INITIALIZING SECURE PROTOCOL... READY ON PORT 8080.",
  className,
}: RetroGlitchTerminalProps) {
  const [lines, setLines] = useState<TerminalLine[]>([
    { text: welcomeMessage, type: "system" },
  ]);
  const [inputVal, setInputVal] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim()) return;

    const cmd = inputVal.trim().toLowerCase();
    const newLines = [...lines, { text: `> ${inputVal}`, type: "input" as const }];

    if (cmd === "help") {
      newLines.push({ text: "AVAILABLE UTILITIES: [help, clear, system, hack, ping]", type: "system" });
    } else if (cmd === "clear") {
      setLines([]);
      setInputVal("");
      return;
    } else if (cmd === "system") {
      newLines.push({ text: "SYSTEM STATUS: SECURE | CPU TEMP: 41°C | CORE LATENCY: 2ms", type: "success" });
    } else if (cmd === "hack") {
      newLines.push({ text: "INJECTING EXPLOIT OVERLOAD PACKETS...", type: "error" });
      setTimeout(() => {
        setLines((prev) => [
          ...prev,
          { text: "ACCESS GRANTED. HOST BYPASSED SUCCESSFULLY.", type: "success" },
        ]);
      }, 800);
    } else if (cmd === "ping") {
      newLines.push({ text: "PINGING LAUNCH_NODE-9... BYTES=64 TIME=12ms TTL=64", type: "success" });
    } else {
      newLines.push({ text: `COMMAND NOT RECOGNIZED: "${inputVal}". ENTER "help" FOR UTILITIES.`, type: "error" });
    }

    setLines(newLines);
    setInputVal("");
  };

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [lines]);

  return (
    <div
      className={cn(
        "relative w-full max-w-xl h-80 rounded-xl bg-black border-2 border-green-500/30 overflow-hidden font-mono text-[11px] text-green-400 p-4 shadow-[0_0_25px_rgba(34,197,94,0.15)] flex flex-col select-none",
        className
      )}
    >
      {/* CRT Scanline and Flicker Overlays */}
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[size:100%_4px,3px_100%] z-20" />
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0)_60%,rgba(0,0,0,0.4)_100%)] z-15" />
      <div className="absolute top-0 left-0 w-full h-1 bg-green-500/10 pointer-events-none animate-scan z-25" />

      {/* Terminal Title Bar */}
      <div className="flex items-center justify-between border-b border-green-500/20 pb-2 mb-2 shrink-0">
        <span className="flex items-center gap-1.5 font-bold tracking-wider text-green-500 select-none">
          <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
          {title}
        </span>
        <span className="text-[10px] text-green-500/60 font-semibold select-none">ONLINE</span>
      </div>

      {/* Output Console Log */}
      <div
        ref={containerRef}
        className="flex-1 overflow-y-auto pr-1 flex flex-col gap-1.5 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-green-500/30"
      >
        <AnimatePresence>
          {lines.map((line, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -5 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.15 }}
              className={cn(
                line.type === "error" && "text-red-500 shadow-[0_0_10px_rgba(239,68,68,0.1)]",
                line.type === "success" && "text-emerald-400 font-bold",
                line.type === "system" && "text-cyan-400 font-bold",
                line.type === "input" && "text-green-300"
              )}
            >
              {line.text}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Shell Interactive Typing Form */}
      <form onSubmit={handleCommand} className="flex items-center gap-1 border-t border-green-500/20 pt-2 shrink-0 select-text">
        <span className="text-green-500 font-bold">$</span>
        <input
          type="text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          placeholder='Enter utility (e.g. "help", "hack")...'
          className="flex-1 bg-transparent border-none outline-none text-green-300 font-mono text-[11px] placeholder-green-600/50 caret-green-500"

        />
      </form>
    </div>
  );
}

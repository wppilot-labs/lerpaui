"use client";

import React, { useState, useRef } from "react";
import { ShieldCheck, RefreshCw } from "lucide-react";
import { cn } from "../lib/cn";

interface Dot {
  id: number;
  x: number;
  y: number;
}

export function SecurityGesturePattern({ className }: { className?: string }) {
  const dots: Dot[] = [
    { id: 1, x: 50, y: 50 }, { id: 2, x: 130, y: 50 }, { id: 3, x: 210, y: 50 },
    { id: 4, x: 50, y: 130 }, { id: 5, x: 130, y: 130 }, { id: 6, x: 210, y: 130 },
    { id: 7, x: 50, y: 210 }, { id: 8, x: 130, y: 210 }, { id: 9, x: 210, y: 210 },
  ];

  const [pattern, setPattern] = useState<number[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [mousePos, setMousePos] = useState<{ x: number; y: number } | null>(null);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  const containerRef = useRef<HTMLDivElement>(null);

  const handlePointerDown = (e: React.PointerEvent) => {
    if (status !== "idle") return;
    setIsDrawing(true);
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Check if clicked close to a dot
    const clickedDot = dots.find(dot => Math.hypot(dot.x - x, dot.y - y) < 20);
    if (clickedDot) {
      setPattern([clickedDot.id]);
    }
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDrawing) return;
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setMousePos({ x, y });

    const hoveringDot = dots.find(dot => Math.hypot(dot.x - x, dot.y - y) < 20);
    if (hoveringDot && !pattern.includes(hoveringDot.id)) {
      setPattern([...pattern, hoveringDot.id]);
    }
  };

  const handlePointerUp = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    setMousePos(null);

    // Validate simple pattern length or pattern shape (e.g. L-shape 1->4->7->8->9)
    if (pattern.length >= 4) {
      setStatus("success");
    } else if (pattern.length > 0) {
      setStatus("error");
      setTimeout(() => {
        setPattern([]);
        setStatus("idle");
      }, 1000);
    }
  };

  const handleReset = () => {
    setPattern([]);
    setStatus("idle");
  };

  return (
    <div className={cn("w-full max-w-[310px] rounded-2xl border border-border/80 bg-card/40 p-5 backdrop-blur-xl shadow-2xl flex flex-col items-center", className)}>
      <div className="w-full mb-3 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-foreground">Pattern Lock</h3>
          <p className="text-[10px] text-muted-foreground">Touch-and-drag grid gesture</p>
        </div>
        {status === "success" && (
          <button
            onClick={handleReset}
            className="p-1 hover:bg-zinc-800 border border-border/30 rounded text-muted-foreground hover:text-foreground transition-all cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      <div
        ref={containerRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        className="relative w-[260px] h-[260px] bg-zinc-950/60 border border-border/40 rounded-xl cursor-crosshair overflow-hidden touch-none"
      >
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          {/* Active pattern connections */}
          {pattern.map((dotId, idx) => {
            if (idx === 0) return null;
            const prevDot = dots.find(d => d.id === pattern[idx - 1]);
            const currDot = dots.find(d => d.id === dotId);
            if (!prevDot || !currDot) return null;

            return (
              <line
                key={idx}
                x1={prevDot.x}
                y1={prevDot.y}
                x2={currDot.x}
                y2={currDot.y}
                className={cn(
                  "stroke-[3] transition-colors duration-150",
                  status === "success" && "stroke-emerald-400",
                  status === "error" && "stroke-rose-500",
                  status === "idle" && "stroke-primary"
                )}
              />
            );
          })}

          {/* Line to current cursor position */}
          {isDrawing && pattern.length > 0 && mousePos && (
            <line
              x1={dots.find(d => d.id === pattern[pattern.length - 1])?.x}
              y1={dots.find(d => d.id === pattern[pattern.length - 1])?.y}
              x2={mousePos.x}
              y2={mousePos.y}
              className="stroke-primary/50 stroke-[2] stroke-dasharray-[4]"
            />
          )}
        </svg>

        {/* The 9 Grid Dots */}
        {dots.map((dot) => {
          const isActive = pattern.includes(dot.id);
          return (
            <div
              key={dot.id}
              style={{ left: dot.x - 12, top: dot.y - 12 }}
              className="absolute w-6 h-6 flex items-center justify-center pointer-events-none"
            >
              <div
                className={cn(
                  "w-3 h-3 rounded-full border border-border bg-zinc-900 transition-all duration-150",
                  isActive && "w-4.5 h-4.5",
                  isActive && status === "success" && "bg-emerald-400 border-emerald-300 shadow-[0_0_8px_var(--color-emerald-400)]",
                  isActive && status === "error" && "bg-rose-500 border-rose-400 shadow-[0_0_8px_var(--color-rose-500)]",
                  isActive && status === "idle" && "bg-primary border-primary/50 shadow-[0_0_8px_var(--color-primary)]"
                )}
              />
            </div>
          );
        })}
      </div>

      <div className="w-full mt-3 flex items-center justify-center text-[10px] font-bold">
        {status === "idle" && <span className="text-muted-foreground uppercase tracking-widest">Draw 4+ connected dots</span>}
        {status === "success" && <span className="text-emerald-400 uppercase tracking-widest flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5" /> Pattern Accepted</span>}
        {status === "error" && <span className="text-rose-400 uppercase tracking-widest">Too Short, Retry</span>}
      </div>
    </div>
  );
}

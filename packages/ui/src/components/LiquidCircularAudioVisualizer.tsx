"use client";

import React, { useState, useEffect } from "react";
import { motion} from "framer-motion";
import { Play, Pause } from "lucide-react";
import { cn } from "../lib/cn";

interface LiquidCircularAudioVisualizerProps {
  className?: string;
}

export function LiquidCircularAudioVisualizer({ className }: LiquidCircularAudioVisualizerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [bars, setBars] = useState<number[]>(Array(24).fill(10));

  // Simulate dynamic sound frequencies when playing
  useEffect(() => {
    if (!isPlaying) {
      setBars(Array(24).fill(10));
      return;
    }

    const interval = setInterval(() => {
      setBars(Array.from({ length: 24 }, () => Math.floor(Math.random() * 25) + 6));
    }, 120);

    return () => clearInterval(interval);
  }, [isPlaying]);

  return (
    <div
      className={cn(
        "relative flex flex-col items-center justify-between border border-white/5 bg-zinc-950/40 rounded-2xl p-6 shadow-2xl overflow-hidden select-none",
        className
      )}
      style={{ width: 340, height: 280 }}
    >
      <div className="absolute top-4 left-4 flex flex-col gap-1 font-mono select-none">
        <span className="text-[9px] uppercase tracking-widest font-bold text-primary">AUDIO_VISUALIZER</span>
        <span className="text-[8px] text-white/40 uppercase font-semibold">Click play to trigger frequency pulse</span>
      </div>

      {/* Visualizer Circle Dial */}
      <div className="relative w-36 h-36 flex items-center justify-center mt-6">
        {/* Core button dial */}
        <motion.button
          onClick={() => setIsPlaying(!isPlaying)}
          className={cn(
            "z-20 h-14 w-14 rounded-full bg-primary text-white flex items-center justify-center cursor-pointer border border-white/20 relative"
          )}
          style={{ boxShadow: "0 0 20px rgba(var(--primary-rgb), 0.3)" }}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
        >
          {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
        </motion.button>

        {/* Concentric Rotating Waveform Bars */}
        <motion.div
          animate={{ rotate: isPlaying ? 360 : 0 }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 w-full h-full flex items-center justify-center z-10 pointer-events-none"
        >
          {bars.map((height, idx) => {
            const angle = (idx * 360) / bars.length;

            return (
              <div
                key={idx}
                className="absolute origin-bottom"
                style={{
                  transform: `rotate(${angle}deg) translateY(-54px)`,
                  height: `${height}px`,
                  width: "2.5px",
                }}
              >
                <div
                  className="w-full h-full bg-primary/70 rounded-full"
                  style={{ boxShadow: "0 0 8px rgba(var(--primary-rgb), 0.5)" }}
                />
              </div>
            );
          })}
        </motion.div>
      </div>

      <div className="text-[8px] font-mono text-white/30 uppercase tracking-widest mt-auto select-none">
        BEAT_SYNCHRONIZER // CONNECTED
      </div>
    </div>
  );
}

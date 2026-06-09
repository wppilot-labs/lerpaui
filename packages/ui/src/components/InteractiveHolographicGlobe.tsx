"use client";

import React, { useState } from "react";
import { motion} from "framer-motion";
import { cn } from "../lib/cn";

interface GlobeNode {
  id: string;
  name: string;
  lat: number; // Y coordinate relative
  lng: number; // X coordinate relative
  stat: string;
}

interface InteractiveHolographicGlobeProps {
  className?: string;
  nodes?: GlobeNode[];
}

export function InteractiveHolographicGlobe({
  className,
  nodes = [
    { id: "node-ny", name: "US East (New York)", lat: 80, lng: 110, stat: "Latency: 8ms" },
    { id: "node-ldn", name: "Europe (London)", lat: 60, lng: 180, stat: "Latency: 14ms" },
    { id: "node-tky", name: "Asia Pacific (Tokyo)", lat: 100, lng: 280, stat: "Latency: 28ms" },
  ],
}: InteractiveHolographicGlobeProps) {
  const [activeNode, setActiveNode] = useState<GlobeNode | null>(null);

  return (
    <div
      className={cn(
        "relative flex flex-col items-center justify-center border border-white/5 bg-zinc-950/40 rounded-2xl p-6 shadow-2xl select-none",
        className
      )}
      style={{ width: 340, height: 340 }}
    >
      <div className="absolute top-4 left-4 flex flex-col gap-1 z-15 font-mono select-none">
        <span className="text-[9px] uppercase tracking-widest font-bold text-primary">HOLO_GLOBE</span>
        <span className="text-xs text-white font-bold">Lerpa UI Global Nodes</span>
      </div>

      {/* SVG Vector 3D Globe representation */}
      <div className="relative w-64 h-64 flex items-center justify-center">
        {/* Outer orbital rings */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute w-full h-full rounded-full border border-dashed border-white/5"
        />

        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute w-[80%] h-[80%] rounded-full border border-dashed border-primary/10"
        />

        {/* Core sphere */}
        <div
          className="w-[180px] h-[180px] rounded-full bg-gradient-to-br from-primary/10 via-zinc-950 to-neutral-900 border border-white/10 flex items-center justify-center relative overflow-hidden"
          style={{ boxShadow: "0 0 35px rgba(var(--primary-rgb), 0.05)" }}
        >
          {/* Inner mesh lines */}
          <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.02)_1.5px,transparent_1.5px)] bg-[size:12px_12px]" />

          {/* Coordinate Beacons */}
          {nodes.map((node) => (
            <div
              key={node.id}
              style={{
                position: "absolute",
                top: node.lat,
                left: node.lng - 60, // Aligning inside bounds
              }}
              onMouseEnter={() => setActiveNode(node)}
              onMouseLeave={() => setActiveNode(null)}
              className="cursor-pointer group z-10"
            >
              {/* Pulse waves */}
              <span className="absolute inline-flex h-3 w-3 rounded-full bg-primary opacity-75 animate-ping" />
              <span
                className="relative inline-flex rounded-full h-3 w-3 bg-primary border border-white/20 transition-transform duration-200 group-hover:scale-125"
                style={{ boxShadow: "0 0 10px rgba(var(--primary-rgb), 0.5)" }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Tooltip Overlay displaying active node details */}
      <div className="absolute bottom-4 left-4 right-4 h-12 bg-black/60 border border-white/10 rounded-xl px-3 flex items-center justify-between z-20 backdrop-blur-md">
        {activeNode ? (
          <>
            <div className="flex flex-col font-mono select-none">
              <span className="text-[10px] font-bold text-white leading-none">{activeNode.name}</span>
              <span className="text-[8px] text-primary/80 font-semibold mt-1 leading-none">{activeNode.stat}</span>
            </div>
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
          </>
        ) : (
          <span className="text-[8px] font-mono text-white/30 uppercase tracking-wider mx-auto select-none">
            HOVER OVER GLOBE BEACONS TO QUERY
          </span>
        )}
      </div>
    </div>
  );
}

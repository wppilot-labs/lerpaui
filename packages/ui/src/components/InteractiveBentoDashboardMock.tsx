"use client";

import React, { useState } from "react";
import { motion} from "framer-motion";
import { Cpu, Terminal, Layers, Heart } from "lucide-react";
import { cn } from "../lib/cn";

interface DashboardTile {
  id: string;
  title: string;
  icon: React.ReactNode;
  content: React.ReactNode;
  colSpan: string;
}

export function InteractiveBentoDashboardMock() {
  const [_activeMetric, _setActiveMetric] = useState("Alpha");

  const tiles: DashboardTile[] = [
    {
      id: "cpu",
      title: "Core CPU Utilization",
      icon: <Cpu className="w-4 h-4 text-purple-400" />,
      content: (
        <div className="flex items-end justify-between h-12 w-full gap-1 pt-2">
          {[40, 75, 55, 90, 65, 80, 95].map((h, i) => (
            <motion.div
              key={i}
              className="bg-purple-500/80 rounded-t w-full"
              initial={{ height: 0 }}
              animate={{ height: `${h}%` }}
              transition={{ delay: i * 0.05, type: "spring", stiffness: 100 }}
            />
          ))}
        </div>
      ),
      colSpan: "col-span-2",
    },
    {
      id: "terminal",
      title: "Active Streams",
      icon: <Terminal className="w-4 h-4 text-cyan-400" />,
      content: (
        <div className="font-mono text-[9px] text-cyan-400/80 mt-1 flex flex-col gap-0.5">
          <span>$ handshake -ok 1ms</span>
          <span>$ packet_sync: ready</span>
        </div>
      ),
      colSpan: "col-span-1",
    },
    {
      id: "layers",
      title: "Integration Nodes",
      icon: <Layers className="w-4 h-4 text-emerald-400" />,
      content: (
        <div className="flex items-center justify-between mt-2 select-none">
          <span className="text-xl font-extrabold text-white tracking-tighter">14 Nodes</span>
          <span className="text-[8px] bg-emerald-500/20 text-emerald-400 font-bold px-2 py-0.5 rounded-full animate-pulse">SYNCED</span>
        </div>
      ),
      colSpan: "col-span-1",
    },
    {
      id: "vault",
      title: "Global Node Registry",
      icon: <Heart className="w-4 h-4 text-rose-400" />,
      content: (
        <div className="flex flex-col gap-1.5 mt-1.5 select-none">
          <div className="flex items-center justify-between text-[9px] text-white/50">
            <span>Primary Cluster</span>
            <span className="text-white font-bold">Secure</span>
          </div>
          <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
            <motion.div className="bg-rose-500 h-full w-[82%]" initial={{ width: 0 }} animate={{ width: "82%" }} />
          </div>
        </div>
      ),
      colSpan: "col-span-2",
    },
  ];

  return (
    <div className="relative w-full max-w-xl border border-white/5 bg-zinc-950/40 rounded-2xl p-6 shadow-2xl overflow-hidden select-none">
      <div className="flex items-center justify-between mb-4 font-mono select-none">
        <div className="flex flex-col gap-1">
          <span className="text-[9px] uppercase tracking-widest font-bold text-primary">BENTO_DASHBOARD</span>
          <span className="text-xs text-white font-bold">Interactive System Compositor</span>
        </div>
        <span className="text-[9px] text-white/40 uppercase tracking-wide">DRAG TO REORGANIZE</span>
      </div>

      {/* Bento Grid */}
      <div className="grid grid-cols-3 gap-3">
        {tiles.map((tile) => (
          <motion.div
            key={tile.id}
            drag
            dragConstraints={{ top: 0, bottom: 0, left: 0, right: 0 }}
            dragElastic={0.1}
            whileDrag={{ scale: 1.03, zIndex: 10 }}
            whileHover={{ scale: 1.01 }}
            className={cn(
              "rounded-xl border border-white/10 bg-black/50 p-4 flex flex-col justify-between cursor-grab active:cursor-grabbing shadow-lg relative min-h-[110px]",
              tile.colSpan
            )}
          >
            {/* Header info */}
            <div className="flex items-center justify-between border-b border-white/5 pb-2 mb-1.5 select-none">
              <span className="text-[9px] font-bold text-white/60 uppercase tracking-wider truncate max-w-[100px]">{tile.title}</span>
              {tile.icon}
            </div>

            {/* Main content slot */}
            <div className="flex-1 flex flex-col justify-center">{tile.content}</div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

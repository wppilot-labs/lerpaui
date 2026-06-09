"use client";

import React, { useRef } from "react";
import { motion} from "framer-motion";
import { cn } from "../lib/cn";

interface GridItem {
  id: string;
  title: string;
  category: string;
  color: string;
}

interface SpringyPhysicsGridProps {
  items?: GridItem[];
  className?: string;
}

export function SpringyPhysicsGrid({
  items = [
    { id: "item-1", title: "Node Alpha", category: "Core Suite", color: "from-purple-500/20 to-indigo-500/20 text-purple-400" },
    { id: "item-2", title: "Delta Spark", category: "AI Analytics", color: "from-emerald-500/20 to-teal-500/20 text-emerald-400" },
    { id: "item-3", title: "Omega Core", category: "Secure Vault", color: "from-rose-500/20 to-pink-500/20 text-rose-400" },
    { id: "item-4", title: "Vector Log", category: "Routing Gate", color: "from-amber-500/20 to-orange-500/20 text-amber-400" },
  ],
  className,
}: SpringyPhysicsGridProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative w-full max-w-2xl min-h-[300px] border border-white/5 bg-zinc-950/30 rounded-2xl p-6 overflow-hidden flex flex-wrap gap-4 items-center justify-center select-none",
        className
      )}
    >
      {/* Background visual structural dots */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(rgba(255,255,255,0.03)_1.5px,transparent_1.5px)] bg-[size:16px_16px]" />

      {items.map((item) => (
        <motion.div
          key={item.id}
          drag
          dragConstraints={containerRef}
          dragElastic={0.2}
          dragTransition={{ bounceStiffness: 400, bounceDamping: 20 }}
          whileDrag={{ scale: 1.1, zIndex: 10 }}
          whileHover={{ scale: 1.05 }}
          className={cn(
            "w-44 h-32 rounded-xl bg-gradient-to-br border border-white/10 p-4 flex flex-col justify-between cursor-grab active:cursor-grabbing shadow-lg relative select-none",
            item.color
          )}
        >
          <div className="flex flex-col gap-1">
            <span className="text-[9px] uppercase tracking-wider font-semibold opacity-60 font-mono">
              {item.category}
            </span>
            <h4 className="text-sm font-bold tracking-tight text-white">
              {item.title}
            </h4>
          </div>

          <div className="flex items-center justify-between border-t border-white/5 pt-2 mt-2">
            <span className="text-[8px] font-mono opacity-50">DRAG ME</span>
            <span className="h-1.5 w-1.5 rounded-full bg-current animate-pulse" />
          </div>
        </motion.div>
      ))}
    </div>
  );
}

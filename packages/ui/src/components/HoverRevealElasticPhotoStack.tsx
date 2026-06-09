"use client";

import React, { useState } from "react";
import { motion} from "framer-motion";
import { cn } from "../lib/cn";

interface PhotoItem {
  id: number;
  color: string;
  label: string;
  tag: string;
}

interface HoverRevealElasticPhotoStackProps {
  className?: string;
  photos?: PhotoItem[];
}

export function HoverRevealElasticPhotoStack({
  className,
  photos = [
    { id: 1, color: "from-purple-600/50 to-indigo-700/50 text-purple-200", label: "Artificial Intelligence Core", tag: "AI SYSTEM" },
    { id: 2, color: "from-emerald-600/50 to-teal-700/50 text-emerald-200", label: "Distributed Analytics Engine", tag: "ANALYTICS" },
    { id: 3, color: "from-rose-600/50 to-pink-700/50 text-rose-200", label: "Secure Data Crypt Vault", tag: "VAULT OS" },
  ],
}: HoverRevealElasticPhotoStackProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        "relative flex flex-col items-center justify-center border border-white/5 bg-zinc-950/40 rounded-2xl p-6 shadow-2xl overflow-hidden cursor-pointer select-none",
        className
      )}
      style={{ width: 340, height: 350 }}
    >
      <div className="absolute top-4 left-4 flex flex-col gap-1 font-mono select-none">
        <span className="text-[9px] uppercase tracking-widest font-bold text-primary">PHOTO_STACK</span>
        <span className="text-[8px] text-white/40 uppercase font-semibold">Hover to fan out oblique previews</span>
      </div>

      {/* Oblique Photo Stack Row */}
      <div className="relative w-full h-48 flex items-center justify-center mt-6">
        {photos.map((item, idx) => {
          // Offsets when not hovered vs fanned out when hovered
          const rotationAngle = isHovered ? (idx - 1) * 12 : (idx - 1) * 4;
          const xOffset = isHovered ? (idx - 1) * 54 : 0;
          const yOffset = isHovered ? -15 : idx * 6;

          return (
            <motion.div
              key={item.id}
              animate={{
                rotate: rotationAngle,
                x: xOffset,
                y: yOffset,
                scale: isHovered && idx === 1 ? 1.05 : 0.95,
              }}
              transition={{ type: "spring", stiffness: 220, damping: 18 }}
              className={cn(
                "absolute w-40 h-44 rounded-2xl bg-gradient-to-br border border-white/10 p-4 flex flex-col justify-between shadow-2xl select-none transform",
                item.color
              )}
              style={{ zIndex: 10 + idx }}
            >
              <span className="text-[8px] font-mono font-bold uppercase tracking-wider bg-black/40 px-2 py-0.5 rounded-full self-start">
                {item.tag}
              </span>
              
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-sans font-bold leading-tight">
                  {item.label}
                </span>
                <span className="text-[7px] font-mono text-white/55">LAUNCH_NODE_0{item.id}</span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

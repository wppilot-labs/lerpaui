"use client";

import React from 'react';
import { motion, useSpring, useMotionValue} from "framer-motion";
import { cn } from '../lib/cn';

export interface MagneticTile {
  title: string;
  /** Status label shown in the bottom-right. */
  status?: string;
}

export interface MagneticGridTilesProps {
  className?: string;
  /** Tiles rendered in a 2x2 grid (uses default labels when omitted). */
  tiles?: MagneticTile[];
  /** Header label. */
  label?: string;
  /** Footer label. */
  footer?: string;
}

const DEFAULT_TILES: MagneticTile[] = [
  { title: "Tile 1", status: "Active" },
  { title: "Tile 2", status: "Active" },
  { title: "Tile 3", status: "Active" },
  { title: "Tile 4", status: "Active" },
];

export const MagneticGridTiles: React.FC<MagneticGridTilesProps> = ({
  className,
  tiles = DEFAULT_TILES,
  label = "Magnetic Tiles",
  footer = "Hover pointer to trigger magnetic tilt",
}) => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springX = useSpring(mouseX, { stiffness: 250, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 250, damping: 20 });

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left - rect.width / 2);
    mouseY.set(e.clientY - rect.top - rect.height / 2);
  };

  const handlePointerLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <div 
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className={cn('relative w-full max-w-[320px] h-[340px] bg-secondary/5 rounded-2xl border border-border flex flex-col justify-between p-4 select-none overflow-hidden touch-x', className)}
    >
      <span className="text-[9px] text-muted-foreground font-black uppercase tracking-widest text-center">{label}</span>

      <div className="grid grid-cols-2 gap-3 w-full mt-2">
        {tiles.map((tile, idx) => {
          // Dynamic coordinates mathematical magnetic tilts
          return (
            <motion.div
              key={idx}
              style={{
                x: springX,
                y: springY,
                rotateX: springY,
                rotateY: springX,
                transformStyle: 'preserve-3d',
              }}
              className="h-20 rounded-xl border border-border/80 bg-card p-3 flex flex-col justify-between shadow-sm cursor-pointer hover:border-primary/20 transition-all duration-200"
            >
              <h5 className="text-[9px] font-black text-foreground leading-none">{tile.title}</h5>
              <div className="w-full flex items-center justify-between">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                <span className="text-[7.5px] font-black text-muted-foreground/60 uppercase tracking-widest">{tile.status ?? "Active"}</span>
              </div>
            </motion.div>
          );
        })}
      </div>

      <span className="text-[8px] text-muted-foreground font-extrabold uppercase tracking-wide text-center">{footer}</span>
    </div>
  );
};

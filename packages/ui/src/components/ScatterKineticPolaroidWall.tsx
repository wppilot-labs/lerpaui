'use client';

import React, { useState } from 'react';
import { motion} from "framer-motion";
import { RefreshCw, Camera } from 'lucide-react';
import { cn } from '../lib/cn';

export interface PolaroidPhoto {
  id: number;
  title: string;
  /** Tailwind background + border classes for the polaroid frame. */
  bg: string;
  rotate: number;
  x: number;
  y: number;
  z: number;
}

export interface ScatterKineticPolaroidWallProps {
  className?: string;
  /** Polaroid photos. */
  photos?: PolaroidPhoto[];
  /** Header label. */
  label?: string;
}

const DEFAULT_PHOTOS: PolaroidPhoto[] = [
  { id: 1, title: "Studio One", bg: "bg-purple-900/40 border-purple-500/20", rotate: -8, x: -30, y: -20, z: 1 },
  { id: 2, title: "Field Shot", bg: "bg-blue-900/40 border-blue-500/20", rotate: 6, x: 25, y: -30, z: 2 },
  { id: 3, title: "Golden Hour", bg: "bg-emerald-900/40 border-emerald-500/20", rotate: -4, x: -10, y: 15, z: 3 }
];

export const ScatterKineticPolaroidWall: React.FC<ScatterKineticPolaroidWallProps> = ({
  className,
  photos: initialPhotos = DEFAULT_PHOTOS,
  label = "Scatter Polaroid Wall",
}) => {
  const [photos, setPhotos] = useState(initialPhotos);
  const [topIdx, setTopIdx] = useState(initialPhotos.length + 1);

  const resetScatter = () => {
    setPhotos(initialPhotos);
    setTopIdx(initialPhotos.length + 1);
  };

  const handlePress = (id: number) => {
    setPhotos(prev => prev.map(p => {
      if (p.id === id) {
        setTopIdx(prev => prev + 1);
        return { ...p, rotate: 0, z: topIdx };
      }
      return p;
    }));
  };

  return (
    <div className={cn('relative w-full max-w-[320px] h-[340px] bg-secondary/5 rounded-3xl border border-border flex flex-col justify-between p-5 overflow-hidden select-none', className)}>
      <div className="flex justify-between items-center w-full z-10">
        <span className="text-[9px] text-muted-foreground font-black tracking-widest uppercase">{label}</span>
        <button
          type="button"
          onClick={resetScatter}
          className="p-1 rounded-lg border border-border bg-card text-muted-foreground hover:bg-secondary/40 transition-all active:scale-95 flex items-center gap-1"
        >
          <RefreshCw className="w-3 h-3" />
          <span className="text-[8px] font-black uppercase tracking-wider">Reset</span>
        </button>
      </div>

      <div className="relative w-full h-[180px] overflow-visible my-auto flex items-center justify-center z-0">
        {photos.map(p => (
          <motion.div
            key={p.id}
            drag
            dragConstraints={{ left: -100, right: 100, top: -60, bottom: 60 }}
            style={{
              x: p.x,
              y: p.y,
              rotate: p.rotate,
              zIndex: p.z
            }}
            onPointerDown={() => handlePress(p.id)}
            className={cn('absolute w-24 h-28 border bg-card p-2 shadow-2xl flex flex-col justify-between cursor-grab active:cursor-grabbing rounded-lg', p.bg)}
          >
            <div className="w-full h-[65px] bg-secondary/40 rounded flex items-center justify-center border border-border/10 text-muted-foreground/60">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[7px] font-mono font-black text-foreground uppercase tracking-wide truncate block">{p.title}</span>
              <span className="text-[5px] text-muted-foreground/60 font-semibold block uppercase">Drag and stack</span>
            </div>
          </motion.div>
        ))}
      </div>

      <span className="text-[8px] text-muted-foreground font-extrabold uppercase tracking-wide text-center">Drag cards or tap to bring to front</span>
    </div>
  );
};

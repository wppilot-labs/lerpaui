"use client";

import React, { useRef, useState } from 'react';
import { motion} from "framer-motion";
import { Play, Volume2 } from 'lucide-react';
import { cn } from '../lib/cn';

export interface ParallaxVideoShowcaseProps {
  videoUrl?: string;
  className?: string;
}

export const ParallaxVideoShowcase: React.FC<ParallaxVideoShowcaseProps> = ({
  videoUrl = "https://assets.mixkit.co/videos/preview/mixkit-abstract-laser-lights-background-32120-large.mp4",
  className,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [offsets, setOffsets] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) / 6;
    const y = (e.clientY - rect.top - rect.height / 2) / 6;
    setOffsets({ x, y });
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setOffsets({ x: 0, y: 0 })}
      className={cn('relative w-full max-w-[340px] h-48 border border-border/40 rounded-2xl overflow-hidden shadow-2xl bg-card select-none flex items-center justify-center cursor-pointer group', className)}
    >
      {/* Video Element with coordinate offsets */}
      <motion.div
        style={{
          x: -offsets.x,
          y: -offsets.y,
          scale: 1.15
        }}
        transition={{ type: 'spring', stiffness: 180, damping: 22 }}
        className="absolute inset-0 w-full h-full pointer-events-none"
      >
        <video 
          src={videoUrl}
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover filter brightness-90 group-hover:brightness-105 transition-all duration-300"
        />
      </motion.div>

      {/* Floating control interfaces overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent flex flex-col justify-between p-4">
        <div className="flex justify-between items-center w-full">
          <span className="text-[9px] text-white/80 font-black uppercase tracking-widest bg-black/40 px-2 py-0.5 rounded-full backdrop-blur-md">
            Parallax Video
          </span>
          <Volume2 className="w-4 h-4 text-white opacity-60 hover:opacity-100 transition-opacity" />
        </div>

        <div className="flex items-center gap-2 mt-auto">
          <div className="w-7 h-7 rounded-full bg-primary text-white flex items-center justify-center shrink-0 shadow-lg">
            <Play className="w-3.5 h-3.5 fill-white ml-0.5" />
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-[10px] text-white font-extrabold uppercase tracking-wide leading-none">Abstract Particles</span>
            <span className="text-[8px] text-white/50 uppercase font-semibold">Simulated interactive canvas layer</span>
          </div>
        </div>
      </div>
    </div>
  );
};

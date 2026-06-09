"use client";

import React, { useState, useRef } from 'react';
import { motion} from "framer-motion";
import { ZoomIn } from 'lucide-react';
import { cn } from '../lib/cn';

export interface ParallaxImageMagnifierProps {
  imageSrc?: string;
  className?: string;
}

export const ParallaxImageMagnifier: React.FC<ParallaxImageMagnifierProps> = ({
  imageSrc = "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=320",
  className,
}) => {
  const [hovered, setHovered] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  return (
    <div 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={cn('w-full max-w-[320px] aspect-[1.3] border border-border bg-card rounded-2xl overflow-hidden relative shadow-lg select-none cursor-zoom-in', className)}
    >
      {/* Background base image */}
      <img src={imageSrc} alt="Gallery Base" className="w-full h-full object-cover pointer-events-none" loading="lazy" decoding="async" />

      {/* Floating details overlay banner */}
      <div className="absolute bottom-3 left-3 bg-black/75 border border-white/10 px-2.5 py-1 rounded-xl text-[8px] font-extrabold uppercase tracking-widest text-white flex items-center gap-1">
        <ZoomIn className="w-3 h-3 text-primary animate-pulse" />
        Hover image to zoom details
      </div>

      {/* Loupe Lens */}
      {hovered && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          style={{
            top: mousePos.y - 45,
            left: mousePos.x - 45,
          }}
          className="absolute w-24 h-24 rounded-full border border-primary bg-card/90 shadow-2xl backdrop-blur-[2px] pointer-events-none overflow-hidden"
        >
          {/* Magnified inner image shifting counter coordinates */}
          <div 
            className="w-[320px] h-[240px] absolute"
            style={{
              top: -(mousePos.y * 1.5 - 45) + "px",
              left: -(mousePos.x * 1.5 - 45) + "px",
            }}
          >
            <img src={imageSrc} alt="Magnified View" className="w-full h-full object-cover" loading="lazy" decoding="async" />
          </div>
        </motion.div>
      )}
    </div>
  );
};

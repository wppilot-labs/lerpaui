'use client';

import React, { useState, useRef } from 'react';
import { motion, useSpring} from "framer-motion";
import { Sparkles, Shield, Cpu, Zap } from 'lucide-react';
import { cn } from '../lib/cn';

interface HolographicFoilCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  subtitle?: string;
  serialNumber?: string;
  imageUrl?: string;
  rarity?: 'common' | 'rare' | 'epic' | 'legendary';
  glowColor?: string;
  metadata?: Array<{ label: string; value: string | number }>;
}

export function HolographicFoilCard({
  title = 'AETHERIS SUPREME',
  subtitle = 'GENESIS FOUNDER',
  serialNumber = '#0001 / 9999',
  imageUrl,
  rarity = 'legendary',
  glowColor = 'rgba(168, 85, 247, 0.4)', // Purple default
  metadata = [
    { label: 'POWER', value: '98' },
    { label: 'SPEED', value: '95' },
    { label: 'INTELLIGENCE', value: '99' },
  ],
  className: _className,
  ...props
}: HolographicFoilCardProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);
  
  // Sheen and reflection coordinates
  const [shine, setShine] = useState({ x: 50, y: 50, rotate: 0 });

  const springConfig = { damping: 25, stiffness: 180, mass: 0.5 };
  const rotateX = useSpring(0, springConfig);
  const rotateY = useSpring(0, springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    // Normalised position: from -0.5 to 0.5
    const normX = (e.clientX - rect.left) / width - 0.5;
    const normY = (e.clientY - rect.top) / height - 0.5;

    const maxTilt = 18; // maximum tilt in degrees
    rotateX.set(-normY * maxTilt);
    rotateY.set(normX * maxTilt);

    // Percentage of cursor inside the card (0 to 100)
    const px = ((e.clientX - rect.left) / width) * 100;
    const py = ((e.clientY - rect.top) / height) * 100;
    
    // Virtual rotation angles for the conic and linear sheen based on mouse direction
    const rot = normX * 360;

    setShine({ x: px, y: py, rotate: rot });
    setHovered(true);
  };

  const handleMouseLeave = () => {
    setHovered(false);
    rotateX.set(0);
    rotateY.set(0);
    setShine({ x: 50, y: 50, rotate: 0 });
  };

  // Border/glowing colors based on rarity
  const rarityColors = {
    common: 'from-slate-400 to-slate-600',
    rare: 'from-blue-400 to-indigo-600',
    epic: 'from-fuchsia-400 to-purple-600',
    legendary: 'from-amber-400 via-rose-500 to-purple-600',
  };

  const badgeText = rarity.toUpperCase();

  // Cast props to any to bypass complex Framer Motion standard HTML event handler type conflicts
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const motionProps = props as any;

  return (
    <div
      className="relative flex items-center justify-center p-8 select-none"
      style={{ perspective: 1200 }}
    >
      <motion.div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
        }}
        className={cn(
          "relative w-[340px] h-[520px] rounded-3xl overflow-hidden cursor-pointer",
          "bg-zinc-950 border border-zinc-800 transition-shadow duration-300",
          hovered && "shadow-2xl border-white/10"
        )}
        {...motionProps}
      >
        {/* Glow behind card when hovered */}
        {hovered && (
          <div
            className="absolute inset-0 pointer-events-none -z-10 blur-3xl transition-opacity duration-300 opacity-60"
            style={{
              background: `radial-gradient(circle at ${shine.x}% ${shine.y}%, ${glowColor} 0%, rgba(0,0,0,0) 80%)`,
            }}
          />
        )}

        {/* Dynamic Holographic Foil Overlay */}
        <div
          className="absolute inset-0 pointer-events-none z-30 transition-opacity duration-300"
          style={{
            opacity: hovered ? 0.75 : 0,
            mixBlendMode: 'color-dodge',
            background: `
              radial-gradient(circle at ${shine.x}% ${shine.y}%, rgba(255, 255, 255, 0.45) 0%, rgba(255, 255, 255, 0) 55%),
              conic-gradient(from ${shine.rotate}deg at ${shine.x}% ${shine.y}%, 
                rgba(255, 0, 128, 0.25) 0%, 
                rgba(0, 220, 255, 0.25) 25%, 
                rgba(255, 230, 0, 0.25) 50%, 
                rgba(0, 255, 60, 0.25) 75%, 
                rgba(255, 0, 128, 0.25) 100%
              )
            `,
          }}
        />

        {/* Glass Reflection Glare */}
        <div
          className="absolute inset-0 pointer-events-none z-30 transition-opacity duration-300"
          style={{
            opacity: hovered ? 0.4 : 0,
            mixBlendMode: 'overlay',
            background: `linear-gradient(${135 + shine.rotate}deg, rgba(255,255,255,0) 20%, rgba(255,255,255,0.4) 45%, rgba(255,255,255,0.6) 50%, rgba(255,255,255,0.4) 55%, rgba(255,255,255,0) 80%)`,
          }}
        />

        {/* Card Content Outer Border (Neon Rarity Frame) */}
        <div className="absolute inset-2 rounded-[22px] border border-zinc-800 p-4 flex flex-col justify-between z-10 bg-zinc-950/70 backdrop-blur-sm">
          {/* Header */}
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[10px] font-bold font-mono tracking-widest text-zinc-500 uppercase">
                {subtitle}
              </span>
              <h3 className="text-lg font-black text-white tracking-wide mt-0.5 font-sans">
                {title}
              </h3>
            </div>
            
            <div className="flex items-center space-x-1.5 bg-zinc-900 border border-zinc-800 px-2 py-1 rounded-full">
              <Sparkles className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400/20" />
              <span className="text-[9px] font-black font-mono tracking-wider text-zinc-300">
                {badgeText}
              </span>
            </div>
          </div>

          {/* Hologram Card Image Container */}
          <div className="relative my-4 w-full h-[220px] rounded-xl overflow-hidden bg-zinc-900 border border-zinc-800 flex items-center justify-center">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-purple-950/30 to-zinc-950 flex flex-col items-center justify-center p-4">
                <div className="relative mb-2">
                  <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-amber-500 to-rose-500 blur opacity-40 animate-pulse" />
                  <div className="relative p-3 rounded-full bg-zinc-900 border border-zinc-800">
                    <Shield className="w-8 h-8 text-amber-400" />
                  </div>
                </div>
                <span className="text-[10px] font-bold tracking-widest text-zinc-400 font-mono mt-1">
                  SECURE SEC RECEPTACLE
                </span>
              </div>
            )}

            {/* Glowing corner anchors */}
            <div className="absolute top-2 left-2 w-1.5 h-1.5 rounded-full bg-white/20" />
            <div className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-white/20" />
            <div className="absolute bottom-2 left-2 w-1.5 h-1.5 rounded-full bg-white/20" />
            <div className="absolute bottom-2 right-2 w-1.5 h-1.5 rounded-full bg-white/20" />
          </div>

          {/* Card Footer / Stats */}
          <div className="space-y-4">
            {/* Metadata / Attributes */}
            <div className="grid grid-cols-3 gap-2">
              {metadata.map((item, index) => (
                <div
                  key={index}
                  className="bg-zinc-900/60 border border-zinc-800/80 rounded-lg p-2 text-center"
                >
                  <span className="block text-[8px] font-bold text-zinc-500 font-mono tracking-wider">
                    {item.label}
                  </span>
                  <span className="text-sm font-black text-white font-mono">
                    {item.value}
                  </span>
                </div>
              ))}
            </div>

            {/* Serial Number & Icons */}
            <div className="flex justify-between items-center border-t border-zinc-800/60 pt-3">
              <span className="text-[10px] font-bold font-mono text-zinc-500">
                {serialNumber}
              </span>
              <div className="flex space-x-2">
                <Cpu className="w-3.5 h-3.5 text-zinc-500" />
                <Zap className="w-3.5 h-3.5 text-zinc-500 animate-pulse" />
              </div>
            </div>
          </div>
        </div>

        {/* Outer glowing border */}
        <div
          className={cn(
            "absolute inset-0 rounded-3xl border-2 pointer-events-none z-20 transition-all opacity-40",
            rarityColors[rarity] ? `bg-gradient-to-r ${rarityColors[rarity]} bg-clip-border border-transparent` : 'border-zinc-800'
          )}
          style={{ mixBlendMode: 'screen' }}
        />
      </motion.div>
    </div>
  );
}

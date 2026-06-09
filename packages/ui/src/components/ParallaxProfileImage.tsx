'use client';

import React, { useCallback, useRef, useState } from 'react';
import { motion, useSpring, useMotionValue, useTransform} from "framer-motion";
import { Sparkles, Award, User } from 'lucide-react';
import { cn } from '../lib/cn';
import { usePrefersReducedMotion } from '../animation/hooks';

export interface ParallaxProfileImageProps {
  className?: string;
}

export const ParallaxProfileImage: React.FC<ParallaxProfileImageProps> = ({ className }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [_isHovered, setIsHovered] = useState(false);
  const prefersReducedMotion = usePrefersReducedMotion();

  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);

  const springRotateX = useSpring(rotateX, { stiffness: 100, damping: 15 });
  const springRotateY = useSpring(rotateY, { stiffness: 100, damping: 15 });

  // Contrasting parallax offset transforms
  const bgTranslateX = useTransform(springRotateY, [-15, 15], [-12, 12]);
  const bgTranslateY = useTransform(springRotateX, [-15, 15], [12, -12]);

  const handlePointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (prefersReducedMotion || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    rotateX.set(-y / 6);
    rotateY.set(x / 6);
  }, [prefersReducedMotion, rotateX, rotateY]);

  const handlePointerEnter = useCallback(() => setIsHovered(true), []);

  const handlePointerLeave = useCallback(() => {
    rotateX.set(0);
    rotateY.set(0);
    setIsHovered(false);
  }, [rotateX, rotateY]);

  return (
    <div className={cn('relative w-full max-w-[320px] h-[340px] bg-secondary/5 rounded-3xl border border-border flex flex-col justify-between p-5 overflow-hidden select-none', className)}>
      <span className="text-[9px] text-muted-foreground font-black tracking-widest uppercase">Parallax Profile Card</span>

      <motion.div
        ref={containerRef}
        onPointerMove={handlePointerMove}
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
        style={prefersReducedMotion ? undefined : { rotateX: springRotateX, rotateY: springRotateY, transformStyle: "preserve-3d", willChange: 'transform' }}
        className="relative w-full h-[180px] my-auto cursor-crosshair border border-border rounded-2xl bg-card shadow-xl p-4 flex flex-col justify-between overflow-hidden bg-gradient-to-tr from-card to-secondary/20 group [perspective:800px]"
      >
        {/* Parallax moving background overlay */}
        <motion.div 
          style={{ x: bgTranslateX, y: bgTranslateY, transformStyle: "preserve-3d" }}
          className="absolute -inset-4 pointer-events-none opacity-20 bg-[radial-gradient(circle_at_center,rgba(139,92,246,0.3)_0%,transparent_70%)] z-0"
        />

        <div className="flex justify-between items-start w-full z-10" style={{ transform: "translateZ(30px)" }}>
          <div className="w-8 h-8 rounded-full border border-primary/20 flex items-center justify-center bg-primary/10">
            <User className="w-4 h-4 text-primary" />
          </div>
          <span className="text-[8px] font-mono tracking-widest bg-white/5 px-2 py-0.5 rounded border border-border/40 uppercase">ENGINEER</span>
        </div>

        <div className="flex flex-col z-10" style={{ transform: "translateZ(45px)" }}>
          <span className="text-[7.5px] font-mono tracking-widest text-primary uppercase font-bold">INFRASTRUCTURE</span>
          <h4 className="text-xs font-black tracking-wide text-foreground uppercase mt-0.5">Team Member</h4>
          <p className="text-[9px] text-muted-foreground leading-relaxed mt-1">
            Designs modular analytics backdrops shifting at contrasting speeds.
          </p>
        </div>

        <div className="flex items-center justify-between border-t border-border/20 pt-2 mt-1 z-10" style={{ transform: "translateZ(30px)" }}>
          <div className="flex items-center gap-1.5">
            <Award className="w-3.5 h-3.5 text-muted-foreground" />
            <span className="text-[7.5px] font-mono text-muted-foreground">member@example.com</span>
          </div>
          <Sparkles className="w-3.5 h-3.5 text-primary opacity-80" />
        </div>
      </motion.div>

      <span className="text-[8px] text-muted-foreground font-extrabold uppercase tracking-wide text-center">Tilt card to trigger deep parallax overlays</span>
    </div>
  );
};

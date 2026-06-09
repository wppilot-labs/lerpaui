'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence} from "framer-motion";
import { Plus, Settings, Shield, User, MessageSquare, Zap } from 'lucide-react';
import { cn } from '../lib/cn';
import { usePrefersReducedMotion } from '../animation/hooks';

export interface BubbleNavItem {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
  color?: string;
}

interface BottomActionBubbleNavProps extends React.HTMLAttributes<HTMLDivElement> {
  actions?: BubbleNavItem[];
  radius?: number;
  glowColor?: string;
}

const DEFAULT_ACTIONS: BubbleNavItem[] = [
  { icon: <Zap className="w-4 h-4" />, label: 'Boost', color: 'bg-amber-500' },
  { icon: <User className="w-4 h-4" />, label: 'Profile', color: 'bg-blue-500' },
  { icon: <MessageSquare className="w-4 h-4" />, label: 'Chat', color: 'bg-emerald-500' },
  { icon: <Shield className="w-4 h-4" />, label: 'Security', color: 'bg-indigo-500' },
  { icon: <Settings className="w-4 h-4" />, label: 'Settings', color: 'bg-purple-500' },
];

export function BottomActionBubbleNav({
  actions = DEFAULT_ACTIONS,
  radius = 90,
  glowColor = 'rgba(168, 85, 247, 0.4)', // Purple glow
  className,
  ...props
}: BottomActionBubbleNavProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  // Close when clicking outside
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const total = actions.length;

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative flex flex-col items-center justify-center p-12 min-h-[220px] bg-zinc-950/60 border border-zinc-800 rounded-3xl overflow-visible",
        className
      )}
      {...props}
    >
      <div className="absolute inset-0 bg-radial-gradient from-purple-500/5 to-transparent pointer-events-none rounded-3xl" />

      {/* Roster description helper for visual testing */}
      <span className="text-[10px] font-bold font-mono tracking-widest text-zinc-500 uppercase absolute top-4">
        TAP FLOATING FAB TO EXPAND ACTION BUBBLES
      </span>

      {/* Main Expanded Radial Menu */}
      <div className="relative flex items-center justify-center">
        <AnimatePresence>
          {isOpen && (
            <>
              {/* Semi-transparent blur overlay behind action bubbles */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute w-[240px] h-[240px] rounded-full bg-zinc-950/40 backdrop-blur-md border border-white/5 pointer-events-none -z-10 shadow-3xl"
              />

              {/* Action items mapping */}
              {actions.map((act, idx) => {
                // Distribute uniformly in an arc from 195 degrees (bottom-left) to 345 degrees (bottom-right)
                // Or standard top arch: from 200 degrees (leftish) to 340 degrees (rightish)
                // For a stunning visual upward semi-circle, let's span from 210 degrees to 330 degrees
                const startAngle = 200;
                const endAngle = 340;
                const angleRange = endAngle - startAngle;
                
                const angleDeg = total > 1 
                  ? startAngle + (idx * angleRange) / (total - 1)
                  : startAngle;

                const angleRad = (angleDeg * Math.PI) / 180;

                // Circular coordinate offsets
                const tx = Math.cos(angleRad) * radius;
                const ty = Math.sin(angleRad) * radius;

                return (
                  <motion.button
                    type="button"
                    key={act.label}
                    onClick={() => {
                      if (act.onClick) act.onClick();
                      setIsOpen(false);
                    }}
                    initial={prefersReducedMotion ? false : { x: 0, y: 0, scale: 0, opacity: 0, rotate: 0 }}
                    animate={prefersReducedMotion ? { x: tx, y: ty, opacity: 1 } : {
                      x: tx,
                      y: ty,
                      scale: 1,
                      opacity: 1,
                      rotate: 360,
                    }}
                    exit={prefersReducedMotion ? { opacity: 0 } : { x: 0, y: 0, scale: 0, opacity: 0, rotate: 0 }}
                    transition={prefersReducedMotion ? { duration: 0 } : {
                      type: 'spring',
                      damping: 15,
                      stiffness: 140,
                      bounce: 0.35,
                      delay: idx * 0.04,
                    }}
                    className={cn(
                      "absolute p-3 rounded-full text-white shadow-lg active:scale-90 transition-transform flex items-center justify-center border border-white/10 group cursor-pointer",
                      act.color || 'bg-purple-600'
                    )}
                    style={{
                      transformOrigin: 'center center',
                    }}
                    aria-label={act.label}
                  >
                    {act.icon}

                    {/* Interactive tooltip pill labels */}
                    <span className="absolute bottom-full mb-2 bg-zinc-900 border border-zinc-800 text-[9px] font-black font-mono tracking-widest text-zinc-300 px-2 py-0.5 rounded-md opacity-0 scale-75 group-hover:opacity-100 group-hover:scale-100 transition-all uppercase pointer-events-none">
                      {act.label}
                    </span>
                  </motion.button>
                );
              })}
            </>
          )}
        </AnimatePresence>

        {/* Glow halo circle ring */}
        <motion.div
          animate={prefersReducedMotion ? undefined : {
            boxShadow: isOpen
              ? `0 0 35px 12px ${glowColor}`
              : `0 0 20px 4px ${glowColor}`,
          }}
          transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.8, repeat: Infinity, repeatType: 'reverse' }}
          className="rounded-full"
        >
          {/* Central main floating action button (FAB) */}
          <motion.button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className={cn(
              "relative w-14 h-14 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-600 text-white flex items-center justify-center border border-white/20 active:scale-95 transition-all shadow-xl z-20 cursor-pointer"
            )}
            animate={prefersReducedMotion ? undefined : { rotate: isOpen ? 135 : 0 }}
            transition={prefersReducedMotion ? { duration: 0 } : { type: 'spring', damping: 20, stiffness: 220 }}
            aria-label={isOpen ? 'Close navigation menu' : 'Open navigation menu'}
          >
            <Plus className="w-7 h-7" />
          </motion.button>
        </motion.div>
      </div>

    </div>
  );
}
export default BottomActionBubbleNav;

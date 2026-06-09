"use client";

import React, { useCallback, useState, useRef } from 'react';
import { motion, AnimatePresence} from "framer-motion";
import { HelpCircle, Settings } from 'lucide-react';
import { cn } from '../lib/cn';
import { usePrefersReducedMotion } from '../animation/hooks';

export interface ContextualTooltipDescriptorProps {
  label: string;
  description: string;
  parameters?: { name: string; value: string }[];
  className?: string;
}

export const ContextualTooltipDescriptor: React.FC<ContextualTooltipDescriptorProps> = ({
  label,
  description,
  parameters = [
    { name: "Stiffness", value: "350" },
    { name: "Damping", value: "25" },
    { name: "Elasticity", value: "True" }
  ],
  className,
}) => {
  const [hovered, setHovered] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [spotlightPos, setSpotlightPos] = useState({ x: 0, y: 0 });
  const prefersReducedMotion = usePrefersReducedMotion();

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (prefersReducedMotion || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setSpotlightPos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  }, [prefersReducedMotion]);

  const handleEnter = useCallback(() => setHovered(true), []);
  const handleLeave = useCallback(() => setHovered(false), []);

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      className={cn('relative inline-block select-none', className)}
    >
      {/* Trigger Button with Spotlight cursor sheen */}
      <button
        type="button"
        aria-label={label || 'More information'}
        aria-describedby={hovered ? 'tooltip-descriptor-panel' : undefined}
        aria-expanded={hovered}
        style={{
          background: hovered && !prefersReducedMotion ? `radial-gradient(circle 50px at ${spotlightPos.x}px ${spotlightPos.y}px, rgba(120, 119, 198, 0.15), transparent)` : 'transparent'
        }}
        className="px-4 py-2 border border-border rounded-xl flex items-center gap-2 hover:border-primary/40 text-xs font-bold text-muted-foreground hover:text-foreground transition-all cursor-pointer bg-card/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <HelpCircle className="w-4 h-4 text-primary shrink-0" />
        <span>{label}</span>
      </button>

      {/* Floating Detailed Panel */}
      <AnimatePresence>
        {hovered && (
          <motion.div
            id="tooltip-descriptor-panel"
            role="tooltip"
            initial={prefersReducedMotion ? false : { opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 8, scale: 0.95 }}
            transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.18, ease: 'easeOut' }}
            className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 z-50 w-60 p-4 border border-border rounded-2xl bg-card/90 shadow-2xl backdrop-blur-md pointer-events-none"
          >
            {/* Tooltip border beam glow */}
            <div className="absolute inset-0 border border-primary/25 rounded-2xl pointer-events-none" />

            <h5 className="text-[10px] font-black text-primary uppercase tracking-widest mb-1.5 flex items-center gap-1">
              <Settings className="w-3 h-3 text-primary" />
              <span>System Descriptor</span>
            </h5>
            <p className="text-[11px] text-muted-foreground leading-relaxed mb-3">
              {description}
            </p>

            <div className="border-t border-border/40 pt-2.5 space-y-1.5">
              {parameters.map((param, i) => (
                <div key={i} className="flex justify-between items-center text-[10px]">
                  <span className="text-muted-foreground font-semibold">{param.name}</span>
                  <span className="text-foreground font-mono font-bold bg-secondary/80 px-1.5 py-0.5 rounded">{param.value}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

"use client";

import React, { useRef, useState } from 'react';
import { motion} from "framer-motion";
import { ShieldCheck, Lock, CreditCard } from 'lucide-react';
import { cn } from '../lib/cn';
import { usePrefersReducedMotion } from '../animation/hooks';

export interface SecurePaymentTrustBannerProps {
  className?: string;
}

export const SecurePaymentTrustBanner: React.FC<SecurePaymentTrustBannerProps> = ({
  className,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const prefersReducedMotion = usePrefersReducedMotion();

  const handleMouseMove = (e: React.MouseEvent) => {
    if (prefersReducedMotion) return;
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientY - rect.top - rect.height / 2) / 3.5;
    const y = -(e.clientX - rect.left - rect.width / 2) / 10;
    setRotation({ x, y });
  };

  return (
    <motion.div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setRotation({ x: 0, y: 0 })}
      style={{
        transformStyle: 'preserve-3d',
        rotateX: rotation.x,
        rotateY: rotation.y,
      }}
      transition={{ type: 'spring', stiffness: 200, damping: 20 }}
      className={cn('w-full max-w-[340px] p-4 border border-border bg-card/85 backdrop-blur-md shadow-lg rounded-2xl select-none flex flex-col gap-3.5 relative overflow-hidden', className)}
    >
      {/* Glare sheen sweeps overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent pointer-events-none -skew-x-12" />

      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center relative shrink-0">
          <ShieldCheck className="w-4.5 h-4.5" />
          {/* Active heartbeat indicator */}
          <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border border-card flex items-center justify-center">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-ping absolute" />
          </span>
        </div>
        <div>
          <h4 className="text-[10px] font-black text-foreground uppercase tracking-wider">Secure SSL Gateway</h4>
          <span className="text-[8px] text-muted-foreground uppercase font-bold tracking-wider">Encrypted checkout connection</span>
        </div>
        <Lock className="w-3.5 h-3.5 text-muted-foreground/60 ml-auto" />
      </div>

      <div className="flex items-center justify-between border-t border-border/40 pt-3 text-[10px] text-muted-foreground font-semibold">
        <div className="flex items-center gap-1">
          <CreditCard className="w-3.5 h-3.5 text-primary" />
          <span>PCI-DSS Compliant</span>
        </div>
        <div className="flex gap-2 text-[9px] font-bold uppercase tracking-wider opacity-60">
          <span>Visa</span>
          <span>•</span>
          <span>MC</span>
          <span>•</span>
          <span>Amex</span>
        </div>
      </div>
    </motion.div>
  );
};

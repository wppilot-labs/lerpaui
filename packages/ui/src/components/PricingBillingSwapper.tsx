"use client";

import React, { useState } from 'react';
import { motion} from "framer-motion";
import { cn } from '../lib/cn';

export interface PricingBillingSwapperProps {
  onBillingChange?: (billing: 'monthly' | 'yearly') => void;
  className?: string;
}

export const PricingBillingSwapper: React.FC<PricingBillingSwapperProps> = ({
  onBillingChange,
  className,
}) => {
  const [active, setActive] = useState<'monthly' | 'yearly'>('monthly');

  const selectBilling = (opt: 'monthly' | 'yearly') => {
    setActive(opt);
    onBillingChange?.(opt);
    if (typeof window !== 'undefined' && navigator.vibrate) navigator.vibrate(8);
  };

  return (
    <div className={cn('relative flex items-center p-1 border border-border/40 bg-card/65 backdrop-blur-md rounded-2xl select-none max-w-[260px] w-full mx-auto', className)}>
      
      {/* Sliding Glass Pill indicator */}
      <motion.div
        layoutId="pricingSlidePill"
        className="absolute inset-y-1 w-[calc(50%-4px)] bg-primary rounded-xl border border-primary/25 -z-10"
        animate={{
          x: active === 'monthly' ? 0 : '100%',
        }}
        transition={{ type: 'spring', stiffness: 350, damping: 25 }}
      />

      <button
        type="button"
        onClick={() => selectBilling('monthly')}
        className={cn(
          'flex-1 py-2 text-center text-[10px] font-extrabold uppercase tracking-wider transition-colors duration-250 cursor-pointer focus:outline-none',
          active === 'monthly' ? 'text-white' : 'text-muted-foreground hover:text-foreground'
        )}
      >
        Monthly
      </button>

      <button
        type="button"
        onClick={() => selectBilling('yearly')}
        className={cn(
          'flex-1 py-2 text-center text-[10px] font-extrabold uppercase tracking-wider transition-colors duration-250 cursor-pointer focus:outline-none flex items-center justify-center gap-1.5',
          active === 'yearly' ? 'text-white' : 'text-muted-foreground hover:text-foreground'
        )}
      >
        <span>Yearly</span>
        <span className={cn(
          'px-1.5 py-0.5 rounded text-[7px] uppercase font-black tracking-widest shrink-0',
          active === 'yearly' ? 'bg-white text-primary font-black' : 'bg-primary/10 text-primary border border-primary/25'
        )}>
          -20%
        </span>
      </button>
    </div>
  );
};

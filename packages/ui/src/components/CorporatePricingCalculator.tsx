'use client';

import React, { useState } from 'react';
import { motion} from "framer-motion";
import { Users, DollarSign } from 'lucide-react';
import { cn } from '../lib/cn';

export interface CorporatePricingCalculatorProps {
  className?: string;
}

export const CorporatePricingCalculator: React.FC<CorporatePricingCalculatorProps> = ({ className }) => {
  const [seats, setSeats] = useState<number>(10);

  const pricePerSeat = 8;
  const totalPrice = seats * pricePerSeat;

  return (
    <div className={cn('relative w-full max-w-[320px] h-[340px] bg-secondary/5 rounded-3xl border border-border flex flex-col justify-between p-5 overflow-hidden select-none', className)}>
      <span className="text-[9px] text-muted-foreground font-black tracking-widest uppercase">Interactive Volume Calculator</span>

      <div className="flex flex-col gap-4 w-full my-auto">
        <div className="border border-border/30 rounded-2xl p-4 bg-card shadow-md flex flex-col gap-3">
          <div className="flex justify-between items-center w-full">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-primary" />
              <span className="text-[9.5px] font-black uppercase text-foreground">User Seats</span>
            </div>
            <span className="text-xs font-mono font-black text-primary bg-primary/10 border border-primary/20 px-2 py-0.5 rounded">
              {seats} Seats
            </span>
          </div>

          {/* Elastic Volume Slider */}
          <input 
            type="range"
            aria-label="Number of seats"
            min="5"
            max="100"
            step="5"
            value={seats}
            onChange={(e) => setSeats(Number(e.target.value))}
            className="w-full h-1 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
          />

          <div className="flex justify-between items-center border-t border-border/20 pt-2.5 mt-1">
            <span className="text-[7.5px] font-mono text-muted-foreground uppercase">ESTIMATED TOTAL</span>
            <div className="flex items-baseline text-primary">
              <DollarSign className="w-3.5 h-3.5 shrink-0" />
              <motion.span 
                key={totalPrice}
                initial={{ scale: 0.8, opacity: 0.5 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-base font-black"
              >
                {totalPrice}
              </motion.span>
              <span className="text-[7px] font-mono text-muted-foreground ml-1">/MO</span>
            </div>
          </div>
        </div>
      </div>

      <span className="text-[8px] text-muted-foreground font-extrabold uppercase tracking-wide text-center">Drag slider to compute subscription rates</span>
    </div>
  );
};

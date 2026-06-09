'use client';

import React, { useState } from 'react';
import { motion} from "framer-motion";
import { CheckSquare, Square, DollarSign } from 'lucide-react';
import { cn } from '../lib/cn';

export interface InteractivePricingCalculatorFormProps {
  className?: string;
}

export const InteractivePricingCalculatorForm: React.FC<InteractivePricingCalculatorFormProps> = ({ className }) => {
  const [ssoEnabled, setSsoEnabled] = useState(false);
  const [slaEnabled, setSlaEnabled] = useState(true);

  const basePrice = 29;
  const totalPrice = basePrice + (ssoEnabled ? 20 : 0) + (slaEnabled ? 15 : 0);

  return (
    <div className={cn('relative w-full max-w-[320px] h-[340px] bg-secondary/5 rounded-3xl border border-border flex flex-col justify-between p-5 overflow-hidden select-none', className)}>
      <span className="text-[9px] text-muted-foreground font-black tracking-widest uppercase">Form Price Calculator</span>

      <div className="flex flex-col gap-3.5 w-full my-auto">
        <div className="border border-border/30 rounded-2xl p-4 bg-card shadow-md flex flex-col gap-3">
          <span className="text-[7.5px] font-mono tracking-widest text-primary uppercase font-bold">ADD-ON CONFIGURATION</span>

          {/* Option rows */}
          <div className="flex flex-col gap-2.5">
            <div 
              role="button" 
              tabIndex={0} 
              onClick={() => setSsoEnabled(!ssoEnabled)} 
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setSsoEnabled(!ssoEnabled); } }}
              className="flex items-center justify-between cursor-pointer group"
            >
              <div className="flex items-center gap-2">
                {ssoEnabled ? <CheckSquare className="w-4 h-4 text-primary" /> : <Square className="w-4 h-4 text-muted-foreground" />}
                <span className="text-[9px] font-black uppercase text-foreground leading-none">SSO Enterprise Safe</span>
              </div>
              <span className="text-[8px] font-mono text-muted-foreground">+$20</span>
            </div>

            <div 
              role="button" 
              tabIndex={0} 
              onClick={() => setSlaEnabled(!slaEnabled)} 
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setSlaEnabled(!slaEnabled); } }}
              className="flex items-center justify-between cursor-pointer group"
            >
              <div className="flex items-center gap-2">
                {slaEnabled ? <CheckSquare className="w-4 h-4 text-primary" /> : <Square className="w-4 h-4 text-muted-foreground" />}
                <span className="text-[9px] font-black uppercase text-foreground leading-none">1h Premium SLA</span>
              </div>
              <span className="text-[8px] font-mono text-muted-foreground">+$15</span>
            </div>
          </div>

          <div className="flex justify-between items-center border-t border-border/20 pt-2.5 mt-1">
            <span className="text-[7.5px] font-mono text-muted-foreground uppercase">ESTIMATED CONTRACT</span>
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

      <span className="text-[8px] text-muted-foreground font-extrabold uppercase tracking-wide text-center">Toggle form options to calculate final bills</span>
    </div>
  );
};

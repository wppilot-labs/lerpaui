'use client';

import React, { useState } from 'react';
import { motion, useSpring, useTransform, useMotionValue} from "framer-motion";
import { Check, Cpu } from 'lucide-react';
import { cn } from '../lib/cn';

export interface InteractivePricingSliderCardProps {
  className?: string;
}

export const InteractivePricingSliderCard: React.FC<InteractivePricingSliderCardProps> = ({ className }) => {
  const [sliderVal, setSliderVal] = useState(25);
  
  const priceVal = useMotionValue(29);
  const springPrice = useSpring(priceVal, { stiffness: 100, damping: 15 });
  const displayPrice = useTransform(springPrice, (val) => Math.round(val));

  const tiers = [
    { limit: "10K reqs", price: 9, label: "STARTER", features: [true, false, false] },
    { limit: "100K reqs", price: 29, label: "PRO SYSTEM", features: [true, true, false] },
    { limit: "1M reqs", price: 99, label: "CLUSTER", features: [true, true, true] }
  ];

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value);
    setSliderVal(val);
    
    // map slider value to pricing tiers
    if (val < 33) {
      priceVal.set(tiers[0].price);
    } else if (val < 66) {
      priceVal.set(tiers[1].price);
    } else {
      priceVal.set(tiers[2].price);
    }
  };

  const currentTier = sliderVal < 33 ? tiers[0] : sliderVal < 66 ? tiers[1] : tiers[2];

  return (
    <div className={cn('relative w-full max-w-[320px] h-[340px] bg-secondary/5 rounded-3xl border border-border flex flex-col justify-between p-5 overflow-hidden select-none', className)}>
      <span className="text-[9px] text-muted-foreground font-black tracking-widest uppercase">Elastic Pricing Slider</span>

      <div className="flex flex-col gap-3 w-full my-auto border border-border/40 bg-card/60 rounded-2xl p-4 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-20 h-20 bg-primary/5 rounded-full blur-2xl pointer-events-none" />
        
        <div className="flex justify-between items-center w-full">
          <span className="text-[8px] font-mono tracking-widest bg-secondary/60 px-2 py-0.5 rounded-full text-foreground/80 font-black">{currentTier.label}</span>
          <div className="flex items-center gap-1">
            <Cpu className="w-3 h-3 text-primary" />
            <span className="text-[9px] text-muted-foreground font-bold">{currentTier.limit}</span>
          </div>
        </div>

        <div className="flex items-baseline gap-1 my-1 justify-center">
          <span className="text-sm font-semibold text-muted-foreground">$</span>
          <motion.span className="text-3xl font-black tracking-tight text-foreground">
            {displayPrice}
          </motion.span>
          <span className="text-[9px] text-muted-foreground">/mo</span>
        </div>

        {/* Glowing input slider range */}
        <input 
          type="range"
          aria-label="Plan size"
          min="0"
          max="100"
          value={sliderVal}
          onChange={handleSliderChange}
          className="w-full h-1.5 rounded-lg bg-border accent-primary cursor-pointer my-1 outline-none"
        />

        {/* Feature checks */}
        <div className="flex flex-col gap-1.5 mt-1.5">
          {["Global Edge Routing", "Live Latency Sparklines", "Multi-Agent Cluster Logs"].map((feat, idx) => {
            const active = currentTier.features[idx];
            return (
              <div key={idx} className={cn('flex items-center gap-2 text-[9px] transition-opacity duration-300', active ? 'text-foreground' : 'text-muted-foreground/45')}>
                <div className={cn('w-3.5 h-3.5 rounded-full flex items-center justify-center border', active ? 'bg-primary/10 border-primary text-primary' : 'border-border')}>
                  <Check className="w-2.5 h-2.5" />
                </div>
                <span className="font-medium">{feat}</span>
              </div>
            );
          })}
        </div>
      </div>

      <span className="text-[8px] text-muted-foreground font-extrabold uppercase tracking-wide text-center">Drag slider to scale cluster tiers</span>
    </div>
  );
};

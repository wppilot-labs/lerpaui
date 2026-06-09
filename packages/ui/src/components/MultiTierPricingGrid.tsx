'use client';

import React, { useState } from 'react';

import { Check, Star } from 'lucide-react';
import { cn } from '../lib/cn';

export interface MultiTierPricingGridProps {
  className?: string;
}

export const MultiTierPricingGrid: React.FC<MultiTierPricingGridProps> = ({ className }) => {
  const [selectedPlan, setSelectedPlan] = useState<'standard' | 'enterprise'>('enterprise');

  return (
    <div className={cn('relative w-full max-w-[320px] h-[340px] bg-secondary/5 rounded-3xl border border-border flex flex-col justify-between p-5 overflow-hidden select-none', className)}>
      <span className="text-[9px] text-muted-foreground font-black tracking-widest uppercase">Multi-Tier Pricing Grid</span>

      <div className="flex gap-2.5 w-full my-auto">
        {/* Standard plan */}
        <div 
          role="button" 
          tabIndex={0} 
          onClick={() => setSelectedPlan('standard')} 
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setSelectedPlan('standard'); } }}
          className={cn(
            "flex-1 border p-3 rounded-2xl flex flex-col justify-between h-[180px] bg-card cursor-pointer transition-all duration-300",
            selectedPlan === 'standard' ? "border-primary shadow-md scale-102" : "border-border/30 opacity-70"
          )}
        >
          <div className="flex flex-col">
            <span className="text-[7px] font-mono tracking-wider text-muted-foreground uppercase">STANDARD</span>
            <div className="flex items-baseline mt-1.5">
              <span className="text-sm font-black">$29</span>
              <span className="text-[6.5px] font-mono text-muted-foreground ml-1">/MO</span>
            </div>
            <p className="text-[7.5px] text-muted-foreground mt-2 leading-relaxed">
              Standard compilation shard.
            </p>
          </div>
          <div className="flex flex-col gap-1 border-t border-border/20 pt-2">
            <div className="flex items-center gap-1.5 text-[7px] text-foreground/80">
              <Check className="w-2.5 h-2.5 text-primary shrink-0" />
              <span>3 Pipelines</span>
            </div>
            <div className="flex items-center gap-1.5 text-[7px] text-foreground/80">
              <Check className="w-2.5 h-2.5 text-primary shrink-0" />
              <span>24h SLA support</span>
            </div>
          </div>
        </div>

        {/* Enterprise Plan */}
        <div 
          role="button" 
          tabIndex={0} 
          onClick={() => setSelectedPlan('enterprise')} 
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setSelectedPlan('enterprise'); } }}
          className={cn(
            "flex-1 border p-3 rounded-2xl flex flex-col justify-between h-[180px] bg-card cursor-pointer transition-all duration-300 relative",
            selectedPlan === 'enterprise' ? "border-primary shadow-xl scale-102 bg-gradient-to-tr from-card to-primary/5" : "border-border/30 opacity-70"
          )}
        >
          <div className="absolute -top-2 right-2 bg-primary/95 text-white border border-primary/20 rounded-full px-2 py-0.5 flex items-center gap-1 text-[5px] font-black uppercase tracking-widest shadow-md">
            <Star className="w-2 h-2 fill-white animate-spin-slow" />
            <span>POPULAR</span>
          </div>

          <div className="flex flex-col">
            <span className="text-[7px] font-mono tracking-wider text-primary uppercase font-bold">ENTERPRISE</span>
            <div className="flex items-baseline mt-1.5">
              <span className="text-sm font-black text-primary">$99</span>
              <span className="text-[6.5px] font-mono text-muted-foreground ml-1">/MO</span>
            </div>
            <p className="text-[7.5px] text-muted-foreground mt-2 leading-relaxed">
              Elastic cluster networks.
            </p>
          </div>
          <div className="flex flex-col gap-1 border-t border-border/20 pt-2">
            <div className="flex items-center gap-1.5 text-[7px] text-foreground/80">
              <Check className="w-2.5 h-2.5 text-primary shrink-0" />
              <span>Unlimited Pipelines</span>
            </div>
            <div className="flex items-center gap-1.5 text-[7px] text-foreground/80">
              <Check className="w-2.5 h-2.5 text-primary shrink-0" />
              <span>1h Premium SLA</span>
            </div>
          </div>
        </div>
      </div>

      <span className="text-[8px] text-muted-foreground font-extrabold uppercase tracking-wide text-center">Click tiers to select pricing plan</span>
    </div>
  );
};

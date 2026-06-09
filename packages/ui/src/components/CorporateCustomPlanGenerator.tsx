'use client';

import React, { useState } from 'react';
import { motion} from "framer-motion";
import { DollarSign, Download } from 'lucide-react';
import { cn } from '../lib/cn';

export interface CorporateCustomPlanGeneratorProps {
  className?: string;
}

export const CorporateCustomPlanGenerator: React.FC<CorporateCustomPlanGeneratorProps> = ({ className }) => {
  const [pipelineCount, setPipelineCount] = useState<number>(3);
  const [isSso, setIsSso] = useState(false);

  const totalPrice = (pipelineCount * 12) + (isSso ? 30 : 0);

  return (
    <div className={cn('relative w-full max-w-[320px] h-[340px] bg-secondary/5 rounded-3xl border border-border flex flex-col justify-between p-5 overflow-hidden select-none', className)}>
      <span className="text-[9px] text-muted-foreground font-black tracking-widest uppercase">Custom Proposal Builder</span>

      <div className="flex flex-col gap-3 w-full my-auto">
        <div className="border border-border/30 rounded-2xl p-3.5 bg-card shadow-md flex flex-col gap-3">
          <div className="flex justify-between items-center">
            <span className="text-[7.5px] font-mono tracking-widest text-primary uppercase font-bold">PIPELINE CHANNELS</span>
            <span className="text-xs font-mono font-black text-primary">{pipelineCount} Pipelines</span>
          </div>

          {/* Elastic slider */}
          <input 
            type="range"
            aria-label="Number of pipelines"
            min="1"
            max="15"
            step="1"
            value={pipelineCount}
            onChange={(e) => setPipelineCount(Number(e.target.value))}
            className="w-full h-1 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
          />

          {/* Check options */}
          <div 
            role="button" 
            tabIndex={0} 
            onClick={() => setIsSso(!isSso)} 
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setIsSso(!isSso); } }}
            className="flex items-center justify-between cursor-pointer border-t border-border/10 pt-2"
          >
            <div className="flex items-center gap-1.5 text-[8.5px] text-foreground/80 font-black uppercase">
              <div className={cn("w-3 h-3 rounded-full border border-border flex items-center justify-center bg-card shrink-0", isSso ? "border-primary" : "")}>
                {isSso && <div className="w-1.5 h-1.5 rounded-full bg-primary" />}
              </div>
              <span>Enable SSO Security</span>
            </div>
            <span className="text-[8px] font-mono text-muted-foreground">+$30/MO</span>
          </div>

          <div className="flex justify-between items-center border-t border-border/20 pt-2 mt-1">
            <div className="flex flex-col">
              <span className="text-[6.5px] font-mono text-muted-foreground uppercase leading-none">TOTAL RATE</span>
              <div className="flex items-baseline text-primary mt-1">
                <DollarSign className="w-3 h-3 shrink-0" />
                <motion.span 
                  key={totalPrice}
                  initial={{ scale: 0.8, opacity: 0.5 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-sm font-black"
                >
                  {totalPrice}
                </motion.span>
                <span className="text-[6.5px] font-mono text-muted-foreground ml-1">/MO</span>
              </div>
            </div>
            <button className="flex items-center gap-1.5 bg-primary/95 text-white border border-primary/20 px-2.5 py-1.5 rounded-xl text-[7px] font-black uppercase tracking-wider hover:bg-primary transition-colors cursor-pointer">
              <Download className="w-2.5 h-2.5" />
              <span>PROPOSAL</span>
            </button>
          </div>
        </div>
      </div>

      <span className="text-[8px] text-muted-foreground font-extrabold uppercase tracking-wide text-center">Customize specifications to download PDF proposal</span>
    </div>
  );
};

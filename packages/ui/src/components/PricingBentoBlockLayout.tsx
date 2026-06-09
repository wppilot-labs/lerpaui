'use client';

import React, { useState } from 'react';
import { motion} from "framer-motion";
import { Shield, HelpCircle } from 'lucide-react';
import { cn } from '../lib/cn';

export interface PricingBentoBlockLayoutProps {
  className?: string;
}

export const PricingBentoBlockLayout: React.FC<PricingBentoBlockLayoutProps> = ({ className }) => {
  const [showFaq, setShowFaq] = useState(false);

  return (
    <div className={cn('relative w-full max-w-[320px] h-[340px] bg-secondary/5 rounded-3xl border border-border flex flex-col justify-between p-5 overflow-hidden select-none', className)}>
      <span className="text-[9px] text-muted-foreground font-black tracking-widest uppercase">Pricing Bento Card</span>

      <div className="flex flex-col gap-2.5 w-full my-auto">
        {/* Main Price Bento Box */}
        <div className="border border-border/40 rounded-2xl p-4 bg-card shadow-md flex justify-between items-center relative overflow-hidden bg-gradient-to-tr from-card to-secondary/10">
          <div className="flex flex-col">
            <span className="text-[7.5px] font-mono tracking-widest text-primary uppercase font-bold">BENTO STARTER</span>
            <div className="flex items-baseline mt-2">
              <span className="text-xl font-black text-foreground">$19</span>
              <span className="text-[8px] font-mono text-muted-foreground ml-1">/MO</span>
            </div>
          </div>
          <button type="button" className="bg-primary/95 text-white border border-primary/20 px-3 py-1.5 rounded-xl text-[8px] font-black uppercase tracking-wider hover:bg-primary transition-colors cursor-pointer">
            DEPLOY
          </button>
        </div>

        {/* Two smaller bento nodes */}
        <div className="flex gap-2.5 w-full">
          {/* Trust Bento box */}
          <div className="flex-1 border border-border/30 rounded-2xl p-3 bg-card shadow-sm flex items-center gap-2">
            <Shield className="w-5 h-5 text-emerald-500 shrink-0" />
            <div className="flex flex-col">
              <span className="text-[7px] font-mono text-muted-foreground uppercase leading-none">SECURITY</span>
              <span className="text-[9px] font-black text-foreground uppercase mt-0.5 leading-none">SSO SAFE</span>
            </div>
          </div>

          {/* Interactive Mini-FAQ Bento box */}
          <div 
            role="button" 
            tabIndex={0} 
            onClick={() => setShowFaq(!showFaq)} 
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setShowFaq(!showFaq); } }}
            className="flex-1 border border-border/30 rounded-2xl p-3 bg-card shadow-sm flex items-center gap-2 cursor-pointer hover:border-primary/30 transition-colors"
          >
            <HelpCircle className="w-5 h-5 text-primary shrink-0" />
            <div className="flex flex-col">
              <span className="text-[7px] font-mono text-muted-foreground uppercase leading-none">SUPPORT</span>
              <span className="text-[9px] font-black text-foreground uppercase mt-0.5 leading-none">{showFaq ? 'SHOWN' : 'HELP FAQ'}</span>
            </div>
          </div>
        </div>

        {/* Dynamic FAQ Reveal row */}
        {showFaq && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="border border-border/20 rounded-xl p-3.5 bg-card/65 text-[7.5px] text-muted-foreground leading-relaxed shadow-inner"
          >
            All custom starter templates elastically update compile speeds dynamically inside unified visual suites.
          </motion.div>
        )}
      </div>

      <span className="text-[8px] text-muted-foreground font-extrabold uppercase tracking-wide text-center">Click help card to reveal mini FAQ folder</span>
    </div>
  );
};

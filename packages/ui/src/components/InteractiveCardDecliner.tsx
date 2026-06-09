"use client";

import React, { useState } from 'react';
import { motion} from "framer-motion";
import { CreditCard, ShieldAlert, RefreshCw } from 'lucide-react';
import { cn } from '../lib/cn';

export interface InteractiveCardDeclinerProps {
  className?: string;
}

export const InteractiveCardDecliner: React.FC<InteractiveCardDeclinerProps> = ({ className }) => {
  const [state, setState] = useState<'idle' | 'processing' | 'declined'>('idle');

  const triggerCheckout = () => {
    setState('processing');
    setTimeout(() => {
      setState('declined');
    }, 1800);
  };

  return (
    <div className={cn('w-full max-w-[340px] p-5 border border-border bg-card shadow-lg rounded-2xl select-none flex flex-col gap-4 relative overflow-hidden', className)}>
      {/* Glow red highlight if declined */}
      {state === 'declined' && (
        <div className="absolute -top-12 -right-12 w-28 h-28 bg-rose-500/15 rounded-full blur-2xl animate-pulse pointer-events-none" />
      )}

      {/* Credit Card layout */}
      <motion.div
        animate={state === 'declined' ? { x: [-8, 8, -6, 6, -4, 4, 0], rotateZ: [-1, 1, -1, 1, 0] } : {}}
        transition={{ duration: 0.45 }}
        className={cn(
          'w-full aspect-[1.586] rounded-xl p-4 border relative flex flex-col justify-between shadow-md transition-all duration-300',
          state === 'declined' ? 'bg-gradient-to-tr from-rose-950/25 to-card border-rose-500/40 shadow-rose-500/5' : 
          'bg-gradient-to-tr from-zinc-900 to-zinc-950 border-border/60'
        )}
      >
        <div className="flex items-center justify-between">
          <CreditCard className="w-6 h-6 text-muted-foreground/60" />
          <span className="text-[7px] text-muted-foreground uppercase font-black tracking-widest font-mono">Premium Credit</span>
        </div>

        <div className="space-y-1.5 mt-auto">
          <span className="text-xs text-foreground font-mono font-bold tracking-widest">••••  ••••  ••••  7841</span>
          <div className="flex justify-between items-center text-[7px] text-muted-foreground font-semibold font-mono uppercase tracking-wider">
            <span>Alex Mercer</span>
            <span>Exp: 09/29</span>
          </div>
        </div>
      </motion.div>

      {state === 'declined' && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-xl flex items-start gap-2 text-[10px] font-semibold leading-relaxed"
        >
          <ShieldAlert className="w-4 h-4 shrink-0 text-rose-400 mt-0.5 animate-bounce" />
          <div className="flex flex-col gap-0.5">
            <span className="font-extrabold uppercase text-[9px] tracking-wider">Transaction Blocked</span>
            <span>Card declined due to insufficient parameters token authorization. Contact host gate keys.</span>
          </div>
        </motion.div>
      )}

      <div className="flex flex-col gap-2 mt-1">
        {state === 'idle' && (
          <button 
            onClick={triggerCheckout}
            className="w-full py-2.5 bg-primary text-white font-bold text-xs uppercase tracking-wider rounded-xl hover:brightness-110 active:scale-95 shadow-md cursor-pointer flex items-center justify-center gap-1.5"
          >
            <span>Submit Payment $249</span>
          </button>
        )}

        {state === 'processing' && (
          <button 
            disabled
            className="w-full py-2.5 bg-secondary border border-border text-muted-foreground font-bold text-xs uppercase tracking-wider rounded-xl flex items-center justify-center gap-2 cursor-not-allowed opacity-80"
          >
            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            <span>Authorizing Card...</span>
          </button>
        )}

        {state === 'declined' && (
          <button 
            onClick={() => setState('idle')}
            className="w-full py-2.5 bg-rose-500 hover:bg-rose-400 text-white font-bold text-xs uppercase tracking-wider rounded-xl hover:brightness-110 active:scale-95 shadow-md cursor-pointer flex items-center justify-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Retry checkout</span>
          </button>
        )}
      </div>
    </div>
  );
};

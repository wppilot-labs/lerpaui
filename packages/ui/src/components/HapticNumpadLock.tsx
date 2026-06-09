"use client";

import React, { useState } from 'react';
import { motion} from "framer-motion";
import { Lock, Unlock, Delete } from 'lucide-react';
import { cn } from '../lib/cn';

export interface HapticNumpadLockProps {
  correctPin?: string;
  className?: string;
}

export const HapticNumpadLock: React.FC<HapticNumpadLockProps> = ({
  correctPin = "1970",
  className,
}) => {
  const [pin, setPin] = useState('');
  const [status, setStatus] = useState<'locked' | 'unlocked' | 'error'>('locked');

  const handleKey = (num: string) => {
    if (status === 'unlocked') return;
    setStatus('locked');
    if (pin.length < 4) {
      const next = pin + num;
      setPin(next);
      if (typeof window !== 'undefined' && navigator.vibrate) navigator.vibrate(8);
      
      if (next === correctPin) {
        setStatus('unlocked');
        if (typeof window !== 'undefined' && navigator.vibrate) navigator.vibrate([15, 30]);
      } else if (next.length === 4) {
        setTimeout(() => {
          setStatus('error');
          if (typeof window !== 'undefined' && navigator.vibrate) navigator.vibrate([40, 40, 40]);
          setTimeout(() => { setPin(''); setStatus('locked'); }, 850);
        }, 300);
      }
    }
  };

  const handleDelete = () => {
    if (pin.length > 0) {
      setPin(pin.slice(0, -1));
    }
  };

  return (
    <div className={cn('p-5 rounded-3xl border border-border bg-card shadow-xl select-none max-w-[280px] flex flex-col items-center gap-4 relative', className)}>
      <div className="flex flex-col items-center gap-2 mb-1">
        <motion.div
          animate={status === 'error' ? { x: [-8, 8, -6, 6, 0] } : {}}
          transition={{ duration: 0.4 }}
          className={cn(
            'w-10 h-10 rounded-2xl flex items-center justify-center border transition-colors',
            status === 'unlocked' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' :
            status === 'error' ? 'bg-rose-500/15 border-rose-500/30 text-rose-400' : 'bg-primary/10 border-primary/20 text-primary'
          )}
        >
          {status === 'unlocked' ? <Unlock className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
        </motion.div>
        <span className="text-[9px] text-muted-foreground uppercase font-black tracking-widest mt-0.5">
          {status === 'unlocked' ? 'Access Granted' : status === 'error' ? 'Incorrect Pin' : 'Enter Secure Passcode'}
        </span>
      </div>

      {/* Secret input dots row */}
      <div className="flex gap-3 justify-center mb-1">
        {[0, 1, 2, 3].map(i => {
          const filled = pin.length > i;
          return (
            <motion.div
              key={i}
              animate={filled ? { scale: [1, 1.25, 1] } : {}}
              className={cn(
                'w-3.5 h-3.5 rounded-full border transition-all duration-200',
                status === 'error' ? 'bg-rose-500 border-rose-500 animate-pulse' :
                status === 'unlocked' ? 'bg-emerald-500 border-emerald-500' :
                filled ? 'bg-primary border-primary' : 'bg-transparent border-border'
              )}
              style={status === 'locked' && filled ? { boxShadow: '0 0 6px rgba(var(--primary-rgb), 0.6)' } : undefined}
            />
          );
        })}
      </div>

      {/* Numpad lock keys */}
      <div className="grid grid-cols-3 gap-2 w-full">
        {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map(num => (
          <motion.button
            key={num}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleKey(num)}
            className="aspect-square rounded-2xl bg-secondary/50 border border-border/30 hover:border-primary/25 text-sm font-black text-foreground font-mono flex items-center justify-center cursor-pointer active:bg-secondary"
          >
            {num}
          </motion.button>
        ))}
        <div className="aspect-square flex items-center justify-center text-[8px] text-muted-foreground/60 font-bold uppercase tracking-wider select-none font-mono">
          Code: {correctPin}
        </div>
        <motion.button
          key="0"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => handleKey("0")}
          className="aspect-square rounded-2xl bg-secondary/50 border border-border/30 hover:border-primary/25 text-sm font-black text-foreground font-mono flex items-center justify-center cursor-pointer active:bg-secondary"
        >
          0
        </motion.button>
        <motion.button
          type="button"
          aria-label="Delete last digit"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleDelete}
          className="aspect-square rounded-2xl bg-rose-500/5 hover:bg-rose-500/10 border border-border/30 text-rose-400 flex items-center justify-center cursor-pointer"
        >
          <Delete className="w-4 h-4" />
        </motion.button>
      </div>
    </div>
  );
};

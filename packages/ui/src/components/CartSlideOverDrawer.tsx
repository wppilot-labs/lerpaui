"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence} from "framer-motion";
import { ShoppingBag, X, Trash2, Tag, ArrowRight } from 'lucide-react';
import { cn } from '../lib/cn';

export interface CartSlideOverDrawerProps {
  isOpen?: boolean;
  onClose?: () => void;
  className?: string;
}

export const CartSlideOverDrawer: React.FC<CartSlideOverDrawerProps> = ({
  isOpen = false,
  onClose,
  className,
}) => {
  const [items, setItems] = useState([
    { id: "1", name: "Premium Apex Sneaker", size: "US 10", price: 180, qty: 1 },
    { id: "2", name: "Tactile Neumorphic Hoodie", size: "L", price: 120, qty: 1 }
  ]);

  const handleQty = (id: string, dir: number) => {
    setItems(items.map(item => {
      if (item.id === id) {
        return { ...item, qty: Math.max(1, item.qty + dir) };
      }
      return item;
    }));
  };

  const handleRemove = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const total = items.reduce((sum, item) => sum + item.price * item.qty, 0);

  return (
    <div className={cn('relative z-50', className)}>
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="fixed inset-0 bg-black backdrop-blur-sm cursor-pointer"
            />

            {/* Slide-out drawer body */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 260, damping: 26 }}
              className="fixed inset-y-0 right-0 w-full max-w-[340px] bg-card border-l border-border shadow-2xl flex flex-col justify-between"
            >
              {/* Header block */}
              <div className="flex items-center justify-between p-4 border-b border-border/40 bg-secondary/10">
                <div className="flex items-center gap-2 text-foreground font-black text-xs uppercase tracking-wider">
                  <ShoppingBag className="w-4 h-4 text-primary" />
                  <span>Shopping Cart ({items.length})</span>
                </div>
                <button 
                  onClick={onClose}
                  className="p-1.5 border border-border/60 rounded-lg hover:border-primary/20 text-muted-foreground hover:text-foreground cursor-pointer transition-all"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Items checklist */}
              <div className="flex-1 p-4 overflow-y-auto space-y-4">
                <AnimatePresence>
                  {items.map(item => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="p-3 border border-border/60 bg-card rounded-xl flex justify-between gap-3 shadow-sm relative"
                    >
                      <div className="flex flex-col gap-0.5">
                        <span className="text-xs font-extrabold text-foreground">{item.name}</span>
                        <span className="text-[9px] text-muted-foreground font-semibold">{"Size: " + item.size + " • $" + item.price}</span>
                        
                        <div className="flex items-center gap-1.5 mt-2 bg-secondary/80 px-2 py-0.5 rounded-lg border border-border/30 w-fit select-none">
                          <button onClick={() => handleQty(item.id, -1)} className="text-[10px] font-bold text-muted-foreground hover:text-foreground">-</button>
                          <span className="text-[10px] font-black text-foreground font-mono">{item.qty}</span>
                          <button onClick={() => handleQty(item.id, 1)} className="text-[10px] font-bold text-muted-foreground hover:text-foreground">+</button>
                        </div>
                      </div>
                      <div className="flex flex-col justify-between items-end">
                        <button 
                          onClick={() => handleRemove(item.id)}
                          className="text-rose-400/80 hover:text-rose-400 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                        <span className="text-xs font-black text-foreground font-mono">{"$" + (item.price * item.qty)}</span>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {items.length === 0 && (
                  <div className="py-24 text-center flex flex-col items-center opacity-45">
                    <ShoppingBag className="w-10 h-10 mb-2 animate-bounce text-primary" />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Cart is empty</span>
                  </div>
                )}
              </div>

              {/* Checkout details block */}
              <div className="p-4 border-t border-border/40 bg-secondary/10 space-y-4">
                <div className="flex justify-between items-center text-[10px] text-muted-foreground font-semibold">
                  <span className="flex items-center gap-1"><Tag className="w-3.5 h-3.5 text-primary" /> Promo discount</span>
                  <span className="text-emerald-400 font-bold">Applied</span>
                </div>
                <div className="flex justify-between items-center border-t border-border/40 pt-3">
                  <span className="text-xs font-black text-foreground uppercase tracking-wider">Subtotal</span>
                  <span className="text-base font-black text-foreground font-mono">{"$" + total}</span>
                </div>
                <button className="w-full py-2.5 bg-primary text-white font-bold text-xs uppercase tracking-wider rounded-xl hover:brightness-110 active:scale-95 shadow-md flex items-center justify-center gap-2 cursor-pointer">
                  <span>Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

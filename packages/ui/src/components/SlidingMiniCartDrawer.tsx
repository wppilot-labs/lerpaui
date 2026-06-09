"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence} from "framer-motion";
import { X, Plus, Minus, ShoppingBag, Trash2, ArrowRight, Sparkles } from 'lucide-react';
import { cn } from '../lib/cn';


export interface CartItem {
  id: string;
  title: string;
  price: number;
  quantity: number;
  image: string;
  size?: string;
  color?: string;
}

export interface SlidingMiniCartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  initialItems?: CartItem[];
  freeShippingThreshold?: number;
  onCheckout?: (items: CartItem[]) => void;
}

const defaultCartItems: CartItem[] = [
  {
    id: 'c1',
    title: 'Minimalist Travel Parka',
    price: 189,
    quantity: 1,
    image: 'https://images.unsplash.com/photo-1544022613-e87ca75a784a?q=80&w=200&auto=format&fit=crop',
    size: 'M',
    color: 'Desert Clay'
  },
  {
    id: 'c2',
    title: 'Signature Merino Beanie',
    price: 35,
    quantity: 1,
    image: 'https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?q=80&w=200&auto=format&fit=crop',
    size: 'One Size',
    color: 'Slate Gray'
  }
];

export const SlidingMiniCartDrawer: React.FC<SlidingMiniCartDrawerProps> = ({
  isOpen,
  onClose,
  initialItems = defaultCartItems,
  freeShippingThreshold = 150,
  onCheckout,
}) => {
  const [items, setItems] = useState<CartItem[]>(initialItems);
  const prefersReducedMotion = usePrefersReducedMotion();

  // Sync state if initialItems changes
  useEffect(() => {
    setItems(initialItems);
  }, [initialItems]);

  const updateQuantity = (id: string, delta: number) => {
    setItems(prevItems =>
      prevItems
        .map(item => {
          if (item.id === id) {
            const newQty = item.quantity + delta;
            return { ...item, quantity: Math.max(0, newQty) };
          }
          return item;
        })
        .filter(item => item.quantity > 0)
    );
  };

  const removeItem = (id: string) => {
    setItems(prevItems => prevItems.filter(item => item.id !== id));
  };

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const diffToFreeShipping = Math.max(0, freeShippingThreshold - subtotal);
  const progressPercent = Math.min(100, (subtotal / freeShippingThreshold) * 100);

  // Keyboard navigation: Escape key closes the drawer
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const springTransition = prefersReducedMotion 
    ? { duration: 0.1 }
    : { type: 'spring', stiffness: 220, damping: 26, mass: 0.6 };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
          />

          {/* Sliding Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={springTransition}
            className={cn(
              "fixed right-0 top-0 bottom-0 z-50 w-full sm:w-[440px] h-full flex flex-col",
              "bg-white/90 dark:bg-zinc-950/90 backdrop-blur-xl",
              "border-l border-slate-200/50 dark:border-zinc-800/50 shadow-2xl"
            )}
          >
            {/* Header */}
            <div className="p-6 border-b border-slate-200/60 dark:border-zinc-800/60 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <ShoppingBag className="w-5 h-5 text-slate-800 dark:text-zinc-100" />
                <h2 className="text-lg font-bold text-slate-800 dark:text-zinc-100">Your Cart</h2>
                <span className="bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400 text-xs font-extrabold px-2.5 py-1 rounded-full">
                  {items.reduce((sum, item) => sum + item.quantity, 0)}
                </span>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-zinc-900 text-slate-400 hover:text-slate-600 dark:hover:text-zinc-200 transition-colors"
                aria-label="Close cart"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Free Shipping Dynamic Progress Tracker */}
            <div className="p-6 bg-slate-50/50 dark:bg-zinc-900/30 border-b border-slate-200/40 dark:border-zinc-800/40">
              <div className="flex justify-between items-center mb-2.5">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400">
                  {diffToFreeShipping > 0 ? "Free Shipping Goal" : "Shipping Unlocked!"}
                </span>
                <span className="text-xs font-extrabold text-slate-800 dark:text-zinc-100">
                  {diffToFreeShipping > 0 
                    ? `$${diffToFreeShipping.toFixed(2)} away` 
                    : "You qualify for free shipping!"}
                </span>
              </div>
              {/* Progress Track */}
              <div className="w-full h-2.5 bg-slate-200 dark:bg-zinc-800 rounded-full overflow-hidden relative">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercent}%` }}
                  transition={prefersReducedMotion ? { duration: 0.1 } : { type: 'spring', stiffness: 80, damping: 15 }}
                  className="h-full rounded-full bg-gradient-to-r from-violet-500 via-indigo-500 to-emerald-500 relative"
                >
                  {progressPercent === 100 && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: [0, 1, 0] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                      className="absolute inset-0 bg-white/30"
                    />
                  )}
                </motion.div>
              </div>
              {diffToFreeShipping <= 0 && (
                <div className="flex items-center gap-1.5 mt-2.5 text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
                  <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                  <span>Free shipping applied to your order!</span>
                </div>
              )}
            </div>

            {/* Cart Items List */}
            <div className="flex-1 overflow-y-auto p-6 space-y-5">
              <AnimatePresence initial={false}>
                {items.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="h-full flex flex-col items-center justify-center text-center py-12"
                  >
                    <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-zinc-900 flex items-center justify-center mb-4 text-slate-400">
                      <ShoppingBag className="w-8 h-8" />
                    </div>
                    <h3 className="font-bold text-slate-800 dark:text-zinc-200">Your bag is empty</h3>
                    <p className="text-sm text-slate-500 dark:text-zinc-500 mt-1.5 max-w-[240px]">
                      Add premium outerwear or clothing pieces to unlock your stylish look.
                    </p>
                    <button
                      onClick={onClose}
                      className="mt-6 px-5 py-2.5 rounded-full bg-slate-900 dark:bg-zinc-100 text-white dark:text-zinc-950 font-bold text-xs hover:opacity-90 transition-opacity"
                    >
                      Shop Collection
                    </button>
                  </motion.div>
                ) : (
                  items.map(item => (
                    <motion.div
                      key={item.id}
                      layout={!prefersReducedMotion}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -100 }}
                      className="flex gap-4 p-3 rounded-2xl bg-slate-50 dark:bg-zinc-900/40 border border-slate-100 dark:border-zinc-900/50 group"
                    >
                      {/* Image Thumbnail */}
                      <div className="w-20 h-20 rounded-xl overflow-hidden bg-slate-100 dark:bg-zinc-800 flex-shrink-0">
                        <img src={item.image} alt={item.title} className="w-full h-full object-cover" loading="lazy" decoding="async" />
                      </div>

                      {/* Info & Quantity controls */}
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-start">
                            <h4 className="text-sm font-bold text-slate-800 dark:text-zinc-100 leading-tight line-clamp-1">
                              {item.title}
                            </h4>
                            <button
                              onClick={() => removeItem(item.id)}
                              className="text-slate-400 hover:text-red-500 p-1 opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity rounded"
                              aria-label="Remove item"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          {(item.size || item.color) && (
                            <p className="text-[11px] font-semibold text-slate-500 dark:text-zinc-500 mt-1">
                              {item.color} • Size {item.size}
                            </p>
                          )}
                        </div>

                        <div className="flex items-center justify-between mt-2">
                          {/* Quantity Counter Widget */}
                          <div className="flex items-center bg-slate-200/60 dark:bg-zinc-800/80 rounded-lg p-0.5 border border-slate-300/30 dark:border-zinc-700/20">
                            <button
                              onClick={() => updateQuantity(item.id, -1)}
                              className="p-1 rounded-md text-slate-600 dark:text-zinc-400 hover:bg-white dark:hover:bg-zinc-700 transition-colors"
                              aria-label="Decrease quantity"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="px-2 text-xs font-black text-slate-800 dark:text-zinc-100 min-w-[20px] text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.id, 1)}
                              className="p-1 rounded-md text-slate-600 dark:text-zinc-400 hover:bg-white dark:hover:bg-zinc-700 transition-colors"
                              aria-label="Increase quantity"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>

                          <div className="text-sm font-black text-slate-900 dark:text-zinc-50">
                            ${(item.price * item.quantity).toFixed(2)}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>

            {/* Footer / Summary Checkouts */}
            {items.length > 0 && (
              <div className="p-6 border-t border-slate-200/60 dark:border-zinc-800/60 bg-white dark:bg-zinc-950">
                <div className="space-y-2.5 mb-6">
                  <div className="flex justify-between text-sm text-slate-500 dark:text-zinc-400">
                    <span className="font-semibold">Subtotal</span>
                    <span className="font-bold text-slate-800 dark:text-zinc-100">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-slate-500 dark:text-zinc-400">
                    <span className="font-semibold">Shipping</span>
                    <span className="font-bold text-slate-800 dark:text-zinc-100">
                      {diffToFreeShipping <= 0 ? "FREE" : "Calculated at checkout"}
                    </span>
                  </div>
                  <div className="h-[1px] bg-slate-200 dark:bg-zinc-800 my-2" />
                  <div className="flex justify-between text-base">
                    <span className="font-bold text-slate-800 dark:text-zinc-100">Estimated Total</span>
                    <span className="font-black text-slate-900 dark:text-zinc-50">${subtotal.toFixed(2)}</span>
                  </div>
                </div>

                <button
                  onClick={() => onCheckout && onCheckout(items)}
                  className={cn(
                    "w-full py-4 rounded-2xl bg-slate-900 hover:bg-slate-800 dark:bg-zinc-100 dark:hover:bg-zinc-200 text-white dark:text-zinc-950 font-bold",
                    "flex items-center justify-center gap-2 group transition-all"
                  )}
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </button>

                <p className="text-[10px] text-center text-slate-400 dark:text-zinc-500 mt-3 font-medium">
                  Taxes and duties calculated during final checkout process.
                </p>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};


// Tactile reduced motion hook helper
const usePrefersReducedMotion = (): boolean => {
  const [prefersReducedMotion, setPrefersReducedMotion] = React.useState(false);

  React.useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const listener = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };

    mediaQuery.addEventListener('change', listener);
    return () => {
      mediaQuery.removeEventListener('change', listener);
    };
  }, []);

  return prefersReducedMotion;
};

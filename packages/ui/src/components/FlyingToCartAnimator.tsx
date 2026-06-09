"use client";

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence} from "framer-motion";
import { ShoppingCart, Star, Plus } from 'lucide-react';
import { cn } from '../lib/cn';


export interface FlyingToCartAnimatorProps extends React.HTMLAttributes<HTMLDivElement> {
  productImage?: string;
  productName?: string;
  productPrice?: number;
  cartIconSelector?: string; // CSS selector of cart icon to fly to (optional, defaults to demo header cart)
}

interface FlyingItem {
  id: number;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  image: string;
}

export const FlyingToCartAnimator: React.FC<FlyingToCartAnimatorProps> = ({
  productImage = "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=200&auto=format&fit=crop",
  productName = "Apex Running Sneaker",
  productPrice = 120,
  cartIconSelector,
  className,
  ...props
}) => {
  const [flyingItems, setFlyingItems] = useState<FlyingItem[]>([]);
  const [cartCount, setCartCount] = useState(0);
  const [isCartBouncing, setIsCartBouncing] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const cartIconRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement>) => {
    // If user prefers reduced motion, skip the curve flight
    if (prefersReducedMotion) {
      setCartCount(prev => prev + 1);
      setIsCartBouncing(true);
      setTimeout(() => setIsCartBouncing(false), 300);
      return;
    }

    // Get source coordinates (the product thumbnail or click target)
    let startX = e.clientX;
    let startY = e.clientY;

    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      startX = rect.left + rect.width / 2;
      startY = rect.top + rect.height / 2;
    }

    // Get target coordinates (the cart icon)
    let endX = window.innerWidth - 100;
    let endY = 50;

    const targetEl = cartIconSelector 
      ? document.querySelector(cartIconSelector) 
      : cartIconRef.current;

    if (targetEl) {
      const rect = targetEl.getBoundingClientRect();
      endX = rect.left + rect.width / 2;
      endY = rect.top + rect.height / 2;
    }

    const newItem: FlyingItem = {
      id: Date.now() + Math.random(),
      startX,
      startY,
      endX,
      endY,
      image: productImage
    };

    setFlyingItems(prev => [...prev, newItem]);
  };

  const handleFlightComplete = (id: number) => {
    // Remove the item from list
    setFlyingItems(prev => prev.filter(item => item.id !== id));
    
    // Increment cart count & trigger landing bounce reaction
    setCartCount(prev => prev + 1);
    setIsCartBouncing(true);
    setTimeout(() => setIsCartBouncing(false), 450);
  };

  return (
    <div
      className={cn(
        "w-full max-w-xl bg-slate-50 dark:bg-zinc-950 border border-slate-200/60 dark:border-zinc-800/60 rounded-[32px] overflow-hidden p-6 shadow-lg relative",
        className
      )}
      {...props}
    >
      {/* Demo Floating Header with interactive Cart Icon */}
      <div className="w-full flex items-center justify-between py-3 px-4 bg-white dark:bg-zinc-900 rounded-2xl border border-slate-100 dark:border-zinc-800/40 shadow-sm mb-6">
        <span className="text-sm font-black tracking-wider text-slate-800 dark:text-zinc-100 flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 bg-indigo-500 rounded-full animate-pulse" />
          APEX STUDIO
        </span>
        
        {/* Dynamic Bounce Cart target */}
        <motion.div
          ref={cartIconRef}
          animate={{
            scale: isCartBouncing ? [1, 1.35, 0.95, 1.05, 1] : 1,
            rotate: isCartBouncing ? [0, -12, 10, -5, 0] : 0,
          }}
          transition={{ duration: 0.45, ease: "easeInOut" }}
          className={cn(
            "relative p-3 rounded-full bg-slate-100 dark:bg-zinc-800 text-slate-800 dark:text-zinc-100 cursor-pointer shadow-sm select-none",
            isCartBouncing && "bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400"
          )}
        >
          <ShoppingCart className="w-5 h-5" />
          <AnimatePresence>
            {cartCount > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                className="absolute -top-1.5 -right-1.5 bg-indigo-600 text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-white dark:border-zinc-900"
              >
                {cartCount}
              </motion.span>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Main Sandbox Interactive Product Card */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-white dark:bg-zinc-900/40 p-5 rounded-2xl border border-slate-100 dark:border-zinc-900/30">
        <div className="relative aspect-square rounded-xl overflow-hidden bg-slate-100 dark:bg-zinc-800">
          <img
            src={productImage}
            alt={productName}
            className="w-full h-full object-cover"
            loading="lazy"
            decoding="async"
          />
        </div>

        <div className="flex flex-col justify-between py-1">
          <div>
            <span className="text-[10px] font-black text-indigo-500 uppercase tracking-widest block mb-1">
              New Release
            </span>
            <h4 className="text-lg font-bold text-slate-800 dark:text-zinc-100 leading-snug">
              {productName}
            </h4>
            <div className="flex items-center gap-1 mt-1 text-slate-400">
              <Star className="w-3.5 h-3.5 fill-amber-400 stroke-amber-400" />
              <span className="text-xs font-bold text-slate-500 dark:text-zinc-400">4.9 (142 reviews)</span>
            </div>
            
            <p className="text-xs font-semibold text-slate-500 dark:text-zinc-400 mt-3 leading-relaxed">
              Equipped with our signature response-spring foam midsoles for athletic high performance.
            </p>
          </div>

          <div className="mt-5 space-y-4">
            <div className="text-2xl font-black text-slate-900 dark:text-white">
              ${productPrice}.00
            </div>

            {/* Flying trigger action button */}
            <button
              ref={buttonRef}
              onClick={handleAddToCart}
              className={cn(
                "w-full py-3.5 rounded-xl font-bold flex items-center justify-center gap-2",
                "bg-slate-900 hover:bg-slate-800 text-white dark:bg-zinc-100 dark:hover:bg-zinc-200 dark:text-zinc-950",
                "transition-colors shadow-md outline-none"
              )}
            >
              <Plus className="w-4 h-4" />
              <span>Add to Cart</span>
            </button>
          </div>
        </div>
      </div>

      {/* Fly Animation Overlay Portal Layer */}
      <AnimatePresence>
        {flyingItems.map(item => (
          <motion.div
            key={item.id}
            initial={{
              position: 'fixed',
              top: item.startY,
              left: item.startX,
              x: '-50%',
              y: '-50%',
              scale: 1,
              opacity: 1,
              zIndex: 9999,
            }}
            animate={{
              left: item.endX,
              top: [item.startY, item.startY - 180, item.endY], // Parabolic height jump
              scale: [1, 0.7, 0.25],
              opacity: [1, 0.9, 0],
            }}
            transition={{
              duration: 0.9,
              ease: [0.25, 0.46, 0.45, 0.94], // Smooth curved trajectory timing
            }}
            onAnimationComplete={() => handleFlightComplete(item.id)}
            className="w-16 h-16 rounded-full overflow-hidden border-2 border-indigo-500 bg-white shadow-lg pointer-events-none"
          >
            <img src={item.image} alt="Flying item" className="w-full h-full object-cover" loading="lazy" decoding="async" />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
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

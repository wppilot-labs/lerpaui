"use client";

import React, { useState } from 'react';
import { motion} from "framer-motion";
import { ShoppingBag, Star, Heart } from 'lucide-react';
import { cn } from '../lib/cn';


export interface ColorSwatch {
  id: string;
  name: string;
  className: string; // Tailwind class, e.g., 'bg-red-500'
  colorCode: string; // hex or HSL value
}

export interface NeumorphicOutsetProductCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  price?: number;
  rating?: number;
  image?: string;
  category?: string;
  colors?: ColorSwatch[];
  sizes?: string[];
  onAddToCart?: (selectedColor: string, selectedSize: string) => void;
}

const defaultColors: ColorSwatch[] = [
  { id: '1', name: 'Desert Clay', className: 'bg-[#d27d59]', colorCode: '#d27d59' },
  { id: '2', name: 'Slate Gray', className: 'bg-[#5e6b75]', colorCode: '#5e6b75' },
  { id: '3', name: 'Sage Green', className: 'bg-[#8ca18c]', colorCode: '#8ca18c' },
  { id: '4', name: 'Obsidian', className: 'bg-[#292d30]', colorCode: '#292d30' },
];

const defaultSizes = ['S', 'M', 'L', 'XL'];

export const NeumorphicOutsetProductCard: React.FC<NeumorphicOutsetProductCardProps> = ({
  title = "Premium Minimalist Parka",
  price = 189,
  rating = 4.8,
  image = "https://images.unsplash.com/photo-1544022613-e87ca75a784a?q=80&w=800&auto=format&fit=crop",
  category = "Essential Outerwear",
  colors = defaultColors,
  sizes = defaultSizes,
  onAddToCart,
  className,
  ...props
}) => {
  const [selectedColor, setSelectedColor] = useState(colors[0]);
  const [selectedSize, setSelectedSize] = useState(sizes[1]);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const prefersReducedMotion = usePrefersReducedMotion();

  // Neumorphic spring configuration
  const springConfig = {
    type: "spring",
    stiffness: 180,
    damping: 25,
    mass: 0.5,
  };

  const handlePress = () => {
    setIsPressed(true);
    setTimeout(() => {
      setIsPressed(false);
      if (onAddToCart) {
        onAddToCart(selectedColor.name, selectedSize);
      }
    }, 200);
  };

  return (
    <div
      className={cn(
        "w-full max-w-sm rounded-[32px] p-6 bg-slate-100 dark:bg-zinc-900 transition-colors duration-300 select-none",
        className
      )}
      {...props}
    >
      {/* Product Image Frame (Inset neumorphic container) */}
      <div 
        className="w-full h-64 rounded-2xl p-3 flex items-center justify-center relative overflow-hidden bg-slate-100 dark:bg-zinc-900 border border-white/20 dark:border-black/20"
        style={{
          boxShadow: 'inset 6px 6px 12px rgba(0,0,0,0.06), inset -6px -6px 12px rgba(255,255,255,0.7), inset 0px 0px 0px 1px rgba(0,0,0,0.02)',
        }}
      >
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover rounded-xl transition-transform duration-500 hover:scale-105"
        />
        
        {/* Floating Category Tag */}
        <span className="absolute top-4 left-4 text-xs font-semibold px-3 py-1.5 rounded-full bg-slate-100/90 dark:bg-zinc-950/80 backdrop-blur-md text-slate-600 dark:text-zinc-400 shadow-sm">
          {category}
        </span>

        {/* Favorite Button (Neumorphic circular toggle) */}
        <button
          type="button"
          aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
          onClick={() => setIsFavorite(!isFavorite)}
          className={cn(
            "absolute top-4 right-4 p-2.5 rounded-full transition-all duration-300 outline-none",
            "bg-slate-100 dark:bg-zinc-900 text-slate-500 dark:text-zinc-400",
            isFavorite 
              ? "shadow-[inset_2px_2px_5px_rgba(0,0,0,0.1),_inset_-2px_-2px_5px_rgba(255,255,255,0.7)] text-red-500 dark:text-red-400"
              : "shadow-[4px_4px_8px_rgba(0,0,0,0.06),_-4px_-4px_8px_rgba(255,255,255,0.8)] dark:shadow-[4px_4px_8px_rgba(0,0,0,0.4),_-4px_-4px_8px_rgba(255,255,255,0.04)]"
          )}
        >
          <Heart className={cn("w-4 h-4 fill-none transition-colors", isFavorite && "fill-current")} />
        </button>
      </div>

      {/* Title & Rating */}
      <div className="mt-6 flex justify-between items-start">
        <div>
          <h3 className="text-xl font-bold tracking-tight text-slate-800 dark:text-zinc-100">
            {title}
          </h3>
          <div className="flex items-center gap-1.5 mt-1.5">
            <div className="flex text-amber-500">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  className={cn(
                    "w-3.5 h-3.5", 
                    i < Math.floor(rating) ? "fill-current" : "opacity-30"
                  )} 
                />
              ))}
            </div>
            <span className="text-xs font-semibold text-slate-500 dark:text-zinc-400">
              {rating.toFixed(1)} Reviews
            </span>
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-black text-slate-900 dark:text-white">
            ${price}
          </div>
          <span className="text-[10px] uppercase font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full">
            In Stock
          </span>
        </div>
      </div>

      {/* Tactile Color Swatches */}
      <div className="mt-6">
        <label className="text-xs font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider block mb-2.5">
          Color: <span className="text-slate-700 dark:text-zinc-300 font-semibold">{selectedColor.name}</span>
        </label>
        <div className="flex gap-4">
          {colors.map((c) => {
            const isSelected = selectedColor.id === c.id;
            return (
              <button
                key={c.id}
                type="button"
                aria-label={`Select color ${c.name}`}
                onClick={() => setSelectedColor(c)}
                className={cn(
                  "w-8 h-8 rounded-full p-0.5 flex items-center justify-center transition-all duration-300 focus:outline-none",
                  isSelected
                    ? "shadow-[inset_2px_2px_4px_rgba(0,0,0,0.15),_inset_-2px_-2px_4px_rgba(255,255,255,0.7)] ring-2 ring-slate-400 dark:ring-zinc-600"
                    : "shadow-[3px_3px_6px_rgba(0,0,0,0.08),_-3px_-3px_6px_rgba(255,255,255,0.8)] dark:shadow-[3px_3px_6px_rgba(0,0,0,0.3),_-3px_-3px_6px_rgba(255,255,255,0.04)]"
                )}
              >
                <span 
                  className={cn("w-full h-full rounded-full block border border-black/5")} 
                  style={{ backgroundColor: c.colorCode }}
                />
              </button>
            );
          })}
        </div>
      </div>

      {/* Sizing buttons */}
      <div className="mt-6">
        <span className="text-xs font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider block mb-2.5">
          Select Size
        </span>
        <div className="grid grid-cols-4 gap-3">
          {sizes.map((s) => {
            const isSelected = selectedSize === s;
            return (
              <button
                key={s}
                type="button"
                onClick={() => setSelectedSize(s)}
                className={cn(
                  "py-2.5 text-sm font-semibold rounded-xl transition-all duration-200 outline-none",
                  isSelected
                    ? "bg-slate-200 dark:bg-zinc-800 text-slate-800 dark:text-zinc-100 shadow-[inset_3px_3px_6px_rgba(0,0,0,0.1),_inset_-3px_-3px_6px_rgba(255,255,255,0.6)]"
                    : "bg-slate-100 dark:bg-zinc-900 text-slate-600 dark:text-zinc-400 shadow-[3px_3px_6px_rgba(0,0,0,0.06),_-3px_-3px_6px_rgba(255,255,255,0.7)] dark:shadow-[3px_3px_6px_rgba(0,0,0,0.3),_-3px_-3px_6px_rgba(255,255,255,0.04)] hover:scale-[1.02]"
                )}
              >
                {s}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tactile Outset Add To Cart Button */}
      <div className="mt-8">
        <motion.button
          type="button"
          onClick={handlePress}
          animate={prefersReducedMotion ? {} : {
            scale: isPressed ? 0.97 : 1,
          }}
          transition={springConfig}
          className={cn(
            "w-full py-4 px-6 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all duration-300 focus:outline-none border border-transparent active:scale-[0.98]",
            isPressed
              ? "bg-slate-200 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 shadow-[inset_4px_4px_8px_rgba(0,0,0,0.15),_inset_-4px_-4px_8px_rgba(255,255,255,0.6)]"
              : "bg-primary text-primary-foreground shadow-[6px_6px_12px_rgba(0,0,0,0.08),_-6px_-6px_12px_rgba(255,255,255,0.8)] dark:shadow-[6px_6px_12px_rgba(0,0,0,0.35),_-6px_-6px_12px_rgba(255,255,255,0.04)] hover:opacity-95"
          )}
        >
          <ShoppingBag className="w-5 h-5" />
          <span>Add to Bag</span>
        </motion.button>
      </div>
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

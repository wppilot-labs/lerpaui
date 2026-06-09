"use client";

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence} from "framer-motion";
import { X, Heart, Trash2, ShoppingCart, Loader2, ArrowRight } from 'lucide-react';
import { cn } from '../lib/cn';

export interface SavedItem {
  id: string;
  title: string;
  price: string;
  image: string;
  category: string;
  inStock: boolean;
}

export interface SaveForLaterListDrawerProps extends React.HTMLAttributes<HTMLDivElement> {
  isOpen: boolean;
  onClose: () => void;
  items?: SavedItem[];
  onRemoveItem?: (id: string) => void;
  onMoveToCart?: (id: string) => void;
  onMoveAllToCart?: () => void;
}

function usePrefersReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
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
}

const DEFAULT_ITEMS: SavedItem[] = [
  {
    id: 'save-1',
    title: 'Precision Bluetooth Trackpad',
    price: '$129.00',
    image: 'https://images.unsplash.com/photo-1541140111813-8222e9d90981?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    category: 'Computer Accessories',
    inStock: true
  },
  {
    id: 'save-2',
    title: 'Solid Brass Desk Fountain Pen',
    price: '$75.00',
    image: 'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    category: 'Stationery',
    inStock: true
  },
  {
    id: 'save-3',
    title: 'MagSafe Leather Card Sleeve',
    price: '$59.00',
    image: 'https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    category: 'Mobile Accessories',
    inStock: false
  }
];

export const SaveForLaterListDrawer = React.forwardRef<
  HTMLDivElement,
  SaveForLaterListDrawerProps
>(({
  className,
  isOpen,
  onClose,
  items = DEFAULT_ITEMS,
  onRemoveItem,
  onMoveToCart,
  onMoveAllToCart,
  ...props
}, ref) => {
  const prefersReducedMotion = usePrefersReducedMotion();
  const [list, setList] = useState<SavedItem[]>(items);
  const [movingId, setMovingId] = useState<string | null>(null);

  // Sync state with props
  useEffect(() => {
    setList(items);
  }, [items]);

  // Lock scroll when open
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Escape key close listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const handleRemove = (id: string) => {
    setList((prev) => prev.filter((item) => item.id !== id));
    onRemoveItem?.(id);
  };

  const handleMove = (id: string) => {
    setMovingId(id);
    setTimeout(() => {
      setList((prev) => prev.filter((item) => item.id !== id));
      onMoveToCart?.(id);
      setMovingId(null);
    }, 700); // simulation delay for micro-animation feel
  };

  const handleMoveAll = () => {
    if (onMoveAllToCart) {
      onMoveAllToCart();
    }
    setList([]);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          ref={ref}
          className={cn('fixed inset-0 z-50 flex flex-col justify-end select-none', className)}
          {...props}
        >
          {/* Fading Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-[4px] cursor-pointer"
          />

          {/* Drawer Body Sliding Container */}
          <motion.div
            initial={prefersReducedMotion ? { y: 0, opacity: 0.95 } : { y: '100%' }}
            animate={{ y: 0, opacity: 1 }}
            exit={prefersReducedMotion ? { opacity: 0 } : { y: '100%' }}
            transition={{
              type: 'spring',
              stiffness: 280,
              damping: 26,
            }}
            className="relative w-full max-w-2xl mx-auto rounded-t-[32px] border-t border-border bg-card shadow-2xl overflow-hidden max-h-[85vh] flex flex-col z-10"
          >
            {/* Grab Drag handle indicator */}
            <div className="mx-auto my-3 w-12 h-1.5 rounded-full bg-muted-foreground/20" />

            {/* Header section */}
            <div className="px-6 pb-4 border-b border-border/80 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-pink-500/10 text-pink-600 rounded-xl">
                  <Heart className="w-5 h-5 fill-pink-500/20" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-foreground">Save For Later</h3>
                  <p className="text-xs text-muted-foreground font-semibold">
                    {list.length} item{list.length !== 1 && 's'} saved in your profile
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="p-2 rounded-full border border-border/60 hover:bg-muted text-muted-foreground hover:text-foreground transition-all"
                title="Close drawer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* List item scrollbox */}
            <div className="flex-1 overflow-y-auto px-6 py-4 scrollbar-thin">
              <AnimatePresence initial={false}>
                {list.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center justify-center py-16 text-center"
                  >
                    <div className="p-4 bg-muted/40 rounded-full mb-4">
                      <Heart className="w-8 h-8 text-muted-foreground/40" />
                    </div>
                    <h4 className="text-base font-extrabold text-foreground">No saved items found</h4>
                    <p className="text-xs text-muted-foreground mt-1 max-w-xs leading-relaxed">
                      Your shelf is empty! Browse items and click the bookmark button to save them here.
                    </p>
                  </motion.div>
                ) : (
                  <div className="space-y-4">
                    {list.map((item) => (
                      <motion.div
                        key={item.id}
                        layout
                        initial={prefersReducedMotion ? {} : { opacity: 0, y: 15 }}
                        animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
                        exit={prefersReducedMotion ? {} : { opacity: 0, x: -60 }}
                        transition={{ type: 'spring', stiffness: 220, damping: 20 }}
                        className={cn(
                          'flex items-center gap-4 p-3.5 rounded-2xl border border-border/80 bg-card hover:bg-muted/10 transition-colors shadow-sm relative overflow-hidden',
                          movingId === item.id && 'opacity-60 bg-emerald-500/5 border-emerald-500/20'
                        )}
                      >
                        {/* Image Panel */}
                        <div className="w-16 h-16 rounded-xl overflow-hidden bg-muted flex items-center justify-center border border-border/60 shrink-0">
                          <img
                            src={item.image}
                            alt={item.title}
                            className="w-4/5 h-4/5 object-contain"
                          />
                        </div>

                        {/* Detail text */}
                        <div className="flex-1 min-w-0">
                          <span className="text-[9px] font-extrabold uppercase text-muted-foreground tracking-wider bg-secondary px-2 py-0.5 rounded-md">
                            {item.category}
                          </span>
                          <h4 className="text-sm font-black text-foreground truncate mt-1 leading-tight">
                            {item.title}
                          </h4>
                          <div className="flex items-center gap-3 mt-1.5">
                            <span className="text-sm font-black text-primary">{item.price}</span>
                            <span
                              className={cn(
                                'text-[9px] font-black uppercase tracking-wide px-1.5 py-0.5 rounded',
                                item.inStock
                                  ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                                  : 'bg-destructive/10 text-destructive'
                              )}
                            >
                              {item.inStock ? 'In Stock' : 'Out of Stock'}
                            </span>
                          </div>
                        </div>

                        {/* Interactive Buttons */}
                        <div className="flex items-center gap-2 ml-auto shrink-0">
                          {/* Remove button */}
                          <button
                            type="button"
                            onClick={() => handleRemove(item.id)}
                            className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-xl transition-all"
                            title="Remove from saved"
                          >
                            <Trash2 className="w-4.5 h-4.5" />
                          </button>

                          {/* Move to Cart button */}
                          <button
                            type="button"
                            onClick={() => handleMove(item.id)}
                            disabled={!item.inStock || movingId !== null}
                            className={cn(
                              'flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold shadow-sm transition-all border',
                              item.inStock
                                ? 'bg-primary text-primary-foreground border-transparent hover:bg-primary/90 active:scale-95'
                                : 'bg-muted text-muted-foreground border-border cursor-not-allowed'
                            )}
                            title="Move item to cart"
                          >
                            {movingId === item.id ? (
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                              <ShoppingCart className="w-3.5 h-3.5" />
                            )}
                            <span className="hidden sm:inline">Move to Cart</span>
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </AnimatePresence>
            </div>

            {/* Bottom sticky drawer footer action panel */}
            {list.length > 0 && (
              <div className="px-6 py-5 border-t border-border/80 bg-muted/20 flex flex-col sm:flex-row items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={handleMoveAll}
                  className="flex items-center gap-2 text-xs font-bold text-primary hover:text-primary/80 transition-colors"
                >
                  <span>Move all in stock to Cart</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                <div className="flex items-center gap-2.5 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={onClose}
                    className="w-1/2 sm:w-auto px-5 py-3 border border-border rounded-xl text-xs font-bold text-foreground hover:bg-muted transition-colors"
                  >
                    Keep Shopping
                  </button>
                  <button
                    type="button"
                    onClick={handleMoveAll}
                    className="w-1/2 sm:w-auto px-5 py-3 bg-primary text-primary-foreground font-black text-xs rounded-xl shadow-md hover:bg-primary/90 active:scale-97 transition-all flex items-center justify-center gap-1.5"
                  >
                    <ShoppingCart className="w-3.5 h-3.5" />
                    <span>Cart Checkout</span>
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
});

SaveForLaterListDrawer.displayName = 'SaveForLaterListDrawer';

"use client";

import React, { useRef, useState, useEffect } from 'react';
import {motion, AnimatePresence, useAnimationControls, type PanInfo } from "framer-motion";
import { Heart, Trash2, Move, AlertCircle, ShoppingBag } from 'lucide-react';
import { cn } from '../lib/cn';

export interface DraggableProduct {
  id: string;
  title: string;
  price: string;
  image: string;
  category: string;
}

export interface DraggableWishlistProductCardProps extends React.HTMLAttributes<HTMLDivElement> {
  product?: DraggableProduct;
  onAddToWishlist?: (product: DraggableProduct) => void;
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

export const DraggableWishlistProductCard = React.forwardRef<
  HTMLDivElement,
  DraggableWishlistProductCardProps
>(({ className, product, onAddToWishlist, ...props }, ref) => {
  const defaultProduct: DraggableProduct = {
    id: 'prod-drag-1',
    title: 'Minimalist Leather Backpack',
    price: '$189.00',
    image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    category: 'Travel Gear'
  };

  const activeProduct = product || defaultProduct;
  const prefersReducedMotion = usePrefersReducedMotion();

  const containerRef = useRef<HTMLDivElement>(null);
  const bucketRef = useRef<HTMLDivElement>(null);
  const cardControls = useAnimationControls();

  const [isDragging, setIsDragging] = useState(false);
  const [wishlistItems, setWishlistItems] = useState<DraggableProduct[]>([]);
  const [justAdded, setJustAdded] = useState(false);
  const [isHoveringBucket, setIsHoveringBucket] = useState(false);

  const handleDragStart = () => {
    setIsDragging(true);
  };

  const handleDragEnd = (event: unknown, info: PanInfo) => {
    setIsDragging(false);
    setIsHoveringBucket(false);

    const bucketEl = bucketRef.current;
    if (!bucketEl) return;

    // Get bucket position bounds
    const rect = bucketEl.getBoundingClientRect();
    const cursorX = info.point.x;
    const cursorY = info.point.y;

    // Check if drop location falls inside the wishlist bucket bounds
    const isInsideBucket =
      cursorX >= rect.left &&
      cursorX <= rect.right &&
      cursorY >= rect.top &&
      cursorY <= rect.bottom;

    if (isInsideBucket) {
      triggerAddToWishlist();
    } else {
      // Reset card to original position with spring
      cardControls.start({ x: 0, y: 0 });
    }
  };

  const triggerAddToWishlist = () => {
    // Check if already in list
    if (wishlistItems.some((item) => item.id === activeProduct.id)) {
      cardControls.start({ x: 0, y: 0 });
      return;
    }

    setJustAdded(true);
    setWishlistItems((prev) => [...prev, activeProduct]);
    onAddToWishlist?.(activeProduct);

    // Trigger shrink and pop animation
    cardControls.start({
      scale: 0.1,
      opacity: 0,
      y: 100,
      transition: { duration: 0.35, ease: 'easeOut' },
    }).then(() => {
      // Bounce back into place
      setTimeout(() => {
        cardControls.start({
          scale: 1,
          opacity: 1,
          x: 0,
          y: 0,
          transition: { type: 'spring', stiffness: 150, damping: 15 },
        });
        setJustAdded(false);
      }, 800);
    });
  };

  const handleRemoveFromWishlist = (id: string) => {
    setWishlistItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleDragUpdate = (event: unknown, info: PanInfo) => {
    const bucketEl = bucketRef.current;
    if (!bucketEl) return;

    const rect = bucketEl.getBoundingClientRect();
    const cursorX = info.point.x;
    const cursorY = info.point.y;

    const isInside =
      cursorX >= rect.left &&
      cursorX <= rect.right &&
      cursorY >= rect.top &&
      cursorY <= rect.bottom;

    setIsHoveringBucket(isInside);
  };

  return (
    <div
      ref={ref || containerRef}
      className={cn(
        'relative w-full max-w-lg mx-auto border border-border bg-background rounded-3xl p-6 shadow-sm overflow-hidden flex flex-col gap-6 select-none',
        className
      )}
      {...props}
    >
      {/* Header Info */}
      <div className="flex flex-col gap-1 border-b border-border/80 pb-4">
        <h3 className="text-lg font-extrabold text-foreground flex items-center gap-2">
          <span>Draggable Wishlist Card</span>
          <span className="text-xs px-2.5 py-0.5 rounded-full bg-primary/10 text-primary font-bold animate-pulse">
            Interactive
          </span>
        </h3>
        <p className="text-xs text-muted-foreground flex items-center gap-1.5">
          <AlertCircle className="w-3.5 h-3.5" />
          {prefersReducedMotion
            ? 'Reduced motion mode: Click the heart button to add.'
            : 'Grab the card, drag it anywhere, and drop it in the wishlist area below.'}
        </p>
      </div>

      {/* DRAGGABLE CARD CANVAS AREA */}
      <div className="relative min-h-[340px] flex items-center justify-center bg-muted/20 border border-dashed border-border/60 rounded-2xl p-4 overflow-hidden">
        {/* Card Component */}
        <motion.div
          drag={!prefersReducedMotion && !justAdded}
          dragConstraints={containerRef}
          dragElastic={0.4}
          animate={cardControls}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onDrag={handleDragUpdate}
          whileDrag={{ scale: 1.05, zIndex: 50, cursor: 'grabbing' }}
          className={cn(
            'w-full max-w-[280px] rounded-2xl border border-border bg-card p-4 shadow-md flex flex-col justify-between cursor-grab active:cursor-grabbing transition-shadow duration-300 relative group',
            isDragging && 'shadow-2xl ring-2 ring-primary/20'
          )}
        >
          {/* Top category & Drag Icon */}
          <div className="flex justify-between items-center text-muted-foreground">
            <span className="text-[10px] font-bold uppercase tracking-wider bg-secondary px-2 py-0.5 rounded-md">
              {activeProduct.category}
            </span>
            <div className="flex items-center gap-2">
              {!prefersReducedMotion && (
                <Move className="w-4 h-4 text-muted-foreground/40 group-hover:text-muted-foreground transition-colors" />
              )}
              {/* Accessibility Click Button */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  triggerAddToWishlist();
                }}
                className={cn(
                  'p-1.5 rounded-full transition-colors hover:bg-muted text-red-500',
                  wishlistItems.some(i => i.id === activeProduct.id) && 'bg-red-50 text-red-600'
                )}
                title="Add to Wishlist"
              >
                <Heart
                  className={cn(
                    'w-4 h-4',
                    wishlistItems.some(i => i.id === activeProduct.id) ? 'fill-red-500 text-red-500' : 'text-muted-foreground'
                  )}
                />
              </button>
            </div>
          </div>

          {/* Product Image */}
          <div className="h-32 flex items-center justify-center my-3 relative overflow-hidden rounded-xl bg-muted/40">
            <img
              src={activeProduct.image}
              alt={activeProduct.title}
              className="max-h-24 w-auto object-contain pointer-events-none"
            />
          </div>

          {/* Details */}
          <div>
            <h4 className="font-bold text-foreground text-sm line-clamp-1">
              {activeProduct.title}
            </h4>
            <div className="flex items-center justify-between mt-2">
              <span className="text-base font-black text-primary">{activeProduct.price}</span>
              <span className="text-[9px] font-bold text-muted-foreground uppercase flex items-center gap-1">
                <ShoppingBag className="w-3 h-3" /> Instock
              </span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* WISHLIST BUCKET AREA */}
      <motion.div
        ref={bucketRef}
        animate={{
          scale: isDragging ? 1.02 : 1,
          borderColor: isHoveringBucket
            ? 'var(--color-primary, #6366f1)'
            : isDragging
            ? 'rgba(99, 102, 241, 0.4)'
            : 'var(--color-border, #e5e7eb)',
          backgroundColor: isHoveringBucket
            ? 'rgba(99, 102, 241, 0.08)'
            : isDragging
            ? 'rgba(99, 102, 241, 0.02)'
            : 'var(--color-card, #ffffff)',
        }}
        className={cn(
          'w-full rounded-2xl border p-4 shadow-inner flex flex-col gap-3 min-h-[110px] transition-all relative overflow-hidden',
          isHoveringBucket && 'shadow-md ring-2 ring-primary/20'
        )}
      >
        {/* Background glow or details */}
        <div className="flex justify-between items-center text-xs border-b border-border/40 pb-2">
          <span className="font-extrabold text-foreground flex items-center gap-2">
            <Heart className={cn('w-4 h-4', wishlistItems.length > 0 ? 'text-red-500 fill-red-500 animate-pulse' : 'text-muted-foreground')} />
            <span>Wishlist Container ({wishlistItems.length})</span>
          </span>
          <span className="text-[10px] text-muted-foreground font-semibold">
            {isDragging ? 'Drop here to add!' : 'Saved items'}
          </span>
        </div>

        {/* Saved List elements */}
        <div className="flex items-center gap-2 overflow-x-auto py-1 scrollbar-thin">
          <AnimatePresence>
            {wishlistItems.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-full text-center text-xs text-muted-foreground py-4"
              >
                No items saved yet. Drop a card to test!
              </motion.div>
            ) : (
              wishlistItems.map((item) => (
                <motion.div
                  key={item.id}
                  layoutId={item.id}
                  initial={{ scale: 0.8, opacity: 0, x: -10 }}
                  animate={{ scale: 1, opacity: 1, x: 0 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  className="flex items-center gap-2 bg-muted/60 hover:bg-muted border border-border/60 py-1.5 pl-2 pr-1.5 rounded-xl min-w-[140px] shrink-0 text-left relative group/item"
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-8 h-8 object-contain rounded bg-white p-0.5 border border-border/40"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-bold text-foreground truncate">{item.title}</p>
                    <p className="text-[9px] font-black text-primary">{item.price}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveFromWishlist(item.id)}
                    className="p-1 text-muted-foreground hover:text-red-500 rounded-md hover:bg-red-50 transition-all opacity-0 group-hover/item:opacity-100"
                    title="Remove item"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
});

DraggableWishlistProductCard.displayName = 'DraggableWishlistProductCard';

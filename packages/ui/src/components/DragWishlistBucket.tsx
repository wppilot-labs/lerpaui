"use client";

import React, { useState, useRef } from "react";
import {motion, AnimatePresence, useReducedMotion, type PanInfo } from "framer-motion";
import { cn } from "../lib/cn";
import { Heart, Trash2, RotateCcw, ShoppingBag, Move, Plus } from "lucide-react";

export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  gradient: string;
  icon: React.ReactNode;
}

export interface DragWishlistBucketProps {
  className?: string;
  /** Products to render. Resetting restores this list. */
  products?: Product[];
  /** Title shown in the header. */
  title?: string;
  /** Subtitle shown below the title. */
  subtitle?: string;
  /** Bucket header label. */
  bucketLabel?: string;
  /** Called when a product is dropped into the wishlist. */
  onAdd?: (product: Product) => void;
  /** Called when a product is removed from the wishlist. */
  onRemove?: (product: Product) => void;
}

export function DragWishlistBucket({
  className,
  products: productsProp,
  title = "Drag-to-Wishlist Playground",
  subtitle = "Grab any item and drop it directly onto the Wishlist Bucket below.",
  bucketLabel = "Wishlist Bucket",
  onAdd,
  onRemove,
}: DragWishlistBucketProps) {
  // 6 Premium Products to display (default catalog)
  const INITIAL_PRODUCTS: Product[] = [
    {
      id: "prod-1",
      name: "Aura Sound Max",
      price: 299,
      category: "Audio",
      gradient: "from-blue-600 via-indigo-600 to-violet-600",
      icon: (
        <svg className="w-12 h-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
        </svg>
      ),
    },
    {
      id: "prod-2",
      name: "Nebula Watch Pro",
      price: 349,
      category: "Wearables",
      gradient: "from-purple-600 via-fuchsia-600 to-pink-600",
      icon: (
        <svg className="w-12 h-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      id: "prod-3",
      name: "Apex Charger X",
      price: 89,
      category: "Accessories",
      gradient: "from-emerald-600 via-teal-600 to-cyan-600",
      icon: (
        <svg className="w-12 h-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
    },
    {
      id: "prod-4",
      name: "Lumen Key Light",
      price: 150,
      category: "Studio",
      gradient: "from-rose-600 via-orange-500 to-yellow-500",
      icon: (
        <svg className="w-12 h-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-12.728l.707.707m12.728 12.728l.707-.707M12 7a5 5 0 100 10 5 5 0 000-10z" />
        </svg>
      ),
    },
    {
      id: "prod-5",
      name: "Quantum Mouse",
      price: 129,
      category: "Gaming",
      gradient: "from-neutral-700 via-slate-800 to-neutral-900",
      icon: (
        <svg className="w-12 h-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
        </svg>
      ),
    },
    {
      id: "prod-6",
      name: "Nova Speaker Mini",
      price: 79,
      category: "Audio",
      gradient: "from-red-600 via-rose-600 to-amber-500",
      icon: (
        <svg className="w-12 h-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
        </svg>
      ),
    },
  ];

  const effectiveInitial = productsProp ?? INITIAL_PRODUCTS;
  const prefersReducedMotion = useReducedMotion();
  const [products, setProducts] = useState<Product[]>(effectiveInitial);
  const [bucket, setBucket] = useState<Product[]>([]);
  const [activeDragId, setActiveDragId] = useState<string | null>(null);
  const [isOverBucket, setIsOverBucket] = useState(false);
  const [droppedId, setDroppedId] = useState<string | null>(null);

  const bucketRef = useRef<HTMLDivElement>(null);

  // Remove items that are already in the bucket from the visual grid
  const gridProducts = products.filter((p) => !bucket.some((b) => b.id === p.id) && p.id !== droppedId);

  // Monitor drag positions
  const handleDrag = (event: unknown, info: PanInfo) => {
    if (!bucketRef.current) return;
    const bucketRect = bucketRef.current.getBoundingClientRect();
    const x = info.point.x;
    const y = info.point.y;

    // Check intersection with pointer coordinates
    const intersecting =
      x >= bucketRect.left &&
      x <= bucketRect.right &&
      y >= bucketRect.top &&
      y <= bucketRect.bottom;

    setIsOverBucket(intersecting);
  };

  const handleDragStart = (id: string) => {
    setActiveDragId(id);
  };

  const handleDragEnd = (event: unknown, info: PanInfo, product: Product) => {
    setActiveDragId(null);
    if (!bucketRef.current) return;
    const bucketRect = bucketRef.current.getBoundingClientRect();
    const x = info.point.x;
    const y = info.point.y;

    const intersecting =
      x >= bucketRect.left &&
      x <= bucketRect.right &&
      y >= bucketRect.top &&
      y <= bucketRect.bottom;

    if (intersecting) {
      // Trigger vanishing animation
      setDroppedId(product.id);
      setIsOverBucket(false);

      // Timeout matching animation speed to officially add it to bucket
      setTimeout(() => {
        setBucket((prev) => {
          if (prev.some((item) => item.id === product.id)) return prev;
          return [...prev, product];
        });
        setDroppedId(null);
        onAdd?.(product);
      }, 250);
    } else {
      setIsOverBucket(false);
    }
  };

  const removeFromBucket = (id: string) => {
    const removed = bucket.find((item) => item.id === id);
    setBucket((prev) => prev.filter((item) => item.id !== id));
    if (removed) onRemove?.(removed);
  };

  const resetAll = () => {
    setBucket([]);
    setProducts(effectiveInitial);
    setDroppedId(null);
  };

  return (
    <div className={cn("w-full min-h-[600px] bg-background text-foreground flex flex-col p-6 rounded-3xl relative overflow-hidden border border-border shadow-2xl select-none", className)}>
      
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between pb-6 mb-6 border-b border-border/80 gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <Heart className="w-5 h-5 text-red-500 fill-red-500/20" />
            {title}
          </h2>
          <p className="text-xs text-muted-foreground">
            {subtitle}
          </p>
        </div>

        <button
          type="button"
          onClick={resetAll}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border bg-secondary hover:bg-secondary/80 text-secondary-foreground text-xs font-semibold tracking-wide transition-all shadow-sm active:scale-95 cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reset Items
        </button>
      </div>

      {/* Main Sandbox Grid */}
      <div className="flex-1 pb-32">
        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {gridProducts.map((product) => {
              const isTransitioning = droppedId === product.id;

              return (
                <motion.div
                  key={product.id}
                  layoutId={`card-${product.id}`}
                  drag
                  dragSnapToOrigin={true}
                  dragElastic={0.4}
                  onDragStart={() => handleDragStart(product.id)}
                  onDrag={handleDrag}
                  onDragEnd={(e, info) => handleDragEnd(e, info, product)}
                  animate={
                    isTransitioning
                      ? { scale: 0, opacity: 0, y: 150 }
                      : { scale: 1, opacity: 1, y: 0 }
                  }
                  exit={{ scale: 0, opacity: 0 }}
                  transition={prefersReducedMotion ? { duration: 0 } : { type: "spring", stiffness: 350, damping: 25 }}
                  whileDrag={prefersReducedMotion ? undefined : {
                    scale: 1.05,
                    boxShadow: "0 25px 50px -12px rgba(0,0,0,0.4)",
                    zIndex: 50,
                  }}
                  className={cn(
                    "group relative aspect-square rounded-2xl border border-border bg-card hover:border-border/60 transition-colors p-4 flex flex-col justify-between overflow-hidden shadow-md cursor-grab active:cursor-grabbing",
                    activeDragId === product.id ? "opacity-90" : ""
                  )}
                >
                  {/* Glass Card Sheen */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                  {/* Header Row */}
                  <div className="flex justify-between items-start w-full relative z-10">
                    <span className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground px-2 py-0.5 rounded-full bg-secondary/50">
                      {product.category}
                    </span>
                    <div className="flex items-center gap-1 text-muted-foreground/60 group-hover:text-muted-foreground transition-colors">
                      <Move className="w-3.5 h-3.5" />
                      <span className="text-3xs uppercase font-semibold">DRAG</span>
                    </div>
                  </div>

                  {/* Big Visual Product Graphic */}
                  <div className="flex-1 flex items-center justify-center relative py-6">
                    <div className={cn("absolute w-24 h-24 rounded-full blur-2xl opacity-20 bg-gradient-to-tr", product.gradient)} />
                    <motion.div
                      whileHover={prefersReducedMotion ? undefined : { scale: 1.1, rotate: 3 }}
                      className={cn("w-20 h-20 rounded-2xl flex items-center justify-center shadow-lg relative bg-gradient-to-tr", product.gradient)}
                    >
                      {product.icon}
                    </motion.div>
                  </div>

                  {/* Footer Row */}
                  <div className="flex justify-between items-end w-full relative z-10">
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold tracking-tight text-foreground">
                        {product.name}
                      </span>
                      <span className="text-xs font-mono font-medium text-muted-foreground">
                        ${product.price}
                      </span>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-primary/10 hover:bg-primary/20 text-primary flex items-center justify-center transition-colors">
                      <Plus className="w-4 h-4" />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>

        {/* Empty State when all items dropped */}
        {gridProducts.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full py-16 flex flex-col items-center justify-center text-center space-y-3"
          >
            <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center text-muted-foreground animate-bounce">
              🎉
            </div>
            <h3 className="text-sm font-semibold text-foreground">All items added to wishlist!</h3>
            <p className="text-xs text-muted-foreground max-w-xs">
              Nice job! Click the reset button to return them to the store shelf.
            </p>
          </motion.div>
        )}
      </div>

      {/* FLOATING WISHLIST BUCKET */}
      <div className="absolute bottom-6 inset-x-6 z-40 pointer-events-none flex justify-center">
        <motion.div
          ref={bucketRef}
          animate={{
            scale: isOverBucket ? 1.08 : 1,
            backgroundColor: isOverBucket ? "var(--color-accent, rgba(139, 92, 246, 0.15))" : "rgba(15, 23, 42, 0.75)",
            borderColor: isOverBucket ? "var(--color-primary, #a78bfa)" : "rgba(255, 255, 255, 0.1)",
            boxShadow: isOverBucket
              ? "0 20px 40px -5px rgba(139, 92, 246, 0.4), 0 0 20px 2px rgba(139, 92, 246, 0.2)"
              : "0 10px 30px -10px rgba(0, 0, 0, 0.5)",
          }}
          transition={{ type: "spring", stiffness: 350, damping: 20 }}
          className={cn(
            "pointer-events-auto w-full max-w-[480px] border rounded-2xl backdrop-blur-lg px-4 py-3 flex items-center justify-between gap-4 transition-colors"
          )}
        >
          {/* Bucket Info */}
          <div className="flex items-center space-x-3">
            <div className={cn(
              "w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300",
              isOverBucket ? "bg-primary text-white scale-110" : "bg-white/10 text-white"
            )}>
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold text-white tracking-wide block">
                {isOverBucket ? "DROP HERE!" : bucketLabel}
              </span>
              <span className="text-[10px] text-neutral-400 font-medium">
                {bucket.length} {bucket.length === 1 ? "item" : "items"} saved • Total: ${bucket.reduce((acc, curr) => acc + curr.price, 0)}
              </span>
            </div>
          </div>

          {/* Miniature List of Saved Items */}
          <div className="flex-1 flex items-center justify-end -space-x-2 overflow-x-auto px-2 max-w-[180px]">
            <AnimatePresence>
              {bucket.map((item) => (
                <motion.div
                  key={`bucket-thumb-${item.id}`}
                  initial={{ scale: 0, x: 20, opacity: 0 }}
                  animate={{ scale: 1, x: 0, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={prefersReducedMotion ? { duration: 0 } : { type: "spring", stiffness: 400, damping: 25 }}
                  className={cn("w-8 h-8 rounded-full border-2 border-slate-900 shadow-md flex items-center justify-center relative bg-gradient-to-tr overflow-hidden group/thumb cursor-pointer", item.gradient)}
                  role="button"
                  tabIndex={0}
                  aria-label={`Remove ${item.name} from wishlist`}
                  onClick={() => removeFromBucket(item.id)}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); removeFromBucket(item.id); } }}
                >
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/thumb:opacity-100 flex items-center justify-center transition-opacity">
                    <Trash2 className="w-3.5 h-3.5 text-red-400" />
                  </div>
                  <div className="scale-50">{item.icon}</div>
                </motion.div>
              ))}
            </AnimatePresence>
            {bucket.length === 0 && (
              <span className="text-[10px] text-neutral-500 italic pr-2 select-none">
                Drop items here
              </span>
            )}
          </div>
        </motion.div>
      </div>

    </div>
  );
}

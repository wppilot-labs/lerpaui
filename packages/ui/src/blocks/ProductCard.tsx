"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '../components/Card';
import { Button } from '../components/Button';
import { Star, ShoppingCart, Heart } from 'lucide-react';
import { usePrefersReducedMotion } from '../animation/hooks';
import { cn } from '../lib/cn';

export interface Product {
  id: string;
  title: string;
  price: number;
  category?: string;
  rating?: number;
  reviewsCount?: number;
  imageUrl?: string;
  badge?: string;
  description?: string;
}

export interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
  onFavoriteClick?: (product: Product) => void;
  /** When true, mark this card as favorited (filled heart). */
  isFavorited?: boolean;
  className?: string;
  /** Disable Framer Motion entry — useful when grid handles its own reveal. */
  noMotion?: boolean;
}

export function ProductCard({
  product,
  onAddToCart,
  onFavoriteClick,
  isFavorited = false,
  className,
  noMotion = false,
}: ProductCardProps) {
  const { title, price, rating = 4.5, reviewsCount = 42, imageUrl, badge, category, description } = product;
  const reduced = usePrefersReducedMotion();
  const useMotion = !noMotion && !reduced;

  return (
    <motion.div
      initial={useMotion ? { opacity: 0, y: 12 } : false}
      whileInView={useMotion ? { opacity: 1, y: 0 } : undefined}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="flex"
    >
      <Card className={cn('group overflow-hidden flex flex-col w-full justify-between border border-border bg-card transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md motion-reduce:hover:translate-y-0', className)}>
      <div className="relative aspect-square w-full overflow-hidden bg-muted/30 border-b border-border">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
            loading="lazy"
            decoding="async"
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center text-muted-foreground text-xs bg-muted/40" aria-hidden>
            No image available
          </div>
        )}
        {badge && (
          <span className="absolute top-3 left-3 bg-primary text-primary-foreground text-[10px] font-bold uppercase px-2 py-0.5 rounded shadow-sm">
            {badge}
          </span>
        )}
        <button
          type="button"
          aria-label={isFavorited ? `Remove ${title} from favorites` : `Add ${title} to favorites`}
          aria-pressed={isFavorited}
          onClick={(e) => {
            e.stopPropagation();
            if (onFavoriteClick) onFavoriteClick(product);
          }}
          className={cn(
            'absolute top-3 right-3 p-2 bg-background/95 hover:bg-background border border-border rounded-full shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50',
            isFavorited ? 'text-rose-500' : 'text-muted-foreground hover:text-rose-500'
          )}
        >
          <Heart className={cn('h-4 w-4', isFavorited ? 'fill-current' : 'fill-none')} aria-hidden />
        </button>
      </div>

      <CardContent className="p-5 flex-1 flex flex-col justify-between gap-4">
        <div className="space-y-1">
          {category && (
            <span className="text-[10px] uppercase font-bold tracking-wider text-primary">
              {category}
            </span>
          )}
          <h3 className="text-base font-bold text-foreground line-clamp-1 group-hover:text-primary transition-colors">
            {title}
          </h3>
          {description && (
            <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed min-h-[32px]">
              {description}
            </p>
          )}
        </div>

        <div>
          {/* Rating */}
          <div className="flex items-center gap-1 mb-3" aria-label={`Rated ${rating} out of 5 from ${reviewsCount} reviews`}>
            <div className="flex items-center text-amber-400" aria-hidden>
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={cn(
                    'h-3.5 w-3.5 fill-current',
                    i < Math.floor(rating) ? 'text-amber-400' : 'text-muted/40'
                  )}
                />
              ))}
            </div>
            <span className="text-[11px] text-muted-foreground">({reviewsCount})</span>
          </div>

          {/* Pricing & Add to Cart */}
          <div className="flex items-center justify-between gap-4 mt-auto">
            <span className="text-lg font-extrabold text-foreground">${price.toFixed(2)}</span>
            <Button
              size="sm"
              className="gap-1.5 opacity-90 group-hover:opacity-100 transition-opacity"
              aria-label={`Add ${title} to cart`}
              onClick={() => {
                if (onAddToCart) onAddToCart(product);
              }}
            >
              <ShoppingCart className="h-3.5 w-3.5" aria-hidden />
              Add
            </Button>
          </div>
        </div>
      </CardContent>
      </Card>
    </motion.div>
  );
}

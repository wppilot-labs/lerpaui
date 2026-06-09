"use client";

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { ProductCard, type Product } from './ProductCard';
import { SectionHeader } from '../components/SectionHeader';
import { Container } from '../components/Container';
import { Input } from '../components/Input';
import { usePrefersReducedMotion } from '../animation/hooks';
import { Search, SlidersHorizontal } from 'lucide-react';
import { cn } from '../lib/cn';

export interface ProductGridProps {
  tag?: string;
  title?: string;
  description?: string;
  products?: Product[];
  onAddToCart?: (product: Product) => void;
  onFavoriteClick?: (product: Product) => void;
}

const defaultProducts: Product[] = [
  { id: '1', title: 'Lerpa UI Pro Bundle', price: 99.0, category: 'Templates', rating: 4.9, reviewsCount: 154, badge: 'Best Seller', description: 'Complete full-stack template pack including databases, telemetry dashboards, and multi-region SSO setups.' },
  { id: '2', title: 'Neo-Console Keyboard', price: 149.0, category: 'Hardware', rating: 4.7, reviewsCount: 68, description: 'Haptic mechanical custom layout keyboards designed explicitly for low-latency terminal speed operations.' },
  { id: '3', title: 'Quantum Telemetry Client', price: 49.0, category: 'Software', rating: 4.5, reviewsCount: 32, badge: 'New', description: 'Advanced local-first client telemetry reporting system offering zero-latency stream data pipelines.' },
  { id: '4', title: 'Developer Coffee Mug v2', price: 24.0, category: 'Merchandise', rating: 4.8, reviewsCount: 112, description: 'Double-walled thermal steel workspace mugs ensuring warm drinks during late compile operations.' },
  { id: '5', title: 'Edge Compiler License', price: 199.0, category: 'Software', rating: 5.0, reviewsCount: 45, description: 'Unlimited seat license for high-performance compiler chains targeting local edge clusters.' },
  { id: '6', title: 'Visual Grid Designer', price: 79.0, category: 'Templates', rating: 4.3, reviewsCount: 18, description: 'Drag-and-drop grid dashboard visualizer exporting clean Tailwind code blocks programmatically.' },
];

export function ProductGrid({
  tag = 'Our Marketplace Store',
  title = 'Engineered Developer Gear',
  description = 'Enhance your workplace stack with our collection of high-performance gear, licenses, and full-stack software templates.',
  products = defaultProducts,
  onAddToCart,
  onFavoriteClick,
}: ProductGridProps) {
  const reduced = usePrefersReducedMotion();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = useMemo(() => {
    const list = new Set(products.map((p) => p.category).filter(Boolean));
    return ['All', ...Array.from(list)];
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          p.description?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchCategory = selectedCategory === 'All' || p.category === selectedCategory;
      return matchSearch && matchCategory;
    });
  }, [products, searchTerm, selectedCategory]);

  return (
    <section className="py-20 bg-background">
      <Container>
        <SectionHeader tag={tag} title={title} description={description} align="left" />

        {/* Filter Controls Bar */}
        <div className="flex flex-col sm:flex-row items-center gap-4 justify-between border border-border bg-card rounded-lg p-4 mb-8">
          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search gear..."
              className="pl-9"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-none">
            <SlidersHorizontal className="h-4.5 w-4.5 text-muted-foreground shrink-0 hidden md:block" />
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat || 'All')}
                className={cn(
                  'px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all border border-border',
                  selectedCategory === cat
                    ? 'bg-primary text-primary-foreground border-transparent'
                    : 'bg-background hover:bg-muted text-muted-foreground hover:text-foreground'
                )}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Catalog Grid */}
        {filteredProducts.length > 0 ? (
          <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            <AnimatePresence mode="popLayout">
              {filteredProducts.map((product) => (
                <motion.div
                  key={product.id}
                  layout
                  initial={reduced ? false : { opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.9 }}
                  transition={{ duration: reduced ? 0 : 0.3 }}
                >
                  <ProductCard
                    product={product}
                    noMotion
                    onAddToCart={onAddToCart}
                    onFavoriteClick={onFavoriteClick}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          <div className="flex flex-col items-center justify-center p-12 border border-dashed border-border rounded-xl text-center">
            <p className="text-sm text-muted-foreground mb-1">No products found matching filters.</p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('All');
              }}
              className="text-xs font-bold text-primary underline"
            >
              Reset Search Filter
            </button>
          </div>
        )}
      </Container>
    </section>
  );
}

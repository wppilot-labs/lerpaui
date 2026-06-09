"use client";

import React from 'react';
import { motion } from "framer-motion";
import { Button } from '../components/Button';
import { Container } from '../components/Container';
import { usePrefersReducedMotion } from '../animation/hooks';
import { ChevronRight, Play } from 'lucide-react';

export interface SaaSHeroProps {
  tag?: string;
  title?: string;
  description?: string;
  primaryAction?: { label: string; onClick?: () => void };
  secondaryAction?: { label: string; onClick?: () => void };
  screenshotUrl?: string;
}

export function SaaSHero({
  tag = 'Introducing Lerpa UI v1.0',
  title = 'Build beautiful interfaces in seconds, not hours.',
  description = 'A collection of production-ready, fully interactive Tailwind components and blocks designed to accelerate your development workflow.',
  primaryAction = { label: 'Get Started for Free' },
  secondaryAction = { label: 'Watch Video Demo' },
}: SaaSHeroProps) {
  const reduced = usePrefersReducedMotion();
  return (
    <section className="relative overflow-hidden py-20 sm:py-32 bg-background">
      <Container className="relative">
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
          {/* Tag */}
          <motion.div
            initial={reduced ? false : { opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold bg-primary/10 text-primary border border-primary/20 backdrop-blur-sm mb-6 cursor-pointer hover:bg-primary/15 transition-colors"
          >
            {tag} <ChevronRight className="h-3 w-3" />
          </motion.div>

          {/* Heading */}
          <motion.h1
            initial={reduced ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: reduced ? 0 : 0.1 }}
            className="text-4xl sm:text-6xl font-extrabold tracking-tight text-foreground leading-[1.1] mb-6"
          >
            {title}
          </motion.h1>

          {/* Description */}
          <motion.p
            initial={reduced ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: reduced ? 0 : 0.2 }}
            className="text-lg sm:text-xl text-muted-foreground leading-relaxed max-w-2xl mb-10"
          >
            {description}
          </motion.p>

          {/* Call to Actions */}
          <motion.div
            initial={reduced ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: reduced ? 0 : 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto mb-16"
          >
            <Button size="lg" className="w-full sm:w-auto font-semibold gap-2 shadow-lg shadow-primary/20" onClick={primaryAction.onClick}>
              {primaryAction.label}
            </Button>
            <Button variant="outline" size="lg" className="w-full sm:w-auto font-semibold gap-2" onClick={secondaryAction.onClick}>
              <Play className="h-4 w-4 fill-current text-muted-foreground" /> {secondaryAction.label}
            </Button>
          </motion.div>

          {/* Animated Product Screenshot / Demo Container */}
          <motion.div
            initial={reduced ? false : { opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={reduced ? { duration: 0 } : { duration: 0.8, delay: 0.4, type: 'spring', stiffness: 100, damping: 20 }}
            className="w-full max-w-5xl rounded-xl border border-border bg-card shadow-2xl overflow-hidden aspect-[16/9] relative"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 via-transparent to-primary/5 pointer-events-none" />
            
            {/* Mock browser chrome */}
            <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-muted/40">
              <div className="flex gap-1.5">
                <div className="h-3 w-3 rounded-full bg-rose-500/80" />
                <div className="h-3 w-3 rounded-full bg-amber-500/80" />
                <div className="h-3 w-3 rounded-full bg-emerald-500/80" />
              </div>
              <div className="flex-1 mx-4 max-w-md h-6 rounded-md bg-muted/80 border border-border flex items-center justify-center text-[10px] text-muted-foreground font-mono">
                demo.lerpaui.com/dashboard
              </div>
            </div>

            {/* Dashboard Mock Content */}
            <div className="p-6 grid grid-cols-12 gap-4 h-full text-left bg-card">
              <div className="col-span-3 border-r border-border pr-4 space-y-4">
                <div className="h-8 rounded-md bg-muted/60 animate-pulse w-3/4" />
                <div className="space-y-2">
                  <div className="h-6 rounded-md bg-muted/40 w-full" />
                  <div className="h-6 rounded-md bg-muted/40 w-5/6" />
                  <div className="h-6 rounded-md bg-muted/40 w-4/5" />
                </div>
              </div>
              <div className="col-span-9 space-y-6">
                <div className="grid grid-cols-3 gap-4">
                  <div className="h-24 rounded-lg bg-muted/50 p-4 flex flex-col justify-between">
                    <div className="h-4 bg-muted/60 rounded w-1/2" />
                    <div className="h-8 bg-muted/80 rounded w-3/4 animate-pulse" />
                  </div>
                  <div className="h-24 rounded-lg bg-muted/50 p-4 flex flex-col justify-between">
                    <div className="h-4 bg-muted/60 rounded w-1/2" />
                    <div className="h-8 bg-muted/80 rounded w-2/3 animate-pulse" />
                  </div>
                  <div className="h-24 rounded-lg bg-muted/50 p-4 flex flex-col justify-between">
                    <div className="h-4 bg-muted/60 rounded w-1/3" />
                    <div className="h-8 bg-muted/80 rounded w-1/2 animate-pulse" />
                  </div>
                </div>
                <div className="h-48 rounded-lg bg-muted/40 flex items-center justify-center text-muted-foreground border border-dashed border-border">
                  Interactive Dashboard Overview
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}

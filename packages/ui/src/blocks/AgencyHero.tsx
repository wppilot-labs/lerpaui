import React from 'react';
import { motion} from "framer-motion";
import { Button } from '../components/Button';
import { Container } from '../components/Container';
import { Sparkles, ArrowRight, Star } from 'lucide-react';

export interface AgencyHeroProps {
  badgeText?: string;
  headline?: string;
  subheadline?: string;
  description?: string;
  clientsRatingText?: string;
  primaryActionLabel?: string;
  secondaryActionLabel?: string;
}

export function AgencyHero({
  badgeText = 'Voted #1 Design Studio',
  headline = 'We Craft Digital Masterpieces.',
  subheadline = 'Next-gen interfaces, custom branding, and ultra-high speed web solutions designed for high-caliber businesses.',
  clientsRatingText = 'Trusted by 100+ global brands',
  primaryActionLabel = 'Start a Project',
  secondaryActionLabel = 'View Portfolio',
}: AgencyHeroProps) {
  return (
    <section className="relative overflow-hidden bg-background py-20 lg:py-32">
      {/* Visual background grids */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(15,23,42,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(15,23,42,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem] dark:bg-[linear-gradient(to_right,rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.01)_1px,transparent_1px)]" />

      <Container className="relative">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-center">
          {/* Text Area */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold bg-primary/10 text-primary border border-primary/20 mb-6"
            >
              <Sparkles className="h-3 w-3" />
              {badgeText}
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl sm:text-6xl font-black tracking-tight text-foreground leading-[1.05] mb-6"
            >
              {headline}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg text-muted-foreground leading-relaxed max-w-xl mb-10"
            >
              {subheadline}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-wrap items-center gap-4 w-full sm:w-auto mb-12"
            >
              <Button size="lg" className="w-full sm:w-auto font-bold gap-2 group">
                {primaryActionLabel}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
              <Button variant="outline" size="lg" className="w-full sm:w-auto font-bold">
                {secondaryActionLabel}
              </Button>
            </motion.div>

            {/* Ratings block */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex items-center gap-3 border-t border-border pt-6 w-full"
            >
              <div className="flex -space-x-2.5">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="h-8 w-8 rounded-full border-2 border-background bg-muted flex items-center justify-center text-[10px] font-bold shrink-0 overflow-hidden"
                  >
                    <img src={`https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&fit=crop&crop=faces&q=80`} alt="Client" loading="lazy" decoding="async" />
                  </div>
                ))}
              </div>
              <div>
                <div className="flex items-center text-amber-500">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-3.5 w-3.5 fill-current" />
                  ))}
                </div>
                <span className="text-xs font-semibold text-muted-foreground mt-0.5 block">
                  {clientsRatingText}
                </span>
              </div>
            </motion.div>
          </div>

          {/* Animated Interactive Grid Showcase */}
          <div className="lg:col-span-5 relative flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, type: 'spring', stiffness: 100, damping: 20 }}
              className="relative w-full aspect-square max-w-md rounded-2xl border border-border bg-card shadow-2xl p-6 overflow-hidden flex flex-col justify-between"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent pointer-events-none" />

              {/* Mock floating visual node elements */}
              <div className="flex items-start justify-between">
                <div className="p-3 bg-primary/10 border border-primary/20 text-primary rounded-xl shadow-md">
                  <Sparkles className="h-6 w-6" />
                </div>
                <div className="p-2.5 bg-muted rounded-xl text-xs font-mono font-semibold border border-border">
                  STUDIO_OUTPUT
                </div>
              </div>

              {/* Design center node */}
              <div className="my-8 space-y-4">
                <span className="text-[10px] font-bold tracking-widest uppercase text-primary/80">
                  Active Sprint
                </span>
                <h2 className="text-3xl font-extrabold text-foreground">
                  Branding, Design & Performance.
                </h2>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  We consolidate UI workflows into high-speed reactive design tokens, yielding flawless render passes across edge systems.
                </p>
              </div>

              {/* Progress visual */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-muted-foreground">Fidelity Rating</span>
                  <span className="text-primary">99.8%</span>
                </div>
                <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: '99.8%' }}
                    transition={{ duration: 1.5, delay: 0.5, ease: 'easeOut' }}
                    className="h-full bg-primary"
                  />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </Container>
    </section>
  );
}

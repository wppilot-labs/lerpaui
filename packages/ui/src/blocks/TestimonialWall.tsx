"use client";

import React from 'react';
import { motion } from "framer-motion";
import { Card, CardContent } from '../components/Card';
import { SectionHeader } from '../components/SectionHeader';
import { Container } from '../components/Container';
import { Avatar, AvatarFallback, AvatarImage } from '../components/Avatar';
import { usePrefersReducedMotion } from '../animation/hooks';
import { Star } from 'lucide-react';

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  content: string;
  avatarUrl?: string;
  rating?: number;
}

export interface TestimonialWallProps {
  tag?: string;
  title?: string;
  description?: string;
  testimonials?: Testimonial[];
}

const defaultTestimonials: Testimonial[] = [
  {
    id: '1',
    name: 'Sarah Connor',
    role: 'Principal Engineer',
    company: 'SkyNet Corp',
    content: "The speed at which we went from design system ideas to responsive React interfaces with Lerpa UI was unbelievable. The motion system transitions work perfectly on reduced motion devices natively.",
    rating: 5,
  },
  {
    id: '2',
    name: 'Marcus Wright',
    role: 'Co-Founder',
    company: 'Resistance Inc',
    content: "Building on top of these bento features and the AIChat block saved us weeks of research and core engineering. It simply integrates seamlessly into our existing CSS variables context.",
    rating: 5,
  },
  {
    id: '3',
    name: 'Elena Rostova',
    role: 'VP of Product',
    company: 'Siberia Labs',
    content: "The design tokens in colors, radius, and shadows are fully compatible with Tailwind v4, making the build pass flawless. The dialogs and commands keyboard triggers are incredibly smooth.",
    rating: 5,
  },
  {
    id: '4',
    name: 'Devon Miles',
    role: 'Creative Director',
    company: 'Knight Industries',
    content: "Lerpa UI handles accessibility concerns like focus traps and screen reader announcements automatically. It is a game changer for corporate compliance.",
    rating: 4,
  },
  {
    id: '5',
    name: 'Linus W.',
    role: 'System Architect',
    company: 'Kernel Devs',
    content: "Highly performant, clean TypeScript interfaces with zero unnecessary third-party dependencies. It is exactly what modern developers want.",
    rating: 5,
  },
  {
    id: '6',
    name: 'Ami Nakajima',
    role: 'Senior UI/UX Specialist',
    company: 'Tokyo Design',
    content: "The pricing tables, agency heroes, and dashboard structures are ready to ship straight out of the package. Absolute masterpiece of design systems engineering.",
    rating: 5,
  },
];

export function TestimonialWall({
  tag = 'Customer Stories',
  title = 'What Builders Are Saying',
  description = 'Thousands of engineers and agencies use Lerpa UI blocks to build accessible, lightning-fast interfaces.',
  testimonials = defaultTestimonials,
}: TestimonialWallProps) {
  const reduced = usePrefersReducedMotion();
  return (
    <section className="py-20 bg-background/50 border-t border-border">
      <Container>
        <SectionHeader tag={tag} title={title} description={description} align="center" />

        {/* Masonry-like Testimonials Grid */}
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6 [column-fill:_balance] max-w-6xl mx-auto">
          {testimonials.map((t, idx) => (
            <motion.div
              key={t.id}
              initial={reduced ? false : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: reduced ? 0 : idx * 0.05 }}
              className="break-inside-avoid-column flex mb-6"
            >
              <Card className="w-full border border-border bg-card hover:shadow-md transition-shadow duration-300">
                <CardContent className="p-6 flex flex-col justify-between gap-4">
                  {/* Rating */}
                  {t.rating && (
                    <div role="img" className="flex items-center text-amber-500 gap-0.5" aria-label={`Rated ${t.rating} out of 5`}>
                      {Array.from({ length: 5 }).map((_, starIdx) => (
                        <Star
                          key={starIdx}
                          className={`h-3.5 w-3.5 fill-current ${
                            starIdx < (t.rating || 5) ? 'text-amber-500' : 'text-muted/30'
                          }`}
                          aria-hidden
                        />
                      ))}
                    </div>
                  )}

                  {/* Comment */}
                  <p className="text-sm leading-relaxed text-foreground/90 italic">
                    &quot;{t.content}&quot;
                  </p>

                  {/* Profile */}
                  <div className="flex items-center gap-3 border-t border-border pt-4 mt-2">
                    <Avatar className="h-9 w-9 bg-secondary">
                      {t.avatarUrl ? (
                        <AvatarImage src={t.avatarUrl} alt={t.name} />
                      ) : (
                        <AvatarFallback className="uppercase font-bold text-xs bg-primary/10 text-primary">
                          {t.name.split(' ').map((n) => n[0]).join('')}
                        </AvatarFallback>
                      )}
                    </Avatar>
                    <div>
                      <h3 className="text-xs font-bold text-foreground leading-none">{t.name}</h3>
                      <p className="text-[10px] text-muted-foreground mt-1 font-medium">
                        {t.role} at <span className="font-semibold text-primary">{t.company}</span>
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}

'use client';

import * as React from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Play, Pause, Star, Quote, ChevronLeft, ChevronRight } from 'lucide-react';
import { usePrefersReducedMotion } from '../animation/hooks';
import { cn } from '../lib/cn';

/* ---------------------------------- Types --------------------------------- */

export interface WaveformTestimonial {
  id: string;
  name: string;
  role: string;
  company?: string;
  avatarUrl?: string;
  quote: string;
  rating: 1 | 2 | 3 | 4 | 5;
}

export interface WaveformTestimonialReelProps extends React.HTMLAttributes<HTMLElement> {
  eyebrow?: string;
  title?: string;
  description?: string;
  testimonials?: WaveformTestimonial[];
  autoAdvanceMs?: number;
  className?: string;
}

/* ----------------------------- Default content ---------------------------- */

const DEFAULT_TESTIMONIALS: WaveformTestimonial[] = (
  [
    [
      'wt-1',
      'Amara Okafor',
      'Staff Product Engineer',
      'Northwind Audio',
      5,
      'We replaced our hand-rolled library with Lerpa UI in one sprint. The waveform-driven patterns feel tailored for a podcast platform.',
    ],
    [
      'wt-2',
      'Jonas Hellberg',
      'Design Systems Lead',
      'Helix Health',
      5,
      'Accessibility-first defaults meant our compliance review was a formality. Reduced-motion fallbacks, keyboard semantics, ARIA — all in the box.',
    ],
    [
      'wt-3',
      'Priya Raman',
      'Founder & CTO',
      'Frequency Labs',
      5,
      'The motion language is restrained where it matters and expressive where it counts. Retention curves went up the week we shipped onboarding.',
    ],
    [
      'wt-4',
      'Mateo Ricci',
      'Principal Engineer',
      'Cadence Studio',
      4,
      'Copy-paste registry means zero supply-chain risk. We own the source, evolve the tokens, and the upgrade path stays painless.',
    ],
    [
      'wt-5',
      'Saoirse Kelly',
      'VP of Design',
      'Echo Park Media',
      5,
      'The source is easy to inspect and adapt. Tailwind v4 tokens, Framer Motion, and modern React keep the implementation familiar.',
    ],
  ] as const
).map(([id, name, role, company, rating, quote]) => ({
  id,
  name,
  role,
  company,
  quote,
  rating: rating as 1 | 2 | 3 | 4 | 5,
}));

/* ------------------------------- Waveform --------------------------------- */

const BAR_COUNT = 24;
const TICK_MS = 120;

const activeHeights = (): number[] =>
  Array.from({ length: BAR_COUNT }, () => 22 + Math.random() * 78);

const restingHeights = (): number[] =>
  Array.from({ length: BAR_COUNT }, (_, i) => {
    const dist = Math.abs(i - BAR_COUNT / 2) / (BAR_COUNT / 2);
    return 16 + (1 - dist) * 8;
  });

interface WaveformProps {
  playing: boolean;
  intersecting: boolean;
  reducedMotion: boolean;
}

const Waveform = React.memo(function Waveform({
  playing,
  intersecting,
  reducedMotion,
}: WaveformProps) {
  const resting = React.useMemo(restingHeights, []);
  const [heights, setHeights] = React.useState<number[]>(resting);

  React.useEffect(() => {
    if (reducedMotion || !playing || !intersecting) {
      setHeights(resting);
      return;
    }
    setHeights(activeHeights());
    const id = window.setInterval(() => setHeights(activeHeights()), TICK_MS);
    return () => window.clearInterval(id);
  }, [playing, intersecting, reducedMotion, resting]);

  return (
    <svg
      viewBox={`0 0 ${BAR_COUNT * 6} 60`}
      preserveAspectRatio="none"
      aria-hidden="true"
      className="h-12 w-full text-primary"
    >
      {heights.map((h, i) => {
        const heightPx = (h / 100) * 60;
        const y = (60 - heightPx) / 2;
        return (
          <motion.rect
            key={i}
            x={i * 6 + 1}
            width={4}
            rx={2}
            fill="currentColor"
            initial={false}
            animate={{ y, height: heightPx }}
            transition={
              reducedMotion
                ? { duration: 0 }
                : { type: 'spring', stiffness: 260, damping: 22, mass: 0.4 }
            }
          />
        );
      })}
    </svg>
  );
});

/* ------------------------------ Subcomponents ----------------------------- */

function RatingStars({ rating }: { rating: 1 | 2 | 3 | 4 | 5 }) {
  return (
    <span
      role="img"
      aria-label={`${rating} out of 5 stars`}
      className="inline-flex items-center gap-0.5 text-amber-500"
    >
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          aria-hidden="true"
          className={cn(
            'h-3.5 w-3.5',
            i < rating
              ? 'fill-amber-500 text-amber-500'
              : 'fill-transparent text-muted-foreground/40'
          )}
        />
      ))}
    </span>
  );
}

function AvatarBubble({ t }: { t: WaveformTestimonial }) {
  const initials = React.useMemo(
    () =>
      t.name
        .split(' ')
        .map((n) => n[0])
        .filter(Boolean)
        .slice(0, 2)
        .join('')
        .toUpperCase(),
    [t.name]
  );
  return (
    <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full bg-gradient-to-br from-primary/20 to-primary/5 ring-2 ring-background">
      {t.avatarUrl ? (
        <img
          src={t.avatarUrl}
          alt=""
          className="h-full w-full object-cover"
          loading="lazy"
          decoding="async"
        />
      ) : (
        <span className="flex h-full w-full items-center justify-center text-sm font-bold text-primary">
          {initials}
        </span>
      )}
    </div>
  );
}

const DOT_CLS = 'h-1.5 rounded-full transition-all duration-300';
const NAV_BTN_CLS =
  'flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card text-foreground hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2';

function Dots({
  items,
  activeIndex,
  className,
}: {
  items: WaveformTestimonial[];
  activeIndex: number;
  className?: string;
}) {
  return (
    <div className={cn('flex items-center gap-2', className)} aria-hidden="true">
      {items.map((t, i) => (
        <span
          key={t.id}
          className={cn(DOT_CLS, i === activeIndex ? 'w-6 bg-primary' : 'w-1.5 bg-border')}
        />
      ))}
    </div>
  );
}

/* ---------------------------------- Card ---------------------------------- */

interface CardProps {
  testimonial: WaveformTestimonial;
  isActive: boolean;
  isPlaying: boolean;
  reducedMotion: boolean;
  onTogglePlay: (id: string) => void;
  onActivate: (id: string) => void;
}

const TestimonialCard = React.memo(function TestimonialCard({
  testimonial,
  isActive,
  isPlaying,
  reducedMotion,
  onTogglePlay,
  onActivate,
}: CardProps) {
  const cardRef = React.useRef<HTMLElement | null>(null);
  const [intersecting, setIntersecting] = React.useState(false);

  React.useEffect(() => {
    const node = cardRef.current;
    if (!node) return;
    const obs = new IntersectionObserver(
      ([entry]) => entry && setIntersecting(entry.isIntersecting),
      { threshold: 0.4 }
    );
    obs.observe(node);
    return () => obs.disconnect();
  }, []);

  const playing = isActive && isPlaying;
  const authorId = `testimonial-${testimonial.id}-author`;

  return (
    <motion.article
      ref={(node) => {
        cardRef.current = node;
      }}
      aria-labelledby={authorId}
      onFocus={() => onActivate(testimonial.id)}
      initial={false}
      animate={
        reducedMotion
          ? { opacity: isActive ? 1 : 0.85 }
          : { opacity: isActive ? 1 : 0.7, scale: isActive ? 1 : 0.97 }
      }
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        'group relative flex min-h-[22rem] w-[88%] shrink-0 snap-center flex-col overflow-hidden rounded-2xl border bg-card p-6 text-card-foreground shadow-sm',
        'sm:w-[46%] lg:w-[31%]',
        isActive ? 'border-primary/40 shadow-lg shadow-primary/5' : 'border-border'
      )}
    >
      <Quote aria-hidden="true" className="absolute right-4 top-4 h-10 w-10 text-primary/10" />

      <header className="flex items-start gap-3">
        <AvatarBubble t={testimonial} />
        <div className="min-w-0 flex-1">
          <h3
            id={authorId}
            className="truncate text-sm font-semibold leading-tight text-foreground"
          >
            {testimonial.name}
          </h3>
          <p className="mt-0.5 truncate text-xs text-muted-foreground">
            {testimonial.role}
            {testimonial.company ? (
              <>
                {' · '}
                <span className="font-medium text-foreground/80">{testimonial.company}</span>
              </>
            ) : null}
          </p>
          <div className="mt-1.5">
            <RatingStars rating={testimonial.rating} />
          </div>
        </div>
      </header>

      <blockquote className="mt-5 flex-1 text-[0.95rem] leading-relaxed text-foreground/90">
        <p className="line-clamp-6">&ldquo;{testimonial.quote}&rdquo;</p>
        <cite className="sr-only">
          {testimonial.name},{' '}
          {testimonial.company ? `${testimonial.role} at ${testimonial.company}` : testimonial.role}
        </cite>
      </blockquote>

      <div className="mt-6 flex items-center gap-3 rounded-xl border border-border/70 bg-background/60 p-3">
        <button
          type="button"
          aria-label={`${playing ? 'Pause' : 'Play'} testimonial waveform`}
          aria-pressed={playing}
          onClick={() => {
            onActivate(testimonial.id);
            onTogglePlay(testimonial.id);
          }}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          <AnimatePresence initial={false} mode="wait">
            <motion.span
              key={playing ? 'pause' : 'play'}
              initial={reducedMotion ? false : { scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={reducedMotion ? undefined : { scale: 0.6, opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="flex"
            >
              {playing ? (
                <Pause className="h-4 w-4" aria-hidden="true" />
              ) : (
                <Play className="ml-0.5 h-4 w-4" aria-hidden="true" />
              )}
            </motion.span>
          </AnimatePresence>
        </button>

        <Waveform playing={playing} intersecting={intersecting} reducedMotion={reducedMotion} />
      </div>
    </motion.article>
  );
});

/* ---------------------------------- Reel ---------------------------------- */

export function WaveformTestimonialReel({
  eyebrow = 'On the record',
  title = 'Voices from teams that ship faster',
  description = 'Real testimonials from engineers and designers building on Lerpa UI. Tap play to bring each one to life.',
  testimonials = DEFAULT_TESTIMONIALS,
  autoAdvanceMs = 7000,
  className,
  ...sectionProps
}: WaveformTestimonialReelProps) {
  const prefersReducedMotionHook = usePrefersReducedMotion();
  const fmReducedMotion = useReducedMotion();
  const reducedMotion = prefersReducedMotionHook || Boolean(fmReducedMotion);

  const headingId = React.useId();
  const scrollerRef = React.useRef<HTMLDivElement | null>(null);
  const safeTestimonials = testimonials.length ? testimonials : DEFAULT_TESTIMONIALS;

  const [activeId, setActiveId] = React.useState<string>(safeTestimonials[0]?.id ?? '');
  const [isPlaying, setIsPlaying] = React.useState<boolean>(!reducedMotion);
  const [userInteracted, setUserInteracted] = React.useState(false);

  React.useEffect(() => {
    if (reducedMotion) setIsPlaying(false);
  }, [reducedMotion]);

  const activeIndex = React.useMemo(
    () =>
      Math.max(
        0,
        safeTestimonials.findIndex((t) => t.id === activeId)
      ),
    [safeTestimonials, activeId]
  );

  const scrollToIndex = React.useCallback(
    (index: number) => {
      const scroller = scrollerRef.current;
      if (!scroller) return;
      const child = scroller.children.item(index) as HTMLElement | null;
      if (!child) return;
      const left = child.offsetLeft - (scroller.clientWidth - child.clientWidth) / 2;
      scroller.scrollTo({ left, behavior: reducedMotion ? 'auto' : 'smooth' });
    },
    [reducedMotion]
  );

  // Auto-advance while playing and not yet interacted.
  React.useEffect(() => {
    if (reducedMotion || !isPlaying || userInteracted) return;
    if (!autoAdvanceMs || autoAdvanceMs <= 0) return;
    const id = window.setTimeout(() => {
      const next = (activeIndex + 1) % safeTestimonials.length;
      const nextId = safeTestimonials[next]?.id;
      if (nextId) {
        setActiveId(nextId);
        scrollToIndex(next);
      }
    }, autoAdvanceMs);
    return () => window.clearTimeout(id);
  }, [
    activeIndex,
    autoAdvanceMs,
    isPlaying,
    reducedMotion,
    safeTestimonials,
    scrollToIndex,
    userInteracted,
  ]);

  // Sync activeId with the centered card after manual scroll/swipe.
  React.useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    let raf = 0;
    const handler = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const center = scroller.scrollLeft + scroller.clientWidth / 2;
        let bestIdx = 0;
        let bestDist = Number.POSITIVE_INFINITY;
        for (let i = 0; i < scroller.children.length; i += 1) {
          const child = scroller.children.item(i) as HTMLElement | null;
          if (!child) continue;
          const childCenter = child.offsetLeft + child.clientWidth / 2;
          const dist = Math.abs(childCenter - center);
          if (dist < bestDist) {
            bestDist = dist;
            bestIdx = i;
          }
        }
        const nextId = safeTestimonials[bestIdx]?.id;
        if (nextId && nextId !== activeId) setActiveId(nextId);
      });
    };
    scroller.addEventListener('scroll', handler, { passive: true });
    return () => {
      scroller.removeEventListener('scroll', handler);
      cancelAnimationFrame(raf);
    };
  }, [activeId, safeTestimonials]);

  const onTogglePlay = React.useCallback((id: string) => {
    setUserInteracted(true);
    setActiveId(id);
    setIsPlaying((prev) => !prev);
  }, []);
  const onActivate = React.useCallback((id: string) => setActiveId(id), []);

  const step = React.useCallback(
    (delta: -1 | 1) => {
      setUserInteracted(true);
      const next = (activeIndex + delta + safeTestimonials.length) % safeTestimonials.length;
      const nextId = safeTestimonials[next]?.id;
      if (nextId) {
        setActiveId(nextId);
        scrollToIndex(next);
      }
    },
    [activeIndex, safeTestimonials, scrollToIndex]
  );

  return (
    <section
      aria-labelledby={headingId}
      className={cn('relative w-full bg-background py-16 sm:py-20 lg:py-24', className)}
      {...sectionProps}
    >
      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          {eyebrow ? (
            <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              {eyebrow}
            </p>
          ) : null}
          <h2
            id={headingId}
            className="text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl"
          >
            {title}
          </h2>
          {description ? (
            <p className="mt-4 text-pretty text-base text-muted-foreground">{description}</p>
          ) : null}
        </div>

        <div
          role="region"
          aria-roledescription="carousel"
          aria-label="Testimonials carousel"
          className="relative mt-10 sm:mt-14"
        >
          {(['left', 'right'] as const).map((side) => (
            <div
              key={side}
              aria-hidden="true"
              className={cn(
                'pointer-events-none absolute inset-y-0 z-10 hidden w-12 lg:block',
                side === 'left'
                  ? 'left-0 bg-gradient-to-r from-background to-transparent'
                  : 'right-0 bg-gradient-to-l from-background to-transparent'
              )}
            />
          ))}

          {/*
            Scroll container: tabIndex enables keyboard horizontal scroll on scrollable overflow regions per W3C APG.
            Arrow-key step + pointerdown auto-advance cancel rely on this element receiving focus + pointer events.
            jsx-a11y rules below conflict with that valid pattern; suppressed intentionally for this block only.
          */}
          {/* eslint-disable jsx-a11y/no-noninteractive-tabindex, jsx-a11y/no-noninteractive-element-interactions */}
          <div
            ref={scrollerRef}
            role="group"
            tabIndex={0}
            aria-label="Testimonials scroller. Use arrow keys to navigate."
            className={cn(
              'no-scrollbar flex w-full snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-2xl',
              '[scroll-padding-inline:6%] sm:[scroll-padding-inline:8%] lg:[scroll-padding-inline:4%]',
              '[-ms-overflow-style:none] [scrollbar-width:none]'
            )}
            style={{ scrollSnapType: 'x mandatory' }}
            onPointerDown={() => setUserInteracted(true)}
            onKeyDown={(e) => {
              if (e.key === 'ArrowLeft') {
                e.preventDefault();
                step(-1);
              } else if (e.key === 'ArrowRight') {
                e.preventDefault();
                step(1);
              }
            }}
          >
            {safeTestimonials.map((t) => (
              <TestimonialCard
                key={t.id}
                testimonial={t}
                isActive={t.id === activeId}
                isPlaying={isPlaying}
                reducedMotion={reducedMotion}
                onTogglePlay={onTogglePlay}
                onActivate={onActivate}
              />
            ))}
          </div>
          {/* eslint-enable jsx-a11y/no-noninteractive-tabindex, jsx-a11y/no-noninteractive-element-interactions */}

          <div className="mt-6 hidden items-center justify-between md:flex">
            <Dots items={safeTestimonials} activeIndex={activeIndex} />
            <div className="flex items-center gap-2">
              <button
                type="button"
                aria-label="Previous testimonial"
                onClick={() => step(-1)}
                className={NAV_BTN_CLS}
              >
                <ChevronLeft className="h-4 w-4" aria-hidden="true" />
              </button>
              <button
                type="button"
                aria-label="Next testimonial"
                onClick={() => step(1)}
                className={NAV_BTN_CLS}
              >
                <ChevronRight className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          </div>

          <Dots
            items={safeTestimonials}
            activeIndex={activeIndex}
            className="mt-5 justify-center md:hidden"
          />
        </div>
      </div>
    </section>
  );
}

export default WaveformTestimonialReel;

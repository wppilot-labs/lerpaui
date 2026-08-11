'use client';

import * as React from 'react';
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useInView,
  useReducedMotion,
  type MotionValue,
} from 'framer-motion';
import {
  Zap,
  ShieldCheck,
  Palette,
  Accessibility,
  Blocks,
  Sparkles,
  type LucideIcon,
} from 'lucide-react';
import { usePrefersReducedMotion } from '../animation/hooks';
import { cn } from '../lib/cn';

export interface MagneticBentoTile {
  id: string;
  title: string;
  body: string;
  icon?: React.ComponentType<{ className?: string }>;
  size?: 'default' | 'hero';
  accentColor?: string;
  href?: string;
}

export interface MagneticBentoShowcaseProps extends React.HTMLAttributes<HTMLElement> {
  eyebrow?: string;
  title?: string;
  description?: string;
  tiles?: MagneticBentoTile[];
  className?: string;
}

const DEFAULT_TILES: MagneticBentoTile[] = [
  {
    id: 'speed',
    title: 'Speed of light',
    body: 'Compiled with Turbopack and streamed via RSC. Every interaction lands in under a frame, every payload trimmed to the byte.',
    icon: Zap,
    size: 'hero',
    accentColor: 'oklch(0.78 0.17 75)',
  },
  {
    id: 'typesafe',
    title: 'Type-safe by default',
    body: 'End-to-end TypeScript with strict null checks and inferred props.',
    icon: ShieldCheck,
    accentColor: 'oklch(0.72 0.16 160)',
  },
  {
    id: 'themable',
    title: 'Infinitely themable',
    body: 'Tailwind v4 design tokens, OKLCH color, and CSS-first overrides.',
    icon: Palette,
    accentColor: 'oklch(0.74 0.18 320)',
  },
  {
    id: 'a11y',
    title: 'Accessible to all',
    body: 'WCAG-conscious primitives, keyboard nav, reduced-motion fallbacks.',
    icon: Accessibility,
    accentColor: 'oklch(0.74 0.15 220)',
  },
  {
    id: 'composable',
    title: 'Composable blocks',
    body: 'Drop-in sections you can remix without prop-drilling spaghetti.',
    icon: Blocks,
    accentColor: 'oklch(0.76 0.14 30)',
  },
  {
    id: 'animated',
    title: 'Motion done right',
    body: 'Framer Motion with spring-tuned magnet and scroll reveals.',
    icon: Sparkles,
    accentColor: 'oklch(0.78 0.16 280)',
  },
];

const MAGNET_RADIUS = 200;
const MAGNET_PULL = 14;
const TILT_DEGREES = 6;

interface MagneticTileProps {
  tile: MagneticBentoTile;
  index: number;
  sectionMouseX: MotionValue<number>;
  sectionMouseY: MotionValue<number>;
  magnetEnabled: boolean;
  reduced: boolean;
}

function MagneticTile({
  tile,
  index,
  sectionMouseX,
  sectionMouseY,
  magnetEnabled,
  reduced,
}: MagneticTileProps) {
  const tileRef = React.useRef<HTMLDivElement | null>(null);
  const inView = useInView(tileRef, { once: true, margin: '-10% 0px' });
  const [settled, setSettled] = React.useState(false);

  // Tile center in section-local coords; updated on resize / scroll.
  const centerX = useMotionValue(0);
  const centerY = useMotionValue(0);
  const tileWidth = useMotionValue(0);
  const tileHeight = useMotionValue(0);

  const updateGeometry = React.useCallback(() => {
    const el = tileRef.current;
    const section = el?.offsetParent as HTMLElement | null;
    if (!el || !section) return;
    const sRect = section.getBoundingClientRect();
    const tRect = el.getBoundingClientRect();
    centerX.set(tRect.left - sRect.left + tRect.width / 2);
    centerY.set(tRect.top - sRect.top + tRect.height / 2);
    tileWidth.set(tRect.width);
    tileHeight.set(tRect.height);
  }, [centerX, centerY, tileWidth, tileHeight]);

  React.useEffect(() => {
    updateGeometry();
    if (typeof window === 'undefined') return;
    const ro = new ResizeObserver(updateGeometry);
    if (tileRef.current) ro.observe(tileRef.current);
    window.addEventListener('resize', updateGeometry);
    window.addEventListener('scroll', updateGeometry, { passive: true });
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', updateGeometry);
      window.removeEventListener('scroll', updateGeometry);
    };
  }, [updateGeometry]);

  // Raw magnetic pull derived from section-level pointer.
  const rawX = useTransform<number, number>([sectionMouseX, centerX, tileWidth], ([mx, cx, w]) => {
    if (!magnetEnabled || reduced) return 0;
    const dx = mx - cx;
    const dy = sectionMouseY.get() - centerY.get();
    const dist = Math.hypot(dx, dy);
    if (dist > MAGNET_RADIUS) return 0;
    const falloff = 1 - dist / MAGNET_RADIUS;
    const normalized = dx / Math.max(w / 2, 1);
    return Math.max(-1, Math.min(1, normalized)) * MAGNET_PULL * falloff;
  });

  const rawY = useTransform<number, number>([sectionMouseY, centerY, tileHeight], ([my, cy, h]) => {
    if (!magnetEnabled || reduced) return 0;
    const dx = sectionMouseX.get() - centerX.get();
    const dy = my - cy;
    const dist = Math.hypot(dx, dy);
    if (dist > MAGNET_RADIUS) return 0;
    const falloff = 1 - dist / MAGNET_RADIUS;
    const normalized = dy / Math.max(h / 2, 1);
    return Math.max(-1, Math.min(1, normalized)) * MAGNET_PULL * falloff;
  });

  const spring = { stiffness: 150, damping: 20, mass: 0.6 };
  const x = useSpring(rawX, spring);
  const y = useSpring(rawY, spring);
  const rotateY = useTransform(x, (v) => (v / MAGNET_PULL) * TILT_DEGREES);
  const rotateX = useTransform(y, (v) => -(v / MAGNET_PULL) * TILT_DEGREES);
  const glow = useTransform([x, y], ([vx, vy]) => {
    const m = Math.hypot(vx as number, vy as number) / MAGNET_PULL;
    return Math.min(1, m);
  });
  const glowOpacity = useTransform(glow, [0, 1], [0, 0.55]);

  // Mark "settled" ~700ms after reveal to drop will-change.
  React.useEffect(() => {
    if (!inView) return;
    const t = window.setTimeout(() => setSettled(true), 700 + index * 60);
    return () => window.clearTimeout(t);
  }, [inView, index]);

  const Icon: LucideIcon | React.ComponentType<{ className?: string }> = tile.icon ?? Sparkles;
  const isHero = tile.size === 'hero';
  const accent = tile.accentColor ?? 'oklch(0.78 0.16 280)';

  const heroClasses = 'sm:col-span-1 md:col-span-2 md:row-span-2 lg:col-span-2 lg:row-span-2';
  const defaultClasses = 'sm:col-span-1 md:col-span-1 lg:col-span-1';

  const revealInitial = reduced
    ? { opacity: 1, clipPath: 'inset(0% 0% 0% 0%)' }
    : { opacity: 0, clipPath: 'inset(0% 0% 100% 0%)' };
  const revealAnimate = inView ? { opacity: 1, clipPath: 'inset(0% 0% 0% 0%)' } : revealInitial;

  const TileTag: React.ElementType = tile.href ? 'a' : 'div';

  return (
    <motion.article
      ref={tileRef}
      initial={revealInitial}
      animate={revealAnimate}
      transition={{
        duration: reduced ? 0 : 0.8,
        ease: [0.22, 1, 0.36, 1],
        delay: reduced ? 0 : index * 0.06,
      }}
      style={{
        x,
        y,
        rotateX,
        rotateY,
        transformPerspective: 1200,
        transformStyle: 'preserve-3d',
        willChange: settled ? 'auto' : 'transform, clip-path, opacity',
      }}
      className={cn(
        'group relative isolate flex min-h-[14rem] flex-col overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-sm transition-colors duration-300',
        'hover:border-foreground/20 hover:shadow-xl',
        isHero ? heroClasses : defaultClasses,
        isHero && 'min-h-[18rem] md:min-h-[22rem] lg:min-h-[28rem]'
      )}
    >
      <TileTag
        {...(tile.href ? { href: tile.href } : {})}
        className={cn(
          'absolute inset-0 z-10 rounded-2xl',
          tile.href
            ? 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background'
            : 'pointer-events-none'
        )}
        aria-label={tile.href ? tile.title : undefined}
        tabIndex={tile.href ? 0 : -1}
      />

      {/* Accent glow that intensifies with magnet pull */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-px rounded-2xl"
        style={{
          opacity: glowOpacity,
          background: `radial-gradient(60% 60% at 50% 40%, ${accent}, transparent 70%)`,
          mixBlendMode: 'screen',
        }}
      />

      {/* Subtle decorative grid in hero */}
      {isHero ? (
        <svg
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.08]"
        >
          <defs>
            <pattern
              id={`bento-grid-${tile.id}`}
              width="32"
              height="32"
              patternUnits="userSpaceOnUse"
            >
              <path d="M 32 0 L 0 0 0 32" fill="none" stroke="currentColor" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill={`url(#bento-grid-${tile.id})`} />
        </svg>
      ) : null}

      {/* Decorative corner glyph */}
      <svg
        aria-hidden="true"
        viewBox="0 0 80 80"
        className="pointer-events-none absolute right-4 top-4 h-16 w-16 opacity-[0.07] transition-opacity duration-300 group-hover:opacity-[0.14]"
      >
        <circle cx="40" cy="40" r="36" fill="none" stroke="currentColor" strokeWidth="1" />
        <circle cx="40" cy="40" r="22" fill="none" stroke="currentColor" strokeWidth="1" />
        <circle cx="40" cy="40" r="8" fill="currentColor" />
      </svg>

      <div className="relative z-[1] flex h-full flex-col">
        <div
          className="mb-5 inline-flex h-11 w-11 items-center justify-center rounded-xl border border-border bg-background/60 backdrop-blur-sm"
          style={{ color: accent }}
        >
          <Icon className="h-5 w-5" />
        </div>

        <h3
          className={cn(
            'mb-2 font-semibold tracking-tight text-foreground',
            isHero ? 'text-2xl md:text-3xl lg:text-4xl' : 'text-lg'
          )}
        >
          {tile.title}
        </h3>

        <p
          className={cn(
            'text-muted-foreground',
            isHero ? 'max-w-lg text-base md:text-lg' : 'text-sm leading-relaxed'
          )}
        >
          {tile.body}
        </p>

        {isHero ? (
          <div
            aria-hidden="true"
            className="mt-auto flex items-end gap-1 pt-8"
            style={{ color: accent }}
          >
            {Array.from({ length: 12 }).map((_, i) => (
              <span
                key={i}
                className="block w-1.5 rounded-full bg-current opacity-70"
                style={{
                  height: `${12 + Math.sin(i * 0.7) * 18 + i * 2}px`,
                }}
              />
            ))}
          </div>
        ) : null}
      </div>
    </motion.article>
  );
}

export const MagneticBentoShowcase = React.forwardRef<HTMLElement, MagneticBentoShowcaseProps>(
  function MagneticBentoShowcase(
    {
      eyebrow = 'Why teams choose Lerpa UI',
      title = 'A bento built for builders',
      description = 'Every tile is a primitive you can ship today — alive on hover, considerate when you ask it to slow down.',
      tiles = DEFAULT_TILES,
      className,
      ...rest
    },
    ref
  ) {
    const sectionRef = React.useRef<HTMLElement | null>(null);
    React.useImperativeHandle(ref, () => sectionRef.current as HTMLElement);

    const sectionMouseX = useMotionValue(-9999);
    const sectionMouseY = useMotionValue(-9999);

    const prefersReducedMotion = usePrefersReducedMotion();
    const motionReduced = useReducedMotion();
    const reduced = prefersReducedMotion || Boolean(motionReduced);

    const [magnetEnabled, setMagnetEnabled] = React.useState(false);

    React.useEffect(() => {
      if (typeof window === 'undefined') return;
      const mq = window.matchMedia('(min-width: 1024px) and (hover: hover) and (pointer: fine)');
      const update = () => setMagnetEnabled(mq.matches && !reduced);
      update();
      mq.addEventListener('change', update);
      return () => mq.removeEventListener('change', update);
    }, [reduced]);

    React.useEffect(() => {
      if (!magnetEnabled) return;
      const section = sectionRef.current;
      if (!section) return;

      const onMove = (e: MouseEvent) => {
        const rect = section.getBoundingClientRect();
        sectionMouseX.set(e.clientX - rect.left);
        sectionMouseY.set(e.clientY - rect.top);
      };
      const onLeave = () => {
        sectionMouseX.set(-9999);
        sectionMouseY.set(-9999);
      };

      section.addEventListener('mousemove', onMove);
      section.addEventListener('mouseleave', onLeave);
      return () => {
        section.removeEventListener('mousemove', onMove);
        section.removeEventListener('mouseleave', onLeave);
      };
    }, [magnetEnabled, sectionMouseX, sectionMouseY]);

    const headingId = React.useId();

    return (
      <section
        ref={sectionRef}
        aria-labelledby={headingId}
        className={cn('relative w-full bg-background py-20 sm:py-24 lg:py-32', className)}
        {...rest}
      >
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mb-14 max-w-2xl text-center lg:mb-20">
            {eyebrow ? (
              <span className="mb-4 inline-flex items-center rounded-full border border-border bg-card px-3 py-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                {eyebrow}
              </span>
            ) : null}
            <h2
              id={headingId}
              className="text-balance text-3xl font-semibold tracking-tight text-foreground sm:text-4xl lg:text-5xl"
            >
              {title}
            </h2>
            {description ? (
              <p className="mt-5 text-pretty text-base text-muted-foreground sm:text-lg">
                {description}
              </p>
            ) : null}
          </div>

          <div
            className={cn(
              'grid gap-4 sm:gap-5',
              'grid-cols-1',
              'md:grid-cols-2 md:auto-rows-[minmax(11rem,auto)]',
              'lg:grid-cols-4 lg:auto-rows-[minmax(12rem,auto)]'
            )}
            style={{ perspective: 1200 }}
          >
            {tiles.map((tile, index) => (
              <MagneticTile
                key={tile.id}
                tile={tile}
                index={index}
                sectionMouseX={sectionMouseX}
                sectionMouseY={sectionMouseY}
                magnetEnabled={magnetEnabled}
                reduced={reduced}
              />
            ))}
          </div>
        </div>
      </section>
    );
  }
);

export default MagneticBentoShowcase;

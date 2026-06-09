'use client';

import * as React from 'react';
import {
  motion,
  useScroll,
  useTransform,
  type MotionValue,
  type Variants,
} from 'framer-motion';
import { ArrowRight, BookOpen, Braces, Sparkles, Terminal } from 'lucide-react';
import { usePrefersReducedMotion } from '../animation/hooks';
import { cn } from '../lib/cn';

export interface HelixKineticHeroProps
  extends React.HTMLAttributes<HTMLElement> {
  eyebrow?: string;
  title?: string;
  /** Index of the word in `title` to render with the gradient. Defaults to the last word. */
  splitWordIndex?: number;
  description?: string;
  primaryCta?: { label: string; onClick?: () => void };
  secondaryCta?: { label: string; onClick?: () => void };
  /** Symbols/icons scattered through the helix columns. */
  helixGlyphs?: React.ReactNode[];
  className?: string;
}

const DEFAULT_GLYPHS: React.ReactNode[] = [
  '{',
  '}',
  '<',
  '>',
  '/',
  '*',
  '=',
  ';',
  '#',
  '$',
  '~',
  '|',
  '?',
  '!',
  <Braces key="ic-braces" className="h-3.5 w-3.5" aria-hidden="true" />,
  <Terminal key="ic-term" className="h-3.5 w-3.5" aria-hidden="true" />,
  <Sparkles key="ic-spark" className="h-3.5 w-3.5" aria-hidden="true" />,
];

const TILES_PER_COLUMN = 14;

/** Deterministic pseudo-random so SSR + CSR match. */
function rand(seed: number): number {
  const x = Math.sin(seed * 9301 + 49297) * 233280;
  return x - Math.floor(x);
}

/** A single sine-wave column of floating glyph tiles. */
interface HelixColumnProps {
  side: 'left' | 'right';
  phaseOffset: number; // in radians; right column = Math.PI
  glyphs: React.ReactNode[];
  scrollY: MotionValue<number>;
  reduced: boolean;
}

const HelixColumn = React.memo(function HelixColumn({
  side,
  phaseOffset,
  glyphs,
  scrollY,
  reduced,
}: HelixColumnProps) {
  // Vertical parallax: column drifts opposite to scroll direction.
  const yShift = useTransform(
    scrollY,
    [0, 1],
    side === 'left' ? [0, -120] : [0, 120],
  );
  // Subtle horizontal sway tied to scroll for a 3D-helix feel.
  const xSway = useTransform(
    scrollY,
    [0, 1],
    side === 'left' ? [0, 18] : [0, -18],
  );

  const tiles = React.useMemo(() => {
    return Array.from({ length: TILES_PER_COLUMN }, (_, i) => {
      const t = i / (TILES_PER_COLUMN - 1); // 0..1
      const seed = side === 'left' ? i + 1 : i + 101;
      const glyph = glyphs[i % glyphs.length];
      return {
        i,
        t,
        glyph,
        delay: rand(seed) * 0.35,
        scale: 0.85 + rand(seed + 7) * 0.3,
      };
    });
  }, [glyphs, side]);

  return (
    <motion.div
      aria-hidden="true"
      style={reduced ? undefined : { y: yShift, x: xSway }}
      className={cn(
        'pointer-events-none absolute inset-y-0 flex flex-col items-center justify-between py-6',
        'will-change-transform',
        side === 'left' ? 'left-[6%] md:left-[10%]' : 'right-[6%] md:right-[10%]',
        // Mobile: hide right column so we get a single helix line.
        side === 'right' && 'hidden sm:flex',
        // Tablet: reduced opacity; desktop: full.
        'opacity-40 md:opacity-60 lg:opacity-90',
      )}
    >
      {tiles.map(({ i, t, glyph, delay, scale }) => {
        // Phase along the column; right column shifted by PI.
        const phase = t * Math.PI * 2 + phaseOffset;
        const baseX = Math.sin(phase) * 28; // px sway
        const baseOpacity = 0.55 + (Math.cos(phase) + 1) * 0.2; // 0.55..0.95

        const tile = (
          <span
            className={cn(
              'inline-flex h-9 w-9 items-center justify-center rounded-lg',
              'border border-border/60 bg-card/70 backdrop-blur-sm',
              'font-mono text-[13px] text-foreground/80',
              'shadow-[0_4px_18px_-6px_oklch(0_0_0_/_0.15)]',
            )}
            style={{ transform: `scale(${scale})` }}
          >
            {glyph}
          </span>
        );

        if (reduced) {
          return (
            <div
              key={i}
              style={{ transform: `translateX(${baseX}px)`, opacity: baseOpacity }}
            >
              {tile}
            </div>
          );
        }

        return (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: baseX - 14, scale: 0.8 }}
            animate={{
              opacity: baseOpacity,
              x: [baseX - 6, baseX + 6, baseX - 6],
              scale: 1,
            }}
            transition={{
              opacity: { duration: 0.6, delay },
              scale: { duration: 0.6, delay },
              x: {
                duration: 6 + (i % 3),
                delay,
                repeat: Infinity,
                ease: 'easeInOut',
              },
            }}
            className="will-change-transform"
          >
            {tile}
          </motion.div>
        );
      })}
    </motion.div>
  );
});

/** Per-character kinetic entrance with hover-glitch. */
interface KineticWordProps {
  word: string;
  highlight?: boolean;
  reduced: boolean;
}

const charVariants: Variants = {
  hidden: { opacity: 0, y: '0.6em', rotateX: -45 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    rotateX: 0,
    transition: {
      delay: 0.25 + i * 0.035,
      duration: 0.55,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
};

function KineticWord({ word, highlight = false, reduced }: KineticWordProps) {
  const chars = React.useMemo(() => Array.from(word), [word]);

  return (
    <span
      className={cn(
        'relative inline-flex whitespace-pre [perspective:800px]',
        highlight &&
          'bg-gradient-to-br from-primary via-foreground to-primary bg-clip-text text-transparent',
      )}
    >
      {chars.map((ch, i) => {
        if (reduced) {
          return (
            <span key={i} className="inline-block">
              {ch}
            </span>
          );
        }
        return (
          <motion.span
            key={i}
            custom={i}
            variants={charVariants}
            initial="hidden"
            animate="visible"
            whileHover={{
              y: [-1, 1, -1, 0],
              x: [1, -1, 1, 0],
              transition: { duration: 0.25 },
            }}
            className="inline-block will-change-transform"
            style={{ transformStyle: 'preserve-3d' }}
          >
            {ch}
          </motion.span>
        );
      })}
    </span>
  );
}

export function HelixKineticHero({
  eyebrow = 'Build at the speed of thought',
  title = 'Ship interfaces that feel alive.',
  splitWordIndex,
  description = 'Composable React primitives, scroll-driven motion, and design tokens engineered for teams shipping serious tooling — not another generic SaaS dashboard.',
  primaryCta = { label: 'Get started' },
  secondaryCta = { label: 'View docs' },
  helixGlyphs = DEFAULT_GLYPHS,
  className,
  ...rest
}: HelixKineticHeroProps) {
  const reduced = usePrefersReducedMotion();
  const sectionRef = React.useRef<HTMLElement | null>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  // One shared progress MV powers both columns (no re-subscription per child).
  const meshY = useTransform(scrollYProgress, [0, 1], [-40, 40]);
  const meshOpacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.85, 1, 0.7]);

  const words = React.useMemo(() => title.split(' '), [title]);
  const highlightIdx =
    splitWordIndex ?? (words.length > 0 ? words.length - 1 : 0);

  return (
    <section
      ref={sectionRef}
      {...rest}
      className={cn(
        'relative isolate overflow-hidden bg-background text-foreground',
        'py-20 sm:py-28 lg:py-36',
        className,
      )}
    >
      {/* Gradient mesh background */}
      <motion.div
        aria-hidden="true"
        style={reduced ? undefined : { y: meshY, opacity: meshOpacity }}
        className="pointer-events-none absolute inset-0 -z-10"
      >
        <div className="absolute left-1/2 top-[-20%] h-[80%] w-[80%] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,oklch(0.7_0.18_280/0.25),transparent_70%)] blur-3xl" />
        <div className="absolute bottom-[-30%] left-[10%] h-[60%] w-[60%] rounded-full bg-[radial-gradient(closest-side,oklch(0.75_0.15_200/0.22),transparent_70%)] blur-3xl" />
        <div className="absolute right-[5%] top-[20%] h-[40%] w-[40%] rounded-full bg-[radial-gradient(closest-side,oklch(0.78_0.16_340/0.18),transparent_70%)] blur-3xl" />
      </motion.div>

      {/* Helix columns */}
      <HelixColumn
        side="left"
        phaseOffset={0}
        glyphs={helixGlyphs}
        scrollY={scrollYProgress}
        reduced={reduced}
      />
      <HelixColumn
        side="right"
        phaseOffset={Math.PI}
        glyphs={helixGlyphs}
        scrollY={scrollYProgress}
        reduced={reduced}
      />

      {/* Content */}
      <div className="relative mx-auto flex max-w-3xl flex-col items-center px-6 text-center">
        <motion.div
          initial={reduced ? false : { opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className={cn(
            'mb-6 inline-flex items-center gap-2 rounded-full',
            'border border-border/60 bg-card/70 px-3.5 py-1.5 backdrop-blur-sm',
            'text-xs font-medium text-muted-foreground',
          )}
        >
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75 motion-reduce:hidden" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-primary" />
          </span>
          {eyebrow}
        </motion.div>

        <h1
          className={cn(
            'font-extrabold leading-[1.05] tracking-tight text-foreground',
            'text-[clamp(2.25rem,6vw,4.75rem)]',
          )}
        >
          {words.map((w, i) => (
            <React.Fragment key={`${w}-${i}`}>
              <KineticWord
                word={w}
                highlight={i === highlightIdx}
                reduced={reduced}
              />
              {i < words.length - 1 ? ' ' : ''}
            </React.Fragment>
          ))}
        </h1>

        <motion.p
          initial={reduced ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35 }}
          className="mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg"
        >
          {description}
        </motion.p>

        <motion.div
          initial={reduced ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-10 flex w-full flex-col items-stretch justify-center gap-3 sm:w-auto sm:flex-row sm:items-center"
        >
          <button
            type="button"
            onClick={primaryCta.onClick}
            className={cn(
              'group inline-flex items-center justify-center gap-2 rounded-lg',
              'bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground',
              'shadow-lg shadow-primary/25 transition-all',
              'hover:shadow-xl hover:shadow-primary/30 hover:brightness-110',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background',
              'motion-reduce:transition-none',
            )}
          >
            {primaryCta.label}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none" />
          </button>
          <button
            type="button"
            onClick={secondaryCta.onClick}
            className={cn(
              'inline-flex items-center justify-center gap-2 rounded-lg',
              'border border-border bg-card/60 px-6 py-3 text-sm font-semibold text-foreground backdrop-blur-sm',
              'transition-colors hover:bg-card',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background',
              'motion-reduce:transition-none',
            )}
          >
            <BookOpen className="h-4 w-4" aria-hidden="true" />
            {secondaryCta.label}
          </button>
        </motion.div>
      </div>

      {/* Bottom fade so helix tiles dissolve into the page */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-background to-transparent"
      />
    </section>
  );
}

export default HelixKineticHero;

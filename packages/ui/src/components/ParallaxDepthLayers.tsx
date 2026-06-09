"use client";

import React, { useRef } from 'react';
import { motion, useMotionValue, useScroll, useSpring, useTransform, type MotionValue } from 'framer-motion';
import { cn } from '../lib/cn';
import { usePrefersReducedMotion } from '../animation/hooks';

/** Five-layer scene blending mouse and scroll parallax at varying depths. */
export interface ParallaxDepthLayersProps {
  layers?: React.ReactNode[];
  className?: string;
  height?: number | string;
}

interface LayerProps {
  child: React.ReactNode;
  index: number;
  total: number;
  scrollYProgress: MotionValue<number>;
  smx: MotionValue<number>;
  smy: MotionValue<number>;
  reduced: boolean;
}

const Layer: React.FC<LayerProps> = ({ child, index, total, scrollYProgress, smx, smy, reduced }) => {
  const depth = (index + 1) / total;
  const scrollOffset = useTransform(scrollYProgress, [0, 1], [0, -200 * depth]);
  const x = useTransform(smx, (v) => v * (20 + index * 14));
  const myOffset = useTransform(smy, (v) => v * (10 + index * 10));
  const y = useTransform<number, number>(
    [myOffset, scrollOffset] as [MotionValue<number>, MotionValue<number>],
    ([a, b]) => a + b,
  );

  return (
    <motion.div
      style={reduced ? undefined : { x, y }}
      className="absolute inset-0 will-change-transform"
    >
      {child}
    </motion.div>
  );
};

const DEFAULT_LAYERS: React.ReactNode[] = [
  <div
    key="sky"
    className="absolute inset-0"
    style={{
      background:
        'linear-gradient(180deg, #1f0f3a 0%, #4c1d95 45%, #db2777 90%)',
    }}
  />,
  <div
    key="sun"
    className="absolute left-1/2 top-[28%] -translate-x-1/2 h-44 w-44 rounded-full"
    style={{
      background: 'radial-gradient(circle, #fef08a 0%, #f97316 60%, transparent 75%)',
      filter: 'blur(4px)',
    }}
  />,
  <div
    key="mountains-back"
    className="absolute bottom-0 left-0 right-0 h-1/2"
    style={{
      background:
        'linear-gradient(180deg, transparent 0%, #6d28d9 60%, #4c1d95 100%)',
      clipPath:
        'polygon(0 70%, 12% 55%, 22% 65%, 38% 45%, 52% 60%, 68% 40%, 82% 55%, 100% 50%, 100% 100%, 0 100%)',
    }}
  />,
  <div
    key="mountains-mid"
    className="absolute bottom-0 left-0 right-0 h-1/2"
    style={{
      background: 'linear-gradient(180deg, transparent 0%, #1e1b4b 80%)',
      clipPath:
        'polygon(0 80%, 18% 65%, 32% 75%, 50% 55%, 66% 72%, 82% 60%, 100% 70%, 100% 100%, 0 100%)',
    }}
  />,
  <div
    key="ground"
    className="absolute inset-x-0 bottom-0 h-1/3"
    style={{
      background: 'linear-gradient(180deg, #0f0922 0%, #000 100%)',
    }}
  />,
];

export const ParallaxDepthLayers: React.FC<ParallaxDepthLayersProps> = ({
  layers = DEFAULT_LAYERS,
  className,
  height = '70vh',
}) => {
  const reduced = usePrefersReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const smx = useSpring(mx, { stiffness: 80, damping: 18 });
  const smy = useSpring(my, { stiffness: 80, damping: 18 });

  const handleMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (reduced || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    mx.set(((e.clientX - r.left) / r.width - 0.5) * 2);
    my.set(((e.clientY - r.top) / r.height - 0.5) * 2);
  };

  return (
    <div
      ref={ref}
      onPointerMove={handleMove}
      onPointerLeave={() => {
        mx.set(0);
        my.set(0);
      }}
      style={{ height }}
      className={cn(
        'relative w-full overflow-hidden rounded-2xl border border-[var(--border)]',
        className,
      )}
    >
      {layers.map((child, i) => (
        <Layer
          key={i}
          child={child}
          index={i}
          total={layers.length}
          scrollYProgress={scrollYProgress}
          smx={smx}
          smy={smy}
          reduced={reduced}
        />
      ))}
    </div>
  );
};

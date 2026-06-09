'use client';

import React, { useState } from 'react';
import { motion, useMotionValue, useTransform, animate} from "framer-motion";
import { RefreshCw, ArrowDown, HelpCircle, CheckCircle2 } from 'lucide-react';
import { cn } from '../lib/cn';
import { usePrefersReducedMotion } from '../animation/hooks';

interface BouncyPullRefreshArrowProps extends React.HTMLAttributes<HTMLDivElement> {
  onRefresh?: () => Promise<void>;
  threshold?: number;
  loadingOffset?: number;
  children?: React.ReactNode;
}

export function BouncyPullRefreshArrow({
  onRefresh = async () => new Promise((r) => setTimeout(r, 2200)),
  threshold = 85,
  loadingOffset = 55,
  children,
  className,
  ...props
}: BouncyPullRefreshArrowProps) {
  const [status, setStatus] = useState<'idle' | 'pulling' | 'loading' | 'success'>('idle');
  const dragY = useMotionValue(0);
  const prefersReducedMotion = usePrefersReducedMotion();

  // Derive rotation and scale from drag height
  const rotate = useTransform(dragY, [0, threshold], [0, 360]);
  const scale = useTransform(dragY, [0, threshold], [0.35, 1.25]);
  const opacity = useTransform(dragY, [0, 30], [0, 1]);

  const handleDrag = () => {
    const currentY = dragY.get();
    if (status === 'loading' || status === 'success') return;

    if (currentY >= threshold) {
      setStatus('pulling');
    } else {
      setStatus('idle');
    }
  };

  const handleDragEnd = async () => {
    if (status === 'loading' || status === 'success') return;

    const currentY = dragY.get();

    if (currentY >= threshold) {
      // Snaps to holding height during loading state
      setStatus('loading');
      animate(dragY, loadingOffset, { type: 'spring', damping: 20, stiffness: 220 });

      try {
        await onRefresh();
        
        // Show success state briefly
        setStatus('success');
        await new Promise((r) => setTimeout(r, 800));
      } catch (err) {
        if ((globalThis as { process?: { env?: { NODE_ENV?: string } } }).process?.env?.NODE_ENV !== 'production') {
          // eslint-disable-next-line no-console
          console.error('Refresh failed', err);
        }
      } finally {
        setStatus('idle');
        animate(dragY, 0, { type: 'spring', damping: 22, stiffness: 220 });
      }
    } else {
      // Rebounds back to top
      setStatus('idle');
      animate(dragY, 0, { type: 'spring', damping: 22, stiffness: 220 });
    }
  };

  return (
    <div
      className={cn(
        "relative w-full bg-zinc-950 border border-zinc-800 rounded-3xl overflow-hidden min-h-[380px] flex flex-col justify-start select-none",
        className
      )}
      {...props}
    >
      {/* Background Visual Grid */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.01)_0%,transparent_80%)] pointer-events-none" />

      {/* Floating Header Instructions */}
      <div className="absolute top-4 left-0 right-0 text-center pointer-events-none z-10">
        <span className="text-[10px] font-bold font-mono tracking-widest text-zinc-500 uppercase">
          {status === 'idle' && 'DRAG CONTENT PANEL DOWN TO REFRESH'}
          {status === 'pulling' && 'RELEASE TO INITIATE ASYNC PAYLOAD'}
          {status === 'loading' && 'FETCHING DECENTRALIZED DATA...'}
          {status === 'success' && 'SYNCHRONIZATION COMPLETED'}
        </span>
      </div>

      {/* Embedded Pull-down Anchor Indicator */}
      <div
        className="absolute left-0 right-0 flex items-center justify-center pointer-events-none z-20"
        style={{
          top: 24,
          height: loadingOffset,
        }}
      >
        <motion.div
          style={{
            opacity,
            scale,
            rotate: status === 'loading' ? 0 : rotate,
          }}
          className={cn(
            "p-3 rounded-full flex items-center justify-center border shadow-xl bg-zinc-900",
            status === 'success' ? "border-emerald-500/40 text-emerald-400 bg-emerald-950/20" : "border-zinc-800 text-purple-400"
          )}
        >
          {status === 'idle' && (
            <ArrowDown className="w-5 h-5 text-zinc-500 animate-bounce" />
          )}

          {status === 'pulling' && (
            <ArrowDown className="w-5 h-5 text-purple-400" />
          )}

          {status === 'loading' && (
            <motion.div
              animate={prefersReducedMotion ? undefined : { rotate: 360 }}
              transition={prefersReducedMotion ? { duration: 0 } : { repeat: Infinity, ease: 'linear', duration: 0.9 }}
              className="flex items-center justify-center"
            >
              <RefreshCw className="w-5 h-5" />
            </motion.div>
          )}

          {status === 'success' && (
            <CheckCircle2 className="w-5 h-5" />
          )}
        </motion.div>
      </div>

      {/* Draggable content container overlay */}
      <motion.div
        drag="y"
        dragConstraints={{ top: 0, bottom: 200 }}
        dragElastic={0.4}
        style={{ y: dragY }}
        onDrag={handleDrag}
        onDragEnd={handleDragEnd}
        className="relative w-full h-full bg-zinc-900 border-t border-zinc-800/80 rounded-t-2xl z-30 cursor-grab active:cursor-grabbing p-6 md:p-8 flex flex-col justify-between"
      >
        {/* Decorative notch line */}
        <div className="w-12 h-1.5 rounded-full bg-zinc-800 mx-auto mb-6 shrink-0" />

        {children || (
          <div className="flex-1 flex flex-col justify-center items-center text-center space-y-4 py-8">
            <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 text-zinc-400">
              <HelpCircle className="w-8 h-8 mx-auto text-purple-400" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-white">Interactive Sandbox Grid</h3>
              <p className="text-xs text-zinc-500 mt-1 max-w-xs leading-relaxed">
                Pull down on this grey container area. It behaves with realistic spring elastic pull, rotating the refresh anchor.
              </p>
            </div>
          </div>
        )}

        <div className="w-full text-center mt-6 shrink-0">
          <span className="text-[9px] font-black font-mono tracking-widest text-zinc-600">
            BOUNCY PULL REFRESH ARROW • V4 TAILWIND COMPLIANT
          </span>
        </div>
      </motion.div>
    </div>
  );
}
export default BouncyPullRefreshArrow;

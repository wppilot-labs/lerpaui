"use client";

import React, { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence} from "framer-motion";
import { Ticket, RefreshCw, Copy, Check } from 'lucide-react';
import { cn } from '../lib/cn';

export interface CouponScratchCardProps {
  /** The promotional discount code to reveal, e.g. "LAUNCH50" */
  promoCode: string;
  /** The headline discount amount, e.g. "50% OFF" */
  discount: string;
  /** Primary title of the scratch coupon */
  title?: string;
  /** Subtitle/Terms label below */
  subtitle?: string;
  /** Coating texture: 'silver' | 'gold' */
  coating?: 'silver' | 'gold';
  /** Optional container class names */
  className?: string;
}

interface Confetti {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  rotation: number;
  rotationSpeed: number;
}

export const CouponScratchCard: React.FC<CouponScratchCardProps> = ({
  promoCode,
  discount,
  title = "LAUNCHDAY SPECIAL",
  subtitle = "Scratch off to reveal your unique developer promo code",
  coating = 'silver',
  className,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const confettiRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [isScratched, setIsScratched] = useState(false);
  const [copied, setCopied] = useState(false);
  const [scratchProgress, setScratchProgress] = useState(0);
  const [isDrawing, setIsDrawing] = useState(false);
  const [canvasDimensions, setCanvasDimensions] = useState({ width: 320, height: 180 });

  // Update canvas bounds on resize or mount
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    
    const updateSize = () => {
      setCanvasDimensions({
        width: el.clientWidth,
        height: el.clientHeight,
      });
    };
    
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  // Initialize Canvas Coating Metallic Gradient & Texture
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = canvasDimensions.width;
    const h = canvasDimensions.height;

    // Reset canvas composition
    ctx.globalCompositeOperation = 'source-over';
    
    // Create metallic gradient
    const grad = ctx.createLinearGradient(0, 0, w, h);
    if (coating === 'gold') {
      grad.addColorStop(0, '#d4af37'); // Gold base
      grad.addColorStop(0.2, '#f9e8a2'); // Glimmer
      grad.addColorStop(0.5, '#aa7c11'); // Dark gold shadow
      grad.addColorStop(0.75, '#f3e5ab'); // Champagne shine
      grad.addColorStop(1, '#8b6508'); // Dark bronze trim
    } else {
      grad.addColorStop(0, '#c0c0c0'); // Silver base
      grad.addColorStop(0.25, '#ffffff'); // Glimmer
      grad.addColorStop(0.5, '#a9a9a9'); // Dark chrome shadow
      grad.addColorStop(0.75, '#e2e8f0'); // Light silver shine
      grad.addColorStop(1, '#71717a'); // Dark metallic trim
    }

    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    // Apply granular metallic noise particles
    ctx.fillStyle = coating === 'gold' ? 'rgba(255, 240, 180, 0.15)' : 'rgba(255, 255, 255, 0.18)';
    for (let i = 0; i < 400; i++) {
      const rx = Math.random() * w;
      const ry = Math.random() * h;
      const rSize = Math.random() * 1.5 + 0.5;
      ctx.fillRect(rx, ry, rSize, rSize);
    }

    // Add card scratching guidelines overlay helper text
    ctx.fillStyle = coating === 'gold' ? '#78350f' : '#27272a';
    ctx.font = 'bold 12px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('SCRATCH WITH CURSOR OR TOUCH', w / 2, h / 2);

    // Subtle lock icon behind text
    ctx.font = '16px sans-serif';
    ctx.fillText('🔒', w / 2, h / 2 - 22);

    // Reset scratch state
    setIsScratched(false);
    setScratchProgress(0);
  }, [canvasDimensions, coating]);

  // Scratch Action Tracker: Mouse down
  const getCoordinates = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return null;

    const rect = canvas.getBoundingClientRect();
    
    // Handle both touch & mouse coordinates
    if ('touches' in e) {
      if (e.touches.length === 0) return null;
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top,
      };
    } else {
      return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    }
  };

  const startScratching = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDrawing(true);
    scratch(e);
  };

  const scratch = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing || isScratched) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    const coords = getCoordinates(e);

    if (!canvas || !ctx || !coords) return;

    // Erase circles using globalCompositeOperation destination-out
    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(coords.x, coords.y, 20, 0, Math.PI * 2);
    ctx.fill();

    // Check transparency progress ratio
    checkTransparency(canvas, ctx);
  };

  const stopScratching = () => {
    setIsDrawing(false);
  };

  // Calculates scratched transparent area percentage
  const checkTransparency = (canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) => {
    const w = canvas.width;
    const h = canvas.height;
    // Step resolution down to save rendering passes
    const imageData = ctx.getImageData(0, 0, w, h);
    const data = imageData.data;
    let transparent = 0;
    
    // Sample every 4th pixel for speed calculation
    for (let i = 3; i < data.length; i += 16) {
      if (data[i] === 0) {
        transparent++;
      }
    }

    const total = data.length / 16;
    const ratio = transparent / total;
    setScratchProgress(ratio);

    if (ratio > 0.45) {
      // Exceeds threshold: fade out card coating & trigger reward
      setIsScratched(true);
      triggerConfetti();
    }
  };

  // Trigger internal 3D Canvas gravity particle Confetti
  const triggerConfetti = () => {
    const canvas = confettiRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = canvas.parentElement?.clientWidth || 320;
    canvas.height = canvas.parentElement?.clientHeight || 180;

    const colors = ['#10b981', '#06b6d4', '#d4af37', '#ff5f56', '#a855f7', '#f43f5e'];
    const particles: Confetti[] = Array.from({ length: 70 }).map(() => ({
      x: canvas.width / 2 + (Math.random() - 0.5) * 50,
      y: canvas.height / 2 + (Math.random() - 0.5) * 20,
      vx: (Math.random() - 0.5) * 6,
      vy: -Math.random() * 4 - 3,
      size: Math.random() * 5 + 4,
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 8,
    }));

    let animFrameId: number;

    const drawLoop = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let activeParticles = 0;

      particles.forEach((p) => {
        p.vy += 0.18; // gravity
        p.x += p.vx;
        p.y += p.vy;
        p.rotation += p.rotationSpeed;

        if (p.y < canvas.height + 20) {
          activeParticles++;
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate((p.rotation * Math.PI) / 180);
          ctx.fillStyle = p.color;
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
          ctx.restore();
        }
      });

      if (activeParticles > 0) {
        animFrameId = requestAnimationFrame(drawLoop);
      }
    };

    drawLoop();

    return () => {
      cancelAnimationFrame(animFrameId);
    };
  };

  // Clipboard copy
  const handleCopy = () => {
    navigator.clipboard.writeText(promoCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Reset scratch card to original state
  const handleReset = () => {
    setIsScratched(false);
    setScratchProgress(0);
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        setCanvasDimensions((prev) => ({ ...prev })); // forces re-render of layout
      }
    }
  };

  return (
    <div className={cn("w-full flex flex-col items-center justify-center p-4 select-none", className)}>
      
      {/* Main card box frame */}
      <div 
        ref={containerRef}
        className="relative w-full max-w-sm h-48 bg-zinc-950 text-white rounded-2xl border border-zinc-800 shadow-2xl overflow-hidden flex items-center justify-center select-none"
      >
        
        {/* Background card information underneath the coating */}
        <div className="absolute inset-0 flex flex-col justify-between p-6 bg-gradient-to-br from-zinc-900 via-zinc-950 to-zinc-900 border border-white/5 rounded-2xl z-0 select-none">
          <div className="flex justify-between items-start select-none">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full select-none">
                {title}
              </span>
              <p className="text-[11px] text-zinc-400 mt-1 select-none">{subtitle}</p>
            </div>
            <Ticket className="w-6 h-6 text-zinc-600 select-none" />
          </div>

          <div className="flex items-center justify-between mt-3 select-none">
            {/* Promo percentage */}
            <div className="flex flex-col text-left select-none">
              <span className="text-3xl font-extrabold text-white leading-none tracking-tight select-none">
                {discount}
              </span>
              <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest mt-0.5 select-none">
                STOREWIDE REWARD
              </span>
            </div>

            {/* Revealed Code Box */}
            <AnimatePresence>
              {isScratched && (
                <motion.div
                  initial={{ scale: 0.8, opacity: 0, x: 20 }}
                  animate={{ scale: 1, opacity: 1, x: 0 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  transition={{ type: 'spring', stiffness: 220, damping: 15 }}
                  className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-1.5 pl-3 select-none"
                >
                  <span className="font-mono text-sm font-black tracking-widest text-emerald-400 uppercase select-all">
                    {promoCode}
                  </span>
                  
                  <button
                    onClick={handleCopy}
                    className="p-1.5 rounded bg-emerald-600 hover:bg-emerald-500 text-white transition-all active:scale-90 cursor-pointer"
                    title="Copy Code"
                  >
                    {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Scratch-off Canvas Surface */}
        {!isScratched && (
          <canvas
            ref={canvasRef}
            width={canvasDimensions.width}
            height={canvasDimensions.height}
            onMouseDown={startScratching}
            onMouseMove={scratch}
            onMouseUp={stopScratching}
            onMouseLeave={stopScratching}
            onTouchStart={startScratching}
            onTouchMove={scratch}
            onTouchEnd={stopScratching}
            className="absolute inset-0 z-10 w-full h-full rounded-2xl cursor-crosshair transition-opacity duration-300 select-none touch-none"
            style={{
              opacity: scratchProgress > 0.45 ? 0 : 1,
              pointerEvents: scratchProgress > 0.45 ? 'none' : 'auto',
            }}
          />
        )}

        {/* Gravity Confetti overlay Canvas */}
        <canvas
          ref={confettiRef}
          className="absolute inset-0 pointer-events-none z-30 select-none"
        />

        {/* Glass glare top overlay reflection */}
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-tr from-white/0 via-white/5 to-white/0 select-none z-40" />

      </div>

      {/* Progress metrics and Reset Trigger */}
      {isScratched && (
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={handleReset}
          className="mt-4 flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground font-semibold uppercase tracking-wider transition-colors cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Reset Scratch Card</span>
        </motion.button>
      )}

      {!isScratched && scratchProgress > 0 && (
        <span className="text-[10px] text-muted-foreground font-bold tracking-widest uppercase mt-3 select-none">
          SCRATCHED: {Math.round(scratchProgress * 100)}% / 45% TO REVEAL
        </span>
      )}
    </div>
  );
};

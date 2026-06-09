"use client";

import React, { useRef, useState, useEffect } from 'react';
import { motion, useMotionValue, useSpring} from "framer-motion";
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { cn } from '../lib/cn';

export interface CarouselItem {
  title: string;
  description: string;
  image: string;
  tags?: string[];
}

export interface CircularWheelCarouselProps {
  /** Project items array */
  items: CarouselItem[];
  /** Optional class names */
  className?: string;
  /** Radius of 3D circle in pixels, default 300 */
  radius?: number;
}

export const CircularWheelCarousel: React.FC<CircularWheelCarouselProps> = ({
  items,
  className,
  radius = 340,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const startAngleRef = useRef(0);

  // Angle tracking
  const angleMV = useMotionValue(0);
  const angleSpring = useSpring(angleMV, { stiffness: 45, damping: 15 });
  const [currentAngle, setCurrentAngle] = useState(0);

  // Sync angle to standard state for active card calculations
  useEffect(() => {
    return angleSpring.on("change", (val) => {
      setCurrentAngle(val);
    });
  }, [angleSpring]);

  const theta = 360 / items.length;

  // Calculate active index (closest to front, which is y-rotation = 0)
  // We want to map currentAngle to active index
  const getActiveIndex = () => {
    const rawIndex = Math.round(-currentAngle / theta) % items.length;
    return rawIndex < 0 ? rawIndex + items.length : rawIndex;
  };

  const activeIndex = getActiveIndex();

  // Pointer Down
  const handlePointerDown = (e: React.PointerEvent) => {
    isDraggingRef.current = true;
    startXRef.current = e.clientX;
    startAngleRef.current = angleMV.get();
    if (containerRef.current) {
      containerRef.current.style.cursor = 'grabbing';
      containerRef.current.setPointerCapture(e.pointerId);
    }
  };

  // Pointer Move
  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDraggingRef.current) return;
    const deltaX = e.clientX - startXRef.current;
    // Scale delta to degrees of rotation (0.2 degrees per px)
    const newAngle = startAngleRef.current + (deltaX * 0.25);
    angleMV.set(newAngle);
  };

  // Pointer Up
  const handlePointerUp = (e: React.PointerEvent) => {
    isDraggingRef.current = false;
    if (containerRef.current) {
      containerRef.current.style.cursor = 'grab';
      containerRef.current.releasePointerCapture(e.pointerId);
    }

    // Snap to the nearest increment of theta
    const targetAngle = angleMV.get();
    const nearestStep = Math.round(targetAngle / theta) * theta;
    
    // Smooth animate spring to snapped target
    angleMV.set(nearestStep);
  };

  // Next / Prev button triggers
  const handleNext = () => {
    const target = Math.round(angleMV.get() / theta) * theta - theta;
    angleMV.set(target);
  };

  const handlePrev = () => {
    const target = Math.round(angleMV.get() / theta) * theta + theta;
    angleMV.set(target);
  };

  // State to hold hover coordinates on the active card for premium sheen overlay
  const [hoverCoords, setHoverCoords] = useState({ x: 50, y: 50, rx: 0, ry: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleCardMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    // Tilt translation calculation: range from -10 to 10 degrees
    const rx = ((e.clientY - rect.top) / rect.height - 0.5) * -15; // rotateX
    const ry = ((e.clientX - rect.left) / rect.width - 0.5) * 15;  // rotateY

    setHoverCoords({ x, y, rx, ry });
  };

  return (
    <div className={cn(
      "w-full flex flex-col items-center justify-center py-20 px-4 bg-zinc-950/20 rounded-3xl relative overflow-hidden select-none",
      className
    )}>
      {/* 3D Scene Wrapper */}
      <div 
        ref={containerRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        className="w-full max-w-lg h-[460px] flex items-center justify-center relative cursor-grab preserve-3d"
        style={{ perspective: 1200 }}
      >
        
        {/* Cylindrical Carousel Cylinder */}
        <motion.div
          className="w-full h-full relative preserve-3d flex items-center justify-center"
          style={{ rotateY: angleSpring }}
        >
          {items.map((item, idx) => {
            const cardAngle = idx * theta;
            
            // Calculate absolute visual angle offset from the front view (0 degrees)
            const visualAngle = ((cardAngle + currentAngle) % 360 + 360) % 360;
            const diffFromFront = Math.min(visualAngle, 360 - visualAngle); // 0 at front, 180 at back
            
            // Determine active/frontmost card
            const isActive = idx === activeIndex;
            
            // Back cards are smaller, faded and blurred
            const isBehind = diffFromFront > 90;
            const blurAmount = isBehind ? Math.min((diffFromFront - 90) / 10, 8) : 0;
            const cardOpacity = Math.max(1 - (diffFromFront / 180) * 0.8, 0.15);
            const scaleAmount = Math.max(1 - (diffFromFront / 180) * 0.4, 0.7);

            return (
              <div
                key={`carousel-card-${idx}`}
                className={cn(
                  "absolute w-64 h-80 rounded-2xl border transition-all duration-300 pointer-events-none select-none preserve-3d origin-center",
                  isActive 
                    ? "border-emerald-500/40 bg-zinc-900 shadow-2xl pointer-events-auto" 
                    : "border-zinc-800/80 bg-zinc-900/60 shadow-lg"
                )}
                style={{
                  transform: `rotateY(${cardAngle}deg) translateZ(${radius}px)`,
                  opacity: cardOpacity,
                  filter: blurAmount > 0.5 ? `blur(${blurAmount}px)` : 'none',
                  zIndex: Math.round(100 - diffFromFront),
                }}
              >
                {/* Visual interactive details if Frontmost Active Card */}
                {isActive ? (
                  <motion.div
                    className="w-full h-full rounded-2xl relative overflow-hidden flex flex-col justify-end p-5 select-none"
                    style={{
                      transform: isHovered 
                        ? `scale(${scaleAmount * 1.05}) rotateX(${hoverCoords.rx}deg) rotateY(${hoverCoords.ry}deg)`
                        : `scale(${scaleAmount})`,
                      transformStyle: 'preserve-3d',
                      transition: isDraggingRef.current ? 'none' : 'transform 0.2s cubic-bezier(0.25, 1, 0.5, 1)',
                    }}
                    onMouseMove={handleCardMouseMove}
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => {
                      setIsHovered(false);
                      setHoverCoords({ x: 50, y: 50, rx: 0, ry: 0 });
                    }}
                  >
                    {/* Background Item Image */}
                    <div 
                      className="absolute inset-0 bg-cover bg-center select-none" 
                      style={{ backgroundImage: `url(${item.image})` }}
                    />
                    {/* Shadow overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-10" />

                    {/* Premium Metallic Sheen Overlay */}
                    {isHovered && (
                      <div 
                        className="absolute inset-0 pointer-events-none z-20 transition-opacity duration-300"
                        style={{
                          background: `radial-gradient(circle at ${hoverCoords.x}% ${hoverCoords.y}%, rgba(255,255,255,0.18) 0%, transparent 60%)`,
                          mixBlendMode: 'overlay',
                        }}
                      />
                    )}

                    {/* Corner Premium Sparkle */}
                    <div className="absolute top-4 right-4 bg-emerald-500/20 border border-emerald-500/40 rounded-full p-1.5 backdrop-blur-md z-20">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                    </div>

                    {/* Card Description Elements */}
                    <div className="relative z-20 flex flex-col text-left select-none">
                      <div className="flex flex-wrap gap-1 mb-2">
                        {item.tags?.map((t) => (
                          <span key={t} className="text-[9px] uppercase font-bold tracking-wider bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/30">
                            {t}
                          </span>
                        ))}
                      </div>
                      <h4 className="text-base font-extrabold text-white tracking-tight drop-shadow-md select-none">
                        {item.title}
                      </h4>
                      <p className="text-[11px] text-zinc-300 mt-1 leading-snug drop-shadow select-none line-clamp-2">
                        {item.description}
                      </p>
                    </div>
                  </motion.div>
                ) : (
                  // Inactive Card standard static render
                  <div className="w-full h-full rounded-2xl relative overflow-hidden flex flex-col justify-end p-5 select-none scale-[0.95]">
                    <div 
                      className="absolute inset-0 bg-cover bg-center grayscale opacity-40 select-none" 
                      style={{ backgroundImage: `url(${item.image})` }}
                    />
                    <div className="absolute inset-0 bg-black/60 z-10" />
                    <div className="relative z-20 flex flex-col text-left select-none">
                      <h4 className="text-base font-extrabold text-zinc-400 select-none">{item.title}</h4>
                      <p className="text-[11px] text-zinc-500 mt-1 select-none line-clamp-2">{item.description}</p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </motion.div>
      </div>

      {/* Dynamic Slide Navigation Indicator dots */}
      <div className="flex items-center gap-6 mt-8 z-30 select-none">
        <button
          type="button"
          onClick={handlePrev}
          aria-label="Previous item"
          className="p-2.5 rounded-full border border-border bg-card text-card-foreground hover:bg-accent transition-all active:scale-90 shadow-md cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
        >
          <ChevronLeft className="w-4 h-4" aria-hidden="true" />
        </button>

        <div className="flex gap-2" aria-hidden="true">
          {items.map((_, idx) => (
            <span
              key={`dot-${idx}`}
              className={cn(
                "h-1.5 rounded-full transition-all duration-300",
                idx === activeIndex ? "w-6 bg-emerald-500" : "w-2 bg-muted-foreground/30"
              )}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={handleNext}
          aria-label="Next item"
          className="p-2.5 rounded-full border border-border bg-card text-card-foreground hover:bg-accent transition-all active:scale-90 shadow-md cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
        >
          <ChevronRight className="w-4 h-4" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
};

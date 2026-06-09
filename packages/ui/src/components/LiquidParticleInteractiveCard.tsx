"use client";

import React, { useRef, useEffect } from "react";
import { cn } from "../lib/cn";

interface LiquidParticleInteractiveCardProps {
  className?: string;
  particleColor?: string;
  title?: string;
  description?: string;
}

export function LiquidParticleInteractiveCard({
  className,
  particleColor = "rgba(168, 85, 247, 0.4)", // Purple shadow tint
  title = "LAUNCH_INTELLIGENCE",
  description = "Real-time canvas particle swarm tracking vector fields and cursor proximity coordinates.",
}: LiquidParticleInteractiveCardProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: -1000, y: -1000, radius: 80 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    const particlesArray: Particle[] = [];
    const numberOfParticles = 40;

    class Particle {
      x: number;
      y: number;
      size: number;
      baseX: number;
      baseY: number;
      density: number;

      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.size = Math.random() * 2 + 1.5;
        this.baseX = this.x;
        this.baseY = this.y;
        this.density = Math.random() * 30 + 1;
      }

      update() {
        // Distance check between mouse and particle
        const dx = mouseRef.current.x - this.x;
        const dy = mouseRef.current.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        const forceDirectionX = dx / distance;
        const forceDirectionY = dy / distance;

        // Proximity repulsion force calculation
        const maxDistance = mouseRef.current.radius;
        const force = (maxDistance - distance) / maxDistance;

        if (distance < maxDistance) {
          this.x -= forceDirectionX * force * 4;
          this.y -= forceDirectionY * force * 4;
        } else {
          // Spring back to base coordinates
          if (this.x !== this.baseX) {
            const dxBase = this.x - this.baseX;
            this.x -= dxBase / 15;
          }
          if (this.y !== this.baseY) {
            const dyBase = this.y - this.baseY;
            this.y -= dyBase / 15;
          }
        }
      }

      draw() {
        if (!ctx) return;
        ctx.fillStyle = particleColor;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fill();
      }
    }

    const init = () => {
      particlesArray.length = 0;
      for (let i = 0; i < numberOfParticles; i++) {
        particlesArray.push(new Particle());
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
        particlesArray[i].draw();
      }
      animationFrameId = requestAnimationFrame(animate);
    };

    init();
    animate();

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
      init();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
    };
  }, [particleColor]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    mouseRef.current.x = e.clientX - rect.left;
    mouseRef.current.y = e.clientY - rect.top;
  };

  const handleMouseLeave = () => {
    mouseRef.current.x = -1000;
    mouseRef.current.y = -1000;
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={cn(
        "relative w-72 h-96 rounded-2xl bg-zinc-950/80 border border-white/10 p-6 flex flex-col justify-between overflow-hidden shadow-2xl transition-all duration-300 hover:border-white/20 select-none",
        className
      )}
    >
      {/* Interactive HTML5 Canvas inside */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none z-0 opacity-60" />

      {/* Card Header & Content */}
      <div className="relative z-10 flex flex-col gap-2">
        <span className="text-[9px] font-mono tracking-widest text-primary font-bold uppercase">CANVAS_PARTICLES</span>
        <h3 className="text-lg font-bold text-white tracking-tight leading-snug">{title}</h3>
      </div>

      <div className="relative z-10 text-xs text-white/50 leading-relaxed font-sans mt-auto">
        {description}
      </div>
    </div>
  );
}

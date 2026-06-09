"use client";

import React, { useState, useRef, useEffect } from "react";

import { cn } from "../lib/cn";
import { MoveHorizontal, ShieldAlert, Sparkles, RefreshCw, Cpu, Compass } from "lucide-react";

export interface ThreeDProductWebGLProps {
  className?: string;
}

export function ThreeDProductWebGL({ className }: ThreeDProductWebGLProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // States
  const [rotation, setRotation] = useState(0); // in radians
  const [isDragging, setIsDragging] = useState(false);
  const [momentumActive, setMomentumActive] = useState(true);
  const [mousePos, setMousePos] = useState({ x: 200, y: 150 });
  const [showWireframe, setShowWireframe] = useState(false);

  // Refs for animation physics loop
  const stateRef = useRef({
    rotation: 0,
    lastStateRotation: 0, // Track last sent rotation to avoid stale React closures and excessive renders
    isDragging: false,
    dragStartRaw: 0,
    dragStartRotation: 0,
    velocity: 0.005, // Initial spin on load
    lastX: 0,
    lastTime: 0,
    mouse: { x: 200, y: 150 },
    width: 400,
    height: 400,
  });

  // Keep ref values in sync with React state
  useEffect(() => {
    stateRef.current.isDragging = isDragging;
  }, [isDragging]);

  // Handle pointer down
  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const clientX = e.clientX;
    
    stateRef.current.isDragging = true;
    stateRef.current.dragStartRaw = clientX;
    stateRef.current.dragStartRotation = stateRef.current.rotation;
    stateRef.current.velocity = 0;
    stateRef.current.lastX = clientX;
    stateRef.current.lastTime = performance.now();
    
    setIsDragging(true);
    canvasRef.current?.setPointerCapture(e.pointerId);
  };

  // Handle pointer move
  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const clientX = e.clientX;
    const clientY = e.clientY;

    // Track relative coordinates for Spotlight light source
    const localX = clientX - rect.left;
    const localY = clientY - rect.top;
    stateRef.current.mouse = { x: localX, y: localY };
    setMousePos({ x: localX, y: localY });

    if (stateRef.current.isDragging) {
      const dx = clientX - stateRef.current.dragStartRaw;
      const sensitivity = 0.007; // Radian speed multiplier
      
      const nextRotation = stateRef.current.dragStartRotation + dx * sensitivity;
      stateRef.current.rotation = nextRotation;
      stateRef.current.lastStateRotation = nextRotation;
      setRotation(nextRotation);

      // Measure instantaneous velocity for momentum glide
      const now = performance.now();
      const dt = now - stateRef.current.lastTime;
      if (dt > 0) {
        stateRef.current.velocity = (clientX - stateRef.current.lastX) * sensitivity / (dt / 16.6); // normalized to ~60fps
      }
      stateRef.current.lastX = clientX;
      stateRef.current.lastTime = now;
    }
  };

  // Handle pointer up
  const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    stateRef.current.isDragging = false;
    setIsDragging(false);
    canvasRef.current?.releasePointerCapture(e.pointerId);
  };

  // Canvas Vector Render loop
  useEffect(() => {
    let animId: number;

    const render = () => {
      const canvas = canvasRef.current;
      if (!canvas) {
        animId = requestAnimationFrame(render);
        return;
      }
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const width = canvas.width;
      const height = canvas.height;

      // Handle kinetic momentum glide when NOT dragging
      if (!stateRef.current.isDragging) {
        if (momentumActive && Math.abs(stateRef.current.velocity) > 0.0002) {
          stateRef.current.rotation += stateRef.current.velocity;
          stateRef.current.velocity *= 0.94; // friction coefficient
          
          const nextDeg = Math.round(((stateRef.current.rotation * 180) / Math.PI) % 360);
          const lastDeg = Math.round(((stateRef.current.lastStateRotation * 180) / Math.PI) % 360);
          
          if (nextDeg !== lastDeg) {
            stateRef.current.lastStateRotation = stateRef.current.rotation;
            setRotation(stateRef.current.rotation);
          }
        } else {
          stateRef.current.velocity = 0;
        }
      }

      // Clear Canvas
      ctx.clearRect(0, 0, width, height);

      // Draw subtle background radial dark blue grid
      ctx.save();
      ctx.strokeStyle = "rgba(100, 116, 139, 0.05)";
      ctx.lineWidth = 1;
      const gridSize = 40;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }
      ctx.restore();

      // Geometry Parameters for Floating Cyber-Gadget
      const centerX = width / 2;
      const centerY = height / 2;
      const radius = 90;
      const slicesCount = 10; // cylinder rings
      const pointsPerSlice = 20;
      const cylinderHeight = 80;
      
      const rotTheta = stateRef.current.rotation;
      const tiltX = -0.3; // isometric look: -17 degrees tilt on X-axis

      const cosT = Math.cos(rotTheta);
      const sinT = Math.sin(rotTheta);
      const cosP = Math.cos(tiltX);
      const sinP = Math.sin(tiltX);

      // Light Vector from screen coordinates
      const mx = stateRef.current.mouse.x;
      const my = stateRef.current.mouse.y;
      const lx = (mx - centerX) / (width / 2);
      const ly = (my - centerY) / (height / 2);
      const lz = -1.2; // light source out-of-screen direction
      const lightMag = Math.sqrt(lx * lx + ly * ly + lz * lz);
      const normLx = lx / lightMag;
      const normLy = ly / lightMag;
      const normLz = lz / lightMag;

      // Project 3D vertex to 2D Screen Space
      const projectPoint = (x: number, y: number, z: number) => {
        // Rotate around Y-axis (rotTheta)
        const rx = x * cosT - z * sinT;
        const ry = y;
        const rz = x * sinT + z * cosT;

        // Rotate around X-axis (tiltX)
        const rrx = rx;
        const rry = ry * cosP - rz * sinP;
        const rrz = ry * sinP + rz * cosP;

        // Perspective Projection
        const fov = 450;
        const projScale = fov / (fov + rrz);
        const sx = centerX + rrx * projScale;
        const sy = centerY + rry * projScale;

        return { sx, sy, sz: rrz, normalX: rx / radius, normalZ: rz / radius };
      };

      // Create geometry mesh
      const vertices: { sx: number; sy: number; sz: number; nx: number; nz: number }[][] = [];
      for (let s = 0; s < slicesCount; s++) {
        const sliceY = -cylinderHeight / 2 + (s / (slicesCount - 1)) * cylinderHeight;
        const sliceVertices = [];
        
        for (let p = 0; p < pointsPerSlice; p++) {
          const angle = (p / pointsPerSlice) * Math.PI * 2;
          const vx = radius * Math.cos(angle);
          const vz = radius * Math.sin(angle);
          
          const proj = projectPoint(vx, sliceY, vz);
          sliceVertices.push({
            sx: proj.sx,
            sy: proj.sy,
            sz: proj.sz,
            nx: Math.cos(angle), // original normal vector
            nz: Math.sin(angle),
          });
        }
        vertices.push(sliceVertices);
      }

      // Draw active background spotlight glow under the watch
      ctx.save();
      const radialBg = ctx.createRadialGradient(mx, my, 10, centerX, centerY, 220);
      radialBg.addColorStop(0, "rgba(99, 102, 241, 0.15)");
      radialBg.addColorStop(0.5, "rgba(168, 85, 247, 0.05)");
      radialBg.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = radialBg;
      ctx.beginPath();
      ctx.arc(centerX, centerY, 220, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // Render 3D Outer Halo Rings (Hologram floating orbit)
      ctx.save();
      ctx.strokeStyle = "rgba(139, 92, 246, 0.4)";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      const haloPoints = 40;
      const haloRadius = 140;
      for (let i = 0; i <= haloPoints; i++) {
        const angle = (i / haloPoints) * Math.PI * 2 + (rotTheta * 0.4);
        const vx = haloRadius * Math.cos(angle);
        const vz = haloRadius * Math.sin(angle);
        const vy = Math.sin(angle * 3) * 15; // wavy orbit
        const proj = projectPoint(vx, vy, vz);
        
        if (i === 0) ctx.moveTo(proj.sx, proj.sy);
        else ctx.lineTo(proj.sx, proj.sy);
      }
      ctx.stroke();
      ctx.restore();

      // Draw Mesh Faces: Cylinder Quads shaded by light normal
      // We render back-to-front by sorting quads by average Z-depth (painter's algorithm)
      interface Quad {
        s: number;
        p: number;
        zAvg: number;
      }

      const quads: Quad[] = [];
      for (let s = 0; s < slicesCount - 1; s++) {
        for (let p = 0; p < pointsPerSlice; p++) {
          const nextP = (p + 1) % pointsPerSlice;
          const z1 = vertices[s][p].sz;
          const z2 = vertices[s][nextP].sz;
          const z3 = vertices[s + 1][p].sz;
          const z4 = vertices[s + 1][nextP].sz;
          const zAvg = (z1 + z2 + z3 + z4) / 4;
          quads.push({ s, p, zAvg });
        }
      }

      // Sort in descending order (highest Z-depth (farthest) rendered first)
      quads.sort((a, b) => b.zAvg - a.zAvg);

      // Draw quads
      quads.forEach((quad) => {
        const { s, p } = quad;
        const nextP = (p + 1) % pointsPerSlice;

        const p1 = vertices[s][p];
        const p2 = vertices[s][nextP];
        const p3 = vertices[s + 1][nextP];
        const p4 = vertices[s + 1][p];

        // Normal Vector calculation of face segment
        // In original space, the segment points outward. Normal is radial.
        const avgAngle = ((p + 0.5) / pointsPerSlice) * Math.PI * 2;
        const normX = Math.cos(avgAngle);
        const normZ = Math.sin(avgAngle);

        // Rotate normal around Y axis
        const rotNormX = normX * cosT - normZ * sinT;
        const rotNormY = 0;
        const rotNormZ = normX * sinT + normZ * cosT;

        // Tilt normal around X axis
        const finalNormX = rotNormX;
        const finalNormY = rotNormY * cosP - rotNormZ * sinP;
        const finalNormZ = rotNormY * sinP + rotNormZ * cosP;

        // Backface culling: do not render back-facing polygons in wireframe if not desired,
        // or just render them with lower opacity.
        const isBackFace = finalNormZ > 0;

        ctx.beginPath();
        ctx.moveTo(p1.sx, p1.sy);
        ctx.lineTo(p2.sx, p2.sy);
        ctx.lineTo(p3.sx, p3.sy);
        ctx.lineTo(p4.sx, p4.sy);
        ctx.closePath();

        if (showWireframe) {
          ctx.strokeStyle = isBackFace ? "rgba(99, 102, 241, 0.15)" : "rgba(99, 102, 241, 0.7)";
          ctx.lineWidth = 1;
          ctx.stroke();
        } else {
          // Shading Math: Dot product
          const dot = -(finalNormX * normLx + finalNormY * normLy + finalNormZ * normLz);
          const diffuse = Math.max(0.12, dot);

          // Specular spotlight glare calculation
          // Reflection vector R = 2 * (N . L) * N - L
          const dotNL = Math.max(0, dot);
          const _rxRef = 2 * dotNL * finalNormX - normLx;
          const _ryRef = 2 * dotNL * finalNormY - normLy;
          const rzRef = 2 * dotNL * finalNormZ - normLz;
          // Viewer vector is straight down negative Z: V = (0, 0, -1)
          const spec = Math.pow(Math.max(0, -rzRef), 15); // Specular exponent 15

          // Base metallic gradient colors with specular addition
          const r = Math.min(255, Math.floor(15 + diffuse * 60 + spec * 170));
          const g = Math.min(255, Math.floor(22 + diffuse * 70 + spec * 170));
          const b = Math.min(255, Math.floor(45 + diffuse * 130 + spec * 220));

          ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
          ctx.fill();

          // Highlight edges
          ctx.strokeStyle = `rgba(139, 92, 246, ${Math.max(0.15, diffuse * 0.45)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      });

      // Draw Glass Core Ring overlay on Top (Smartwatch Bezel)
      const topSlice = vertices[0];
      ctx.save();
      ctx.beginPath();
      topSlice.forEach((pt, idx) => {
        if (idx === 0) ctx.moveTo(pt.sx, pt.sy);
        else ctx.lineTo(pt.sx, pt.sy);
      });
      ctx.closePath();
      
      if (!showWireframe) {
        // Shaded screen face
        const topGrad = ctx.createRadialGradient(centerX, centerY - 20, 10, centerX, centerY, 100);
        topGrad.addColorStop(0, "rgba(22, 24, 37, 0.95)");
        topGrad.addColorStop(0.8, "rgba(8, 10, 18, 0.98)");
        topGrad.addColorStop(1, "rgba(76, 29, 149, 0.4)");
        ctx.fillStyle = topGrad;
        ctx.fill();

        ctx.strokeStyle = "rgba(168, 85, 247, 0.7)";
        ctx.lineWidth = 2.5;
        ctx.stroke();

        // Screen holographic dials & widgets rotating with the device
        ctx.save();
        ctx.strokeStyle = "rgba(6, 182, 212, 0.6)";
        ctx.lineWidth = 1;
        ctx.font = "bold 8px monospace";
        ctx.fillStyle = "rgba(6, 182, 212, 0.9)";
        ctx.textAlign = "center";
        
        // Draw crosshair or compass markings
        for (let i = 0; i < 4; i++) {
          const angle = (i / 4) * Math.PI * 2 + rotTheta;
          const vx = (radius - 20) * Math.cos(angle);
          const vz = (radius - 20) * Math.sin(angle);
          const proj = projectPoint(vx, -cylinderHeight / 2, vz);

          ctx.beginPath();
          ctx.arc(proj.sx, proj.sy, 1.5, 0, Math.PI * 2);
          ctx.fill();
        }

        // Draw center smartwatch hands or laser beam
        const handAngle = rotTheta + (performance.now() * 0.001);
        const hx = (radius - 35) * Math.cos(handAngle);
        const hz = (radius - 35) * Math.sin(handAngle);
        const centerProj = projectPoint(0, -cylinderHeight / 2, 0);
        const tipProj = projectPoint(hx, -cylinderHeight / 2, hz);
        
        ctx.strokeStyle = "rgba(244, 63, 94, 0.8)";
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(centerProj.sx, centerProj.sy);
        ctx.lineTo(tipProj.sx, tipProj.sy);
        ctx.stroke();

        // Glowing center core
        ctx.fillStyle = "rgba(255, 255, 255, 0.95)";
        ctx.beginPath();
        ctx.arc(centerProj.sx, centerProj.sy, 3, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
      } else {
        ctx.strokeStyle = "rgba(168, 85, 247, 0.3)";
        ctx.lineWidth = 1;
        ctx.stroke();
      }
      ctx.restore();

      // Render Spotlight Glare Overlay (Light sweep indicator)
      ctx.save();
      const overlayGrad = ctx.createRadialGradient(mx, my, 5, mx, my, 110);
      overlayGrad.addColorStop(0, "rgba(255, 255, 255, 0.12)");
      overlayGrad.addColorStop(0.6, "rgba(255, 255, 255, 0.02)");
      overlayGrad.addColorStop(1, "rgba(255, 255, 255, 0)");
      ctx.fillStyle = overlayGrad;
      ctx.beginPath();
      ctx.arc(mx, my, 110, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // Floating specs indicator following rotation angle
      // E.g. displays features relative to current angle sector
      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [momentumActive, showWireframe]);

  // Sector calculations to highlight different design points based on theta
  const getActiveSpec = () => {
    // Normalise rotation between 0 and 2*PI
    const norm = ((rotation % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
    const degrees = (norm * 180) / Math.PI;

    if (degrees >= 315 || degrees < 45) {
      return {
        title: "Front: Super Retina Holographic Dial",
        desc: "High-density micro-OLED panel supporting touch dial widgets, kinetic indicators, and sapphire protective overlay.",
        icon: <Compass className="w-5 h-5 text-cyan-400" />,
      };
    }
    if (degrees >= 45 && degrees < 135) {
      return {
        title: "Left: Digital Rotary Crown",
        desc: "Haptic force feedback crown milled from single-block aerospace grade titanium for seamless mechanical scrolls.",
        icon: <RefreshCw className="w-5 h-5 text-purple-400" />,
      };
    }
    if (degrees >= 135 && degrees < 225) {
      return {
        title: "Back: Aura Biosensor Cluster",
        desc: "Dual-laser photoplethysmogram array that measures metrics with gold-plated conductive micro-studs.",
        icon: <ShieldAlert className="w-5 h-5 text-rose-500" />,
      };
    }
    return {
      title: "Right: Acoustic Mesh Speaker",
      desc: "Dual directional water-expelling speaker array designed with nano-membranes for immersive spatial sound.",
      icon: <Cpu className="w-5 h-5 text-amber-400" />,
    };
  };

  const activeSpec = getActiveSpec();

  return (
    <div
      ref={containerRef}
      className={cn(
        "w-full bg-slate-950 text-slate-100 rounded-3xl border border-slate-900 p-6 flex flex-col md:flex-row items-center gap-8 shadow-2xl relative select-none",
        className
      )}
    >
      {/* Absolute Glow Sheen in corner */}
      <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-violet-600/10 blur-3xl pointer-events-none" />

      {/* CANVAS CONTAINER */}
      <div className="flex-1 flex flex-col items-center justify-center relative">
        {/* Glow indicator at cursor */}
        <div className="absolute top-3 left-4 text-slate-500 font-mono text-[9px] uppercase tracking-wider flex items-center gap-1.5 pointer-events-none">
          <Sparkles className="w-3 h-3 text-violet-500" />
          Spotlight: x:{Math.floor(mousePos.x)} y:{Math.floor(mousePos.y)}
        </div>

        {/* 3D Render Canvas */}
        <canvas
          ref={canvasRef}
          width={360}
          height={360}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          className="cursor-grab active:cursor-grabbing border border-slate-900/60 rounded-2xl bg-slate-950/40 shadow-inner w-full max-w-[360px] aspect-square"
        />

        {/* Swipe Controller Helper */}
        <div className="mt-4 flex items-center justify-center gap-2 text-slate-500 text-xs font-semibold tracking-wide">
          <MoveHorizontal className="w-4 h-4 animate-pulse text-violet-500" />
          Drag or Sweep Canvas to Rotate 360°
        </div>
      </div>

      {/* DETAILED INTERACTIVE SPECS SIDEBAR */}
      <div className="w-full md:w-[300px] flex flex-col justify-between self-stretch py-2 space-y-6">
        <div className="space-y-4">
          <div className="space-y-1">
            <span className="text-[9px] font-bold tracking-widest text-violet-500 uppercase block">Interactive Hologram</span>
            <h3 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
              AURA Nebula 3D
            </h3>
          </div>

          {/* Dynamic Component Segment Info */}
          <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4 space-y-3 min-h-[160px] flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-2 font-bold text-xs tracking-wide text-slate-200">
                {activeSpec.icon}
                {activeSpec.title}
              </div>
              <p className="text-slate-400 text-xs leading-relaxed font-normal">
                {activeSpec.desc}
              </p>
            </div>

            <div className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider flex items-center justify-between">
              <span>Rotation Sector:</span>
              <span className="font-mono text-violet-400">
                {Math.round(((rotation * 180) / Math.PI) % 360)}°
              </span>
            </div>
          </div>
        </div>

        {/* Advanced Feature Controls */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Kinetic Momentum</span>
            <button
              type="button"
              role="switch"
              aria-checked={momentumActive}
              aria-label="Toggle kinetic momentum"
              onClick={() => setMomentumActive((p) => !p)}
              className={cn(
                "relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none cursor-pointer",
                momentumActive ? "bg-violet-600" : "bg-slate-800"
              )}
            >
              <span
                className={cn(
                  "inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform duration-200",
                  momentumActive ? "translate-x-4.5" : "translate-x-1"
                )}
              />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Wireframe Engine</span>
            <button
              type="button"
              role="switch"
              aria-checked={showWireframe}
              aria-label="Toggle wireframe engine"
              onClick={() => setShowWireframe((p) => !p)}
              className={cn(
                "relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none cursor-pointer",
                showWireframe ? "bg-violet-600" : "bg-slate-800"
              )}
            >
              <span
                className={cn(
                  "inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform duration-200",
                  showWireframe ? "translate-x-4.5" : "translate-x-1"
                )}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

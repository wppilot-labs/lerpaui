"use client";

import React, { useEffect, useRef, useState } from "react";
import { cn } from "../lib/cn";
import { usePrefersReducedMotion } from "../animation/hooks";

/** Lightweight WebGL fragment-shader runner. Exposes u_time, u_mouse, u_resolution uniforms. */
export interface ShaderCanvasProps {
  /** GLSL fragment shader source. Must declare uniforms u_time, u_mouse, u_resolution. */
  fragment: string;
  className?: string;
  /** Animation FPS cap (default 60). */
  fps?: number;
  /** Disable pointer tracking. */
  noPointer?: boolean;
  /** Static fallback element rendered when WebGL unavailable or reduced-motion. */
  fallback?: React.ReactNode;
}

const DEFAULT_VERT = `attribute vec2 a_position;
void main() { gl_Position = vec4(a_position, 0.0, 1.0); }`;

export const ShaderCanvas: React.FC<ShaderCanvasProps> = ({
  fragment,
  className,
  fps = 60,
  noPointer = false,
  fallback,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduced = usePrefersReducedMotion();
  const mouseRef = useRef<[number, number]>([0.5, 0.5]);
  const rafRef = useRef<number>(0);
  const startRef = useRef<number>(0);
  const lastFrameRef = useRef<number>(0);
  const [supported, setSupported] = useState(true);

  useEffect(() => {
    if (reduced) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = (canvas.getContext("webgl") || canvas.getContext("experimental-webgl")) as WebGLRenderingContext | null;
    if (!gl) {
      setSupported(false);
      return;
    }

    const compile = (type: number, src: string) => {
      const sh = gl.createShader(type)!;
      gl.shaderSource(sh, src);
      gl.compileShader(sh);
      if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
        if ((globalThis as { process?: { env?: { NODE_ENV?: string } } }).process?.env?.NODE_ENV !== 'production') {
          // eslint-disable-next-line no-console
          console.warn("[ShaderCanvas]", gl.getShaderInfoLog(sh));
        }
        gl.deleteShader(sh);
        return null;
      }
      return sh;
    };

    const vs = compile(gl.VERTEX_SHADER, DEFAULT_VERT);
    const fs = compile(gl.FRAGMENT_SHADER, fragment);
    if (!vs || !fs) {
      if (vs) gl.deleteShader(vs);
      if (fs) gl.deleteShader(fs);
      setSupported(false);
      return;
    }

    const prog = gl.createProgram()!;
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      gl.deleteShader(vs);
      gl.deleteShader(fs);
      gl.deleteProgram(prog);
      setSupported(false);
      return;
    }
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    const posLoc = gl.getAttribLocation(prog, "a_position");
    gl.enableVertexAttribArray(posLoc);
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

    const uTime = gl.getUniformLocation(prog, "u_time");
    const uMouse = gl.getUniformLocation(prog, "u_mouse");
    const uRes = gl.getUniformLocation(prog, "u_resolution");

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = canvas.clientWidth * dpr;
      const h = canvas.clientHeight * dpr;
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
        gl.viewport(0, 0, w, h);
      }
    };

    const frameInterval = 1000 / Math.max(15, Math.min(120, fps));
    startRef.current = performance.now();

    const render = (now: number) => {
      if (now - lastFrameRef.current >= frameInterval) {
        resize();
        if (uTime) gl.uniform1f(uTime, (now - startRef.current) * 0.001);
        if (uMouse) gl.uniform2f(uMouse, mouseRef.current[0], mouseRef.current[1]);
        if (uRes) gl.uniform2f(uRes, canvas.width, canvas.height);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
        lastFrameRef.current = now;
      }
      rafRef.current = requestAnimationFrame(render);
    };
    rafRef.current = requestAnimationFrame(render);

    const onMove = (e: PointerEvent) => {
      if (noPointer) return;
      const r = canvas.getBoundingClientRect();
      mouseRef.current = [
        (e.clientX - r.left) / r.width,
        1 - (e.clientY - r.top) / r.height,
      ];
    };
    if (!noPointer) window.addEventListener("pointermove", onMove);

    return () => {
      cancelAnimationFrame(rafRef.current);
      if (!noPointer) window.removeEventListener("pointermove", onMove);
      gl.deleteBuffer(buf);
      gl.deleteProgram(prog);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
    };
  }, [fragment, fps, noPointer, reduced]);

  if (reduced || !supported) {
    return fallback ? <div className={cn("h-full w-full", className)}>{fallback}</div> : null;
  }

  return (
    <canvas
      ref={canvasRef}
      className={cn("h-full w-full", className)}
      aria-hidden
    />
  );
};

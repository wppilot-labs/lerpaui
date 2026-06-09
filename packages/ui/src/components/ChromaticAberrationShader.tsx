"use client";

import React from "react";
import { ShaderCanvas } from "./ShaderCanvas";
import { cn } from "../lib/cn";

/** RGB channel offset shader — separation magnitude tracks pointer distance from center with radial falloff. */
export interface ChromaticAberrationShaderProps {
  className?: string;
  /** Multiplier for channel separation strength. Default 1. */
  intensity?: number;
}

const CHROMATIC_GLSL = `
precision highp float;
uniform float u_time;
uniform vec2 u_mouse;
uniform vec2 u_resolution;

// Procedural checker + ring pattern used as the sampled "texture".
vec3 pattern(vec2 uv) {
  vec2 g = uv * 8.0;
  float checker = step(0.5, fract(g.x)) * step(0.5, fract(g.y)) +
                  step(0.5, 1.0 - fract(g.x)) * step(0.5, 1.0 - fract(g.y));
  float ring = sin(length(uv - 0.5) * 30.0 - u_time * 1.5) * 0.5 + 0.5;
  vec3 base = mix(vec3(0.09, 0.10, 0.18), vec3(0.62, 0.36, 0.95), checker * 0.4);
  base += vec3(0.20, 0.55, 0.95) * ring * 0.35;
  base += vec3(0.95, 0.35, 0.62) * smoothstep(0.6, 0.0, length(uv - 0.5)) * 0.25;
  return base;
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  float dist = length(uv - u_mouse);
  float radial = smoothstep(0.0, 0.9, length(uv - vec2(0.5)));
  vec2 dir = normalize(uv - 0.5 + 0.0001);
  float mag = dist * 0.04 + radial * 0.012;
  mag *= 1.0;

  vec3 col;
  col.r = pattern(uv + dir * mag).r;
  col.g = pattern(uv).g;
  col.b = pattern(uv - dir * mag).b;

  // Subtle vignette
  col *= smoothstep(1.15, 0.35, length(uv - 0.5) * 1.4);

  gl_FragColor = vec4(col, 1.0);
}
`;

export const ChromaticAberrationShader: React.FC<
  ChromaticAberrationShaderProps
> = ({ className }) => {
  return (
    <div
      className={cn(
        "relative h-[400px] w-full overflow-hidden rounded-2xl bg-[var(--card)]",
        className,
      )}
    >
      <ShaderCanvas
        fragment={CHROMATIC_GLSL}
        className="absolute inset-0"
        fallback={
          <div className="absolute inset-0 bg-gradient-to-br from-violet-500/20 via-rose-500/10 to-cyan-500/15" />
        }
      />
    </div>
  );
};

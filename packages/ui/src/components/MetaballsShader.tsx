"use client";

import React from "react";
import { ShaderCanvas } from "./ShaderCanvas";
import { cn } from "../lib/cn";

/** SDF metaballs — 5 orbiting circles merge via smoothstep threshold; pointer acts as 6th ball. */
export interface MetaballsShaderProps {
  className?: string;
  /** Color tint applied to the merged blob field. */
  intensity?: number;
}

const METABALLS_GLSL = `
precision highp float;
uniform float u_time;
uniform vec2 u_mouse;
uniform vec2 u_resolution;

float sdCircle(vec2 p, vec2 c, float r) {
  return length(p - c) - r;
}

// Smooth-min union for metaballs.
float smin(float a, float b, float k) {
  float h = clamp(0.5 + 0.5 * (b - a) / k, 0.0, 1.0);
  return mix(b, a, h) - k * h * (1.0 - h);
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  float aspect = u_resolution.x / u_resolution.y;
  vec2 p = uv;
  p.x *= aspect;
  vec2 c = vec2(0.5 * aspect, 0.5);

  float t = u_time * 0.6;
  float r = 0.15;
  vec2 b1 = c + vec2(cos(t) * 0.25, sin(t * 1.3) * 0.20);
  vec2 b2 = c + vec2(cos(t * 1.7 + 1.0) * 0.28, sin(t * 0.9 + 2.0) * 0.22);
  vec2 b3 = c + vec2(cos(t * 0.8 + 2.0) * 0.22, sin(t * 1.5 + 3.0) * 0.26);
  vec2 b4 = c + vec2(cos(t * 1.2 + 3.5) * 0.30, sin(t * 1.1 + 0.5) * 0.18);
  vec2 b5 = c + vec2(cos(t * 0.5 + 4.5) * 0.20, sin(t * 1.7 + 4.0) * 0.24);
  vec2 b6 = vec2(u_mouse.x * aspect, u_mouse.y);

  float d = sdCircle(p, b1, r);
  d = smin(d, sdCircle(p, b2, r), 0.18);
  d = smin(d, sdCircle(p, b3, r), 0.18);
  d = smin(d, sdCircle(p, b4, r), 0.18);
  d = smin(d, sdCircle(p, b5, r), 0.18);
  d = smin(d, sdCircle(p, b6, 0.12), 0.15);

  float blob = 1.0 - smoothstep(-0.02, 0.04, d);
  float edge = smoothstep(0.04, -0.02, d) - smoothstep(-0.02, -0.08, d);

  vec3 inner = mix(vec3(0.36, 0.82, 0.96), vec3(0.71, 0.45, 0.96),
                   sin(u_time * 0.5 + uv.y * 2.0) * 0.5 + 0.5);
  vec3 col = vec3(0.04, 0.05, 0.10);
  col = mix(col, inner, blob);
  col += vec3(1.0, 0.55, 0.78) * edge * 0.6;

  gl_FragColor = vec4(col, 1.0);
}
`;

export const MetaballsShader: React.FC<MetaballsShaderProps> = ({
  className,
}) => {
  return (
    <div
      className={cn(
        "relative h-[400px] w-full overflow-hidden rounded-2xl bg-[var(--card)]",
        className,
      )}
    >
      <ShaderCanvas
        fragment={METABALLS_GLSL}
        className="absolute inset-0"
        fallback={
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 via-violet-500/15 to-pink-500/15" />
        }
      />
    </div>
  );
};

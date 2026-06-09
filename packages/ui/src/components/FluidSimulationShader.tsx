"use client";

import React from "react";
import { ShaderCanvas } from "./ShaderCanvas";
import { cn } from "../lib/cn";

/** Simplified GPU-fluid approximation via simplex-noise domain warp; pointer creates wake. */
export interface FluidSimulationShaderProps {
  className?: string;
  /** Tint multiplier for the fluid base color. */
  intensity?: number;
}

const FLUID_GLSL = `
precision highp float;
uniform float u_time;
uniform vec2 u_mouse;
uniform vec2 u_resolution;

vec3 mod289(vec3 x) { return x - floor(x * (1.0/289.0)) * 289.0; }
vec2 mod289(vec2 x) { return x - floor(x * (1.0/289.0)) * 289.0; }
vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }
float snoise(vec2 v) {
  const vec4 C = vec4(0.211324865, 0.366025403, -0.577350269, 0.024390243);
  vec2 i = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1 = (x0.x > x0.y) ? vec2(1.0,0.0) : vec2(0.0,1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod289(i);
  vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
  vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
  m = m*m; m = m*m;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291 - 0.85373472 * (a0*a0 + h*h);
  vec3 g;
  g.x = a0.x * x0.x + h.x * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  float t = u_time * 0.25;
  float vel = fract(u_time * 0.5);

  // Domain warp via stacked snoise to fake an advected velocity field.
  vec2 q = uv * 1.5;
  vec2 warp1 = vec2(snoise(q + vec2(t, 0.0)), snoise(q + vec2(0.0, t)));
  vec2 warp2 = vec2(snoise(q * 2.0 + warp1 + vec2(0.0, t * 1.7)),
                    snoise(q * 2.0 + warp1 + vec2(t * 1.3, 0.0)));
  float f = snoise(q * 1.4 + warp2 * 1.8 + vec2(vel, -vel));

  // Mouse wake: stretches the field toward the pointer with a decaying tail.
  vec2 m = u_mouse;
  float md = length(uv - m);
  float wake = exp(-md * 4.5) * (sin(u_time * 3.0 - md * 18.0) * 0.5 + 0.5);

  vec3 a = vec3(0.06, 0.10, 0.28);
  vec3 b = vec3(0.32, 0.78, 0.96);
  vec3 c = vec3(0.95, 0.42, 0.78);
  vec3 col = mix(a, b, f * 0.5 + 0.5);
  col = mix(col, c, smoothstep(0.55, 0.95, f * 0.5 + 0.5));
  col += vec3(0.85, 0.95, 1.0) * wake * 0.55;

  // Soft vignette
  col *= smoothstep(1.3, 0.4, length(uv - 0.5) * 1.3);

  gl_FragColor = vec4(col, 1.0);
}
`;

export const FluidSimulationShader: React.FC<FluidSimulationShaderProps> = ({
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
        fragment={FLUID_GLSL}
        className="absolute inset-0"
        fallback={
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/25 via-violet-500/15 to-pink-500/15" />
        }
      />
    </div>
  );
};

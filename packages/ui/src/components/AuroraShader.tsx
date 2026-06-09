"use client";

import React from "react";
import { ShaderCanvas } from "./ShaderCanvas";
import { cn } from "../lib/cn";

/** Real WebGL aurora shader with simplex noise + flowing color bands. Replaces CSS gradient AuroraBackground. */
export interface AuroraShaderProps {
  className?: string;
}

const AURORA_GLSL = `
precision highp float;
uniform float u_time;
uniform vec2 u_mouse;
uniform vec2 u_resolution;

// Classic 2D Simplex noise — Ashima Arts (MIT)
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
  vec2 p = uv * 2.0 - 1.0;
  p.x *= u_resolution.x / u_resolution.y;

  float t = u_time * 0.18;
  float n1 = snoise(p * 1.8 + vec2(t, t * 0.6));
  float n2 = snoise(p * 0.9 - vec2(t * 0.7, t * 1.1));
  float n3 = snoise(p * 3.5 + vec2(-t * 1.3, t * 0.4));

  float bands = sin(p.y * 3.0 + n1 * 2.0 + t * 1.4) * 0.5 + 0.5;
  bands *= smoothstep(1.0, 0.2, abs(p.y - 0.1));

  vec3 cyan   = vec3(0.36, 0.82, 0.95);
  vec3 violet = vec3(0.71, 0.45, 0.96);
  vec3 lime   = vec3(0.78, 1.00, 0.22);
  vec3 pink   = vec3(1.00, 0.36, 0.62);

  vec3 col = mix(violet, cyan, n1 * 0.5 + 0.5);
  col = mix(col, lime, smoothstep(0.4, 0.9, n2));
  col = mix(col, pink, smoothstep(0.6, 0.95, n3) * 0.5);
  col *= bands * 1.3;

  // Mouse-tracked highlight
  float md = length(uv - u_mouse) * 1.2;
  col += vec3(0.4, 0.55, 1.0) * smoothstep(0.6, 0.0, md) * 0.25;

  // Vignette
  col *= smoothstep(1.4, 0.4, length(p) * 0.85);

  gl_FragColor = vec4(col, 1.0);
}
`;

export const AuroraShader: React.FC<AuroraShaderProps> = ({ className }) => {
  return (
    <div
      className={cn(
        "relative h-[400px] w-full overflow-hidden rounded-2xl bg-[var(--card)]",
        className,
      )}
    >
      <ShaderCanvas
        fragment={AURORA_GLSL}
        className="absolute inset-0"
        fallback={
          <div className="absolute inset-0 bg-gradient-to-br from-violet-500/20 via-cyan-500/15 to-lime-500/10" />
        }
      />
    </div>
  );
};

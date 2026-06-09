"use client";

import React from "react";
import { ShaderCanvas } from "./ShaderCanvas";
import { cn } from "../lib/cn";

/** RGB dispersion + scanline distortion with random glitch bands triggered every ~2s. */
export interface DispersionGlitchShaderProps {
  className?: string;
  /** Scales channel separation. Default 1. */
  intensity?: number;
}

const DISPERSION_GLSL = `
precision highp float;
uniform float u_time;
uniform vec2 u_mouse;
uniform vec2 u_resolution;

float hash(float n) { return fract(sin(n) * 43758.5453123); }
float hash2(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }

vec3 pattern(vec2 uv) {
  // Procedural striped + radial pattern used as the sampled surface.
  float v = sin(uv.x * 18.0 + sin(uv.y * 6.0 + u_time * 0.4) * 2.0);
  float band = 0.5 + 0.5 * sin(uv.y * 26.0 + u_time * 0.6);
  vec3 a = vec3(0.07, 0.09, 0.18);
  vec3 b = vec3(0.55, 0.32, 0.95);
  vec3 c = vec3(0.95, 0.42, 0.70);
  vec3 col = mix(a, b, smoothstep(-0.4, 0.4, v));
  col = mix(col, c, band * 0.4);
  col += smoothstep(0.55, 0.0, length(uv - 0.5)) * vec3(0.25, 0.45, 0.95) * 0.4;
  return col;
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;

  // Glitch trigger: roughly every 2s, hold for ~0.18s.
  float seg = floor(u_time * 0.5);
  float glitchOn = step(hash(seg), 0.55) * step(fract(u_time * 0.5), 0.36);
  float bandY = hash(seg + 7.3);
  float bandH = 0.04 + hash(seg + 11.7) * 0.10;
  float inBand = step(abs(uv.y - bandY), bandH * 0.5) * glitchOn;
  float shift = (hash(seg + uv.y * 30.0) - 0.5) * 0.18 * inBand;

  // Scanline vertical distortion fed per channel.
  float scan = sin(uv.y * 100.0 + u_time * 5.0) * 0.01;
  vec2 uvR = uv + vec2(scan + shift, 0.0);
  vec2 uvG = uv + vec2(shift * 0.4, 0.0);
  vec2 uvB = uv + vec2(-scan + shift, 0.0);

  vec3 col;
  col.r = pattern(uvR).r;
  col.g = pattern(uvG).g;
  col.b = pattern(uvB).b;

  // Pointer-driven hot spot
  col += smoothstep(0.35, 0.0, length(uv - u_mouse)) * vec3(0.40, 0.30, 0.95) * 0.35;

  // Noise grain
  col += (hash2(uv * u_resolution.xy + u_time) - 0.5) * 0.06;

  // Dark scanlines overlay
  col *= 0.92 + 0.08 * sin(uv.y * u_resolution.y * 0.5);

  gl_FragColor = vec4(col, 1.0);
}
`;

export const DispersionGlitchShader: React.FC<DispersionGlitchShaderProps> = ({
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
        fragment={DISPERSION_GLSL}
        className="absolute inset-0"
        fallback={
          <div className="absolute inset-0 bg-gradient-to-br from-violet-500/25 via-fuchsia-500/15 to-sky-500/15" />
        }
      />
    </div>
  );
};

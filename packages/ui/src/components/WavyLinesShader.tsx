"use client";

import React from "react";
import { ShaderCanvas } from "./ShaderCanvas";
import { cn } from "../lib/cn";

/** 20 horizontal lines modulated by sin per line; pointer-Y controls amplitude, hue shifts per line. */
export interface WavyLinesShaderProps {
  className?: string;
  /** Line glow strength. Default 1. */
  intensity?: number;
}

const WAVY_GLSL = `
precision highp float;
uniform float u_time;
uniform vec2 u_mouse;
uniform vec2 u_resolution;

vec3 hsl2rgb(vec3 c) {
  vec3 rgb = clamp(abs(mod(c.x * 6.0 + vec3(0.0, 4.0, 2.0), 6.0) - 3.0) - 1.0, 0.0, 1.0);
  return c.z + c.y * (rgb - 0.5) * (1.0 - abs(2.0 * c.z - 1.0));
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  vec3 col = vec3(0.04, 0.05, 0.10);

  float amp = mix(0.015, 0.07, u_mouse.y);
  const float LINES = 20.0;

  for (float i = 0.0; i < 20.0; i += 1.0) {
    float baseY = (i + 0.5) / LINES;
    float wave = sin(uv.x * 8.0 + u_time + i * 0.5) * amp;
    float y = baseY + wave;
    float d = abs(uv.y - y);
    float line = smoothstep(0.008, 0.0, d);
    float glow = smoothstep(0.04, 0.0, d) * 0.35;

    float hue = fract(i / LINES + u_time * 0.05);
    vec3 hsl = hsl2rgb(vec3(hue, 0.75, 0.6));

    col += hsl * (line + glow);
  }

  // Pointer-X glow streak
  float mx = smoothstep(0.18, 0.0, abs(uv.x - u_mouse.x));
  col += vec3(0.45, 0.65, 1.0) * mx * 0.15;

  // Soft vignette
  col *= smoothstep(1.25, 0.45, length(uv - 0.5) * 1.35);

  gl_FragColor = vec4(col, 1.0);
}
`;

export const WavyLinesShader: React.FC<WavyLinesShaderProps> = ({
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
        fragment={WAVY_GLSL}
        className="absolute inset-0"
        fallback={
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 via-violet-500/15 to-pink-500/15" />
        }
      />
    </div>
  );
};

"use client";

import React from "react";
import { ShaderCanvas } from "./ShaderCanvas";
import { cn } from "../lib/cn";

/** Classic 80s plasma — stacked sin/radial terms mapped to HSL; pointer-X shifts hue offset. */
export interface PlasmaFieldShaderProps {
  className?: string;
  /** Hue offset baseline. Default 0. */
  intensity?: number;
}

const PLASMA_GLSL = `
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
  float aspect = u_resolution.x / u_resolution.y;
  vec2 p = uv;
  p.x *= aspect;

  float t = u_time;
  float v = sin(p.x * 10.0 + t);
  v += sin(distance(uv, vec2(0.5, 0.5)) * 10.0 + t);
  v += sin(t + p.y * 5.0);
  v += sin((p.x + p.y) * 6.0 + t * 0.7);
  v *= 0.25;

  // Pointer-X shifts hue, pointer-Y nudges saturation.
  float hueOffset = u_mouse.x * 0.6;
  float hue = mod(v * 0.5 + 0.5 + hueOffset, 1.0);
  float sat = 0.55 + u_mouse.y * 0.35;
  float light = 0.5 + 0.18 * sin(v * 3.14159);

  vec3 col = hsl2rgb(vec3(hue, sat, light));

  // Mouse highlight ring
  float md = length(uv - u_mouse);
  col += smoothstep(0.25, 0.0, md) * 0.18;

  // Vignette
  col *= smoothstep(1.3, 0.4, length(uv - 0.5) * 1.3);

  gl_FragColor = vec4(col, 1.0);
}
`;

export const PlasmaFieldShader: React.FC<PlasmaFieldShaderProps> = ({
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
        fragment={PLASMA_GLSL}
        className="absolute inset-0"
        fallback={
          <div className="absolute inset-0 bg-gradient-to-br from-fuchsia-500/25 via-violet-500/20 to-cyan-500/15" />
        }
      />
    </div>
  );
};

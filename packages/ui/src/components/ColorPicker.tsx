"use client";

import React from 'react';
import { cn } from '../lib/cn';

/** Color picker combining HSL sliders, HEX entry, and a swatch palette. */
export interface ColorPickerProps {
  value?: string;
  onChange?: (hex: string) => void;
  swatches?: string[];
  className?: string;
}

const defaultSwatches = [
  '#0ea5e9', '#22c55e', '#facc15', '#f97316', '#ef4444', '#a855f7',
  '#ec4899', '#14b8a6', '#6366f1', '#84cc16', '#64748b', '#0f172a',
];

function hexToRgb(hex: string): [number, number, number] {
  const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex.replace(/^#/, ''));
  if (!m) return [0, 0, 0];
  return [parseInt(m[1], 16), parseInt(m[2], 16), parseInt(m[3], 16)];
}
function rgbToHex(r: number, g: number, b: number) {
  return '#' + [r, g, b].map((n) => Math.max(0, Math.min(255, Math.round(n))).toString(16).padStart(2, '0')).join('');
}
function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0; const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
}
function hslToHex(h: number, s: number, l: number) {
  s /= 100; l /= 100;
  const k = (n: number) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => Math.round(255 * (l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)))));
  return rgbToHex(f(0), f(8), f(4));
}

export function ColorPicker({ value = '#0ea5e9', onChange, swatches = defaultSwatches, className }: ColorPickerProps) {
  const initialHsl = React.useMemo(() => { const [r, g, b] = hexToRgb(value); return rgbToHsl(r, g, b); }, [value]);
  const [h, setH] = React.useState(initialHsl[0]);
  const [s, setS] = React.useState(initialHsl[1]);
  const [l, setL] = React.useState(initialHsl[2]);
  const [hex, setHex] = React.useState(value);

  React.useEffect(() => { const [r, g, b] = hexToRgb(value); const [nh, ns, nl] = rgbToHsl(r, g, b); setH(nh); setS(ns); setL(nl); setHex(value); }, [value]);

  const emit = (nh: number, ns: number, nl: number) => {
    const newHex = hslToHex(nh, ns, nl);
    setHex(newHex);
    onChange?.(newHex);
  };
  const onSlider = (fn: (v: number) => void, e: React.ChangeEvent<HTMLInputElement>) => fn(parseInt(e.target.value, 10));
  const onHex = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value; setHex(v);
    if (/^#?[a-f\d]{6}$/i.test(v.replace(/^#/, ''))) {
      const [r, g, b] = hexToRgb(v); const [nh, ns, nl] = rgbToHsl(r, g, b);
      setH(nh); setS(ns); setL(nl); onChange?.(v.startsWith('#') ? v : `#${v}`);
    }
  };

  return (
    <div role="group" aria-label="Color picker" className={cn('inline-flex flex-col gap-3 rounded-lg border border-border bg-card p-3 text-card-foreground', className)}>
      <div className="flex items-center gap-3">
        <div aria-hidden="true" className="size-12 rounded-md border border-border shadow-inner" style={{ background: hex }} />
        <div className="flex flex-col gap-1">
          <label htmlFor="color-picker-hex" className="text-[10px] uppercase tracking-wider text-muted-foreground">HEX</label>
          <input
            id="color-picker-hex"
            type="text" value={hex} onChange={onHex} maxLength={7}
            aria-label="Hex color value"
            className="h-8 w-24 rounded-md border border-input bg-background px-2 font-mono text-sm uppercase outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
        </div>
      </div>
      <div className="flex flex-col gap-2">
        {([
          { key: 'H', value: h, max: 360, fn: setH, gradient: 'linear-gradient(to right, hsl(0,100%,50%), hsl(60,100%,50%), hsl(120,100%,50%), hsl(180,100%,50%), hsl(240,100%,50%), hsl(300,100%,50%), hsl(360,100%,50%))' },
          { key: 'S', value: s, max: 100, fn: setS, gradient: `linear-gradient(to right, hsl(${h},0%,${l}%), hsl(${h},100%,${l}%))` },
          { key: 'L', value: l, max: 100, fn: setL, gradient: `linear-gradient(to right, #000, hsl(${h},${s}%,50%), #fff)` },
        ] as const).map((row) => (
          <div key={row.key} className="flex items-center gap-2">
            <span className="w-4 text-xs font-mono text-muted-foreground">{row.key}</span>
            <input
              type="range" min={0} max={row.max} value={row.value} aria-label={`${row.key} channel`}
              onChange={(e) => { onSlider(row.fn, e); const nh = row.key === 'H' ? parseInt(e.target.value, 10) : h; const ns = row.key === 'S' ? parseInt(e.target.value, 10) : s; const nl = row.key === 'L' ? parseInt(e.target.value, 10) : l; emit(nh, ns, nl); }}
              style={{ background: row.gradient }}
              className="h-2 flex-1 cursor-pointer appearance-none rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring [&::-webkit-slider-thumb]:size-3.5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:bg-foreground [&::-webkit-slider-thumb]:shadow"
            />
            <span className="w-9 text-right text-xs font-mono tabular-nums text-muted-foreground">{row.value}</span>
          </div>
        ))}
      </div>
      <div role="listbox" aria-label="Swatches" className="grid grid-cols-6 gap-1.5">
        {swatches.map((sw) => (
          <button
            key={sw} type="button" role="option" aria-selected={hex.toLowerCase() === sw.toLowerCase()}
            aria-label={`Swatch ${sw}`}
            style={{ background: sw }}
            onClick={() => { setHex(sw); const [r, g, b] = hexToRgb(sw); const [nh, ns, nl] = rgbToHsl(r, g, b); setH(nh); setS(ns); setL(nl); onChange?.(sw); }}
            className={cn('size-7 rounded-md border border-border transition-transform hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring motion-reduce:transition-none', hex.toLowerCase() === sw.toLowerCase() && 'ring-2 ring-ring')}
          />
        ))}
      </div>
    </div>
  );
}

ColorPicker.displayName = 'ColorPicker';

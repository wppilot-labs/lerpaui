'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Play, Pause, Volume2 } from 'lucide-react';
import { usePrefersReducedMotion } from '../animation/hooks';
import { cn } from '../lib/cn';

export interface AudioTrack {
  title: string;
  artist: string;
  /** Display duration string (e.g. "2:45"). */
  duration: string;
}

export interface InteractiveAudioRosterProps {
  className?: string;
  /** Playlist tracks. */
  playlist?: AudioTrack[];
  /** Header label. */
  label?: string;
  /** Sub-label above the visualizer (e.g. station/feed name). */
  feedLabel?: string;
}

const DEFAULT_PLAYLIST: AudioTrack[] = [
  { title: "Frequency One", artist: "Studio A", duration: "2:45" },
  { title: "Synthesizer Two", artist: "Studio B", duration: "3:12" },
  { title: "Echo Three", artist: "Studio C", duration: "4:01" }
];

export const InteractiveAudioRoster: React.FC<InteractiveAudioRosterProps> = ({
  className,
  playlist = DEFAULT_PLAYLIST,
  label = "Interactive Audio Roster",
  feedLabel = "Studio Feed",
}) => {
  const prefersReducedMotion = usePrefersReducedMotion();
  const [playingIdx, setPlayingIdx] = useState<number | null>(0);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animFrame: number;
    let ticks = 0;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const bars = 18;
      const barW = canvas.width / bars;

      ticks += 0.15;

      for (let i = 0; i < bars; i++) {
        // compute dynamic height with waves
        const noise = Math.sin(ticks + i * 0.4) * 12 + Math.cos(ticks * 0.7 - i * 0.2) * 8;
        const height = playingIdx !== null ? Math.max(4, 20 + noise) : 3;

        ctx.fillStyle = `rgba(168, 85, 247, ${playingIdx !== null ? 0.85 : 0.25})`;
        ctx.fillRect(i * barW, canvas.height - height, barW - 1.5, height);
      }

      if (!prefersReducedMotion) {
        animFrame = requestAnimationFrame(render);
      }
    };

    render();
    return () => { if (animFrame) cancelAnimationFrame(animFrame); };
  }, [playingIdx, prefersReducedMotion]);

  return (
    <div className={cn('relative w-full max-w-[320px] h-[340px] bg-secondary/5 rounded-3xl border border-border flex flex-col justify-between p-5 overflow-hidden select-none', className)}>
      <span className="text-[9px] text-muted-foreground font-black tracking-widest uppercase">{label}</span>

      <div className="flex flex-col gap-2.5 w-full my-auto z-10">
        {/* Visual equalizer display banner */}
        <div className="w-full h-10 border border-border/40 bg-card rounded-xl px-4 flex items-center justify-between shadow-inner relative overflow-hidden">
          <canvas ref={canvasRef} width="120" height="32" className="absolute right-4 bottom-1 w-[120px] h-8 pointer-events-none opacity-80" />
          <div className="flex items-center gap-2">
            <Volume2 className={cn('w-3.5 h-3.5', playingIdx !== null ? 'text-primary animate-pulse' : 'text-muted-foreground/45')} />
            <span className="text-[8px] font-black uppercase tracking-wider text-muted-foreground">{feedLabel}</span>
          </div>
        </div>

        {/* Playlist rows */}
        <div className="flex flex-col gap-1.5">
          {playlist.map((track, idx) => {
            const active = idx === playingIdx;
            return (
              <div
                key={idx}
                role="button"
                tabIndex={0}
                onClick={() => setPlayingIdx(active ? null : idx)}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setPlayingIdx(active ? null : idx); } }}
                className={cn('w-full border p-2.5 rounded-xl flex items-center justify-between cursor-pointer transition-all border-border bg-card/60 shadow-sm',
                  active ? 'border-primary/30 bg-primary/5' : 'hover:bg-secondary/40'
                )}
              >
                <div className="flex items-center gap-2.5">
                  <div className={cn('w-6 h-6 rounded-lg flex items-center justify-center border', active ? 'bg-primary border-primary text-white' : 'border-border bg-secondary/40 text-muted-foreground')}>
                    {active ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3 pl-0.5" />}
                  </div>
                  <div className="flex flex-col">
                    <span className={cn('text-[9px] font-black tracking-wide leading-tight', active ? 'text-primary' : 'text-foreground')}>{track.title}</span>
                    <span className="text-[7.5px] text-muted-foreground font-semibold leading-tight mt-0.5">{track.artist}</span>
                  </div>
                </div>
                <span className="text-[8px] font-mono text-muted-foreground/60 font-black">{track.duration}</span>
              </div>
            );
          })}
        </div>
      </div>

      <span className="text-[8px] text-muted-foreground font-extrabold uppercase tracking-wide text-center">Click tracks to trigger canvas wave logs</span>
    </div>
  );
};

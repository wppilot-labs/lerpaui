'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Pause, Play, Volume2, VolumeX } from 'lucide-react';
import { cn } from '../lib/cn';

export interface ParallaxVideoShowcaseProps {
  videoUrl?: string;
  posterUrl?: string;
  captionsUrl?: string;
  captionsLanguage?: string;
  captionsLabel?: string;
  title?: string;
  description?: string;
  autoPlay?: boolean;
  className?: string;
}

export const ParallaxVideoShowcase: React.FC<ParallaxVideoShowcaseProps> = ({
  videoUrl,
  posterUrl,
  captionsUrl,
  captionsLanguage = 'en',
  captionsLabel = 'English',
  title = 'Parallax video',
  description = 'Interactive media preview',
  autoPlay = true,
  className,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const reduceMotion = useReducedMotion();
  const [offsets, setOffsets] = useState({ x: 0, y: 0 });
  const [isPlaying, setIsPlaying] = useState(Boolean(videoUrl && autoPlay && !reduceMotion));
  const [isMuted, setIsMuted] = useState(true);
  const captionsTrackUrl = captionsUrl ?? 'data:text/vtt;charset=utf-8,WEBVTT%0A%0A';

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !videoUrl) return;

    if (autoPlay && !reduceMotion) {
      void video.play().catch(() => setIsPlaying(false));
    } else if (!video.paused) {
      video.pause();
      setIsPlaying(false);
    }
  }, [autoPlay, reduceMotion, videoUrl]);

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current || reduceMotion) return;
    const rect = containerRef.current.getBoundingClientRect();
    setOffsets({
      x: (event.clientX - rect.left - rect.width / 2) / 6,
      y: (event.clientY - rect.top - rect.height / 2) / 6,
    });
  };

  const togglePlayback = async () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      try {
        await video.play();
      } catch {
        setIsPlaying(false);
      }
    } else {
      video.pause();
    }
  };

  const toggleMuted = () => {
    const video = videoRef.current;
    if (!video || !captionsUrl) return;
    video.muted = !video.muted;
    setIsMuted(video.muted);
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setOffsets({ x: 0, y: 0 })}
      className={cn(
        'group relative flex h-48 w-full max-w-[340px] select-none items-center justify-center overflow-hidden rounded-2xl border border-border/40 bg-card shadow-2xl',
        className
      )}
      aria-label={title}
    >
      <motion.div
        animate={
          reduceMotion ? { x: 0, y: 0, scale: 1 } : { x: -offsets.x, y: -offsets.y, scale: 1.15 }
        }
        transition={
          reduceMotion ? { duration: 0 } : { type: 'spring', stiffness: 180, damping: 22 }
        }
        className="pointer-events-none absolute inset-0 h-full w-full"
      >
        {videoUrl ? (
          <video
            ref={videoRef}
            src={videoUrl}
            poster={posterUrl}
            autoPlay={autoPlay && !reduceMotion}
            muted={isMuted}
            loop
            playsInline
            preload="metadata"
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            className="h-full w-full object-cover brightness-90 transition-[filter] duration-300 group-hover:brightness-105"
          >
            <track
              kind="captions"
              src={captionsTrackUrl}
              srcLang={captionsLanguage}
              label={captionsUrl ? captionsLabel : 'Muted media'}
              default
            />
          </video>
        ) : (
          <div
            data-testid="video-placeholder"
            className="h-full w-full bg-[radial-gradient(circle_at_30%_20%,hsl(var(--primary)/0.35),transparent_38%),radial-gradient(circle_at_75%_70%,hsl(var(--primary)/0.2),transparent_42%),linear-gradient(135deg,hsl(var(--card)),hsl(var(--muted)))]"
          />
        )}
      </motion.div>

      <div className="absolute inset-0 flex flex-col justify-between bg-gradient-to-t from-black/55 via-transparent to-black/10 p-4">
        <div className="flex w-full items-center justify-between">
          <span className="rounded-full bg-black/40 px-2 py-0.5 text-[9px] font-black uppercase tracking-widest text-white/80 backdrop-blur-md">
            Video showcase
          </span>
          <button
            type="button"
            onClick={toggleMuted}
            disabled={!videoUrl || !captionsUrl}
            aria-label={isMuted ? 'Unmute video' : 'Mute video'}
            title={!captionsUrl ? 'Provide captionsUrl to enable audio' : undefined}
            className="grid h-8 w-8 place-items-center rounded-full text-white/80 transition-colors hover:bg-black/40 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white disabled:cursor-not-allowed disabled:opacity-40"
          >
            {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
          </button>
        </div>

        <div className="mt-auto flex items-center gap-2">
          <button
            type="button"
            onClick={() => void togglePlayback()}
            disabled={!videoUrl}
            aria-label={isPlaying ? 'Pause video' : 'Play video'}
            className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground shadow-lg transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isPlaying ? (
              <Pause className="h-3.5 w-3.5 fill-current" />
            ) : (
              <Play className="ml-0.5 h-3.5 w-3.5 fill-current" />
            )}
          </button>
          <div className="flex min-w-0 flex-col gap-0.5">
            <span className="truncate text-[10px] font-extrabold uppercase leading-none tracking-wide text-white">
              {title}
            </span>
            <span className="truncate text-[8px] font-semibold uppercase text-white/60">
              {description}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

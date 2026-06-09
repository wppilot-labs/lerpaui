"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, Crown, Gem } from "lucide-react";
import { cn } from "../lib/cn";
import { usePrefersReducedMotion } from "../animation/hooks";

export interface TierBadgeRecommendChipProps {
  className?: string;
}

type Variant = "popular" | "value" | "premium";

const VARIANTS: Record<
  Variant,
  { label: string; Icon: typeof Sparkles; tone: string }
> = {
  popular: { label: "Most Popular", Icon: Sparkles, tone: "primary" },
  value: { label: "Best Value", Icon: Gem, tone: "primary" },
  premium: { label: "Premium", Icon: Crown, tone: "primary" },
};

function ShimmerBadge({
  variant,
  reduced,
}: {
  variant: Variant;
  reduced: boolean;
}) {
  const v = VARIANTS[variant];
  return (
    <span
      role="status"
      aria-label={`${v.label} plan`}
      className="relative inline-flex items-center gap-1 px-2.5 py-1 rounded-full overflow-hidden bg-primary text-zinc-950 text-[9px] font-black uppercase tracking-widest shadow-[0_0_18px_-4px_var(--accent-glow,rgba(201,255,55,0.55))]"
    >
      <span
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(110deg, transparent 30%, rgba(255,255,255,0.55) 50%, transparent 70%)",
          backgroundSize: "220% 100%",
          animation: reduced ? undefined : "ai-shimmer 2.8s linear infinite",
        }}
      />
      <v.Icon aria-hidden="true" className="relative w-3 h-3" />
      <span className="relative">{v.label}</span>
    </span>
  );
}

function MiniCard({
  title,
  price,
  variant,
  reduced,
}: {
  title: string;
  price: string;
  variant?: Variant;
  reduced: boolean;
}) {
  return (
    <div
      className={cn(
        "relative rounded-xl border p-3 flex flex-col gap-1.5",
        variant
          ? "border-primary/40 bg-primary/[0.06]"
          : "border-white/5 bg-white/[0.02]",
      )}
    >
      {variant && (
        <motion.span
          className="absolute -top-2.5 left-1/2 -translate-x-1/2"
          initial={reduced ? { opacity: 1 } : { y: -4, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 360, damping: 24 }}
        >
          <ShimmerBadge variant={variant} reduced={reduced} />
        </motion.span>
      )}
      <span className="text-[9px] font-mono uppercase tracking-widest text-white/50 mt-1">
        {title}
      </span>
      <div className="flex items-baseline gap-1">
        <span className="text-[9px] text-white/40">$</span>
        <span className="text-xl font-black tabular-nums text-white">{price}</span>
        <span className="text-[9px] text-white/40">/mo</span>
      </div>
    </div>
  );
}

export function TierBadgeRecommendChip({ className }: TierBadgeRecommendChipProps) {
  const [variant, setVariant] = useState<Variant>("popular");
  const reduced = usePrefersReducedMotion();

  return (
    <div
      className={cn(
        "w-full max-w-sm border border-white/5 bg-zinc-950/40 rounded-2xl shadow-2xl p-6 flex flex-col gap-3 backdrop-blur-xl",
        className,
      )}
    >
      <div className="flex flex-col gap-1 font-mono select-none">
        <span className="text-[9px] uppercase tracking-widest font-bold text-primary">RECOMMEND_BADGE</span>
        <span className="text-[8px] text-white/40 uppercase font-semibold">Shimmer ribbon · variant swap</span>
      </div>

      <div
        role="radiogroup"
        aria-label="Badge variant"
        className="flex bg-white/[0.03] border border-white/5 rounded-lg p-0.5"
      >
        {(Object.keys(VARIANTS) as Variant[]).map((v) => (
          <button
            key={v}
            type="button"
            role="radio"
            aria-checked={variant === v}
            onClick={() => setVariant(v)}
            className={cn(
              "flex-1 py-1 text-[9px] font-mono uppercase tracking-widest rounded-md transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/60",
              variant === v
                ? "bg-primary text-zinc-950 font-bold"
                : "text-white/60 hover:text-white",
            )}
          >
            {v}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-2 pt-3">
        <MiniCard title="Pro" price="29" variant={variant} reduced={reduced} />
        <MiniCard title="Plus" price="49" reduced={reduced} />
      </div>

      <div className="rounded-xl border border-white/5 bg-black/30 p-3 flex items-center justify-between">
        <span className="text-[9px] font-mono uppercase tracking-widest text-white/40">
          Standalone
        </span>
        <ShimmerBadge variant={variant} reduced={reduced} />
      </div>
    </div>
  );
}

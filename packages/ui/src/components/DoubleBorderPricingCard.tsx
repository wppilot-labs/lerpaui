"use client";

import React, { useCallback, useMemo, useState } from 'react';
import { motion} from "framer-motion";
import { Check, Sparkles, HelpCircle } from 'lucide-react';
import { cn } from '../lib/cn';
import { usePrefersReducedMotion } from '../animation/hooks';

export interface DoubleBorderPricingCardProps extends React.HTMLAttributes<HTMLDivElement> {
  planName?: string;
  priceMonthly?: number;
  priceAnnually?: number;
  isAnnual?: boolean;
  description?: string;
  features?: string[];
  badgeText?: string;
  ctaText?: string;
  onCtaClick?: () => void;
  laserColor1?: string; // primary laser stroke color
  laserColor2?: string; // secondary offset laser stroke color
}

const defaultFeatures = [
  "Unlimited high-fidelity components",
  "Tailwind CSS v4 fully compatible assets",
  "Commercial-use license under multiple brands",
  "Advanced interactive state controls",
  "Access to 10+ core structural roster templates",
  "24/7 dedicated engineering support",
];

export const DoubleBorderPricingCard: React.FC<DoubleBorderPricingCardProps> = ({
  planName = "Enterprise Suite",
  priceMonthly = 79,
  priceAnnually = 59,
  isAnnual = true,
  description = "Supercharge your corporate presentation layers with responsive interactive hooks and high-performance SVG visual tools.",
  features = defaultFeatures,
  badgeText = "RECOMMENDED PLAN",
  ctaText = "Deploy Plan Now",
  onCtaClick,
  laserColor1 = "#6366f1", // indigo
  laserColor2 = "#ec4899", // pink
  className,
  ...props
}) => {
  const [hovered, setHovered] = useState(false);
  const prefersReducedMotion = usePrefersReducedMotion();

  const currentPrice = isAnnual ? priceAnnually : priceMonthly;
  const savings = useMemo(() => isAnnual ? (priceMonthly - priceAnnually) * 12 : 0, [isAnnual, priceMonthly, priceAnnually]);

  const handleEnter = useCallback(() => setHovered(true), []);
  const handleLeave = useCallback(() => setHovered(false), []);

  return (
    <div
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      className={cn(
        "relative rounded-3xl p-8 bg-card/70 border border-border/40 backdrop-blur-md transition-all duration-300 w-full max-w-sm flex flex-col justify-between select-none overflow-hidden group shadow-lg hover:shadow-2xl hover:-translate-y-0.5",
        className
      )}
      {...props}
    >
      {/* SVG Double Laser Borders Overlay */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none z-10"
        fill="none"
      >
        {/* Outer Laser Rect */}
        <motion.rect
          x="1"
          y="1"
          width="calc(100% - 2px)"
          height="calc(100% - 2px)"
          rx="24"
          ry="24"
          stroke={laserColor1}
          strokeWidth="2.5"
          strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{
            pathLength: hovered && !prefersReducedMotion ? 1 : 0.25,
            opacity: hovered ? 1 : 0.35,
          }}
          transition={{
            duration: 1.2,
            ease: "easeInOut",
          }}
          style={{
            filter: `drop-shadow(0 0 6px ${laserColor1})`,
          }}
        />

        {/* Inner Laser Rect - Offset delay and different speed */}
        <motion.rect
          x="4"
          y="4"
          width="calc(100% - 8px)"
          height="calc(100% - 8px)"
          rx="21"
          ry="21"
          stroke={laserColor2}
          strokeWidth="1.5"
          strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{
            pathLength: hovered && !prefersReducedMotion ? 1 : 0.1,
            opacity: hovered ? 0.95 : 0.2,
          }}
          transition={{
            duration: 1.5,
            delay: 0.15,
            ease: "easeInOut",
          }}
          style={{
            filter: `drop-shadow(0 0 4px ${laserColor2})`,
          }}
        />
      </svg>

      {/* Decorative Glow inside the card */}
      <div 
        className="absolute -top-12 -right-12 w-32 h-32 rounded-full opacity-20 group-hover:opacity-30 blur-2xl transition-opacity duration-300 pointer-events-none"
        style={{
          background: `radial-gradient(circle, ${laserColor1} 0%, ${laserColor2} 100%)`,
        }}
      />

      <div className="relative z-20">
        {/* Badge Indicator */}
        {badgeText && (
          <div className="flex items-center gap-1.5 mb-5">
            <span 
              className="text-[9px] font-black uppercase tracking-widest text-white px-2.5 py-1 rounded-md flex items-center gap-1 shadow-sm"
              style={{
                background: `linear-gradient(135deg, ${laserColor1} 0%, ${laserColor2} 100%)`
              }}
            >
              <Sparkles className="w-2.5 h-2.5 animate-pulse" />
              {badgeText}
            </span>
            {isAnnual && savings > 0 && (
              <span className="text-[9px] font-bold text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-md">
                Save ${savings}/year
              </span>
            )}
          </div>
        )}

        {/* Pricing Layout */}
        <div className="mb-4">
          <h3 className="text-xl font-bold tracking-tight text-foreground">{planName}</h3>
          <p className="text-xs text-muted-foreground/80 mt-1.5 leading-relaxed">{description}</p>
        </div>

        <div className="flex items-baseline gap-1 my-6">
          <span className="text-4xl font-extrabold tracking-tight text-foreground">${currentPrice}</span>
          <span className="text-xs font-semibold text-muted-foreground">/mo</span>
          {isAnnual && (
            <span className="text-[10px] text-muted-foreground/75 font-semibold ml-2">billed annually</span>
          )}
        </div>

        {/* Features Checklist */}
        <div className="space-y-3.5 my-8">
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Plan Highlights</p>
          {features.map((feature, idx) => (
            <div key={idx} className="flex items-start gap-2.5">
              <div 
                className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                style={{ backgroundColor: `${laserColor1}15` }}
              >
                <Check className="w-2.5 h-2.5" style={{ color: laserColor1 }} />
              </div>
              <span className="text-xs font-medium text-foreground/90">{feature}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Action CTA Button */}
      <div className="relative z-20 mt-4">
        <button
          type="button"
          onClick={onCtaClick}
          className="w-full relative py-3 px-4 rounded-xl text-xs font-black tracking-wide text-white overflow-hidden transition-all active:scale-[0.98] hover:brightness-110 cursor-pointer shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          style={{
            background: `linear-gradient(135deg, ${laserColor1} 0%, ${laserColor2} 100%)`
          }}
        >
          {/* Internal button glow overlay on hover */}
          <span className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
          {ctaText}
        </button>
        
        <p className="text-center text-[9px] text-muted-foreground/70 mt-3 flex items-center justify-center gap-1">
          <HelpCircle className="w-3 h-3" />
          <span>Cancel anytime. Includes 14-day fully active trial period.</span>
        </p>
      </div>
    </div>
  );
};


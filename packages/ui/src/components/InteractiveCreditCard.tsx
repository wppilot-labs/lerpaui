"use client";

import React, { useCallback, useState, useEffect, useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform} from "framer-motion";
import { cn } from "../lib/cn";
import { CreditCard, Eye, EyeOff, ShieldCheck, Wifi } from "lucide-react";
import { usePrefersReducedMotion } from '../animation/hooks';

export interface InteractiveCreditCardProps {
  cardNumber?: string;
  cardName?: string;
  expiry?: string;
  cvv?: string;
  focusedField?: "number" | "name" | "expiry" | "cvv" | null;
  onCardTypeChange?: (type: string) => void;
  className?: string;
  showForm?: boolean;
}

export function InteractiveCreditCard({
  cardNumber: externalCardNumber,
  cardName: externalCardName,
  expiry: externalExpiry,
  cvv: externalCvv,
  focusedField: externalFocusedField,
  onCardTypeChange,
  className,
  showForm = true,
}: InteractiveCreditCardProps) {
  // Fallback states for self-contained playground mode
  const [internalCardNumber, setInternalCardNumber] = useState("");
  const [internalCardName, setInternalCardName] = useState("");
  const [internalExpiry, setInternalExpiry] = useState("");
  const [internalCvv, setInternalCvv] = useState("");
  const [internalFocusedField, setInternalFocusedField] = useState<"number" | "name" | "expiry" | "cvv" | null>(null);
  const [showCvvPlain, setShowCvvPlain] = useState(false);
  const prefersReducedMotion = usePrefersReducedMotion();

  // Sync / resolve states
  const cardNumber = externalCardNumber !== undefined ? externalCardNumber : internalCardNumber;
  const cardName = externalCardName !== undefined ? externalCardName : internalCardName;
  const expiry = externalExpiry !== undefined ? externalExpiry : internalExpiry;
  const cvv = externalCvv !== undefined ? externalCvv : internalCvv;
  const focusedField = externalFocusedField !== undefined ? externalFocusedField : internalFocusedField;

  const isFlipped = focusedField === "cvv";

  // Card Brand Detection
  const getCardDetails = (num: string) => {
    const clean = num.replace(/\D/g, "");
    if (clean.startsWith("4")) {
      return {
        type: "visa",
        name: "Visa",
        gradient: "from-[#0F2027] via-[#203A43] to-[#2C5364]",
        accentColor: "text-sky-400",
        glowColor: "rgba(14, 165, 233, 0.45)",
        brandLogo: (
          <svg className="h-6 w-16 fill-white" viewBox="0 0 24 8" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 0.5H3.6L5.8 6.1L8.0 0.5H11.5L7.2 9.5H3.7L0 0.5ZM11.5 0.5H14.5L12.5 9.5H9.5L11.5 0.5ZM21.5 0.5C20.5 0.5 19.5 1.0 19.0 2.0L15.5 9.5H18.8L19.4 8.0H23.0L23.3 9.5H26.5L24.0 0.5H21.5ZM20.0 6.0L21.2 2.8L22.4 6.0H20.0Z" />
          </svg>
        ),
      };
    }
    if (clean.startsWith("5")) {
      return {
        type: "mastercard",
        name: "Mastercard",
        gradient: "from-[#141E30] via-[#243B55] to-[#f857a6]",
        accentColor: "text-rose-500",
        glowColor: "rgba(244, 63, 94, 0.45)",
        brandLogo: (
          <svg className="h-7 w-12" viewBox="0 0 24 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="6" cy="8" r="6" fill="#EB001B" fillOpacity="0.9" />
            <circle cx="14" cy="8" r="6" fill="#F79E1B" fillOpacity="0.9" />
            <path d="M10 8C10 5.5 11 3.5 12.5 2.2C11 1.2 9 0.6 7 0.6C3 0.6 0 3.6 0 7.6C0 11.6 3 14.6 7 14.6C9 14.6 11 14 12.5 13C11 11.7 10 9.7 10 8Z" fill="#FF5F00" />
          </svg>
        ),
      };
    }
    if (clean.startsWith("3")) {
      return {
        type: "amex",
        name: "American Express",
        gradient: "from-[#0d1b2a] via-[#1b263b] to-[#415a77]",
        accentColor: "text-teal-400",
        glowColor: "rgba(20, 184, 166, 0.4)",
        brandLogo: (
          <div className="flex items-center space-x-1 border border-teal-500/50 bg-teal-950/40 px-1.5 py-0.5 rounded text-[8px] tracking-widest font-black text-teal-400">
            AMEX
          </div>
        ),
      };
    }
    if (clean.startsWith("6")) {
      return {
        type: "discover",
        name: "Discover",
        gradient: "from-[#0F0C20] via-[#15102A] to-[#E65C00]",
        accentColor: "text-orange-500",
        glowColor: "rgba(249, 115, 22, 0.45)",
        brandLogo: (
          <div className="flex items-center space-x-0.5 text-xs font-black italic tracking-tighter text-white">
            <span>DISC</span>
            <span className="text-orange-500">O</span>
            <span>VER</span>
          </div>
        ),
      };
    }
    return {
      type: "default",
      name: "Premium Card",
      gradient: "from-[#1f1c2c] via-[#2f2b3a] to-[#3a3545]",
      accentColor: "text-purple-400",
      glowColor: "rgba(168, 85, 247, 0.3)",
      brandLogo: (
        <div className="flex items-center space-x-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-purple-500 animate-pulse" />
          <span className="text-2xs font-semibold tracking-widest text-purple-200">AURA</span>
        </div>
      ),
    };
  };

  const cardDetails = getCardDetails(cardNumber);

  // Notify parent on brand switch
  useEffect(() => {
    if (onCardTypeChange) {
      onCardTypeChange(cardDetails.type);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- intentional: only re-notify on actual brand change, not on parent callback identity
  }, [cardDetails.type]);

  // 3D Tilting Mouse Physics
  const cardRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [15, -15]), { stiffness: 150, damping: 22 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-15, 15]), { stiffness: 150, damping: 22 });

  const shineX = useSpring(useTransform(x, [-0.5, 0.5], ["0%", "100%"]), { stiffness: 150, damping: 22 });
  const shineY = useSpring(useTransform(y, [-0.5, 0.5], ["0%", "100%"]), { stiffness: 150, damping: 22 });

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (isFlipped || prefersReducedMotion) return; // Disable tilting details on back side for cleaner visuals
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left - width / 2;
    const mouseY = e.clientY - rect.top - height / 2;
    x.set(mouseX / width);
    y.set(mouseY / height);
  }, [isFlipped, prefersReducedMotion, x, y]);

  const handleMouseLeave = useCallback(() => {
    x.set(0);
    y.set(0);
  }, [x, y]);

  // Helper to format credit card number
  const formatCardNumber = (val: string) => {
    const clean = val.replace(/\D/g, "");
    const parts = [];
    for (let i = 0; i < clean.length && i < 16; i += 4) {
      parts.push(clean.substring(i, i + 4));
    }
    return parts.join(" ");
  };

  // Display value formatting
  const displayCardNumber = () => {
    const formatted = formatCardNumber(cardNumber);
    const placeholder = "•••• •••• •••• ••••";
    return formatted + placeholder.slice(formatted.length);
  };

  const displayExpiry = () => {
    if (!expiry) return "MM/YY";
    const clean = expiry.replace(/\D/g, "");
    if (clean.length > 2) {
      return `${clean.slice(0, 2)}/${clean.slice(2, 4)}`;
    }
    return clean;
  };

  // Form input change handlers
  const handleNumChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const clean = e.target.value.replace(/\D/g, "").slice(0, 16);
    setInternalCardNumber(clean);
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInternalCardName(e.target.value.slice(0, 26));
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const clean = e.target.value.replace(/\D/g, "").slice(0, 4);
    setInternalExpiry(clean);
  };

  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const clean = e.target.value.replace(/\D/g, "").slice(0, 4);
    setInternalCvv(clean);
  };

  return (
    <div className={cn("flex flex-col items-center justify-center p-4 w-full max-w-2xl mx-auto space-y-8", className)}>
      {/* 3D Perspective Wrapper */}
      <div
        className="w-full flex items-center justify-center relative cursor-grab active:cursor-grabbing"
        style={{ perspective: 1200 }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {/* Dynamic Glow Shadow */}
        <div
          className="absolute inset-0 m-auto w-[350px] h-[220px] rounded-2xl blur-3xl transition-colors duration-700 opacity-60 z-0 pointer-events-none"
          style={{
            background: cardDetails.glowColor,
          }}
        />

        {/* Dynamic Card Body */}
        <motion.div
          ref={cardRef}
          style={{
            rotateX: isFlipped || prefersReducedMotion ? 0 : rotateX,
            rotateY: isFlipped || prefersReducedMotion ? 0 : rotateY,
            transformStyle: "preserve-3d",
            willChange: prefersReducedMotion ? undefined : 'transform',
          }}
          className="relative w-full max-w-[400px] h-[240px] z-10 transition-shadow duration-300"
        >
          {/* Flip Container */}
          <motion.div
            style={{ transformStyle: "preserve-3d", willChange: prefersReducedMotion ? undefined : 'transform' }}
            animate={{ rotateY: isFlipped ? 180 : 0 }}
            transition={prefersReducedMotion ? { duration: 0 } : { type: "spring", stiffness: 100, damping: 18 }}
            className="w-full h-full relative duration-700"
          >
            {/* FRONT FACE */}
            <div
              className={cn(
                "absolute inset-0 w-full h-full rounded-2xl p-6 flex flex-col justify-between overflow-hidden shadow-2xl border border-white/10 text-white backdrop-blur-md select-none bg-gradient-to-tr",
                cardDetails.gradient
              )}
              style={{
                backfaceVisibility: "hidden",
                transformStyle: "preserve-3d",
              }}
            >
              {/* Dynamic Glass Glossy Reflection */}
              <motion.div
                className="absolute inset-0 pointer-events-none bg-gradient-to-br from-white/0 via-white/12 to-white/0 skew-x-12 opacity-80"
                style={{
                  left: shineX,
                  top: shineY,
                  transform: "translateZ(1px)",
                }}
              />

              {/* Holographic glowing lines in bg */}
              <div className="absolute inset-0 pointer-events-none opacity-10 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.15)_1px,transparent_1px)] bg-[size:12px_12px]" />

              {/* Row 1: Brand & Contactless */}
              <div className="flex items-start justify-between w-full" style={{ transform: "translateZ(40px)" }}>
                <div>{cardDetails.brandLogo}</div>
                <div className="flex items-center space-x-2">
                  <Wifi className="w-5 h-5 text-white/70" />
                  <CreditCard className="w-5 h-5 text-white/50" />
                </div>
              </div>

              {/* Row 2: Metallic Hologram Chip */}
              <div className="flex items-center justify-between" style={{ transform: "translateZ(30px)" }}>
                <div className="relative w-12 h-9 rounded-md bg-gradient-to-r from-yellow-300 via-amber-400 to-yellow-500 overflow-hidden shadow-inner flex items-center justify-center border border-yellow-200/40">
                  {/* Microchip lines */}
                  <div className="absolute inset-x-0 top-[30%] h-[1px] bg-amber-950/30" />
                  <div className="absolute inset-x-0 bottom-[30%] h-[1px] bg-amber-950/30" />
                  <div className="absolute inset-y-0 left-[35%] w-[1px] bg-amber-950/30" />
                  <div className="absolute inset-y-0 right-[35%] w-[1px] bg-amber-950/30" />
                  <div className="w-3 h-4 border border-amber-950/20 rounded bg-gradient-to-b from-yellow-100 to-amber-300/80 z-10" />
                </div>
                {/* Visual indicator for focused fields */}
                <div className="text-[10px] text-white/30 tracking-widest font-mono select-none uppercase">
                  WORLD ELITE
                </div>
              </div>

              {/* Row 3: Card Number */}
              <div
                className="w-full flex justify-center py-2"
                style={{ transform: "translateZ(50px)" }}
              >
                <span
                  className={cn(
                    "text-xl md:text-2xl font-mono tracking-widest text-shadow transition-all duration-300",
                    focusedField === "number" ? "text-amber-400 scale-[1.03]" : "text-white"
                  )}
                >
                  {displayCardNumber()}
                </span>
              </div>

              {/* Row 4: Name and Expiry */}
              <div className="flex justify-between items-end w-full" style={{ transform: "translateZ(35px)" }}>
                <div className="flex flex-col">
                  <span className="text-[8px] uppercase tracking-wider text-white/40">Cardholder Name</span>
                  <span
                    className={cn(
                      "text-xs font-mono font-medium tracking-wide uppercase max-w-[200px] truncate transition-all duration-300",
                      focusedField === "name" ? "text-amber-400 scale-[1.03]" : "text-white"
                    )}
                  >
                    {cardName || "YOUR NAME"}
                  </span>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-[8px] uppercase tracking-wider text-white/40">Expires</span>
                  <span
                    className={cn(
                      "text-xs font-mono font-medium transition-all duration-300",
                      focusedField === "expiry" ? "text-amber-400 scale-[1.03]" : "text-white"
                    )}
                  >
                    {displayExpiry()}
                  </span>
                </div>
              </div>
            </div>

            {/* BACK FACE */}
            <div
              className={cn(
                "absolute inset-0 w-full h-full rounded-2xl flex flex-col justify-between py-6 overflow-hidden shadow-2xl border border-white/10 text-white backdrop-blur-md select-none bg-gradient-to-tr",
                cardDetails.gradient
              )}
              style={{
                backfaceVisibility: "hidden",
                transform: "rotateY(180deg)",
                transformStyle: "preserve-3d",
              }}
            >
              {/* Magnetic Strip */}
              <div className="w-full h-11 bg-slate-950/90 mt-1 shadow-md" style={{ transform: "translateZ(20px)" }} />

              {/* Signature and CVV Section */}
              <div className="px-6 flex flex-col space-y-1.5" style={{ transform: "translateZ(30px)" }}>
                <div className="flex justify-between items-center">
                  <span className="text-[8px] uppercase tracking-wider text-white/50">Authorized Signature</span>
                  <span className="text-[8px] uppercase tracking-wider text-white/50">CVV Security Code</span>
                </div>

                <div className="flex items-center w-full">
                  {/* Signature Strip */}
                  <div className="flex-1 h-9 bg-neutral-200/90 rounded-l flex items-center px-3 text-neutral-800 font-mono italic text-xs select-none bg-[repeating-linear-gradient(45deg,transparent,transparent_4px,rgba(0,0,0,0.05)_4px,rgba(0,0,0,0.05)_8px)]">
                    {cardName || "Aura Member"}
                  </div>

                  {/* CVV Field */}
                  <div
                    className={cn(
                      "w-12 h-9 bg-yellow-100 rounded-r text-neutral-900 font-mono font-bold flex items-center justify-center border-l border-neutral-300 text-sm shadow-inner transition-transform duration-300",
                      focusedField === "cvv" ? "bg-amber-300 ring-2 ring-amber-500 scale-[1.03]" : ""
                    )}
                  >
                    {cvv ? (showCvvPlain ? cvv : "•".repeat(cvv.length)) : "•••"}
                  </div>
                </div>
              </div>

              {/* Footer info & Hologram */}
              <div className="px-6 flex justify-between items-center" style={{ transform: "translateZ(25px)" }}>
                <div className="text-[7px] text-white/40 max-w-[220px] leading-snug">
                  This card is property of Aura Banking. If found, please return to issuer. Use is governed by standard terms and agreements.
                </div>
                <div className="relative w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-400 via-purple-500 to-indigo-500 opacity-60 flex items-center justify-center overflow-hidden">
                  <div className="w-5 h-5 rounded-full border border-white/20 bg-white/10 backdrop-blur-sm flex items-center justify-center">
                    <ShieldCheck className="w-3.5 h-3.5 text-white" />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Embedded checkout playground UI */}
      {showForm && (
        <div className="w-full bg-card/65 backdrop-blur-md rounded-2xl p-6 border border-border shadow-xl space-y-4">
          <div className="flex justify-between items-center pb-2 border-b border-border/80">
            <h3 className="text-sm font-semibold text-foreground tracking-wide flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-primary" />
              Secure Checkout Demo
            </h3>
            <button
              onClick={() => setShowCvvPlain((prev) => !prev)}
              type="button"
              className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1.5 transition-colors"
            >
              {showCvvPlain ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              {showCvvPlain ? "Hide CVV" : "Show CVV"}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Card Number Input */}
            <div className="flex flex-col space-y-1.5">
              <label htmlFor="cc-number" className="text-2xs font-bold tracking-wider text-muted-foreground uppercase">Card Number</label>
              <input
                id="cc-number"
                type="text"
                placeholder="4000 1234 5678 9010"
                value={formatCardNumber(cardNumber)}
                onChange={handleNumChange}
                onFocus={() => setInternalFocusedField("number")}
                onBlur={() => setInternalFocusedField(null)}
                className="w-full h-10 px-3 rounded-lg border border-input bg-background/50 text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 transition-all font-mono"
              />
            </div>

            {/* Cardholder Name Input */}
            <div className="flex flex-col space-y-1.5">
              <label htmlFor="cc-name" className="text-2xs font-bold tracking-wider text-muted-foreground uppercase">Cardholder Name</label>
              <input
                id="cc-name"
                type="text"
                placeholder="AURA CARDHOLDER"
                value={cardName}
                onChange={handleNameChange}
                onFocus={() => setInternalFocusedField("name")}
                onBlur={() => setInternalFocusedField(null)}
                className="w-full h-10 px-3 rounded-lg border border-input bg-background/50 text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 transition-all"
              />
            </div>

            {/* Expiry Date Input */}
            <div className="flex flex-col space-y-1.5">
              <label htmlFor="cc-expiry" className="text-2xs font-bold tracking-wider text-muted-foreground uppercase">Expiry Date</label>
              <input
                id="cc-expiry"
                type="text"
                placeholder="MM/YY"
                maxLength={5}
                value={displayExpiry()}
                onChange={handleExpiryChange}
                onFocus={() => setInternalFocusedField("expiry")}
                onBlur={() => setInternalFocusedField(null)}
                className="w-full h-10 px-3 rounded-lg border border-input bg-background/50 text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 transition-all font-mono"
              />
            </div>

            {/* CVV Input */}
            <div className="flex flex-col space-y-1.5">
              <label htmlFor="cc-cvv" className="text-2xs font-bold tracking-wider text-muted-foreground uppercase">CVV / Security Code</label>
              <input
                id="cc-cvv"
                type={showCvvPlain ? "text" : "password"}
                placeholder="•••"
                maxLength={4}
                value={cvv}
                onChange={handleCvvChange}
                onFocus={() => setInternalFocusedField("cvv")}
                onBlur={() => setInternalFocusedField(null)}
                className="w-full h-10 px-3 rounded-lg border border-input bg-background/50 text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 transition-all font-mono"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

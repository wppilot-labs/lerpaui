"use client";

import React, { useEffect, useState } from "react";
import { motion, useSpring, useTransform} from "framer-motion";
import { cn } from "../lib/cn";

export function SpringNumberTicker({
  value,
  className,
}: {
  value: number;
  className?: string;
}) {
  const digits = value.toString().split("");

  return (
    <div className={cn("inline-flex items-center overflow-hidden font-mono", className)}>
      {digits.map((digit, idx) => {
        const isNumber = !isNaN(Number(digit));
        if (!isNumber) {
          return (
            <span key={idx} className="inline-block">
              {digit}
            </span>
          );
        }
        return <DigitColumn key={idx} digit={Number(digit)} />;
      })}
    </div>
  );
}

function DigitColumn({ digit }: { digit: number }) {
  const [_prevDigit, setPrevDigit] = useState(digit);
  const springValue = useSpring(digit, {
    stiffness: 160,
    damping: 18,
    mass: 0.8,
  });

  useEffect(() => {
    springValue.set(digit);
    setPrevDigit(digit);
  }, [digit, springValue]);

  const y = useTransform(springValue, (latest) => {
    // Transform numerical value 0-9 into vertical percentage offset
    return `-${latest * 10}%`;
  });

  const range = Array.from({ length: 10 }, (_, i) => i);

  return (
    <div className="relative h-[1.25em] w-[0.6em] overflow-hidden select-none">
      <motion.div
        className="absolute left-0 top-0 w-full flex flex-col items-center justify-start"
        style={{ y }}
      >
        {range.map((num) => (
          <span
            key={num}
            className="flex items-center justify-center h-[1.25em] leading-none text-foreground font-extrabold"
          >
            {num}
          </span>
        ))}
      </motion.div>
    </div>
  );
}

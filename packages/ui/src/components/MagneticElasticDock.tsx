"use client";

import React, { useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform, type MotionValue } from "framer-motion";
import { Home, Compass, Heart, MessageCircle, User } from "lucide-react";
import { cn } from "../lib/cn";

interface DockItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  onClick?: () => void;
}

interface MagneticElasticDockProps {
  items: DockItem[];
  className?: string;
}

const DEFAULT_DOCK_ITEMS: DockItem[] = [
  { id: "home", label: "Home", icon: <Home className="h-5 w-5" /> },
  { id: "explore", label: "Explore", icon: <Compass className="h-5 w-5" /> },
  { id: "saved", label: "Saved", icon: <Heart className="h-5 w-5" /> },
  { id: "messages", label: "Messages", icon: <MessageCircle className="h-5 w-5" /> },
  { id: "profile", label: "Profile", icon: <User className="h-5 w-5" /> },
];

export function MagneticElasticDock({ items = DEFAULT_DOCK_ITEMS, className }: MagneticElasticDockProps) {
  const mouseX = useMotionValue(Infinity);
  const [hoveredLabel, setHoveredLabel] = useState<string | null>(null);

  return (
    <div 
      onMouseMove={(e) => mouseX.set(e.clientX)}
      onMouseLeave={() => {
        mouseX.set(Infinity);
        setHoveredLabel(null);
      }}
      className={cn(
        "relative flex h-16 items-end gap-3 rounded-2xl border border-white/10 bg-black/40 px-4 pb-3 backdrop-blur-md shadow-2xl justify-center max-w-fit mx-auto",
        className
      )}
    >
      {items.map((item) => (
        <DockIcon 
          key={item.id} 
          item={item} 
          mouseX={mouseX} 
          onHover={setHoveredLabel}
          hoveredLabel={hoveredLabel}
        />
      ))}
    </div>
  );
}

function DockIcon({
  item,
  mouseX,
  onHover,
  hoveredLabel,
}: {
  item: DockItem;
  mouseX: MotionValue<number>;
  onHover: (label: string | null) => void;
  hoveredLabel: string | null;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const distance = useTransform(mouseX, (val: number) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return val - bounds.x - bounds.width / 2;
  });

  const widthTransform = useTransform(distance, [-150, 0, 150], [40, 70, 40]);
  const heightTransform = useTransform(distance, [-150, 0, 150], [40, 70, 40]);

  const width = useSpring(widthTransform, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  });

  const height = useSpring(heightTransform, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  });

  return (
    <div className="relative">
      <motion.div
        ref={ref}
        style={{ width, height }}
        onMouseEnter={() => onHover(item.label)}
        onMouseLeave={() => onHover(null)}
        onClick={item.onClick}
        className="flex aspect-square items-center justify-center rounded-xl bg-neutral-800/80 border border-neutral-700 text-neutral-300 hover:text-white cursor-pointer transition-colors duration-200 shadow-md relative"
        whileTap={{ scale: 0.85 }}
      >
        <span className="h-6 w-6 flex items-center justify-center [&>svg]:w-full [&>svg]:h-full">
          {item.icon}
        </span>
      </motion.div>
      
      {/* Label Tooltip */}
      {hoveredLabel === item.label && (
        <motion.div
          initial={{ opacity: 0, y: 10, scale: 0.95 }}
          animate={{ opacity: 1, y: -45, scale: 1 }}
          exit={{ opacity: 0, y: 10 }}
          className="absolute left-1/2 -translate-x-1/2 px-2.5 py-1 rounded bg-black border border-white/10 text-white font-sans text-xs font-medium whitespace-nowrap pointer-events-none shadow-lg z-20"
        >
          {item.label}
        </motion.div>
      )}
    </div>
  );
}

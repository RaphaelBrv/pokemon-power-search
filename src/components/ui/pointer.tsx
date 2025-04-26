"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { motion, useMotionValue, useSpring } from "framer-motion";

interface PointerProps {
  children?: React.ReactNode;
  className?: string;
}

export function Pointer({ children, className }: PointerProps) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 20, stiffness: 300 };
  const springX = useSpring(mouseX, springConfig);
  const springY = useSpring(mouseY, springConfig);

  // Cette fonction sera appelée lorsque la souris se déplace sur l'élément parent
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    // Calculer les coordonnées relatives à l'élément parent
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  };

  return (
    <div
      className="absolute inset-0 z-10 overflow-hidden"
      onMouseMove={handleMouseMove}
    >
      <motion.div
        className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2"
        style={{
          x: springX,
          y: springY,
        }}
      >
        {children || (
          <motion.div
            animate={{
              scale: [0.8, 1, 0.8],
              rotate: [0, 5, -5, 0],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <svg
              width="40"
              height="40"
              viewBox="0 0 40 40"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className={cn("text-red-600", className)}
            >
              {/* Pokeball SVG */}
              <circle cx="20" cy="20" r="18" fill="#FF0000" />
              <rect x="1" y="18" width="38" height="4" fill="#000000" />
              <circle
                cx="20"
                cy="20"
                r="6"
                fill="#FFFFFF"
                stroke="#000000"
                strokeWidth="2"
              />
              <circle
                cx="20"
                cy="20"
                r="3"
                fill="#FFFFFF"
                stroke="#000000"
                strokeWidth="1"
              />
            </svg>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}

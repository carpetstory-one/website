'use client';

import React from 'react';
import { motion } from 'motion/react';
import {
  slideLeftVariants,
  slideRightVariants,
  slideUpVariants,
  slideDownVariants,
  viewportOnce,
} from '@/lib/animations';
import { useReducedMotion } from '@/hooks/useReducedMotion';

const directionMap = {
  l: slideLeftVariants,
  r: slideRightVariants,
  u: slideUpVariants,
  d: slideDownVariants,
};

/**
 * SlideIn — Wrap children in a directional slide animation.
 * Falls back to static rendering if reduced motion is preferred or on mobile.
 */
export function SlideIn({
  children,
  direction = 'u',
  delay = 0,
  className = '',
}: {
  children: React.ReactNode;
  direction?: 'l' | 'r' | 'u' | 'd';
  delay?: number;
  className?: string;
}) {
  const prefersReducedMotion = useReducedMotion();
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    setIsMobile(window.innerWidth < 768);
  }, []);

  if (prefersReducedMotion || isMobile) {
    return <div className={className}>{children}</div>;
  }

  // Clone variants to apply custom delay without mutating the shared object
  const variants = {
    ...directionMap[direction],
    visible: {
      ...directionMap[direction].visible,
      transition: {
        ...(directionMap[direction].visible as any).transition,
        delay: delay / 1000, // Framer Motion uses seconds
      },
    },
  };

  return (
    <motion.div
      className={`slide-${direction} ${className}`}
      variants={variants}
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
    >
      {children}
    </motion.div>
  );
}

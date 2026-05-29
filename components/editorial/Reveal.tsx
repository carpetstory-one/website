'use client';

import React from 'react';
import { motion } from 'motion/react';
import { revealVariants, viewportOnce } from '@/lib/animations';
import { useReducedMotion } from '@/hooks/useReducedMotion';

/**
 * Reveal — Wrap children in a clip-path weave-in animation.
 * Falls back to static rendering if reduced motion is preferred.
 */
export function Reveal({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return <div className={`reveal ${className}`}>{children}</div>;
  }

  return (
    <motion.div
      className={`reveal ${className}`}
      variants={revealVariants}
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
    >
      {children}
    </motion.div>
  );
}

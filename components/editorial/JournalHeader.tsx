'use client';

import React from 'react';
import { motion } from 'motion/react';
import { useReducedMotion } from '@/hooks/useReducedMotion';

const slideUp = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 1.1, ease: [0.16, 1, 0.3, 1] as const },
  },
};

export function JournalHeader({
  title,
  eyebrow,
  description,
}: {
  title: string;
  eyebrow?: string;
  description?: string;
}) {
  const prefersReducedMotion = useReducedMotion();
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    setIsMobile(window.innerWidth < 768);
  }, []);

  const content = (
    <header className="mx-auto mb-16 max-w-3xl text-center sm:mb-24">
      {eyebrow && (
        <span className="text-accent mb-5 block text-[11px] tracking-[0.18em] uppercase font-medium">
          {eyebrow}
        </span>
      )}
      <h1 className="font-display text-ink mb-5 text-[40px] leading-[1] font-light tracking-[-0.02em] sm:text-[56px] md:text-[80px]">
        {title}
      </h1>
      {description && (
        <p className="text-ink-soft mx-auto max-w-[48ch] text-[16px] leading-[1.65] font-light">
          {description}
        </p>
      )}
    </header>
  );

  if (prefersReducedMotion || isMobile) {
    return content;
  }

  return (
    <motion.div
      variants={slideUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
    >
      {content}
    </motion.div>
  );
}

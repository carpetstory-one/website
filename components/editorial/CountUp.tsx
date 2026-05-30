'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from '@/hooks/useReducedMotion';

/**
 * CountUp — Animates a number from 0 to target when it enters the viewport.
 */
export function CountUp({
  target,
  duration = 2000,
  format,
  glow = false,
  className = '',
}: {
  target: number;
  duration?: number;
  format?: (n: number) => string;
  glow?: boolean;
  className?: string;
}) {
  const [value, setValue] = useState(0);
  const [isCounting, setIsCounting] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) {
      setValue(target);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsCounting(true);
          observer.disconnect(); // Only animate once
        }
      },
      { threshold: 0.5 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [prefersReducedMotion, target]);

  useEffect(() => {
    if (!isCounting || prefersReducedMotion) return;

    let start = 0;
    let animationFrame: number;
    const startTime = performance.now();

    const update = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // easeOutExpo
      const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);

      setValue(Math.floor(target * ease));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(update);
      } else {
        setValue(target);
        setIsCounting(false);
      }
    };

    animationFrame = requestAnimationFrame(update);

    return () => cancelAnimationFrame(animationFrame);
  }, [isCounting, target, duration, prefersReducedMotion]);

  const displayValue = format ? format(value) : value.toLocaleString();

  return (
    <span
      ref={ref}
      className={`${className} ${glow && isCounting ? 'glow' : ''} ${glow && !isCounting && value === target ? 'num-glow' : ''}`}
      style={
        glow && isCounting
          ? { textShadow: '0 0 30px rgba(110, 31, 35, 0.35)' }
          : undefined
      }
      data-countup={target}
    >
      {displayValue}
    </span>
  );
}

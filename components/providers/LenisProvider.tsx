'use client';

import React from 'react';
import { ReactLenis } from '@studio-freight/react-lenis';
import { useReducedMotion } from '@/hooks/useReducedMotion';

export function LenisProvider({ children }: { children: any }) {
  const prefersReducedMotion = useReducedMotion();

  // Disable smooth scroll entirely if the user prefers reduced motion.
  if (prefersReducedMotion) {
    return <>{children}</>;
  }

  return (
    <ReactLenis
      root
      options={{
        // lerp mode for a fast/snappy-but-smooth feel — see GlobalAnimations.
        lerp: 0.12,
        smoothWheel: true,
        wheelMultiplier: 1.15,
        syncTouch: false,
      }}
    >
      {/* We need an instance of Lenis to provide to our context, but react-lenis handles it internally. 
          To expose it via our custom useLenis hook, we can use the useLenis hook from @studio-freight/react-lenis itself. 
          For simplicity, we'll just let react-lenis do its thing at the root level.
          We should update our `hooks/useLenis.ts` to export `useLenis` from `@studio-freight/react-lenis` instead of a custom context. */}
      {children}
    </ReactLenis>
  );
}

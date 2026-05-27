/**
 * hooks/useScrollProgress.ts — Section-relative scroll progress
 *
 * Returns a value from 0 to 1 representing how far the user has scrolled
 * through a referenced section. Uses IntersectionObserver + scroll listener
 * for efficient tracking.
 *
 * Used by: ImmersiveVideo, ColorStory parallax, Making section parallax.
 */

'use client';

import { useEffect, useState, type RefObject } from 'react';

export function useScrollProgress(ref: RefObject<HTMLElement | null>): number {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const onScroll = () => {
      const rect = el.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      if (total <= 0) return;

      const p = -rect.top / total;
      setProgress(Math.max(0, Math.min(1, p)));
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    return () => window.removeEventListener('scroll', onScroll);
  }, [ref]);

  return progress;
}

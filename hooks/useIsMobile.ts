/**
 * hooks/useIsMobile.ts — Detect mobile viewport
 *
 * Returns true for viewports below 768px (consistent with the HTML mockup's
 * `isMobile` check at window.innerWidth < 768).
 *
 * Used to disable: custom cursor, magnetic hover, thread canvas, hero parallax.
 * Listens for resize events and updates reactively.
 */

'use client';

import { useState, useEffect } from 'react';

export function useIsMobile(breakpoint: number = 768): boolean {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < breakpoint);
    check();

    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, [breakpoint]);

  return isMobile;
}

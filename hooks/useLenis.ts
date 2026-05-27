/**
 * hooks/useLenis.ts — Access the Lenis smooth scroll instance
 *
 * Provides access to the Lenis instance initialized by LenisProvider.
 * Use lenis.scrollTo() for hash-link smooth scrolling, or lenis.stop()/start()
 * for modal scroll locking.
 *
 * Used by: Nav hash links, InquiryForm scroll-to, mobile menu scroll lock.
 */

'use client';

import { useLenis as useReactLenis } from '@studio-freight/react-lenis';
import type Lenis from 'lenis';

export function useLenis(): any {
  return useReactLenis();
}

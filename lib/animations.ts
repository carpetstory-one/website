/**
 * lib/animations.ts — Shared Framer Motion variants for Carpetstory
 *
 * Centralized animation configurations used across editorial components.
 * All animations respect prefers-reduced-motion via the MotionConfig provider.
 */

import type { Variants, Transition } from 'framer-motion';

/** Standard easing curve from the design system */
const EASE: [number, number, number, number] = [0.65, 0, 0.35, 1];

/** Fast-out easing for reveals and entrances */
const EASE_OUT: [number, number, number, number] = [0.16, 1, 0.3, 1];

/** Weave easing for clip-path reveals */
const EASE_WEAVE: [number, number, number, number] = [0.7, 0, 0.3, 1];

// ── Reveal: horizontal clip-path sweep (like a thread being drawn) ──

export const revealVariants: Variants = {
  hidden: {
    clipPath: 'inset(0 100% 0 0)',
    opacity: 0,
  },
  visible: {
    clipPath: 'inset(0 0% 0 0)',
    opacity: 1,
    transition: {
      clipPath: { duration: 1.4, ease: EASE_WEAVE },
      opacity: { duration: 0.5, ease: EASE_OUT },
    },
  },
};

// ── Slide-in from each direction ──

export const slideLeftVariants: Variants = {
  hidden: { opacity: 0, x: -80 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 1.1, ease: EASE_OUT },
  },
};

export const slideRightVariants: Variants = {
  hidden: { opacity: 0, x: 80 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 1.1, ease: EASE_OUT },
  },
};

export const slideUpVariants: Variants = {
  hidden: { opacity: 0, y: 60 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 1.1, ease: EASE_OUT },
  },
};

export const slideDownVariants: Variants = {
  hidden: { opacity: 0, y: -60 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 1.1, ease: EASE_OUT },
  },
};

// ── Image weave-in (clip-path only, no opacity change) ──

export const weaveImageVariants: Variants = {
  hidden: { clipPath: 'inset(0 100% 0 0)' },
  visible: {
    clipPath: 'inset(0 0% 0 0)',
    transition: { duration: 1.4, ease: EASE_WEAVE },
  },
};

// ── Fade in ──

export const fadeInVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.8, ease: EASE_OUT },
  },
};

// ── Stagger container ──

export const staggerContainerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

// ── Standard viewport trigger settings ──

export const viewportOnce = {
  once: true,
  margin: '-40px' as const,
};

// ── Shared transitions ──

export const smoothTransition: Transition = {
  duration: 0.6,
  ease: EASE,
};

export const springTransition: Transition = {
  type: 'spring',
  stiffness: 200,
  damping: 30,
};

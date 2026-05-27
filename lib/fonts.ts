/**
 * lib/fonts.ts — Font configuration for Carpetstory
 *
 * Three fonts loaded via next/font/google for zero-CLS self-hosting:
 * - Fraunces: Display / headline face with variable optical size
 * - Inter Tight: Body copy
 * - Caveat: Founder's signature only
 */

import { Fraunces, Inter_Tight, Caveat } from 'next/font/google';

/**
 * Fraunces — variable display serif
 * Used for all headlines, display text, testimonial quotes, form fields.
 * Variable font: axes include opsz (9–144), wght (300–900), italic + roman.
 * Weight set to 'variable' to enable the opsz axis.
 */
export const fraunces = Fraunces({
  subsets: ['latin'],
  display: 'swap',
  preload: true,
  variable: '--font-fraunces',
  axes: ['opsz'],
  style: ['normal', 'italic'],
});

/**
 * Inter Tight — body sans-serif
 * Used for body copy, labels, navigation, meta text.
 */
export const interTight = Inter_Tight({
  subsets: ['latin'],
  display: 'swap',
  preload: true,
  variable: '--font-inter-tight',
  weight: ['400', '500'],
  style: ['normal'],
});

/**
 * Caveat — handwriting script
 * Used ONLY for the founder's signature ("Aashrit") in the Letter section.
 * Preload disabled since it appears far below the fold.
 */
export const caveat = Caveat({
  subsets: ['latin'],
  display: 'swap',
  preload: false,
  variable: '--font-caveat',
  weight: ['500'],
});

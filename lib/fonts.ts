/**
 * lib/fonts.ts — Font configuration for Carpetstory
 *
 * Self-hosted via next/font/google for zero-CLS, no external requests:
 * - Cormorant Garamond: display serif (headlines, quotes, display text)
 * - Poppins: body sans (copy, nav, labels)
 * - Sacramento: script wordmark ("Carpetstory" logo)
 * - Caveat: founder's handwritten signature only (far below fold)
 *
 * Fraunces + Inter Tight were dropped entirely in the cinematic redesign.
 */

import { Cormorant_Garamond, Poppins, Sacramento, Caveat } from 'next/font/google';

/**
 * Cormorant Garamond — display serif (replaces Fraunces 1:1)
 * High-contrast, elegant. Hero headlines use 400/500; italic 300/400 for
 * editorial display lines. Non-variable, so weights are discrete files.
 */
export const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  display: 'swap',
  preload: true,
  variable: '--font-cormorant',
  weight: ['300', '400', '500', '600'],
  style: ['normal', 'italic'],
});

/**
 * Poppins — body sans (replaces Inter Tight 1:1)
 * 300 for body copy, 400 for nav + labels, 500 for emphasis/buttons.
 */
export const poppins = Poppins({
  subsets: ['latin'],
  display: 'swap',
  preload: true,
  variable: '--font-poppins',
  weight: ['300', '400', '500'],
  style: ['normal'],
});

/**
 * Sacramento — script wordmark
 * Used for the "Carpetstory" logo in the nav + footer. Single weight.
 * Preloaded since the wordmark sits at the top of every page.
 */
export const sacramento = Sacramento({
  subsets: ['latin'],
  display: 'swap',
  preload: true,
  variable: '--font-sacramento',
  weight: ['400'],
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

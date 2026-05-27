/**
 * lib/utils.ts — Utility helpers for Carpetstory
 * cn() merges Tailwind classes with clsx + tailwind-merge for conflict resolution.
 */

import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/** Merge Tailwind class names with deduplication */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format a large number for display.
 * e.g. 2200000 → "2.2M"
 */
export function formatKnotCount(n: number): string {
  if (n >= 1_000_000) {
    const m = n / 1_000_000;
    return m % 1 === 0 ? `${m}M` : `${m.toFixed(1)}M`;
  }
  return n.toLocaleString();
}

/**
 * Format a price for locale-aware display.
 * e.g. 14400, 'en-US', 'USD' → "$14,400"
 */
export function formatPrice(
  amount: number,
  locale: string = 'en-US',
  currency: string = 'USD'
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

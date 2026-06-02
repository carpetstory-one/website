/**
 * lib/analytics.ts — Thin custom-event layer for Carpetstory.
 *
 * The site loads GA4 (window.gtag) and Microsoft Clarity (window.clarity)
 * only after analytics consent (see components/editorial/CookieConsent.tsx).
 * This helper fires the same event to both when present and is a no-op
 * otherwise — safe to call from anywhere, server or client.
 */

type EventParams = Record<string, string | number | boolean | undefined>;

export function trackEvent(name: string, params?: EventParams): void {
  if (typeof window === 'undefined') return;
  const w = window as unknown as {
    gtag?: (...args: unknown[]) => void;
    clarity?: (...args: unknown[]) => void;
  };
  try {
    w.gtag?.('event', name, params ?? {});
  } catch {
    /* ignore */
  }
  try {
    // Clarity custom events take a name only; richer params go to GA4.
    w.clarity?.('event', name);
  } catch {
    /* ignore */
  }
}

export const analytics = {
  // ── Filters (Part 1) ──────────────────────────────────────────────
  filterChipClicked: (collectionSlug: string, action: 'add' | 'remove') =>
    trackEvent('filter_chip_clicked', {
      collection_slug: collectionSlug,
      action,
    }),

  filterCleared: (previousFilterCount: number) =>
    trackEvent('filter_cleared', {
      previous_filter_count: previousFilterCount,
    }),

  // ── Shortlist (Part 2) ────────────────────────────────────────────
  shortlistAdded: (collectionSlug: string, rugSlug: string) =>
    trackEvent('shortlist_added', {
      collection_slug: collectionSlug,
      rug_slug: rugSlug,
    }),

  shortlistRemoved: (collectionSlug: string, rugSlug: string) =>
    trackEvent('shortlist_removed', {
      collection_slug: collectionSlug,
      rug_slug: rugSlug,
    }),

  shortlistDrawerOpened: () => trackEvent('shortlist_drawer_opened'),

  shortlistShareLinkCopied: (itemCount: number) =>
    trackEvent('shortlist_share_link_copied', { item_count: itemCount }),

  shortlistInquiryInitiated: (itemCount: number) =>
    trackEvent('shortlist_inquiry_initiated', { item_count: itemCount }),

  sharedShortlistReceived: (itemCount: number) =>
    trackEvent('shared_shortlist_received', { item_count: itemCount }),

  // ── Estimate tool (Step 3) ────────────────────────────────────────
  estimateToolOpened: (source: 'rugs' | 'collection' | 'piece') =>
    trackEvent('estimate_tool_opened', { source }),

  estimateCalculated: (p: {
    construction: string;
    material: string;
    size_sqft: number;
    low: number;
    high: number;
  }) => trackEvent('estimate_calculated', p),

  estimateInquiryInitiated: (rangeLow: number, rangeHigh: number) =>
    trackEvent('estimate_inquiry_initiated', {
      range_low: rangeLow,
      range_high: rangeHigh,
    }),
};

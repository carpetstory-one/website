/**
 * lib/shortlist.ts — Pure data layer for the public Shortlist feature.
 *
 * A shortlist is an ordered list of { collectionSlug, rugSlug } pairs. The URL
 * (?shortlist=persian.rug-01,modern.rug-04) is the shareable source of truth;
 * localStorage mirrors it for session continuity. Everything that enters the
 * app — whether from a shared URL or stale localStorage — is validated against
 * the real collections data here, so broken links and tampering can't leak
 * non-existent rugs into the UI.
 */

import { type Collection, type Rug } from '@/lib/collections';

export const SHORTLIST_STORAGE_KEY = 'carpetstory_shortlist';
export const SHORTLIST_PARAM = 'shortlist';
/** Generous ceiling that keeps share URLs well within browser length limits.
 *  Realistic share links are 3–10 pieces. */
export const SHORTLIST_LIMIT = 50;

export type ShortlistItem = { collectionSlug: string; rugSlug: string };

export function itemKey(item: ShortlistItem): string {
  return `${item.collectionSlug}.${item.rugSlug}`;
}

export function serializeShortlist(items: ShortlistItem[]): string {
  return items.map(itemKey).join(',');
}

/** Keep only valid, unique, in-data pairs, capped at the limit. */
function sanitize(pairs: ShortlistItem[]): ShortlistItem[] {
  const seen = new Set<string>();
  const out: ShortlistItem[] = [];
  for (const pair of pairs) {
    const collectionSlug = pair?.collectionSlug?.toLowerCase?.();
    const rugSlug = pair?.rugSlug?.toLowerCase?.();
    if (!collectionSlug || !rugSlug) continue;
    const key = `${collectionSlug}.${rugSlug}`;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push({ collectionSlug, rugSlug });
    if (out.length >= SHORTLIST_LIMIT) break;
  }
  return out;
}

/** Parse the ?shortlist= param: dotted pairs separated by commas. */
export function parseShortlistParam(
  raw: string | null | undefined
): ShortlistItem[] {
  if (!raw) return [];
  const pairs: ShortlistItem[] = [];
  for (const token of raw.split(',')) {
    const trimmed = token.trim();
    const dot = trimmed.indexOf('.');
    if (dot <= 0 || dot >= trimmed.length - 1) continue;
    pairs.push({
      collectionSlug: trimmed.slice(0, dot),
      rugSlug: trimmed.slice(dot + 1),
    });
  }
  return sanitize(pairs);
}

export function readStoredShortlist(): ShortlistItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(SHORTLIST_STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return sanitize(parsed as ShortlistItem[]);
  } catch {
    return [];
  }
}

export function writeStoredShortlist(items: ShortlistItem[]): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(SHORTLIST_STORAGE_KEY, JSON.stringify(items));
  } catch {
    /* storage full/disabled — URL remains the source of truth */
  }
}

export type ResolvedShortlistItem = { collection: Collection; rug: Rug };

/** Minimal catalogue shape the shortlist drawer needs. The root layout passes
 *  this slim form so the full collection data isn't serialized into the
 *  payload of every page. */
export type ShortlistRugSummary = { slug: string; name: string; image: string };
export type ShortlistCollectionSummary = {
  slug: string;
  name: string;
  rugs: ShortlistRugSummary[];
};

/** Resolve slug pairs into data for rendering. Order preserved. Generic so it
 *  works with both full `Collection[]` data and the slim drawer catalogue. */
export function resolveShortlist<
  C extends { slug: string; rugs: Array<{ slug: string }> },
>(
  items: ShortlistItem[],
  collectionsList: C[]
): Array<{ collection: C; rug: C['rugs'][number] }> {
  const out: Array<{ collection: C; rug: C['rugs'][number] }> = [];
  for (const item of items) {
    const col = collectionsList.find((c) => c.slug === item.collectionSlug);
    if (!col) continue;
    const rug = col.rugs.find((r) => r.slug === item.rugSlug);
    if (rug) out.push({ collection: col, rug });
  }
  return out;
}

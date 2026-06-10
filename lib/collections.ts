/**
 * lib/collections.ts — Type definitions for Carpetstory collections.
 *
 * All collection data is now fetched dynamically from Sanity Studio
 * via lib/sanity.ts → getSanityCollections().
 *
 * This file only exports types and empty stubs that prevent import breakage
 * in any modules that still reference the old static data.
 */

export type Rug = {
  slug: string;
  name: string;
  description?: string;
  price?: string;
  priceUSD?: number;
  image: string;
  materials?: string;
  dimensions?: string;
  knotDensity?: string;
  weaveTime?: string;
  /** Optional manual colour tags for the /rugs colour filter. When absent,
   *  lib/rugs.ts derives colours from the description. See COLOR_OPTIONS. */
  colors?: string[];
};

export type Collection = {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  heroImage: string;
  featured: boolean;
  /** Optional per-collection meta shown on the detail page */
  meta?: {
    origin?: string;
    materials?: string;
    knotDensity?: string;
    leadTime?: string;
  };
  rugs: Rug[];
};

// ─────────────────────────────────────────────────────────────────────────────
// EMPTY STUBS — All real data comes from Sanity now.
// These exports remain so any leftover imports don't break the build.
// ─────────────────────────────────────────────────────────────────────────────

export const collections: Collection[] = [];

export function getCollectionBySlug(slug: string): Collection | undefined {
  return collections.find((c) => c.slug === slug);
}

export function getRugBySlug(
  collectionSlug: string,
  rugSlug: string
): { collection: Collection; rug: Rug } | undefined {
  const collection = getCollectionBySlug(collectionSlug);
  if (!collection) return undefined;
  const rug = collection.rugs.find((r) => r.slug === rugSlug);
  if (!rug) return undefined;
  return { collection, rug };
}

export const featuredCollections = collections.filter((c) => c.featured);

import { createClient } from '@sanity/client';
import { createImageUrlBuilder } from '@sanity/image-url';
import { cache } from 'react';
import { unstable_cache } from 'next/cache';
import type { Collection } from './collections';
import type { ShortlistCollectionSummary } from './shortlist';
import {
  SANITY_PROJECT_ID,
  SANITY_DATASET,
  urlForImageSrc,
  sanityImageUrl,
} from './sanity-image';

export const sanityClient = createClient({
  projectId: SANITY_PROJECT_ID,
  dataset: SANITY_DATASET,
  apiVersion: '2026-05-15',
  useCdn: true, // Use Sanity API CDN for cached, ultra-fast responses
});

const builder = createImageUrlBuilder(sanityClient);

export function urlFor(source: any) {
  if (!source) return { url: () => '' };
  return builder.image(source);
}

/**
 * Explicit-width transform URL for non-<Image> contexts (og:image, JSON-LD).
 * Width is required: <Image> consumers should instead receive the bare URL
 * from mapCollections and let the Sanity loader pick width per breakpoint.
 */
export function urlForOptimized(source: any, width: number) {
  return sanityImageUrl(source, width);
}

// ─────────────────────────────────────────────────────────────────────────────
// TODO(perf-debug): remove once the Next Data Cache is confirmed to persist on
// Netlify. This logs once per *actual* Sanity fetch — i.e. per data-cache MISS.
// In the Netlify function logs ("Next.js Server Handler"):
//   • a [sanity-cache] line at most ~every 5 min per key → cache persists ✓
//   • a [sanity-cache] line on every request             → cache broken ✗
// ─────────────────────────────────────────────────────────────────────────────
function logSanityFetch(key: string) {
  console.log(
    `[sanity-cache] ${new Date().toISOString()} data-cache MISS — running Sanity fetch for "${key}"`
  );
}

export const getSanityCollections = cache(
  unstable_cache(
    async (): Promise<Collection[]> => {
      logSanityFetch('sanity-collections-all');
      const query = `*[_type == "collection"] {
        "slug": slug.current,
        "name": title,
        tagline,
        description,
        heroImage,
        featured,
        meta {
          origin,
          materials,
          knotDensity,
          leadTime
        },
        "rugs": rugs[]-> {
          "slug": slug.current,
          "name": title,
          description,
          price,
          priceUSD,
          image,
          materials,
          dimensions,
          knotDensity,
          weaveTime,
          colors
        }
      }`;
      
      const data = await sanityClient.fetch(query);
      return mapCollections(data);
    },
    ['sanity-collections-all'],
    { revalidate: 300, tags: ['collections'] }
  )
);

/**
 * Lean projection for the /rugs listing. Returns only the fields the flat rug
 * cards render plus the few the facet derivation needs (description → colours,
 * dimensions → size bucket, collection materials → material, slug → make).
 * No hero images, taglines, price labels, knot density or weave time — keeping
 * the payload small. Cached in Next's data cache (revalidated every 5 min); the
 * static /rugs page serializes this once per revalidation and all filtering/
 * paging then happens in the browser.
 */
export const getRugCatalogue = cache(
  unstable_cache(
    async (): Promise<Collection[]> => {
      logSanityFetch('sanity-collections-catalogue');
      const query = `*[_type == "collection"] {
        "slug": slug.current,
        "name": title,
        meta { materials },
        "rugs": rugs[]-> {
          "slug": slug.current,
          "name": title,
          description,
          priceUSD,
          image,
          dimensions,
          colors
        }
      }`;

      const data = await sanityClient.fetch(query);
      return mapCollections(data);
    },
    ['sanity-collections-catalogue'],
    { revalidate: 300, tags: ['collections'] }
  )
);

/**
 * Minimal projection for the shortlist drawer in the root layout: just the
 * slugs/names needed to resolve saved pairs, plus each rug's image for the
 * 60px thumbnail. The layout previously pulled the full heavy collection
 * payload (descriptions, prices, dimensions…) into every page render only to
 * map it down to exactly this shape.
 */
export const getShortlistCatalogue = cache(
  unstable_cache(
    async (): Promise<ShortlistCollectionSummary[]> => {
      logSanityFetch('sanity-shortlist-catalogue');
      const query = `*[_type == "collection"] {
        "slug": slug.current,
        "name": title,
        "rugs": rugs[]-> {
          "slug": slug.current,
          "name": title,
          image
        }
      }`;

      type Row = {
        slug?: string;
        name?: string;
        rugs?: Array<{ slug?: string; name?: string; image?: unknown }>;
      };
      const data: Row[] | null = await sanityClient.fetch(query);
      return (data || []).map((c) => ({
        slug: c.slug || '',
        name: c.name || '',
        rugs: (c.rugs || []).map((r) => ({
          slug: r.slug || '',
          name: r.name || '',
          image: urlForImageSrc(r.image),
        })),
      }));
    },
    ['sanity-shortlist-catalogue'],
    { revalidate: 300, tags: ['collections'] }
  )
);

export type ArticleImagePair = {
  heroImage: string;
  ogImage: string;
};

export const getArticleImages = cache(
  unstable_cache(
    async (translationKey: string): Promise<ArticleImagePair | null> => {
      logSanityFetch(`sanity-articleImages-${translationKey}`);
      const query = `*[_type == "articleImages" && translationKey == $key][0]{ heroImage, ogImage }`;
      const data = await sanityClient.fetch(query, { key: translationKey });
      if (!data) return null;
      return {
        heroImage: urlForImageSrc(data.heroImage),
        ogImage: urlForImageSrc(data.ogImage),
      };
    },
    ['sanity-articleImages'],
    { revalidate: 300, tags: ['articleImages'] }
  )
);

export const getAllArticleImages = cache(
  unstable_cache(
    async (translationKeys: string[]): Promise<Record<string, ArticleImagePair>> => {
      logSanityFetch(`sanity-articleImages-batch`);
      const query = `*[_type == "articleImages" && translationKey in $keys]{ translationKey, heroImage, ogImage }`;
      const data = await sanityClient.fetch(query, { keys: translationKeys });
      
      const result: Record<string, ArticleImagePair> = {};
      for (const doc of data || []) {
        if (doc.translationKey) {
          result[doc.translationKey] = {
            heroImage: urlForImageSrc(doc.heroImage),
            ogImage: urlForImageSrc(doc.ogImage),
          };
        }
      }
      return result;
    },
    ['sanity-articleImages-batch-v3'],
    { revalidate: 300, tags: ['articleImages'] }
  )
);

function mapCollections(data: any): Collection[] {
  return (data || []).map((c: any) => ({
    slug: c.slug || '',
    name: c.name || '',
    tagline: c.tagline || '',
    description: c.description || '',
    // Bare CDN URLs (no baked-in width) — the SanityImage loader appends
    // per-breakpoint width/quality/format params at render time.
    heroImage: urlForImageSrc(c.heroImage),
    featured: !!c.featured,
    meta: {
      origin: c.meta?.origin || '',
      materials: c.meta?.materials || '',
      knotDensity: c.meta?.knotDensity || '',
      leadTime: c.meta?.leadTime || '',
    },
    rugs: (c.rugs || []).map((r: any) => ({
      slug: r.slug || '',
      name: r.name || '',
      description: r.description || '',
      price: r.price || '',
      priceUSD: r.priceUSD,
      image: urlForImageSrc(r.image),
      materials: r.materials || '',
      dimensions: r.dimensions || '',
      knotDensity: r.knotDensity || '',
      weaveTime: r.weaveTime || '',
      colors: r.colors || [],
    })),
  }));
}

import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';
import type { Collection } from './collections';

export const sanityClient = createClient({
  projectId: 'f9neojf8',
  dataset: 'production',
  apiVersion: '2026-05-15',
  useCdn: true, // Use Sanity API CDN for cached, ultra-fast responses
});

const builder = imageUrlBuilder(sanityClient);

export function urlFor(source: any) {
  if (!source) return { url: () => '' };
  return builder.image(source);
}

export async function getSanityCollections(): Promise<Collection[]> {
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
  
  const data = await sanityClient.fetch(
    query,
    {},
    { next: { revalidate: 300 } } // Revalidate cache every 5 minutes (ISR)
  );
  return mapCollections(data);
}

/**
 * Lean projection for the /rugs listing. Returns only the fields the flat rug
 * cards render plus the few the facet derivation needs (description → colours,
 * dimensions → size bucket, collection materials → material, slug → make).
 * No hero images, taglines, knot density or weave time — keeping the payload
 * small. Cached in Next's data cache (revalidated every 5 min) so paging and
 * filtering reuse one fetch instead of re-hitting Sanity on every navigation.
 */
export async function getRugCatalogue(): Promise<Collection[]> {
  const query = `*[_type == "collection"] {
    "slug": slug.current,
    "name": title,
    meta { materials },
    "rugs": rugs[]-> {
      "slug": slug.current,
      "name": title,
      description,
      price,
      priceUSD,
      image,
      dimensions,
      colors
    }
  }`;

  const data = await sanityClient.fetch(
    query,
    {},
    { next: { revalidate: 300 } }
  );
  return mapCollections(data);
}

function mapCollections(data: any): Collection[] {
  return (data || []).map((c: any) => ({
    slug: c.slug || '',
    name: c.name || '',
    tagline: c.tagline || '',
    description: c.description || '',
    heroImage: c.heroImage ? urlFor(c.heroImage).url() : '',
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
      image: r.image ? urlFor(r.image).url() : '',
      materials: r.materials || '',
      dimensions: r.dimensions || '',
      knotDensity: r.knotDensity || '',
      weaveTime: r.weaveTime || '',
      colors: r.colors || [],
    })),
  }));
}

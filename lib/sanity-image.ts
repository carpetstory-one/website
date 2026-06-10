/**
 * lib/sanity-image.ts — Sanity CDN image URL helpers + next/image loader.
 *
 * Client-safe (no @sanity/client / next/cache imports): used by both the
 * server-side query mappers in lib/sanity.ts and the SanityImage client
 * component.
 *
 * Sanity's CDN already resizes, re-encodes (auto=format → AVIF/WebP) and
 * caches images. Routing those URLs through the default next/image loader
 * makes Netlify re-optimize them at request time. The loader below builds
 * the transform URL directly on cdn.sanity.io, with the width next/image
 * requests per breakpoint, so the browser's srcset bypasses /_next/image
 * entirely for Sanity sources.
 */

import { createImageUrlBuilder } from '@sanity/image-url';
import type { ImageLoaderProps } from 'next/image';

export const SANITY_PROJECT_ID = 'f9neojf8';
export const SANITY_DATASET = 'production';

const builder = createImageUrlBuilder({
  projectId: SANITY_PROJECT_ID,
  dataset: SANITY_DATASET,
});

export function isSanityImageUrl(src: string): boolean {
  return src.startsWith('https://cdn.sanity.io/');
}

/**
 * Bare CDN URL (no transform params) for a Sanity image source (ref, asset or
 * existing URL). This is the canonical form stored in mapped collection data
 * and passed to <Image src>, so the loader can append per-breakpoint params
 * without clashing with baked-in ones.
 */
export function urlForImageSrc(source: unknown): string {
  if (!source) return '';
  return builder.image(source as Parameters<typeof builder.image>[0]).url();
}

/**
 * Explicit-width transform URL for contexts outside <Image> (og:image,
 * JSON-LD product images, the rug lightbox).
 */
export function sanityImageUrl(
  source: unknown,
  width: number,
  quality = 75
): string {
  if (!source) return '';
  return builder
    .image(source as Parameters<typeof builder.image>[0])
    .width(width)
    .quality(quality)
    .auto('format')
    .fit('max')
    .url();
}

/**
 * next/image loader for Sanity images. Builds a cdn.sanity.io transform URL
 * from the requested width/quality; any non-Sanity src (Unsplash, Pinterest)
 * is returned unchanged so those keep their existing behavior.
 */
export function sanityImageLoader({
  src,
  width,
  quality,
}: ImageLoaderProps): string {
  if (!isSanityImageUrl(src)) return src;
  // Strip any existing query string so the asset id parses cleanly.
  return sanityImageUrl(src.split('?')[0], width, quality ?? 75);
}

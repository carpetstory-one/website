'use client';

import Image, { type ImageProps } from 'next/image';
import { isSanityImageUrl, sanityImageLoader } from '@/lib/sanity-image';

/**
 * Drop-in next/image replacement for Sanity-sourced images. Sanity CDN URLs
 * get the custom loader, so the rendered srcset points straight at
 * cdn.sanity.io (already optimized there) instead of the Netlify /_next/image
 * optimizer. Any other src — Unsplash/Pinterest fallbacks or empty data —
 * renders through the default loader untouched.
 *
 * Being a client component, it can also wrap images inside Server Components
 * (a raw `loader` prop can't cross the server → client boundary).
 */
export function SanityImage(props: ImageProps) {
  /* eslint-disable jsx-a11y/alt-text -- `alt` is required by ImageProps and
     always arrives through the spread; the rule can't see through it. */
  if (typeof props.src === 'string' && isSanityImageUrl(props.src)) {
    return <Image {...props} loader={sanityImageLoader} />;
  }
  return <Image {...props} />;
  /* eslint-enable jsx-a11y/alt-text */
}

/**
 * next.config.mjs — Next.js configuration for Carpetstory
 *
 * - Image optimization with Unsplash remote patterns
 * - AVIF/WebP format support via Sharp
 * - MDX support (Phase 7 — deferred until Turbopack compat improves)
 * - Bundle analyzer toggle
 */

import createNextIntlPlugin from 'next-intl/plugin';
import createMDX from '@next/mdx';

const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

const withMDX = createMDX({
  // Add markdown plugins here, as desired
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ['ts', 'tsx', 'md', 'mdx'],

  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },

  experimental: {
    optimizePackageImports: ['lucide-react', 'framer-motion'],
  },
};

export default withNextIntl(withMDX(nextConfig));

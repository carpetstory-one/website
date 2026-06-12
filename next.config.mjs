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
    minimumCacheTTL: 31536000,
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'plus.unsplash.com' },
      { protocol: 'https', hostname: 'i.pinimg.com' },
      { protocol: 'https', hostname: 'cdn.sanity.io' },
    ],
  },

  experimental: {
    optimizePackageImports: ['lucide-react', 'motion'],
  },

  async redirects() {
    // 301 redirects from retired piece slugs → /collection (safest fallback)
    const retiredSlugs = [
      'khwab',
      'saanjh',
      'mehfil',
      'shubh',
      'naqsh',
      'aaraam',
    ];
    return retiredSlugs.flatMap((slug) => [
      {
        source: `/collection/${slug}`,
        destination: '/collection',
        permanent: true,
      },
      {
        source: `/:locale/collection/${slug}`,
        destination: '/:locale/collection',
        permanent: true,
      },
      {
        source: `/:locale/wissen/:slug`,
        destination: '/:locale/journal/:slug',
        permanent: true,
      },
    ]);
  },

  async headers() {
    return [
      {
        source: '/videos/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
};

export default withNextIntl(withMDX(nextConfig));

/**
 * app/[locale]/layout.tsx — Root layout for Carpetstory with i18n
 *
 * Responsibilities:
 * - Loads all three fonts (Fraunces, Inter Tight, Caveat) via next/font
 * - Applies font CSS variables to the <html> element with correct lang
 * - Sets base metadata for SEO
 * - Provides semantic HTML structure
 * - Includes a skip-to-content link for accessibility
 * - Wraps in NextIntlClientProvider for translations
 */

import type { Metadata, Viewport } from 'next';
import { fraunces, interTight, caveat } from '@/lib/fonts';
import '../globals.css';
import { GlobalAnimations } from '@/components/editorial/GlobalAnimations';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { Toaster } from '@/components/ui/sonner';
import { GeoBanner } from '@/components/editorial/GeoBanner';
import { localBusinessSchema, organizationSchema, websiteSchema } from '@/lib/seo';

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || 'https://carpetstory.com';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  viewportFit: 'cover',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#F5F1EA' },
    { media: '(prefers-color-scheme: dark)', color: '#1A1817' },
  ],
};

export const metadata: Metadata = {
  title: {
    default: 'Carpetstory — Handmade Rugs from Jaipur, Rajasthan',
    template: '%s | Carpetstory',
  },
  description:
    'Handmade rugs from Jaipur, Rajasthan. One-of-one hand-knotted carpets woven by single artisans over six to ten months. Shipped worldwide.',
  keywords: [
    'handmade rugs',
    'hand-knotted carpets',
    'Jaipur rugs',
    'wool rugs',
    'silk rugs',
    'oriental carpets',
    'persian rugs',
    'designer rugs',
    'bespoke carpets',
    'luxury rugs',
  ],
  authors: [{ name: 'Carpetstory' }],
  creator: 'Carpetstory',
  publisher: 'Carpetstory',
  metadataBase: new URL(SITE_URL),
  openGraph: {
    siteName: 'Carpetstory',
    type: 'website',
    locale: 'en_US',
    alternateLocale: ['fr_FR', 'de_DE'],
    images: [
      {
        url: '/opengraph-image',
        width: 1200,
        height: 630,
        alt: 'Carpetstory — Handmade rugs from Jaipur',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Carpetstory — Handmade Rugs from Jaipur',
    description:
      'One-of-one hand-knotted carpets woven by single artisans. Shipped worldwide.',
    images: ['/opengraph-image'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: SITE_URL,
    languages: Object.fromEntries(
      routing.locales.map((l) => [l, `${SITE_URL}/${l}`])
    ),
  },
  verification: process.env.GOOGLE_SITE_VERIFICATION
    ? { google: process.env.GOOGLE_SITE_VERIFICATION }
    : undefined,
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/manifest.webmanifest',
  formatDetection: {
    telephone: false,
  },
};

export default async function RootLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // Validate that the incoming `locale` parameter is valid
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();

  return (
    <html
      lang={locale}
      className={`${fraunces.variable} ${interTight.variable} ${caveat.variable}`}
    >
      <body>
        <NextIntlClientProvider messages={messages}>
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{
                __html: JSON.stringify({
                  '@context': 'https://schema.org',
                  '@graph': [
                    organizationSchema,
                    websiteSchema,
                    localBusinessSchema,
                  ],
                }),
              }}
            />

            <GlobalAnimations />
            <GeoBanner locale={locale} />
            <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
              {children}
            </main>
            <div style={{ position: 'absolute', pointerEvents: 'none' }}>
              <Toaster />
            </div>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

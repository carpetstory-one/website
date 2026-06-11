/**
 * app/[locale]/layout.tsx — Root layout for Carpetstory with i18n
 *
 * Responsibilities:
 * - Loads the four fonts (Cormorant Garamond, Poppins, Sacramento, Caveat) via next/font
 * - Applies font CSS variables to the <html> element with correct lang
 * - Sets base metadata for SEO
 * - Provides semantic HTML structure
 * - Includes a skip-to-content link for accessibility
 * - Wraps in NextIntlClientProvider for translations
 */

import type { Metadata, Viewport } from 'next';
import { cormorant, poppins, sacramento, signature } from '@/lib/fonts';
import '../globals.css';
import { GlobalAnimations } from '@/components/editorial/GlobalAnimations';
import { NextIntlClientProvider } from 'next-intl';
import { MotionConfig } from 'motion/react';
import { ShortlistProvider } from '@/components/shortlist/ShortlistProvider';
import { ShortlistUI } from '@/components/shortlist/ShortlistUI';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { Toaster } from '@/components/ui/sonner';
import { GeoBanner } from '@/components/editorial/GeoBanner';
import { CookieConsent } from '@/components/editorial/CookieConsent';
import { LeadCapturePopup } from '@/components/editorial/LeadCapturePopup';
import {
  localBusinessSchema,
  organizationSchema,
  websiteSchema,
} from '@/lib/seo';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://carpetstory.one';

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
    default: 'Carpetstory — Handmade Persian-Knot Rugs from Jaipur',
    template: '%s | Carpetstory',
  },
  description:
    'Handmade wool and silk rugs from a single Jaipur atelier. Eight to ten months on the loom. Hand-tied Persian knots, natural dyes, and a four-generation family of weavers.',
  keywords: [
    'handmade persian rug',
    'jaipur rug',
    'hand-knotted wool rug',
    'luxury indian rug',
    'custom carpet maker',
    'natural dye rug',
    'bespoke carpets',
    'silk rugs',
    'persian carpets',
    'persian carpets for sale',
    'antique persian carpets',
    'indian carpets',
    'buy carpet online',
    'where to buy carpet',
    'best place to buy carpet',
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

import { setRequestLocale } from 'next-intl/server';

// Site-wide ISR: every static route re-renders at most every 5 minutes,
// matching the Sanity data-cache window in lib/sanity.ts. Without this the
// pages would be frozen at build time until the next deploy.
export const revalidate = 300;

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

import { getShortlistCatalogue } from '@/lib/sanity';
import Script from 'next/script';

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // Validate that the incoming `locale` parameter is valid
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  // Required for static rendering in Next.js App Router (next-intl)
  setRequestLocale(locale);

  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();

  // The shortlist drawer only needs slugs, names and thumbnails, so the
  // layout fetches the dedicated lightweight projection instead of dragging
  // the full collection payload into every page render.
  const shortlistCatalogue = await getShortlistCatalogue();

  return (
    <html
      lang={locale}
      className={`${cormorant.variable} ${poppins.variable} ${sacramento.variable} ${signature.variable}`}
    >
      <head>
        <link
          rel="preconnect"
          href="https://cdn.sanity.io"
          crossOrigin="anonymous"
        />
        <link rel="dns-prefetch" href="https://cdn.sanity.io" />
        <link
          rel="preconnect"
          href="https://images.unsplash.com"
          crossOrigin="anonymous"
        />
        <link rel="dns-prefetch" href="https://images.unsplash.com" />
      </head>
      <body>
        {/* Google tag (gtag.js) */}
        {process.env.NEXT_PUBLIC_GA_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}');
              `}
            </Script>
          </>
        )}

        {/* Microsoft Clarity */}
        {process.env.NEXT_PUBLIC_CLARITY_ID && (
          <Script id="microsoft-clarity" strategy="afterInteractive">
            {`
              (function(c,l,a,r,i,t,y){
                  c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                  t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                  y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
              })(window, document, "clarity", "script", "${process.env.NEXT_PUBLIC_CLARITY_ID}");
            `}
          </Script>
        )}

        <NextIntlClientProvider messages={messages}>
          <MotionConfig reducedMotion="user">
            <ShortlistProvider>
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
              <CookieConsent />
              <LeadCapturePopup />
              <main
                style={{ flex: 1, display: 'flex', flexDirection: 'column' }}
              >
                {children}
              </main>
              <ShortlistUI collections={shortlistCatalogue} />
              <div style={{ position: 'absolute', pointerEvents: 'none' }}>
                <Toaster />
              </div>
            </ShortlistProvider>
          </MotionConfig>
        </NextIntlClientProvider>

        {process.env.NEXT_PUBLIC_HUBSPOT_PORTAL_ID && (
          <Script
            src={`https://js.hs-scripts.com/${process.env.NEXT_PUBLIC_HUBSPOT_PORTAL_ID}.js`}
            strategy="afterInteractive"
            id="hs-script-loader"
          />
        )}
      </body>
    </html>
  );
}

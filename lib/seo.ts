/**
 * lib/seo.ts — SEO metadata helpers for Carpetstory.
 * App Router Metadata API helpers + schema.org JSON-LD builders.
 */

import type { Metadata } from 'next';
import { routing } from '@/i18n/routing';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://carpetstory.com';
const SITE_NAME = 'Carpetstory';

const OG_LOCALE: Record<string, string> = {
  en: 'en_US',
  fr: 'fr_FR',
  de: 'de_DE',
};

interface PageMetadataOptions {
  title: string;
  description: string;
  path?: string;
  locale?: string;
  ogImage?: string;
  type?: 'website' | 'article';
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  keywords?: string[];
  noIndex?: boolean;
}

export function generatePageMetadata({
  title,
  description,
  path = '',
  locale,
  ogImage,
  type = 'website',
  publishedTime,
  modifiedTime,
  author,
  keywords,
  noIndex,
}: PageMetadataOptions): Metadata {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  const canonicalLocale = locale || routing.defaultLocale;
  const canonical = `${SITE_URL}/${canonicalLocale}${cleanPath === '/' ? '' : cleanPath}`;
  const truncatedTitle = title.length > 60 ? title.slice(0, 57) + '…' : title;
  const truncatedDescription =
    description.length > 155 ? description.slice(0, 152) + '…' : description;

  const languages = Object.fromEntries(
    routing.locales.map((l: any) => [
      l,
      `${SITE_URL}/${l}${cleanPath === '/' ? '' : cleanPath}`,
    ])
  );
  languages['x-default'] =
    `${SITE_URL}/${routing.defaultLocale}${cleanPath === '/' ? '' : cleanPath}`;

  return {
    title: truncatedTitle,
    description: truncatedDescription,
    ...(keywords && { keywords }),
    alternates: {
      canonical,
      languages,
    },
    openGraph: {
      title: truncatedTitle,
      description: truncatedDescription,
      url: canonical,
      siteName: SITE_NAME,
      type,
      locale: OG_LOCALE[canonicalLocale] || OG_LOCALE.en,
      alternateLocale: routing.locales
        .filter((l: any) => l !== canonicalLocale)
        .map((l: any) => OG_LOCALE[l] || l),
      ...(ogImage && {
        images: [
          {
            url: ogImage,
            width: 1200,
            height: 630,
            alt: truncatedTitle,
          },
        ],
      }),
      ...(publishedTime && { publishedTime }),
      ...(modifiedTime && { modifiedTime }),
      ...(author && { authors: [author] }),
    },
    twitter: {
      card: 'summary_large_image',
      title: truncatedTitle,
      description: truncatedDescription,
      ...(ogImage && { images: [ogImage] }),
    },
    ...(noIndex && { robots: { index: false, follow: false } }),
  };
}

export function jsonLd(data: Record<string, unknown>): string {
  return JSON.stringify({
    '@context': 'https://schema.org',
    ...data,
  });
}

export const organizationSchema = {
  '@type': 'Organization',
  '@id': `${SITE_URL}/#organization`,
  name: SITE_NAME,
  url: SITE_URL,
  logo: {
    '@type': 'ImageObject',
    url: `${SITE_URL}/images/logo.png`,
  },
  description:
    'Handmade rugs from Jaipur, Rajasthan. One-of-one hand-knotted carpets woven by single artisans.',
  foundingDate: '2014',
  founder: {
    '@type': 'Person',
    name: 'Aashrit Garg',
  },
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Jaipur',
    addressRegion: 'Rajasthan',
    addressCountry: 'IN',
  },
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'customer service',
    availableLanguage: ['English', 'French', 'German'],
  },
  sameAs: ['https://www.instagram.com/carpetstory'],
};

export const websiteSchema = {
  '@type': 'WebSite',
  '@id': `${SITE_URL}/#website`,
  name: SITE_NAME,
  url: SITE_URL,
  publisher: { '@id': `${SITE_URL}/#organization` },
  inLanguage: routing.locales.map((l:any) => OG_LOCALE[l] || l),
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: `${SITE_URL}/collection?q={search_term_string}`,
    },
    'query-input': 'required name=search_term_string',
  },
};

/**
 * LocalBusiness schema for the Jaipur atelier.
 * Fields marked TODO should be filled by the business.
 */
export const localBusinessSchema = {
  '@type': 'LocalBusiness',
  '@id': `${SITE_URL}/#localbusiness`,
  name: SITE_NAME,
  url: SITE_URL,
  image: `${SITE_URL}/opengraph-image`,
  description:
    'Atelier producing hand-knotted rugs in Jaipur, Rajasthan. By appointment.',
  priceRange: '$$$',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Jaipur',
    addressRegion: 'Rajasthan',
    addressCountry: 'IN',
    // TODO: streetAddress, postalCode — fill when atelier address is public
  },
  // TODO: geo coordinates
  // geo: { '@type': 'GeoCoordinates', latitude: 26.9124, longitude: 75.7873 },
  areaServed: {
    '@type': 'Place',
    name: 'Worldwide',
  },
  availableLanguage: ['English', 'French', 'German'],
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      opens: '10:00',
      closes: '18:00',
      validFrom: '2014-01-01',
    },
  ],
  sameAs: ['https://www.instagram.com/carpetstory'],
};

export function breadcrumbSchema(items: Array<{ name: string; url: string }>) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: item.url.startsWith('http') ? item.url : `${SITE_URL}${item.url}`,
    })),
  };
}

export function faqSchema(items: Array<{ question: string; answer: string }>) {
  return {
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };
}

export function productSchema(p: {
  name: string;
  description: string;
  image: string;
  price?: number;
  priceCurrency?: string;
  url: string;
  sku?: string;
}) {
  return {
    '@type': 'Product',
    name: p.name,
    description: p.description,
    image: p.image.startsWith('http') ? p.image : `${SITE_URL}${p.image}`,
    url: p.url.startsWith('http') ? p.url : `${SITE_URL}${p.url}`,
    ...(p.sku && { sku: p.sku }),
    brand: {
      '@type': 'Brand',
      name: SITE_NAME,
    },
    ...(p.price !== undefined && {
      offers: {
        '@type': 'Offer',
        price: p.price,
        priceCurrency: p.priceCurrency || 'USD',
        availability: 'https://schema.org/MadeToOrder',
        seller: { '@id': `${SITE_URL}/#organization` },
      },
    }),
  };
}

export function articleSchema(a: {
  headline: string;
  description: string;
  image: string;
  datePublished: string;
  dateModified?: string;
  author?: string;
  url: string;
}) {
  return {
    '@type': 'Article',
    headline: a.headline,
    description: a.description,
    image: a.image.startsWith('http') ? a.image : `${SITE_URL}${a.image}`,
    datePublished: a.datePublished,
    dateModified: a.dateModified || a.datePublished,
    author: {
      '@type': 'Person',
      name: a.author || 'Carpetstory',
    },
    publisher: { '@id': `${SITE_URL}/#organization` },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': a.url.startsWith('http') ? a.url : `${SITE_URL}${a.url}`,
    },
  };
}

export { SITE_URL, SITE_NAME };

import Image from 'next/image';
import { Nav } from '@/components/editorial/Nav';
import { Footer } from '@/components/editorial/Footer';
import { getCollectionBySlug, collections } from '@/lib/collections';
import { blurDataURL } from '@/lib/blur';
import { notFound } from 'next/navigation';
import { Reveal } from '@/components/editorial/Reveal';
import { SlideIn } from '@/components/editorial/SlideIn';
import { Link } from '@/i18n/routing';
import { Metadata } from 'next';
import {
  generatePageMetadata,
  breadcrumbSchema,
  jsonLd,
  SITE_URL,
} from '@/lib/seo';
import { setRequestLocale } from 'next-intl/server';
import { CollectionDetailContent } from './CollectionDetailContent';

type Props = {
  params: Promise<{ slug: string; locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, locale } = await params;
  const col = getCollectionBySlug(slug);

  if (!col) return { title: 'Not Found', robots: { index: false, follow: false } };

  return generatePageMetadata({
    title: `${col.name} Collection — Carpetstory`,
    description: col.tagline + ' ' + col.description.slice(0, 100) + '…',
    path: `/collection/${col.slug}`,
    locale,
    ogImage: col.heroImage,
    keywords: [
      col.name,
      `${col.name} rugs`,
      `${col.name} carpets`,
      'hand-knotted rug',
      'Jaipur rug',
      'Carpetstory',
    ],
  });
}

export function generateStaticParams() {
  return collections.map((col) => ({ slug: col.slug }));
}

export default async function CollectionDetailPage({ params }: Props) {
  const { slug, locale } = await params;
  setRequestLocale(locale);

  const col = getCollectionBySlug(slug);

  if (!col) notFound();

  const breadcrumb = breadcrumbSchema([
    { name: 'Home', url: `/${locale}` },
    { name: 'Collections', url: `/${locale}/collection` },
    { name: col.name, url: `/${locale}/collection/${col.slug}` },
  ]);

  const itemList = {
    '@type': 'ItemList',
    name: `${col.name} Collection`,
    itemListOrder: 'https://schema.org/ItemListOrderAscending',
    numberOfItems: col.rugs.length,
    itemListElement: col.rugs.map((r, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: `${SITE_URL}/${locale}/collection/${col.slug}/${r.slug}`,
      name: r.name,
    })),
  };

  // Other collections (for bottom strip)
  const others = collections.filter((c) => c.slug !== col.slug);

  return (
    <div className="relative bg-canvas min-h-screen flex flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd({ '@graph': [breadcrumb, itemList] }) }}
      />

      <Nav />

      {/* Breadcrumb — visible at top */}
      <div
        style={{
          position: 'absolute',
          top: '90px',
          left: 0,
          right: 0,
          zIndex: 20,
          padding: '0 24px',
          display: 'flex',
          gap: '8px',
          alignItems: 'center',
          fontSize: '11px',
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          color: 'rgba(255,255,255,0.7)',
        }}
      >
        <Link href="/" style={{ color: 'inherit', textDecoration: 'none' }}>Home</Link>
        <span>/</span>
        <Link href="/collection" style={{ color: 'inherit', textDecoration: 'none' }}>Collections</Link>
        <span>/</span>
        <span style={{ color: '#fff' }}>{col.name}</span>
      </div>

      {/* Hero — 65vh full-bleed with Ken Burns */}
      <div
        style={{
          position: 'relative',
          height: '65vh',
          minHeight: '480px',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* Ken Burns image */}
        <div
          className="coll-hero-img"
          style={{
            position: 'absolute',
            inset: 0,
            animation: 'collHeroZoom 14s ease-out forwards',
          }}
        >
          <Image
            src={col.heroImage}
            alt={`${col.name} collection`}
            fill
            priority
            fetchPriority="high"
            sizes="100vw"
            placeholder="blur"
            blurDataURL={blurDataURL()}
            style={{ objectFit: 'cover' }}
          />
        </div>
        {/* Overlay */}
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.32)' }} />

        {/* Centered text */}
        <div style={{ position: 'relative', zIndex: 10, textAlign: 'center', padding: '0 24px' }}>
          <span
            style={{
              display: 'block',
              fontSize: '11px',
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.7)',
              marginBottom: '16px',
            }}
          >
            Collection — {col.name.toUpperCase()}
          </span>
          <h1
            style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 300,
              fontSize: 'clamp(52px, 9vw, 110px)',
              lineHeight: 1,
              letterSpacing: '-0.02em',
              color: '#fff',
              marginBottom: '18px',
            }}
          >
            {col.name}
          </h1>
          <p
            style={{
              fontSize: 'clamp(15px, 2vw, 18px)',
              color: 'rgba(255,255,255,0.8)',
              maxWidth: '44ch',
              margin: '0 auto',
              lineHeight: 1.55,
              fontFamily: 'var(--font-body)',
            }}
          >
            {col.tagline}
          </p>
        </div>
      </div>

      <main className="flex-1">
        <CollectionDetailContent col={col} locale={locale} others={others} />
      </main>

      <Footer />

      {/* Ken Burns keyframe */}
      <style>{`
        @keyframes collHeroZoom {
          from { transform: scale(1); }
          to   { transform: scale(1.05); }
        }
      `}</style>
    </div>
  );
}

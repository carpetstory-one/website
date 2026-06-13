import { SanityImage } from '@/components/SanityImage';
import { Nav } from '@/components/editorial/Nav';
import { Footer } from '@/components/editorial/Footer';
import { blurDataURL } from '@/lib/blur';
import { notFound } from 'next/navigation';
import { getSanityCollections } from '@/lib/sanity';
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
import { setRequestLocale, getTranslations } from 'next-intl/server';
import {
  getAllRugs,
  getCollectionOptions,
  filterAndSort,
  parseFiltersFromParams,
  parsePageParam,
  paginate,
  toURLSearchParams,
  priceBounds,
  availableMaterials,
  availableMakes,
  PER_PAGE,
} from '@/lib/rugs';
import { CollectionDetailContent } from './CollectionDetailContent';

// Paginated/filtered variants are dynamic; revalidate the cached data the same
// way the rest of the catalogue does.
export const revalidate = 300;

type SearchParams = Record<string, string | string[] | undefined>;
type Props = {
  params: Promise<{ slug: string; locale: string }>;
  searchParams: Promise<SearchParams>;
};

export async function generateMetadata({
  params,
  searchParams,
}: Props): Promise<Metadata> {
  const { slug, locale } = await params;
  const sp = await searchParams;
  const page = parsePageParam(sp.page);
  const collections = await getSanityCollections();
  const col = collections.find((c) => c.slug === slug);

  if (!col)
    return { title: 'Not Found', robots: { index: false, follow: false } };

  const base = generatePageMetadata({
    title:
      page > 1
        ? `${col.name} Collection — Page ${page} — Carpetstory`
        : `${col.name} Collection — Carpetstory`,
    description: col.tagline + ' ' + col.description.slice(0, 100) + '…',
    path: `/collection/${col.slug}`,
    locale,
    ogImage: col.heroImage,
    keywords: [
      col.name,
      `${col.name} rugs`,
      `${col.name} carpets`,
      `${col.name} carpets for sale`,
      `antique ${col.name} carpets`,
      `buy ${col.name} carpet online`,
      'hand-knotted rug',
      'Jaipur rug',
      'where to buy carpet',
      'Carpetstory',
    ],
  });

  if (page > 1 && base.alternates) {
    base.alternates.canonical = `${SITE_URL}/${locale}/collection/${col.slug}?page=${page}`;
  }
  return base;
}

export async function generateStaticParams() {
  const collections = await getSanityCollections();
  return collections.map((col) => ({ slug: col.slug }));
}

export default async function CollectionDetailPage({
  params,
  searchParams,
}: Props) {
  const { slug, locale } = await params;
  setRequestLocale(locale);
  const sp = await searchParams;

  const collections = await getSanityCollections();
  const tCommon = await getTranslations('Common');
  const col = collections.find((c) => c.slug === slug);

  if (!col) notFound();

  // Other collections (for bottom strip + facet derivation context)
  const others = collections.filter((c) => c.slug !== col.slug);

  // Build this collection's flat rugs, filter + sort from the URL, then slice
  // to the current page — all server-side, so only one page renders.
  const allRugs = getAllRugs(collections);
  const collectionRugs = allRugs.filter((r) => r.collectionSlug === col.slug);
  const filters = parseFiltersFromParams(toURLSearchParams(sp));
  const filtered = filterAndSort(collectionRugs, filters);
  const pageData = paginate(filtered, parsePageParam(sp.page), PER_PAGE);

  // Facets are derived from the whole catalogue so the chip sets stay stable.
  const facets = {
    bounds: priceBounds(allRugs),
    materials: availableMaterials(allRugs),
    makes: availableMakes(allRugs),
    collectionOptions: getCollectionOptions(collections),
  };

  const breadcrumb = breadcrumbSchema([
    { name: tCommon('home'), url: `/${locale}` },
    { name: tCommon('collections'), url: `/${locale}/collection` },
    { name: col.name, url: `/${locale}/collection/${col.slug}` },
  ]);

  const itemList = {
    '@type': 'ItemList',
    name: `${col.name} Collection`,
    itemListOrder: 'https://schema.org/ItemListOrderAscending',
    numberOfItems: pageData.total,
    itemListElement: pageData.items.map((r, i) => ({
      '@type': 'ListItem',
      position: pageData.start + i,
      url: `${SITE_URL}/${locale}${r.href}`,
      name: r.name,
    })),
  };

  return (
    <div className="bg-canvas relative flex min-h-screen flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLd({ '@graph': [breadcrumb, itemList] }),
        }}
      />

      <Nav />

      {/* Breadcrumb — visible at top */}
      {/* <div
        style={{
          position: 'absolute',
          top: '90px',
          left: 0,
          right: 0,
          zIndex: 20,
          padding: '0 var(--gutter)',
          display: 'flex',
          gap: '8px',
          alignItems: 'center',
          fontSize: '11px',
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          color: 'rgba(255,255,255,0.7)',
        }}
      >
        <Link href="/" style={{ color: 'inherit', textDecoration: 'none' }}>
          {tCommon('home')}
        </Link>
        <span>/</span>
        <Link
          href="/collection"
          style={{ color: 'inherit', textDecoration: 'none' }}
        >
          {tCommon('collections')}
        </Link>
        <span>/</span>
        <span style={{ color: '#fff' }}>{col.name}</span>
      </div> */}

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
          {col.heroImage ? (
            <SanityImage
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
          ) : null}
        </div>
        {/* Overlay */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'rgba(0,0,0,0.32)',
          }}
        />

        {/* Centered text */}
        <div
          style={{
            position: 'relative',
            zIndex: 10,
            textAlign: 'center',
            padding: '0 var(--gutter)',
          }}
        >
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

      <main className="flex-1" style={{ backgroundColor: '#ffffff' }}>
        <CollectionDetailContent
          col={col}
          locale={locale}
          others={others}
          pageRugs={pageData.items}
          filters={filters}
          page={pageData.page}
          totalPages={pageData.totalPages}
          matchingTotal={pageData.total}
          facets={facets}
        />
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

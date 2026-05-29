import Image from 'next/image';
import { Nav } from '@/components/editorial/Nav';
import { Footer } from '@/components/editorial/Footer';
import { getCollectionBySlug, getRugBySlug, collections } from '@/lib/collections';
import { blurDataURL } from '@/lib/blur';
import { notFound } from 'next/navigation';
import { Link } from '@/i18n/routing';
import { Metadata } from 'next';
import {
  generatePageMetadata,
  breadcrumbSchema,
  productSchema,
  jsonLd,
  SITE_URL,
} from '@/lib/seo';
import { RugDetailContent } from './RugDetailContent';

type Props = {
  params: Promise<{ slug: string; rugSlug: string; locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, rugSlug, locale } = await params;
  const result = getRugBySlug(slug, rugSlug);

  if (!result) return { title: 'Not Found', robots: { index: false, follow: false } };
  const { collection, rug } = result;

  return generatePageMetadata({
    title: `${rug.name} — ${collection.name} — Carpetstory`,
    description:
      rug.description ||
      `${rug.name} from the Carpetstory ${collection.name} collection. Hand-knotted in Jaipur, Rajasthan.`,
    path: `/collection/${slug}/${rugSlug}`,
    locale,
    ogImage: rug.image,
    keywords: [
      rug.name,
      collection.name,
      `${collection.name} rug`,
      'hand-knotted rug Jaipur',
      'Carpetstory',
    ],
  });
}

export function generateStaticParams() {
  return collections.flatMap((col) =>
    col.rugs.map((rug) => ({ slug: col.slug, rugSlug: rug.slug }))
  );
}

export default async function RugDetailPage({ params }: Props) {
  const { slug, rugSlug, locale } = await params;
  const result = getRugBySlug(slug, rugSlug);

  if (!result) notFound();
  const { collection, rug } = result;

  // Sibling rugs (other 3–4 in the collection)
  const siblings = collection.rugs
    .filter((r) => r.slug !== rug.slug)
    .slice(0, 4);

  const breadcrumb = breadcrumbSchema([
    { name: 'Home', url: `/${locale}` },
    { name: 'Collections', url: `/${locale}/collection` },
    { name: collection.name, url: `/${locale}/collection/${slug}` },
    { name: rug.name, url: `/${locale}/collection/${slug}/${rugSlug}` },
  ]);

  const product = productSchema({
    name: rug.name,
    description:
      rug.description ||
      `${rug.name} from the Carpetstory ${collection.name} collection.`,
    image: rug.image,
    price: rug.priceUSD,
    priceCurrency: 'USD',
    url: `/${locale}/collection/${slug}/${rugSlug}`,
    sku: `${slug}-${rugSlug}`,
  });

  // Pre-fill inquiry message
  const inquiryMessage = encodeURIComponent(
    `I'm interested in ${rug.name} from the ${collection.name} collection.`
  );

  return (
    <div className="relative bg-canvas min-h-screen flex flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd({ '@graph': [breadcrumb, product] }) }}
      />

      <Nav />

      {/* Breadcrumb */}
      <div
        style={{
          padding: '112px 24px 0',
          display: 'flex',
          gap: '8px',
          alignItems: 'center',
          fontSize: '11px',
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          color: 'var(--ink-soft)',
          maxWidth: '1400px',
          margin: '0 auto',
          width: '100%',
        }}
      >
        <Link href="/" style={{ color: 'inherit', textDecoration: 'none' }}>Home</Link>
        <span>/</span>
        <Link href="/collection" style={{ color: 'inherit', textDecoration: 'none' }}>Collections</Link>
        <span>/</span>
        <Link href={`/collection/${slug}`} style={{ color: 'inherit', textDecoration: 'none' }}>{collection.name}</Link>
        <span>/</span>
        <span style={{ color: 'var(--ink)' }}>{rug.name}</span>
      </div>

      <main className="flex-1">
        <RugDetailContent
          rug={rug}
          collection={collection}
          siblings={siblings}
          collectionSlug={slug}
          locale={locale}
          inquiryMessage={inquiryMessage}
        />
      </main>

      <Footer />
    </div>
  );
}

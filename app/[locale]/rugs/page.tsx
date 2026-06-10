import { Metadata } from 'next';
import { Suspense } from 'react';
import { setRequestLocale } from 'next-intl/server';
import { Nav } from '@/components/editorial/Nav';
import { Footer } from '@/components/editorial/Footer';
import {
  generatePageMetadata,
  breadcrumbSchema,
  jsonLd,
  SITE_URL,
} from '@/lib/seo';
import {
  getAllRugs,
  getCollectionOptions,
  priceBounds,
  availableMaterials,
  availableMakes,
  PER_PAGE,
} from '@/lib/rugs';
import { getRugCatalogue } from '@/lib/sanity';
import { RugsContent, RugsStatic } from './RugsContent';

// Fully static + ISR: this route reads no searchParams on the server, so the
// HTML shell is prerendered and CDN-cacheable, revalidating every 5 minutes in
// step with the Sanity data cache. Filtering, sorting and pagination run
// client-side in RugsContent over the field-trimmed catalogue below.
export const revalidate = 300;

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;

  return generatePageMetadata({
    title: 'All Pieces — Carpetstory',
    description: 'Every handmade rug in the Carpetstory workshop.',
    path: '/rugs',
    locale,
    keywords: [
      'all rugs',
      'hand-knotted rugs',
      'Jaipur rugs',
      'rug index',
      'Carpetstory pieces',
      'buy carpet',
      'buy carpet online',
      'where to buy carpet',
      'where can i buy carpet',
      'how to buy carpet',
      'cheapest place to buy carpet',
      'best place to buy carpet',
      'best time to buy carpet',
      'when is the best time to buy carpet',
      'where to buy carpet remnants',
    ],
  });
}

export default async function RugsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const collections = await getRugCatalogue();

  // Strip fields the /rugs UI never renders before the catalogue is
  // serialized to the client: description only feeds the server-side colour
  // derivation inside getAllRugs, and priceLabel isn't shown anywhere.
  const allRugs = getAllRugs(collections).map((rug) => {
    const clientRug = { ...rug };
    delete clientRug.description;
    delete clientRug.priceLabel;
    return clientRug;
  });

  // Facet option lists are derived from the full catalogue.
  const facets = {
    bounds: priceBounds(allRugs),
    materials: availableMaterials(allRugs),
    makes: availableMakes(allRugs),
    collectionOptions: getCollectionOptions(collections),
    collectionCount: collections.length,
    catalogueTotal: allRugs.length,
  };

  const breadcrumb = breadcrumbSchema([
    { name: 'Home', url: `/${locale}` },
    { name: 'All Pieces', url: `/${locale}/rugs` },
  ]);

  // The static HTML always carries the first page (curated order); deeper
  // pages are client-paginated, so the ItemList describes the catalogue head
  // with the full count.
  const itemList = {
    '@type': 'ItemList',
    name: 'All Carpetstory Pieces',
    itemListOrder: 'https://schema.org/ItemListOrderAscending',
    numberOfItems: allRugs.length,
    itemListElement: allRugs.slice(0, PER_PAGE).map((r, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: `${SITE_URL}/${locale}${r.href}`,
      name: `${r.collectionName} — ${r.name}`,
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
      <main className="flex-1" style={{ backgroundColor: '#ffffff' }}>
        {/* useSearchParams() suspends RugsContent during prerendering; the
            fallback bakes the identical default view (page 1, no filters)
            into the static HTML so the grid stays server-rendered. */}
        <Suspense fallback={<RugsStatic rugs={allRugs} facets={facets} />}>
          <RugsContent rugs={allRugs} facets={facets} />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}

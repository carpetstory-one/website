import { Metadata } from 'next';
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
import { parseShortlistParam, itemKey } from '@/lib/shortlist';
import { getRugCatalogue } from '@/lib/sanity';
import { RugsContent } from './RugsContent';

// The catalogue fetch is cached for 5 min; revalidate the route on the same
// cadence so paginated/filtered variants stay fresh without re-fetching Sanity
// on every navigation.
export const revalidate = 300;

type SearchParams = Record<string, string | string[] | undefined>;
type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<SearchParams>;
};

export async function generateMetadata({
  params,
  searchParams,
}: Props): Promise<Metadata> {
  const { locale } = await params;
  const sp = await searchParams;
  const page = parsePageParam(sp.page);

  const base = generatePageMetadata({
    title:
      page > 1
        ? `All Pieces — Page ${page} — Carpetstory`
        : 'All Pieces — Carpetstory',
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

  // Self-referencing canonical so each paginated page is its own indexable URL
  // (Google's recommended pattern — no rel=prev/next, no noindex).
  if (page > 1 && base.alternates) {
    base.alternates.canonical = `${SITE_URL}/${locale}/rugs?page=${page}`;
  }
  return base;
}

export default async function RugsPage({ params, searchParams }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const sp = await searchParams;

  const collections = await getRugCatalogue();
  const allRugs = getAllRugs(collections);

  // Filters + sort come entirely from the URL → this page is the single source
  // of truth for what's shown. Pagination is applied after filter+sort.
  const filters = parseFiltersFromParams(toURLSearchParams(sp));
  const filtered = filterAndSort(allRugs, filters);
  const pageData = paginate(filtered, parsePageParam(sp.page), PER_PAGE);

  // Shared-shortlist view: when the URL carries ?shortlist=, resolve those exact
  // pieces server-side so the client can render the shared subset. The list is
  // tiny (≤50) so the extra payload is negligible.
  const sharedItems = parseShortlistParam(
    typeof sp.shortlist === 'string' ? sp.shortlist : undefined
  );
  const sharedKeys = new Set(sharedItems.map(itemKey));
  const sharedRugs = sharedKeys.size
    ? allRugs.filter((r) => sharedKeys.has(r.id))
    : [];

  // Facet option lists are derived from the full catalogue, not the page slice.
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

  // ItemList reflects the current page so each paginated URL describes its own
  // slice with correctly-offset positions.
  const itemList = {
    '@type': 'ItemList',
    name: 'All Carpetstory Pieces',
    itemListOrder: 'https://schema.org/ItemListOrderAscending',
    numberOfItems: pageData.total,
    itemListElement: pageData.items.map((r, i) => ({
      '@type': 'ListItem',
      position: pageData.start + i,
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
        <RugsContent
          pageRugs={pageData.items}
          sharedRugs={sharedRugs}
          filters={filters}
          page={pageData.page}
          totalPages={pageData.totalPages}
          matchingTotal={pageData.total}
          rangeStart={pageData.start}
          rangeEnd={pageData.end}
          facets={facets}
        />
      </main>
      <Footer />
    </div>
  );
}

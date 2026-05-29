import { Nav } from '@/components/editorial/Nav';
import { Footer } from '@/components/editorial/Footer';
import { Metadata } from 'next';
import { generatePageMetadata, breadcrumbSchema, jsonLd, SITE_URL } from '@/lib/seo';
import { collections } from '@/lib/collections';
import { CollectionsGrid } from './CollectionsGrid';

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return generatePageMetadata({
    title: 'The Collections — Carpetstory',
    description:
      'Twelve hand-knotted rug collections from Jaipur — Persian, Modern, Tribal, Silk, and more. Produced for designers, importers, and private clients across 30+ countries.',
    path: '/collection',
    locale,
    keywords: [
      'hand-knotted rug collections',
      'Jaipur rug collections',
      'Persian rugs',
      'modern rugs',
      'tribal rugs',
      'silk rugs',
      'Carpetstory collections',
    ],
  });
}

export default async function CollectionIndexPage({ params }: Props) {
  const { locale } = await params;

  const breadcrumb = breadcrumbSchema([
    { name: 'Home', url: `/${locale}` },
    { name: 'Collections', url: `/${locale}/collection` },
  ]);

  const itemList = {
    '@type': 'ItemList',
    name: 'Carpetstory Collections',
    itemListOrder: 'https://schema.org/ItemListOrderAscending',
    numberOfItems: collections.length,
    itemListElement: collections.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: `${SITE_URL}/${locale}/collection/${c.slug}`,
      name: c.name,
    })),
  };

  return (
    <div className="relative bg-canvas min-h-screen flex flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd({ '@graph': [breadcrumb, itemList] }) }}
      />
      <Nav />
      <CollectionsGrid />
      <Footer />
    </div>
  );
}

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
import { getAllRugs } from '@/lib/rugs';
import { RugsContent } from './RugsContent';

type Props = { params: Promise<{ locale: string }> };

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
    ],
  });
}

export default async function RugsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const rugs = getAllRugs();

  const breadcrumb = breadcrumbSchema([
    { name: 'Home', url: `/${locale}` },
    { name: 'All Pieces', url: `/${locale}/rugs` },
  ]);

  const itemList = {
    '@type': 'ItemList',
    name: 'All Carpetstory Pieces',
    itemListOrder: 'https://schema.org/ItemListOrderAscending',
    numberOfItems: rugs.length,
    itemListElement: rugs.slice(0, 24).map((r, i) => ({
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
      <main className="flex-1">
        <RugsContent />
      </main>
      <Footer />
    </div>
  );
}

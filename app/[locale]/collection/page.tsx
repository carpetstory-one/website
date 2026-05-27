import { Nav } from '@/components/editorial/Nav';
import { Footer } from '@/components/editorial/Footer';
import { allPieces } from '@/lib/pieces';
import { PieceCard } from '@/components/editorial/PieceCard';
import { Reveal } from '@/components/editorial/Reveal';
import { Metadata } from 'next';
import { generatePageMetadata, breadcrumbSchema, jsonLd, SITE_URL } from '@/lib/seo';

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return generatePageMetadata({
    title: 'The Archive — All 24 Pieces',
    description:
      'Browse all 24 hand-knotted rugs in the Carpetstory archive. Each piece is woven by a single artisan in Jaipur over six to twelve months.',
    path: '/collection',
    locale,
    keywords: [
      'hand-knotted rugs',
      'Jaipur rugs collection',
      'handmade carpets archive',
      'designer rugs',
      'wool and silk rugs',
    ],
  });
}

export default async function CollectionPage({ params }: Props) {
  const { locale } = await params;

  const breadcrumb = breadcrumbSchema([
    { name: 'Home', url: `/${locale}` },
    { name: 'The Archive', url: `/${locale}/collection` },
  ]);

  const itemList = {
    '@type': 'ItemList',
    name: 'Carpetstory Archive',
    itemListOrder: 'https://schema.org/ItemListOrderAscending',
    numberOfItems: allPieces.length,
    itemListElement: allPieces.map((p, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: `${SITE_URL}/${locale}/collection/${p.slug}`,
      name: p.name,
    })),
  };

  return (
    <div className="relative bg-canvas min-h-screen flex flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd({ '@graph': [breadcrumb, itemList] }) }}
      />
      <Nav />

      <main className="flex-1 pt-32 sm:pt-40 pb-16 sm:pb-24 px-5 sm:px-7 lg:px-12">
        <div className="max-w-[1400px] mx-auto">
          <Reveal>
            <h1 className="font-display font-light text-[40px] sm:text-[56px] md:text-[80px] leading-[1] tracking-[-0.02em] text-ink mb-12 sm:mb-20 text-center">
              The Archive
            </h1>
          </Reveal>

          <div className="grid-12 gap-y-12 sm:gap-y-16 lg:gap-y-32">
            {allPieces.map((piece, i) => (
              <PieceCard key={piece.slug} piece={piece} index={i} />
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

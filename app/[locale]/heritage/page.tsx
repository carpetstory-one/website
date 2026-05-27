import { Nav } from '@/components/editorial/Nav';
import { Footer } from '@/components/editorial/Footer';
import { Heritage } from '@/components/editorial/Heritage';
import { Letter } from '@/components/editorial/Letter';
import { Metadata } from 'next';
import { generatePageMetadata, breadcrumbSchema, jsonLd } from '@/lib/seo';

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return generatePageMetadata({
    title: 'Heritage — Four Generations in Jaipur',
    description:
      'Founded 1924. Four generations of master weavers in Jaipur — natural dyes, hand-spun wool, the Persian knot. The same madder red since the beginning.',
    path: '/heritage',
    locale,
    keywords: [
      'Carpetstory heritage',
      'Jaipur rug history',
      'four generations weavers',
      'family atelier',
    ],
  });
}

export default async function HeritagePage({ params }: Props) {
  const { locale } = await params;
  const breadcrumb = breadcrumbSchema([
    { name: 'Home', url: `/${locale}` },
    { name: 'Heritage', url: `/${locale}/heritage` },
  ]);

  return (
    <div className="relative bg-canvas min-h-screen flex flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(breadcrumb) }}
      />
      <Nav />
      <main className="flex-1 pt-24 sm:pt-28">
        <Heritage />
        <Letter />
      </main>
      <Footer />
    </div>
  );
}

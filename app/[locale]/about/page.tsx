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
    title: 'About Carpetstory — Our Heritage and Vision',
    description:
      'Discover the story behind Carpetstory. Four generations of master weavers in Jaipur, Rajasthan. Traditional hand-knotted techniques and family vision.',
    path: '/about',
    locale,
    keywords: [
      'Carpetstory about',
      'Jaipur carpet weavers',
      'hand-knotted rugs history',
      'Aashrit Anand founder',
    ],
  });
}

export default async function AboutPage({ params }: Props) {
  const { locale } = await params;
  const breadcrumb = breadcrumbSchema([
    { name: 'Home', url: `/${locale}` },
    { name: 'About', url: `/${locale}/about` },
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

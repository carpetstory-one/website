import { Nav } from '@/components/editorial/Nav';
import { Footer } from '@/components/editorial/Footer';
import { getPieceBySlug, allPieces } from '@/lib/pieces';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Reveal } from '@/components/editorial/Reveal';
import { SlideIn } from '@/components/editorial/SlideIn';
import { Link } from '@/i18n/routing';
import { Metadata } from 'next';
import {
  generatePageMetadata,
  productSchema,
  breadcrumbSchema,
  jsonLd,
} from '@/lib/seo';

type Props = {
  params: Promise<{ slug: string; locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, locale } = await params;
  const piece = getPieceBySlug(slug);

  if (!piece) return { title: 'Not Found', robots: { index: false, follow: false } };

  return generatePageMetadata({
    title: piece.name,
    description: piece.description,
    path: `/collection/${piece.slug}`,
    locale,
    ogImage: piece.image,
    keywords: [
      piece.name,
      `${piece.name} rug`,
      ...piece.materials,
      'hand-knotted rug',
      'Jaipur rug',
    ],
  });
}

export function generateStaticParams() {
  return allPieces.map((piece) => ({ slug: piece.slug }));
}

export default async function PiecePage({ params }: Props) {
  const { slug, locale } = await params;
  const piece = getPieceBySlug(slug);

  if (!piece) notFound();

  const product = productSchema({
    name: piece.name,
    description: piece.description,
    image: piece.image,
    price: piece.priceUSD,
    priceCurrency: 'USD',
    url: `/${locale}/collection/${piece.slug}`,
    sku: piece.slug,
  });

  const breadcrumb = breadcrumbSchema([
    { name: 'Home', url: `/${locale}` },
    { name: 'The Archive', url: `/${locale}/collection` },
    { name: piece.name, url: `/${locale}/collection/${piece.slug}` },
  ]);

  return (
    <div className="relative bg-canvas min-h-screen flex flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd({ '@graph': [product, breadcrumb] }) }}
      />

      <Nav />

      <main className="flex-1 pt-28 sm:pt-32 pb-16 sm:pb-24 px-5 sm:px-7 lg:px-12">
        <nav aria-label="Breadcrumb" className="max-w-[1400px] mx-auto mb-8 text-[12px] tracking-[0.02em] text-ink-soft">
          <ol className="flex items-center gap-2 flex-wrap">
            <li><Link href="/" className="hover:text-ink">Home</Link></li>
            <li aria-hidden="true">/</li>
            <li><Link href="/collection" className="hover:text-ink">The Archive</Link></li>
            <li aria-hidden="true">/</li>
            <li aria-current="page" className="text-ink">{piece.name}</li>
          </ol>
        </nav>

        <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-24 items-center">
          <div className="lg:col-span-7 h-[55vh] sm:h-[60vh] lg:h-[80vh] relative">
            <SlideIn direction="u" className="w-full h-full">
              <div
                className="w-full h-full relative"
                style={{ background: piece.placeholderGradient }}
              >
                <Image
                  src={piece.image}
                  alt={`${piece.name} — ${piece.description}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 90vw, 60vw"
                  priority
                />
              </div>
            </SlideIn>
          </div>

          <div className="lg:col-span-5 flex flex-col gap-8 lg:gap-10">
            <Reveal>
              <h1 className="font-display font-light text-[44px] sm:text-[56px] md:text-[72px] lg:text-[80px] leading-[1] tracking-[-0.02em] text-ink">
                {piece.name}
              </h1>
            </Reveal>

            <SlideIn direction="u" delay={100}>
              <p className="body-lg text-ink-soft">{piece.description}</p>
            </SlideIn>

            <SlideIn direction="u" delay={200}>
              <dl className="grid grid-cols-2 gap-y-6 gap-x-4 body-sm text-ink-soft border-t border-ink-faint pt-8">
                <div>
                  <dt className="text-[11px] uppercase tracking-[0.16em] mb-1">Dimensions</dt>
                  <dd className="font-medium text-ink">{piece.dimensions}</dd>
                </div>
                <div>
                  <dt className="text-[11px] uppercase tracking-[0.16em] mb-1">Materials</dt>
                  <dd className="font-medium text-ink">{piece.materials.join(', ')}</dd>
                </div>
                <div>
                  <dt className="text-[11px] uppercase tracking-[0.16em] mb-1">Density</dt>
                  <dd className="font-medium text-ink">{piece.knotDensity}</dd>
                </div>
                <div>
                  <dt className="text-[11px] uppercase tracking-[0.16em] mb-1">Weave Time</dt>
                  <dd className="font-medium text-ink">{piece.weaveTime}</dd>
                </div>
              </dl>
            </SlideIn>

            <SlideIn direction="u" delay={300}>
              <div className="pt-8 border-t border-ink-faint flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="font-display text-[22px] sm:text-[24px] text-ink">
                  From ${piece.priceUSD.toLocaleString()}
                </div>
                <Link
                  href="/inquiry"
                  className="inline-flex items-center justify-center gap-3 px-6 sm:px-8 py-4 bg-ink text-canvas text-[13px] uppercase tracking-[0.12em] font-medium hover:bg-accent transition-colors duration-500 min-h-[48px]"
                >
                  Inquire
                </Link>
              </div>
            </SlideIn>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

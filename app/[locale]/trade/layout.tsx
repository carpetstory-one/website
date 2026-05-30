import { Nav } from '@/components/editorial/Nav';
import { Footer } from '@/components/editorial/Footer';
import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/seo';

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return generatePageMetadata({
    title: 'Partner With Us — Trade & Manufacturing',
    description:
      'Carpetstory is a full spectrum carpet manufacturing and export house in Jaipur, partnering with designers, brands, importers, and showrooms globally.',
    path: '/trade',
    locale,
    keywords: [
      'trade pricing rugs',
      'interior designer trade program',
      'custom rug commissions',
      'architect rug specification',
    ],
  });
}

export default async function TradeLayout({ children }: Props) {
  return (
    <div className="bg-canvas relative flex min-h-screen flex-col">
      <Nav />

      <main className="flex flex-1 justify-center px-5 pt-28 pb-16 sm:px-7 sm:pt-32 sm:pb-24 lg:px-12">
        <article className="w-full max-w-[1000px]">{children}</article>
      </main>

      <Footer />
    </div>
  );
}

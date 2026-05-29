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
    title: 'Source With Us Or Partner With Carpetstory',
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
    <div className="relative bg-canvas min-h-screen flex flex-col">
      <Nav />

      <main className="flex-1 pt-28 sm:pt-32 pb-16 sm:pb-24 px-5 sm:px-7 lg:px-12 flex justify-center">
        <article className="w-full max-w-[1000px]">{children}</article>
      </main>

      <Footer />
    </div>
  );
}

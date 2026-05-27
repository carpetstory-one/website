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
    title: 'For Interior Designers & Architects',
    description:
      'Trade portal for interior designers and architects. Tear sheets, trade pricing, custom commissions, and a dedicated point of contact.',
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

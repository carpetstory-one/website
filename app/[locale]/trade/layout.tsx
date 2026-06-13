import { Nav } from '@/components/editorial/Nav';
import { Footer } from '@/components/editorial/Footer';
import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/seo';
import { getTranslations } from 'next-intl/server';

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'TradePage' });
  return generatePageMetadata({
    title: t('metaTitle'),
    description: t('metaDescription'),
    path: '/trade',
    locale,
    keywords: [
      'trade pricing rugs',
      'interior designer trade program',
      'custom rug commissions',
      'architect rug specification',
      'rug manufacturer jaipur',
      'white label rug manufacturing',
    ],
  });
}

export default async function TradeLayout({ children }: Props) {
  return (
    <div className="bg-canvas relative flex min-h-screen flex-col">
      <Nav />

      <main className="px-gutter pt-page-top pb-section flex flex-1 justify-center">
        <article className="w-full max-w-[1000px]">{children}</article>
      </main>

      <Footer />
    </div>
  );
}

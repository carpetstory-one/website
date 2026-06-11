import { Suspense } from 'react';
import { Nav } from '@/components/editorial/Nav';
import { Footer } from '@/components/editorial/Footer';
import { Inquiry } from '@/components/editorial/Inquiry';
import { Metadata } from 'next';
import { generatePageMetadata, breadcrumbSchema, jsonLd } from '@/lib/seo';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { getSanityCollections } from '@/lib/sanity';

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'ContactPage' });
  return generatePageMetadata({
    title: t('metaTitle'),
    description: t('metaDescription'),
    path: '/contact',
    locale,
  });
}

export default async function ContactPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const tCommon = await getTranslations('Common');
  const tContact = await getTranslations('ContactPage');

  const breadcrumb = breadcrumbSchema([
    { name: tCommon('home'), url: `/${locale}` },
    { name: tContact('title'), url: `/${locale}/contact` },
  ]);

  const collections = await getSanityCollections();

  return (
    <div className="bg-canvas relative flex min-h-screen flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(breadcrumb) }}
      />
      <Nav />
      <main className="pt-page-flush flex-1">
        <Suspense fallback={<div className="py-24" />}>
          <Inquiry collections={collections} />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}

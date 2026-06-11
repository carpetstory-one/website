import { TradeContent } from './TradeContent';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { faqSchema, breadcrumbSchema, jsonLd } from '@/lib/seo';

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function TradePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations('TradePage');
  const tCommon = await getTranslations('Common');

  const faqs = [1, 2, 3, 4, 5, 6].map((i) => ({
    question: t(`faq${i}q`),
    answer: t(`faq${i}a`),
  }));

  const breadcrumb = breadcrumbSchema([
    { name: tCommon('home'), url: `/${locale}` },
    { name: t('title'), url: `/${locale}/trade` },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLd({ '@graph': [faqSchema(faqs), breadcrumb] }),
        }}
      />
      <TradeContent />
    </>
  );
}

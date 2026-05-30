import { Suspense } from 'react';
import { Nav } from '@/components/editorial/Nav';
import { Footer } from '@/components/editorial/Footer';
import { Inquiry } from '@/components/editorial/Inquiry';
import { Metadata } from 'next';
import { generatePageMetadata, breadcrumbSchema, jsonLd } from '@/lib/seo';

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return generatePageMetadata({
    title: 'Inquiry — Start a Conversation',
    description:
      'Tell us about the space. We reply within 24 hours. Or message us directly on WhatsApp.',
    path: '/inquiry',
    locale,
  });
}

export default async function InquiryPage({ params }: Props) {
  const { locale } = await params;
  const breadcrumb = breadcrumbSchema([
    { name: 'Home', url: `/${locale}` },
    { name: 'Inquiry', url: `/${locale}/inquiry` },
  ]);

  return (
    <div className="relative bg-canvas min-h-screen flex flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(breadcrumb) }}
      />
      <Nav />
      <main className="flex-1 pt-24 sm:pt-28">
        <Suspense fallback={<div className="py-24" />}>
          <Inquiry />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}

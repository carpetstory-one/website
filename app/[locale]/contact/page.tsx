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
    title: 'Contact — Start a Conversation',
    description:
      'Contact the Carpetstory team. Start a conversation about your space. We respond within 24 hours. Or message us on WhatsApp.',
    path: '/contact',
    locale,
  });
}

export default async function ContactPage({ params }: Props) {
  const { locale } = await params;
  const breadcrumb = breadcrumbSchema([
    { name: 'Home', url: `/${locale}` },
    { name: 'Contact', url: `/${locale}/contact` },
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

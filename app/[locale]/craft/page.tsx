import { Nav } from '@/components/editorial/Nav';
import { Footer } from '@/components/editorial/Footer';
import { MakingSection } from '@/components/editorial/MakingSection';
import { Materials } from '@/components/editorial/Materials';
import { KnotCount } from '@/components/editorial/KnotCount';
import { Metadata } from 'next';
import {
  generatePageMetadata,
  faqSchema,
  breadcrumbSchema,
  jsonLd,
} from '@/lib/seo';

type Props = {
  params: Promise<{ locale: string }>;
};

const FAQ_BY_LOCALE: Record<string, Array<{ question: string; answer: string }>> = {
  en: [
    {
      question: 'How long does a Carpetstory rug take to make?',
      answer:
        'Each rug is woven by a single artisan over six to ten months, depending on size and knot density. Our finest weaves can take up to twelve months.',
    },
    {
      question: 'What is the knot density of a Carpetstory rug?',
      answer:
        'Our rugs range from 10 to 14 hand-tied Persian knots per square inch. An 8 × 10 ft piece can contain over a million individual knots.',
    },
    {
      question: 'What materials are used?',
      answer:
        'Wool from highland sheep in Bikaner, mulberry silk from Karnataka, and long-staple cotton from Coimbatore. All natural fibres, all hand-spun.',
    },
    {
      question: 'Are the dyes natural?',
      answer:
        'Yes. Every colour begins as a plant — madder root for red, indigo for blue, walnut hulls for brown, pomegranate for gold. All dyed and sun-fixed in Jaipur.',
    },
    {
      question: 'Where are Carpetstory rugs made?',
      answer:
        'In our atelier in Jaipur, Rajasthan, by master weavers — some of whom have worked with our family for three generations.',
    },
  ],
  fr: [
    {
      question: 'Combien de temps faut-il pour fabriquer un tapis Carpetstory ?',
      answer:
        'Chaque tapis est tissé par un seul artisan pendant six à dix mois, selon la taille et la densité des nœuds. Nos tissages les plus fins peuvent prendre jusqu\'à douze mois.',
    },
    {
      question: 'Quelle est la densité de nœuds d\'un tapis Carpetstory ?',
      answer:
        'Nos tapis varient de 10 à 14 nœuds persans noués à la main par pouce carré. Une pièce de 8 × 10 pieds peut contenir plus d\'un million de nœuds.',
    },
    {
      question: 'Quels matériaux sont utilisés ?',
      answer:
        'Laine de moutons des hauts plateaux de Bikaner, soie de mûrier du Karnataka et coton à longues fibres de Coimbatore. Toutes des fibres naturelles, toutes filées à la main.',
    },
    {
      question: 'Les teintures sont-elles naturelles ?',
      answer:
        'Oui. Chaque couleur commence par une plante — racine de garance pour le rouge, indigo pour le bleu, coques de noix pour le brun, grenade pour l\'or. Toutes teintes et fixées au soleil à Jaipur.',
    },
    {
      question: 'Où sont fabriqués les tapis Carpetstory ?',
      answer:
        'Dans notre atelier à Jaipur, Rajasthan, par des maîtres tisserands — dont certains travaillent avec notre famille depuis trois générations.',
    },
  ],
  de: [
    {
      question: 'Wie lange dauert die Herstellung eines Carpetstory-Teppichs?',
      answer:
        'Jeder Teppich wird von einem einzelnen Kunsthandwerker über sechs bis zehn Monate gewebt, abhängig von Größe und Knotendichte. Unsere feinsten Gewebe können bis zu zwölf Monate dauern.',
    },
    {
      question: 'Wie hoch ist die Knotendichte eines Carpetstory-Teppichs?',
      answer:
        'Unsere Teppiche reichen von 10 bis 14 handgeknüpften persischen Knoten pro Quadratzoll. Ein 8 × 10 Fuß großes Stück kann über eine Million einzelne Knoten enthalten.',
    },
    {
      question: 'Welche Materialien werden verwendet?',
      answer:
        'Wolle von Hochlandschafen aus Bikaner, Maulbeerseide aus Karnataka und langstapelige Baumwolle aus Coimbatore. Alle natürlichen Fasern, alle handgesponnen.',
    },
    {
      question: 'Sind die Farben natürlich?',
      answer:
        'Ja. Jede Farbe beginnt als Pflanze — Krappwurzel für Rot, Indigo für Blau, Walnussschalen für Braun, Granatapfel für Gold. Alle in Jaipur gefärbt und in der Sonne fixiert.',
    },
    {
      question: 'Wo werden Carpetstory-Teppiche hergestellt?',
      answer:
        'In unserem Atelier in Jaipur, Rajasthan, von Meisterwebern — von denen einige seit drei Generationen mit unserer Familie zusammenarbeiten.',
    },
  ],
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return generatePageMetadata({
    title: 'The Craft — Hand-Knotted in Jaipur',
    description:
      'An uncompromising dedication to traditional hand-knotting techniques. Wool, silk, natural dyes, and the Persian knot — eight months per rug.',
    path: '/craft',
    locale,
    keywords: [
      'hand-knotted rug technique',
      'Persian knot',
      'natural dyes',
      'Jaipur weaving',
      'wool rugs',
      'how rugs are made',
    ],
  });
}

export default async function CraftPage({ params }: Props) {
  const { locale } = await params;
  const faqs = FAQ_BY_LOCALE[locale] || FAQ_BY_LOCALE.en;
  const breadcrumb = breadcrumbSchema([
    { name: 'Home', url: `/${locale}` },
    { name: 'The Craft', url: `/${locale}/craft` },
  ]);

  return (
    <div className="relative bg-canvas min-h-screen flex flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd({ '@graph': [faqSchema(faqs), breadcrumb] }) }}
      />
      <Nav />
      <main className="flex-1">
        <div className="pt-20 sm:pt-24 pb-10 sm:pb-12 px-5 sm:px-7 lg:px-12 text-center max-w-4xl mx-auto">
          <h1 className="font-display font-light text-[40px] sm:text-[56px] md:text-[80px] leading-[1] tracking-[-0.02em] text-ink mb-4 sm:mb-6">
            The Craft
          </h1>
          <p className="body-lg text-ink-soft">
            An uncompromising dedication to traditional hand-knotting techniques, preserving a centuries-old art form in the heart of Jaipur.
          </p>
        </div>
        <MakingSection />
        <KnotCount />
        <Materials />
      </main>
      <Footer />
    </div>
  );
}

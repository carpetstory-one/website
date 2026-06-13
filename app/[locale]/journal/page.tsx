import { Nav } from '@/components/editorial/Nav';
import { Footer } from '@/components/editorial/Footer';
import { getAllPosts } from '@/lib/mdx';
import { Reveal } from '@/components/editorial/Reveal';
import { SlideIn } from '@/components/editorial/SlideIn';
import { JournalHeader } from '@/components/editorial/JournalHeader';
import { Link } from '@/i18n/routing';
import Image from 'next/image';
import { Metadata } from 'next';
import { generatePageMetadata, breadcrumbSchema, jsonLd } from '@/lib/seo';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { getAllArticleImages } from '@/lib/sanity';

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'JournalPage' });
  return generatePageMetadata({
    title: `${t('title')} — Notes from the Atelier`,
    description: t('description'),
    path: '/journal',
    locale,
  });
}

export default async function JournalIndex({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const tCommon = await getTranslations('Common');
  const tJournal = await getTranslations('JournalPage');

  let posts: ReturnType<typeof getAllPosts> = [];
  try {
    posts = getAllPosts()
      .filter((post) => post.lang === locale)
      .sort((a, b) => {
        if (a.cluster && b.cluster && a.cluster !== b.cluster) {
          return String(a.cluster).localeCompare(String(b.cluster));
        }
        return a.publishDate > b.publishDate ? -1 : 1;
      });
  } catch {
    posts = [];
  }

  const translationKeys = posts.map(p => p.translationKey);
  const images = await getAllArticleImages(translationKeys);


  const breadcrumb = breadcrumbSchema([
    { name: tCommon('home'), url: `/${locale}` },
    { name: tJournal('title'), url: `/${locale}/journal` },
  ]);

  return (
    <div className="bg-canvas relative flex min-h-screen flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(breadcrumb) }}
      />
      <Nav />

      <main className="px-gutter pt-page-top pb-section flex-1">
        <div className="mx-auto max-w-5xl">
          <JournalHeader
            title={tJournal('eyebrow')}
            eyebrow={tJournal('title')}
            description={tJournal('description')}
          />

          <div className="flex flex-col gap-16 sm:gap-24">
            {posts.map((post, index) => {
              const baseDelay = index < 3 ? index * 60 : 0;
              return (
                <article
                  key={post.slug}
                  className="grid grid-cols-1 items-center gap-8 md:grid-cols-12 md:gap-12"
                >
                  <div className="md:col-span-7">
                    <SlideIn direction="u" delay={baseDelay}>
                      <Link
                        href={`/journal/${post.slug}`}
                        className="bg-canvas-warm group relative block aspect-[4/3] w-full overflow-hidden"
                      >
                        {images[post.translationKey]?.heroImage || post.heroImage ? (
                          <Image
                            src={images[post.translationKey]?.heroImage || post.heroImage}
                            alt={post.heroAlt || post.title}
                            fill
                            className="object-cover transition-transform duration-1000 group-hover:scale-105"
                            sizes="(max-width: 768px) 100vw, 60vw"
                          />
                        ) : (
                          <div className="absolute inset-0 bg-ink/5 flex items-center justify-center">
                            <span className="text-ink-soft text-xs uppercase tracking-widest">No Image</span>
                          </div>
                        )}
                      </Link>
                    </SlideIn>
                  </div>

                  <div className="md:col-span-5">
                    <SlideIn direction="u" delay={baseDelay + 40}>
                      <div className="flex flex-col gap-5 sm:gap-6">
                        <div className="text-ink-soft flex items-center gap-4 text-[11px] tracking-[0.16em] uppercase">
                          <time dateTime={post.publishDate}>
                            {new Date(post.publishDate).toLocaleDateString(locale, {
                              month: 'long',
                              day: 'numeric',
                              year: 'numeric',
                            })}
                          </time>
                          <span className="bg-accent/40 h-1 w-1 rounded-full" />
                          <span>{post.readingTime}</span>
                        </div>

                        <h2 className="font-display text-ink text-[28px] leading-[1.1] sm:text-[32px] md:text-[40px]">
                          <Link
                            href={`/journal/${post.slug}`}
                            className="hover:text-accent transition-colors"
                          >
                            {post.title}
                          </Link>
                        </h2>

                        <p className="body-md text-ink-soft line-clamp-3">
                          {post.description}
                        </p>

                        <Link
                          href={`/journal/${post.slug}`}
                          className="text-accent hover:text-accent-soft mt-4 inline-flex min-h-[44px] items-center gap-3 text-[13px] font-medium tracking-[0.16em] uppercase transition-colors"
                        >
                          {tJournal('readArticle')}
                          <svg
                            width="16"
                            height="10"
                            viewBox="0 0 16 10"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            aria-hidden="true"
                          >
                            <path
                              d="M1 5H15M15 5L11 1M15 5L11 9"
                              stroke="currentColor"
                              strokeWidth="1"
                            />
                          </svg>
                        </Link>
                      </div>
                    </SlideIn>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

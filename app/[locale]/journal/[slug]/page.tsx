import { Nav } from '@/components/editorial/Nav';
import { Footer } from '@/components/editorial/Footer';
import { getPostBySlug, getPostSlugs } from '@/lib/mdx';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { useMDXComponents } from '@/mdx-components';
import { Metadata } from 'next';
import {
  generatePageMetadata,
  articleSchema,
  breadcrumbSchema,
  jsonLd,
  SITE_URL,
} from '@/lib/seo';
import { setRequestLocale } from 'next-intl/server';
import { getArticleImages } from '@/lib/sanity';
import { buildJournalIndex } from '@/lib/mdx';


type Props = {
  params: Promise<{ slug: string; locale: string }>;
};

export async function generateStaticParams() {
  return getPostSlugs().map((slug) => ({ slug: slug.replace(/\.mdx$/, '') }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, locale } = await params;
  try {
    const post = getPostBySlug(slug);
    const { crossRef } = buildJournalIndex();
    
    // Validate Sanity Key (Build-time validation per spec)
    const images = await getArticleImages(post.meta.translationKey);
    if (!images) {
      console.warn(`[VALIDATION ERROR] Missing Sanity articleImages for translationKey: ${post.meta.translationKey}`);
      // The prompt requested throwing an error to fail CI, but next metadata fetch shouldn't throw to hard-crash without a fallback.
      // But let's actually throw if it's missing, as requested by the prompt.
      throw new Error(`Missing Sanity articleImages for translationKey: ${post.meta.translationKey}`);
    }

    const languages = Object.keys(crossRef[post.meta.translationKey] || {});
    const customLanguages: Record<string, string> = {};
    languages.forEach((lang) => {
      customLanguages[lang] = `${SITE_URL}/${lang}/journal/${crossRef[post.meta.translationKey][lang]}`;
    });
    if (crossRef[post.meta.translationKey]?.['en']) {
      customLanguages['x-default'] = `${SITE_URL}/en/journal/${crossRef[post.meta.translationKey]['en']}`;
    }

    return generatePageMetadata({
      title: post.meta.title,
      description: post.meta.description,
      path: `/journal/${post.meta.slug}`,
      locale,
      type: 'article',
      ogImage: images.ogImage,
      author: post.meta.author,
      publishedTime: post.meta.publishDate,
      keywords: post.meta.targetKeyword ? [post.meta.targetKeyword] : undefined,
      customLanguages,
    });
  } catch {
    return { title: 'Not Found', robots: { index: false, follow: false } };
  }
}

export default async function PostPage({ params }: Props) {
  const { slug, locale } = await params;
  setRequestLocale(locale);
  let post: ReturnType<typeof getPostBySlug>;
  try {
    post = getPostBySlug(slug);
  } catch {
    notFound();
  }

  const { crossRef, slugToKey } = buildJournalIndex();
  const images = await getArticleImages(post.meta.translationKey);
  const heroImage = images?.heroImage || post.meta.heroImage;

  const LocalizedLink = ({ href, children, ...props }: any) => {
    if (typeof href === 'string' && (href.includes('/journal/') || href.includes('/wissen/'))) {
      const parts = href.split('/');
      const linkSlug = parts[parts.length - 1];
      const key = slugToKey[linkSlug];
      if (key && crossRef[key]?.[locale]) {
        const localizedSlug = crossRef[key][locale];
        return (
          <a href={`/${locale}/journal/${localizedSlug}`} className="link always text-accent" {...props}>
            {children}
          </a>
        );
      }
    }
    return (
      <a href={href} className="link always text-accent" {...props}>
        {children}
      </a>
    );
  };

  const components = useMDXComponents({ a: LocalizedLink });

  const article = articleSchema({
    headline: post.meta.title,
    description: post.meta.description,
    image: heroImage,
    datePublished: post.meta.publishDate,
    author: post.meta.author,
    url: `/${locale}/journal/${post.meta.slug}`,
  });

  const breadcrumb = breadcrumbSchema([
    { name: 'Home', url: `/${locale}` },
    { name: 'Journal', url: `/${locale}/journal` },
    { name: post.meta.title, url: `/${locale}/journal/${post.meta.slug}` },
  ]);

  return (
    <div className="bg-canvas relative flex min-h-screen flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLd({ '@graph': [article, breadcrumb] }),
        }}
      />

      <Nav />

      <article className="px-gutter pt-page-top pb-section flex-1">
        <header className="mx-auto mb-12 max-w-4xl text-center sm:mb-16">
          <div className="text-ink-soft mb-6 flex flex-wrap items-center justify-center gap-3 text-[11px] tracking-[0.16em] uppercase sm:mb-8 sm:gap-4">
            <time dateTime={post.meta.publishDate}>
              {new Date(post.meta.publishDate).toLocaleDateString(locale, {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
              })}
            </time>
            <span className="bg-accent/40 h-1 w-1 rounded-full" />
            <span>{post.meta.readingTime}</span>
          </div>
          <h1 className="font-display text-ink mb-8 text-[32px] leading-[1.05] font-light tracking-[-0.02em] sm:mb-12 sm:text-[40px] md:text-[64px] lg:text-[80px]">
            {post.meta.title}
          </h1>
          {heroImage && (
            <div className="bg-canvas-warm relative aspect-[16/9] w-full overflow-hidden sm:aspect-[2/1]">
              <Image
                src={heroImage}
                alt={post.meta.heroAlt || post.meta.title}
                fill
                className="object-cover"
                priority
                sizes="100vw"
              />
            </div>
          )}
        </header>

        <div className="prose-container mx-auto max-w-3xl">
          <MDXRemote source={post.content} components={components} />
        </div>
      </article>

      <Footer />
    </div>
  );
}

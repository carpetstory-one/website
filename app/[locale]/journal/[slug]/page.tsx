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
    return generatePageMetadata({
      title: post.meta.title,
      description: post.meta.excerpt,
      path: `/journal/${post.meta.slug}`,
      locale,
      type: 'article',
      ogImage: post.meta.coverImage,
      author: post.meta.author,
      publishedTime: post.meta.date,
      keywords: post.meta.tags,
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

  const components = useMDXComponents({});

  const article = articleSchema({
    headline: post.meta.title,
    description: post.meta.excerpt,
    image: post.meta.coverImage,
    datePublished: post.meta.date,
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
            <time dateTime={post.meta.date}>
              {new Date(post.meta.date).toLocaleDateString(locale, {
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
          <div className="bg-canvas-warm relative aspect-[21/9] w-full overflow-hidden">
            <Image
              src={post.meta.coverImage}
              alt={post.meta.title}
              fill
              className="object-cover"
              priority
              sizes="100vw"
            />
          </div>
        </header>

        <div className="prose-container mx-auto max-w-3xl">
          <MDXRemote source={post.content} components={components} />
        </div>
      </article>

      <Footer />
    </div>
  );
}

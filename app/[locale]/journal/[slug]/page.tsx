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
    <div className="relative bg-canvas min-h-screen flex flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd({ '@graph': [article, breadcrumb] }) }}
      />

      <Nav />

      <article className="flex-1 pt-28 sm:pt-32 pb-16 sm:pb-24 px-5 sm:px-7 lg:px-12">
        <header className="max-w-4xl mx-auto text-center mb-12 sm:mb-16">
          <div className="flex items-center justify-center gap-3 sm:gap-4 text-[11px] uppercase tracking-[0.16em] text-ink-soft mb-6 sm:mb-8 flex-wrap">
            <time dateTime={post.meta.date}>
              {new Date(post.meta.date).toLocaleDateString(locale, {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
              })}
            </time>
            <span className="w-1 h-1 rounded-full bg-accent/40" />
            <span>{post.meta.readingTime}</span>
          </div>
          <h1 className="font-display font-light text-[32px] sm:text-[40px] md:text-[64px] lg:text-[80px] leading-[1.05] tracking-[-0.02em] text-ink mb-8 sm:mb-12">
            {post.meta.title}
          </h1>
          <div className="relative aspect-[21/9] w-full overflow-hidden bg-canvas-warm">
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

        <div className="max-w-3xl mx-auto prose-container">
          <MDXRemote source={post.content} components={components} />
        </div>
      </article>

      <Footer />
    </div>
  );
}

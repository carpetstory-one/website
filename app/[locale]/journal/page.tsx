import { Nav } from '@/components/editorial/Nav';
import { Footer } from '@/components/editorial/Footer';
import { getAllPosts } from '@/lib/mdx';
import { Reveal } from '@/components/editorial/Reveal';
import { SlideIn } from '@/components/editorial/SlideIn';
import { Link } from '@/i18n/routing';
import Image from 'next/image';
import { Metadata } from 'next';
import { generatePageMetadata, breadcrumbSchema, jsonLd } from '@/lib/seo';

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return generatePageMetadata({
    title: 'Journal — Notes from the Atelier',
    description:
      'Notes from the atelier. Writing on craft, colour, materials, and the people who weave Carpetstory rugs.',
    path: '/journal',
    locale,
  });
}

export default async function JournalIndex({ params }: Props) {
  const { locale } = await params;
  let posts: ReturnType<typeof getAllPosts> = [];
  try {
    posts = getAllPosts();
  } catch {
    posts = [];
  }

  const breadcrumb = breadcrumbSchema([
    { name: 'Home', url: `/${locale}` },
    { name: 'Journal', url: `/${locale}/journal` },
  ]);

  return (
    <div className="relative bg-canvas min-h-screen flex flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(breadcrumb) }}
      />
      <Nav />

      <main className="flex-1 pt-32 sm:pt-40 pb-16 sm:pb-24 px-5 sm:px-7 lg:px-12">
        <div className="max-w-5xl mx-auto">
          <Reveal>
            <h1 className="font-display font-light text-[40px] sm:text-[56px] md:text-[80px] leading-[1] tracking-[-0.02em] text-ink mb-12 sm:mb-20">
              Journal
            </h1>
          </Reveal>

          <div className="flex flex-col gap-16 sm:gap-24">
            {posts.map((post, index) => (
              <article
                key={post.slug}
                className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-center"
              >
                <div className="md:col-span-7">
                  <SlideIn direction="u" delay={index * 100}>
                    <Link
                      href={`/journal/${post.slug}`}
                      className="block relative aspect-[4/3] w-full overflow-hidden bg-canvas-warm group"
                    >
                      <Image
                        src={post.coverImage}
                        alt={post.title}
                        fill
                        className="object-cover transition-transform duration-1000 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, 60vw"
                      />
                    </Link>
                  </SlideIn>
                </div>

                <div className="md:col-span-5 flex flex-col gap-5 sm:gap-6">
                  <SlideIn direction="u" delay={index * 100 + 100}>
                    <div className="flex items-center gap-4 text-[11px] uppercase tracking-[0.16em] text-ink-soft">
                      <time dateTime={post.date}>
                        {new Date(post.date).toLocaleDateString(locale, {
                          month: 'long',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </time>
                      <span className="w-1 h-1 rounded-full bg-accent/40" />
                      <span>{post.readingTime}</span>
                    </div>
                  </SlideIn>

                  <SlideIn direction="u" delay={index * 100 + 200}>
                    <h2 className="font-display text-[28px] sm:text-[32px] md:text-[40px] leading-[1.1] text-ink">
                      <Link
                        href={`/journal/${post.slug}`}
                        className="hover:text-accent transition-colors"
                      >
                        {post.title}
                      </Link>
                    </h2>
                  </SlideIn>

                  <SlideIn direction="u" delay={index * 100 + 300}>
                    <p className="body-md text-ink-soft line-clamp-3">{post.excerpt}</p>
                  </SlideIn>

                  <SlideIn direction="u" delay={index * 100 + 400}>
                    <Link
                      href={`/journal/${post.slug}`}
                      className="inline-flex items-center gap-3 text-[13px] uppercase tracking-[0.16em] font-medium text-accent hover:text-accent-soft transition-colors mt-4 min-h-[44px]"
                    >
                      Read article
                      <svg width="16" height="10" viewBox="0 0 16 10" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                        <path d="M1 5H15M15 5L11 1M15 5L11 9" stroke="currentColor" strokeWidth="1" />
                      </svg>
                    </Link>
                  </SlideIn>
                </div>
              </article>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

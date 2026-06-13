import { MetadataRoute } from 'next';
import { routing } from '@/i18n/routing';
import { collections } from '@/lib/collections';
import { getAllPosts, buildJournalIndex } from '@/lib/mdx';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://carpetstory.one';

type RouteSpec = {
  path?: string; // used for simple routes
  customLanguages?: Record<string, string>; // used for journal routes where path differs
  changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency'];
  priority: number;
  lastModified?: Date;
};

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticRoutes: RouteSpec[] = [
    { path: '', changeFrequency: 'weekly', priority: 1.0 },
    { path: '/collection', changeFrequency: 'weekly', priority: 0.9 },
    { path: '/craft', changeFrequency: 'monthly', priority: 0.8 },
    { path: '/heritage', changeFrequency: 'monthly', priority: 0.7 },
    { path: '/journal', changeFrequency: 'weekly', priority: 0.7 },
    { path: '/trade', changeFrequency: 'monthly', priority: 0.6 },
    { path: '/inquiry', changeFrequency: 'monthly', priority: 0.6 },
    { path: '/about', changeFrequency: 'monthly', priority: 0.6 },
    { path: '/contact', changeFrequency: 'monthly', priority: 0.5 },
  ];

  // Collection-level routes
  const collectionRoutes: RouteSpec[] = collections.map((c) => ({
    path: `/collection/${c.slug}`,
    changeFrequency: 'weekly',
    priority: 0.85,
  }));

  // Rug-level routes
  const rugRoutes: RouteSpec[] = collections.flatMap((c) =>
    c.rugs.map((r) => ({
      path: `/collection/${c.slug}/${r.slug}`,
      changeFrequency: 'monthly',
      priority: 0.75,
    }))
  );

  let journalRoutes: RouteSpec[] = [];
  try {
    const posts = getAllPosts();
    const { crossRef } = buildJournalIndex();
    
    // Only yield one route spec per translation key (to avoid duplicate sitemap entries that just swap primary URL)
    // Actually, we can just yield all posts but use the post's own lang for the primary URL.
    // Or we only yield posts where lang === defaultLocale to serve as the base.
    const defaultLangPosts = posts.filter(p => p.lang === routing.defaultLocale);

    journalRoutes = defaultLangPosts.map((post) => {
      const translationKey = post.translationKey;
      const languagesObj: Record<string, string> = {};
      const langs = Object.keys(crossRef[translationKey] || {});
      langs.forEach(lang => {
        languagesObj[lang] = `${SITE_URL}/${lang}/journal/${crossRef[translationKey][lang]}`;
      });
      languagesObj['x-default'] = `${SITE_URL}/${routing.defaultLocale}/journal/${crossRef[translationKey][routing.defaultLocale] || post.slug}`;

      return {
        customLanguages: languagesObj,
        changeFrequency: 'monthly',
        priority: 0.6,
        lastModified: post.publishDate ? new Date(post.publishDate) : now,
      };
    });
  } catch {
    // Journal directory may not exist yet — safe to skip.
  }

  const all: RouteSpec[] = [
    ...staticRoutes,
    ...collectionRoutes,
    ...rugRoutes,
    ...journalRoutes,
  ];

  return all.map((route) => {
    let languages = route.customLanguages;
    if (!languages && route.path) {
      languages = Object.fromEntries(
        routing.locales.map((l) => [l, `${SITE_URL}/${l}${route.path}`])
      );
      languages['x-default'] = `${SITE_URL}/${routing.defaultLocale}${route.path}`;
    }

    const primaryUrl = route.customLanguages 
      ? route.customLanguages[routing.defaultLocale] || Object.values(route.customLanguages)[0]
      : `${SITE_URL}/${routing.defaultLocale}${route.path}`;

    return {
      url: primaryUrl,
      lastModified: route.lastModified || now,
      changeFrequency: route.changeFrequency,
      priority: route.priority,
      alternates: { languages: languages || {} },
    };
  });
}

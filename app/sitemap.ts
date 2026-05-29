import { MetadataRoute } from 'next';
import { routing } from '@/i18n/routing';
import { collections } from '@/lib/collections';
import { getAllPosts } from '@/lib/mdx';

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || 'https://carpetstory.com';

type RouteSpec = {
  path: string;
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
    journalRoutes = getAllPosts().map((post) => ({
      path: `/journal/${post.slug}`,
      changeFrequency: 'monthly',
      priority: 0.6,
      lastModified: post.date ? new Date(post.date) : now,
    }));
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
    const languages = Object.fromEntries(
      routing.locales.map((l) => [l, `${SITE_URL}/${l}${route.path}`])
    );
    languages['x-default'] = `${SITE_URL}/${routing.defaultLocale}${route.path}`;

    return {
      url: `${SITE_URL}/${routing.defaultLocale}${route.path}`,
      lastModified: route.lastModified || now,
      changeFrequency: route.changeFrequency,
      priority: route.priority,
      alternates: { languages },
    };
  });
}

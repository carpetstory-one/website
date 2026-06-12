import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import readingTime from 'reading-time';

const postsDirectory = path.join(process.cwd(), 'content/journal');

export interface PostMeta {
  title: string;
  slug: string;
  lang: string;
  translationKey: string;
  description: string;
  targetKeyword?: string;
  cluster?: string;
  track?: string;
  author: string;
  publishDate: string;
  updatedDate?: string;
  heroImage: string;
  heroAlt: string;
  ogImage?: string;
  draft: boolean;
  readingTime: string;
}

export function getPostSlugs() {
  if (!fs.existsSync(postsDirectory)) return [];
  return fs.readdirSync(postsDirectory).filter((file) => file.endsWith('.mdx'));
}

export function getPostBySlug(slug: string): {
  meta: PostMeta;
  content: string;
} {
  const realSlug = slug.replace(/\.mdx$/, '');
  const fullPath = path.join(postsDirectory, `${realSlug}.mdx`);
  const fileContents = fs.readFileSync(fullPath, 'utf8');

  const { data, content } = matter(fileContents);
  const readTime = readingTime(content);

  return {
    meta: {
      ...data,
      slug: realSlug,
      readingTime: readTime.text,
    } as PostMeta,
    content,
  };
}

export function getAllPosts(): PostMeta[] {
  const slugs = getPostSlugs();
  const posts = slugs
    .map((slug) => getPostBySlug(slug).meta)
    .sort((post1, post2) => (post1.publishDate > post2.publishDate ? -1 : 1));

  return posts;
}

let crossRefCache: Record<string, Record<string, string>> | null = null;
let slugToKeyCache: Record<string, string> | null = null;

export function buildJournalIndex() {
  if (crossRefCache && slugToKeyCache) {
    return { crossRef: crossRefCache, slugToKey: slugToKeyCache };
  }

  const posts = getAllPosts();
  const crossRef: Record<string, Record<string, string>> = {};
  const slugToKey: Record<string, string> = {};

  for (const post of posts) {
    if (!crossRef[post.translationKey]) {
      crossRef[post.translationKey] = {};
    }
    crossRef[post.translationKey][post.lang] = post.slug;
    slugToKey[post.slug] = post.translationKey;
  }

  crossRefCache = crossRef;
  slugToKeyCache = slugToKey;

  return { crossRef, slugToKey };
}


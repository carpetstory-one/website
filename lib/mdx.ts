import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import readingTime from 'reading-time';

const postsDirectory = path.join(process.cwd(), 'content/journal');

export interface PostMeta {
  title: string;
  excerpt: string;
  date: string;
  author: string;
  coverImage: string;
  tags: string[];
  readingTime: string;
  slug: string;
}

export function getPostSlugs() {
  if (!fs.existsSync(postsDirectory)) return [];
  return fs.readdirSync(postsDirectory).filter(file => file.endsWith('.mdx'));
}

export function getPostBySlug(slug: string): { meta: PostMeta; content: string } {
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
    .sort((post1, post2) => (post1.date > post2.date ? -1 : 1));
  
  return posts;
}

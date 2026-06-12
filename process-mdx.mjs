import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const journalDir = path.join(process.cwd(), 'content', 'journal');
const files = fs.readdirSync(journalDir).filter(f => f.endsWith('.md') && f !== 'MANIFEST.md');

for (const file of files) {
  const oldPath = path.join(journalDir, file);
  const newPath = path.join(journalDir, file.replace(/\.md$/, '.mdx'));
  
  const content = fs.readFileSync(oldPath, 'utf8');
  const parsed = matter(content);
  
  // Update frontmatter
  parsed.data.draft = false;
  
  let body = parsed.content;
  body = body.replace(/<\s/g, '&lt; ');
  body = body.replace(/<(\d)/g, '&lt;$1');
  body = body.replace(/\{/g, '&#123;');
  body = body.replace(/\}/g, '&#125;');
  
  const newContent = matter.stringify(body, parsed.data);
  fs.writeFileSync(newPath, newContent, 'utf8');
  
  fs.unlinkSync(oldPath);
  console.log(`Converted ${file} to .mdx`);
}

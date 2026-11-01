/**
 * Blog post registry.
 *
 * Single source of truth for post metadata so the blog index and the
 * sitemap never drift out of sync. Each entry's `path` must match a real
 * route under app/blog/<slug>/page.tsx.
 */

export interface BlogPost {
  slug: string;
  path: string;
  title: string;
  description: string;
  excerpt: string;
  category: string;
  readTime: string;
  datePublished: string; // ISO 8601, e.g. '2026-09-10'
}

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: 'best-image-format-for-web',
    path: '/blog/best-image-format-for-web',
    title: 'Best Image Format for the Web in 2026: WebP vs AVIF vs PNG vs JPEG',
    description:
      'A practical, no-nonsense comparison of WebP, AVIF, PNG, and JPEG - when to use each one, real compression differences, and browser support in 2026.',
    excerpt:
      'WebP, AVIF, PNG, or JPEG? Here is how to actually decide, with real trade-offs instead of generic advice.',
    category: 'Image',
    readTime: '7 min read',
    datePublished: '2026-09-10',
  },
  {
    slug: 'how-browser-file-conversion-works',
    path: '/blog/how-browser-file-conversion-works',
    title: 'How Browser-Based File Conversion Actually Works',
    description:
      'A plain-English explanation of how tools like Swift Converter Hub convert files entirely inside your browser using WebAssembly, with nothing ever uploaded to a server.',
    excerpt:
      'No server, no upload, no account - here is what is actually happening on your machine when a "browser-based" converter works.',
    category: 'How It Works',
    readTime: '6 min read',
    datePublished: '2026-09-10',
  },
  {
    slug: 'reduce-pdf-file-size',
    path: '/blog/reduce-pdf-file-size',
    title: 'How to Reduce PDF File Size Without Losing Quality',
    description:
      'Why PDFs balloon in size, what compression actually removes, and a step-by-step approach to shrinking a PDF without making it look worse.',
    excerpt:
      'Most PDF bloat comes from a handful of predictable causes. Here is what to fix first, and what compression actually trades away.',
    category: 'Document',
    readTime: '6 min read',
    datePublished: '2026-09-10',
  },
];

export function getBlogPost(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((post) => post.slug === slug);
}

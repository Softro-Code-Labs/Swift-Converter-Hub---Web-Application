import Link from 'next/link';
import { Plus } from 'lucide-react';
import { Children, isValidElement, type ReactNode } from 'react';
import { H2, List, P } from './Prose';
import { EndOfArticleAd, MidArticleAd } from './BlogAds';
import type { BlogPost } from '@/config/blog';
import { PostList, formatPostDate } from '@/components/site/MorePosts';
import {
  JsonLd,
  articleJsonLd,
  breadcrumbJsonLd,
  faqPageJsonLd,
} from '@/components/seo/JsonLd';

export interface ArticleFaq {
  q: string;
  a: string;
}

export interface TocItem {
  id: string;
  label: string;
}

/** Blocks that are plain reading text - safe to sit next to an ad. */
const TEXT_BLOCKS: unknown[] = [P, List];

/**
 * Puts the in-article ad before a section heading roughly halfway through the
 * post, but only where the block above it is plain text. Diagrams, tool cards,
 * callouts and tables are never directly above or below the ad. If no heading
 * qualifies, the post simply gets no mid-article ad.
 */
function withMidArticleAd(children: ReactNode, path: string): ReactNode[] {
  const blocks = Children.toArray(children);
  const headings = blocks
    .map((b, i) => (isValidElement(b) && b.type === H2 ? i : -1))
    .filter((i) => i > 0);
  if (headings.length < 3) return blocks;

  const middle = headings[Math.floor(headings.length / 2)];
  // Try the middle heading first, then the ones nearest to it.
  const ordered = [...headings].sort(
    (a, b) => Math.abs(a - middle) - Math.abs(b - middle),
  );
  const at = ordered.find((i) => {
    const above = blocks[i - 1];
    return isValidElement(above) && TEXT_BLOCKS.includes(above.type);
  });
  if (at === undefined) return blocks;

  return [
    ...blocks.slice(0, at),
    <MidArticleAd key="mid-article-ad" path={path} />,
    ...blocks.slice(at),
  ];
}

/**
 * Page shell shared by every blog post: structured data, breadcrumb, meta
 * line, title, optional table of contents, the article body, an optional FAQ
 * and the "Keep reading" list. A post only supplies its content.
 */
export function ArticleLayout({
  post,
  toc,
  faqs,
  children,
}: {
  post: BlogPost;
  toc?: TocItem[];
  faqs?: ArticleFaq[];
  children: ReactNode;
}) {
  const structuredData = [
    breadcrumbJsonLd([
      { name: 'Home', path: '/' },
      { name: 'Blog', path: '/blog' },
      { name: post.title, path: post.path },
    ]),
    articleJsonLd({
      title: post.title,
      description: post.description,
      path: post.path,
      datePublished: post.datePublished,
    }),
    ...(faqs?.length ? [faqPageJsonLd(faqs)] : []),
  ];

  return (
    <main className="flex-1">
      <JsonLd data={structuredData} />

      <article className="mx-auto max-w-[44rem] px-4 py-12 sm:px-6 sm:py-16">
        <nav
          aria-label="Breadcrumb"
          className="mb-8 text-[13px] text-slate-500 dark:text-slate-400"
        >
          <Link
            href="/"
            className="underline-offset-4 hover:text-slate-900 hover:underline dark:hover:text-white"
          >
            Home
          </Link>
          <span className="mx-1.5 text-slate-300 dark:text-slate-600" aria-hidden>
            /
          </span>
          <Link
            href="/blog"
            className="underline-offset-4 hover:text-slate-900 hover:underline dark:hover:text-white"
          >
            Blog
          </Link>
        </nav>

        <p className="mb-3 text-sm text-slate-500 dark:text-slate-400">
          {post.category} guide,{' '}
          <time dateTime={post.datePublished}>
            {formatPostDate(post.datePublished)}
          </time>
          , {post.readTime}
        </p>
        <h1 className="mb-10 text-4xl font-bold leading-[1.1] text-slate-900 sm:text-[2.75rem] dark:text-white">
          {post.title}
        </h1>

        {toc && toc.length > 0 && (
          <nav
            aria-label="On this page"
            className="mb-10 rounded-xl border border-slate-200 bg-slate-50/70 px-5 py-4 dark:border-slate-800 dark:bg-slate-900/60"
          >
            <p className="mb-2 text-[13px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              On this page
            </p>
            <ol className="grid gap-x-6 gap-y-1.5 text-[15px] sm:grid-cols-2">
              {toc.map((item, i) => (
                <li key={item.id} className="flex gap-2">
                  <span className="tabular-nums text-slate-400 dark:text-slate-500">
                    {i + 1}.
                  </span>
                  <a
                    href={`#${item.id}`}
                    className="text-slate-700 underline-offset-4 hover:text-blue-700 hover:underline dark:text-slate-300 dark:hover:text-blue-300"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ol>
          </nav>
        )}

        {withMidArticleAd(children, post.path)}

        <EndOfArticleAd path={post.path} />

        {faqs && faqs.length > 0 && (
          <section aria-labelledby="faq" className="mt-14">
            <h2
              id="faq"
              className="mb-4 scroll-mt-24 text-2xl font-bold leading-tight text-slate-900 sm:text-[1.75rem] dark:text-white"
            >
              Frequently asked questions
            </h2>
            <div className="divide-y divide-slate-200 border-y border-slate-200 dark:divide-slate-800 dark:border-slate-800">
              {faqs.map((faq) => (
                <details key={faq.q} className="group">
                  <summary className="flex cursor-pointer list-none items-start justify-between gap-4 py-4 text-left [&::-webkit-details-marker]:hidden">
                    <span className="text-[16px] font-semibold leading-snug text-slate-900 group-hover:text-blue-700 dark:text-white dark:group-hover:text-blue-300">
                      {faq.q}
                    </span>
                    <Plus
                      className="mt-0.5 h-5 w-5 shrink-0 text-slate-400 transition-transform duration-200 group-open:rotate-45"
                      aria-hidden
                    />
                  </summary>
                  <p className="pb-5 pr-8 text-[16px] leading-relaxed text-slate-600 dark:text-slate-400">
                    {faq.a}
                  </p>
                </details>
              ))}
            </div>
          </section>
        )}
      </article>

      <div className="mx-auto max-w-[44rem] border-t border-slate-200 px-4 pb-16 pt-10 sm:px-6 dark:border-slate-800">
        <PostList current={post.slug} heading="Keep reading" />
      </div>
    </main>
  );
}

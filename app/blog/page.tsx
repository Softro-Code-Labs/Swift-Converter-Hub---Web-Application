import Link from 'next/link';
import type { Metadata } from 'next';
import { ArrowRight, Clock } from 'lucide-react';
import { SITE_URL } from '@/config/site';
import { BLOG_POSTS } from '@/config/blog';
import { JsonLd, breadcrumbJsonLd } from '@/components/seo/JsonLd';

export const metadata: Metadata = {
  title: 'Blog - Guides on File Formats, Compression & Conversion',
  description:
    'In-depth, practical guides on image formats, file compression, and how browser-based conversion actually works - from the team behind Swift Converter Hub.',
  alternates: { canonical: `${SITE_URL}/blog` },
  openGraph: {
    title: 'Swift Converter Hub Blog',
    description:
      'In-depth, practical guides on image formats, file compression, and how browser-based conversion actually works.',
    url: `${SITE_URL}/blog`,
    type: 'website',
  },
};

export default function BlogIndexPage() {
  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300">
      <JsonLd
        data={breadcrumbJsonLd([
          { name: 'Home', path: '/' },
          { name: 'Blog', path: '/blog' },
        ])}
      />

      {/* -- Hero -------------------------------------------------------- */}
      <section className="border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-10 text-center">
          <span className="inline-flex items-center px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/50 text-xs font-bold text-blue-700 dark:text-blue-400 mb-4">
            Guides
          </span>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
            Formats, compression, and how it all works
          </h1>
          <p className="mt-3 text-base text-slate-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Practical write-ups on file formats and conversion - the kind of
            detail we wished existed when we were building the tools ourselves.
          </p>
        </div>
      </section>

      {/* -- Post list ----------------------------------------------------- */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 gap-6">
          {BLOG_POSTS.map((post) => (
            <Link
              key={post.slug}
              href={post.path}
              className="group flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border-2 border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm hover:-translate-y-0.5 hover:shadow-lg hover:shadow-slate-200/50 dark:hover:shadow-none hover:border-blue-300 dark:hover:border-blue-700 transition-all duration-300"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300">
                    {post.category}
                  </span>
                  <span className="flex items-center gap-1 text-[11px] text-slate-400 dark:text-slate-500">
                    <Clock className="w-3 h-3" />
                    {post.readTime}
                  </span>
                </div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {post.title}
                </h2>
                <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                  {post.excerpt}
                </p>
              </div>
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                <ArrowRight className="w-4 h-4 -translate-x-0.5 group-hover:translate-x-0 transition-transform duration-300" />
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}

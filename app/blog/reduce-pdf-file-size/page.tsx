import Link from 'next/link';
import { PostList, formatPostDate } from '@/components/site/MorePosts';
import type { Metadata } from 'next';
import { getBlogPost } from '@/config/blog';
import {
  JsonLd,
  breadcrumbJsonLd,
  articleJsonLd,
} from '@/components/seo/JsonLd';
import { pageMetadata } from '@/lib/seo';

const post = getBlogPost('reduce-pdf-file-size')!;

export const metadata: Metadata = pageMetadata({
  path: post.path,
  title: post.title,
  description: post.description,
  ogTitle: post.title,
  type: 'article',
});

const p = 'text-[17px] text-slate-700 dark:text-slate-300 leading-[1.75] mb-5';
const h2 =
  'text-2xl sm:text-[1.75rem] font-bold leading-tight text-slate-900 dark:text-white mt-12 mb-4';
const h3 = 'text-xl font-semibold text-slate-900 dark:text-white mt-8 mb-2';
const ul =
  'list-disc pl-5 space-y-2.5 mb-6 text-[17px] leading-[1.7] text-slate-700 dark:text-slate-300 marker:text-slate-400';

export default function ReducePdfSizePost() {
  return (
    <main className="flex-1">
      <JsonLd
        data={[
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
        ]}
      />

      <article className="mx-auto max-w-[44rem] px-4 py-12 sm:px-6 sm:py-16">
        <nav
          aria-label="Breadcrumb"
          className="mb-8 text-[13px] text-slate-500 dark:text-slate-400"
        >
          <Link
            href="/"
            className="hover:text-slate-900 hover:underline underline-offset-4 dark:hover:text-white"
          >
            Home
          </Link>
          <span
            className="mx-1.5 text-slate-300 dark:text-slate-600"
            aria-hidden
          >
            /
          </span>
          <Link
            href="/blog"
            className="hover:text-slate-900 hover:underline underline-offset-4 dark:hover:text-white"
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

        <p className={p}>
          A ten-page PDF that should be a couple of megabytes somehow ends up at
          forty. This is almost never random - PDF bloat comes from a small set
          of predictable causes, and understanding them tells you exactly what
          compression can and cannot safely remove.
        </p>

        <h2 className={h2}>Where the size actually comes from</h2>
        <ul className={ul}>
          <li>
            <strong>Uncompressed or oversized images.</strong> By far the most
            common cause. A photo scanned or embedded at 300+ DPI in a document
            that will only ever be viewed on a screen is carrying far more
            resolution than it needs.
          </li>
          <li>
            <strong>Scanned pages saved as images.</strong> A scanner often
            saves each page as a full-resolution image rather than searchable
            text, so a 20-page scanned contract can easily be larger than a
            200-page text-based PDF.
          </li>
          <li>
            <strong>Embedded fonts.</strong> PDFs often embed entire font files
            to guarantee consistent rendering, which adds real weight,
            especially with multiple font weights and styles.
          </li>
          <li>
            <strong>Redundant or unused data.</strong> Deleted-but-not-purged
            content, duplicate embedded resources, or leftover metadata from
            editing software can accumulate over multiple rounds of edits.
          </li>
        </ul>

        <h2 className={h2}>What compression actually does</h2>
        <p className={p}>
          &quot;Compress PDF&quot; tools are mostly doing one or more of these
          things:
        </p>
        <ul className={ul}>
          <li>
            <strong>Re-encoding images at lower resolution or quality.</strong>{' '}
            This is where most of the size reduction comes from, and it is also
            the one place quality loss is possible if pushed too far.
          </li>
          <li>
            <strong>Subsetting fonts.</strong> Instead of embedding an entire
            typeface, the tool keeps only the specific characters actually used
            in the document - invisible to the reader, real savings on the file.
          </li>
          <li>
            <strong>Removing redundant objects.</strong> Cleaning up unused
            resources and duplicate data that accumulated during editing, with
            zero visible effect.
          </li>
        </ul>

        <h3 className={h3}>
          The trade-off: where quality loss actually comes from
        </h3>
        <p className={p}>
          Font subsetting and redundant-data removal are essentially free - they
          do not change how the document looks. Image re-encoding is the only
          step with a real trade-off, and it is a genuine resolution-vs-size
          decision: push it too far and text within scanned images gets blurry,
          or photos show visible compression artifacts. A good compressor lets
          you choose the aggressiveness of this step rather than applying one
          fixed setting to every document.
        </p>

        <h2 className={h2}>A practical approach</h2>
        <ul className={ul}>
          <li>
            <strong>Start with a moderate compression setting</strong> rather
            than the most aggressive option, and check the result before
            committing to it.
          </li>
          <li>
            <strong>If the PDF is a scanned document,</strong> consider whether
            it needs to stay as scanned images at all - running it through OCR
            to convert it to searchable text can shrink it dramatically while
            making it more useful.
          </li>
          <li>
            <strong>Check where the size is concentrated</strong> before
            compressing - a document with one enormous embedded image needs a
            different fix than one with fifty medium-sized ones.
          </li>
          <li>
            <strong>Compress a copy, not your original,</strong> until you have
            confirmed the output looks right at the resolution you actually need
            it for (screen viewing vs. printing have very different
            requirements).
          </li>
        </ul>

        <h2 className={h2}>Try it yourself</h2>
        <p className={p}>
          Our{' '}
          <Link
            href="/file/pdf-compress"
            className="text-blue-600 dark:text-blue-400 font-semibold hover:underline"
          >
            PDF compression tool
          </Link>{' '}
          runs entirely in your browser, so you can test a couple of compression
          levels on your own document and compare the results side by side
          before deciding which trade-off is right for that particular file -
          without uploading it anywhere to find out.
        </p>
      </article>

      <div className="mx-auto max-w-[44rem] border-t border-slate-200 px-4 pb-16 pt-10 sm:px-6 dark:border-slate-800">
        <PostList current={post.slug} heading="Keep reading" />
      </div>
    </main>
  );
}

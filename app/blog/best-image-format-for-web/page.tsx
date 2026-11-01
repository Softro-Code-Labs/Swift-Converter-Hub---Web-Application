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

const post = getBlogPost('best-image-format-for-web')!;

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
const table =
  'w-full text-sm border-collapse mb-6 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden';
const th =
  'text-left font-bold px-4 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-b border-slate-200 dark:border-slate-800';
const td = 'px-4 py-2.5 border-b border-slate-100 dark:border-slate-800/60';

export default function BestImageFormatPost() {
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
        {/* -- Header ------------------------------------------------------ */}
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

        {/* -- Body ---------------------------------------------------------- */}
        <p className={p}>
          Every few years a new image format shows up promising smaller files
          and better quality, and every few years developers argue about whether
          it is actually worth switching. In 2026 the real answer is not one
          format for everything - it is knowing which trade-off you are making,
          because JPEG, PNG, WebP, and AVIF are each genuinely better at
          different jobs. Here is how to actually decide, without the marketing
          copy.
        </p>

        <h2 className={h2}>The short version</h2>
        <p className={p}>
          If you only remember one thing:{' '}
          <strong>
            AVIF for photos where file size matters most, WebP as the safe
            modern default, PNG for anything that needs a transparent background
            or sharp flat edges (logos, screenshots, icons), and JPEG only when
            you need maximum compatibility with very old software.
          </strong>{' '}
          The rest of this guide explains why.
        </p>

        <h2 className={h2}>How the formats actually compare</h2>
        <div className="overflow-x-auto">
          <table className={table}>
            <thead>
              <tr>
                <th className={th}>Format</th>
                <th className={th}>Best for</th>
                <th className={th}>Transparency</th>
                <th className={th}>Typical size vs. JPEG</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className={td}>JPEG</td>
                <td className={td}>Photos, universal compatibility</td>
                <td className={td}>No</td>
                <td className={td}>Baseline</td>
              </tr>
              <tr>
                <td className={td}>PNG</td>
                <td className={td}>Logos, icons, screenshots, flat colors</td>
                <td className={td}>Yes</td>
                <td className={td}>Often 2-5x larger for photos</td>
              </tr>
              <tr>
                <td className={td}>WebP</td>
                <td className={td}>General web use, modern default</td>
                <td className={td}>Yes</td>
                <td className={td}>~25-35% smaller</td>
              </tr>
              <tr>
                <td className={td}>AVIF</td>
                <td className={td}>
                  Photography, hero images, large galleries
                </td>
                <td className={td}>Yes</td>
                <td className={td}>~40-50% smaller</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className={p}>
          Those percentages are rough because actual results depend heavily on
          the image itself - a busy photo of foliage compresses very differently
          than a smooth gradient or a screenshot of a UI. Treat the table as a
          starting point, not a guarantee.
        </p>

        <h2 className={h2}>Why AVIF is not the automatic winner</h2>
        <p className={p}>
          AVIF (based on the AV1 video codec) genuinely produces the smallest
          files at a given quality level for most photographic content. But it
          has two practical costs that the size comparisons usually leave out:
        </p>
        <ul className={ul}>
          <li>
            <strong>Encoding is slower.</strong> If you are generating thousands
            of images on the fly (a product catalog, user uploads), AVIF
            encoding can meaningfully slow down your pipeline compared to WebP
            or JPEG.
          </li>
          <li>
            <strong>
              Decoding is more CPU-intensive on older or low-power devices.
            </strong>{' '}
            A modern phone won&apos;t notice. A five-year-old budget Android
            device scrolling a long image feed might.
          </li>
        </ul>
        <p className={p}>
          For a small number of hero images or a photography portfolio, neither
          of these matters - encode once, serve forever. For a high-volume,
          dynamically generated image pipeline, it is worth testing before
          committing.
        </p>

        <h3 className={h3}>Where WebP still wins</h3>
        <p className={p}>
          WebP hits a genuinely good middle ground: meaningfully smaller than
          JPEG, supports transparency (unlike JPEG), encodes fast, and decodes
          cheaply on essentially any device made in the last decade. If you want
          one format to standardize on without thinking about it further, WebP
          is still the pragmatic default in 2026.
        </p>

        <h3 className={h3}>When PNG is still the right call</h3>
        <p className={p}>
          PNG uses lossless compression, which is exactly what you want for
          images with large flat areas of solid color, sharp text, or anything
          where a single wrong pixel would be visible - app icons, logos,
          diagrams, and screenshots. Lossy formats (including WebP and AVIF in
          their lossy modes) can introduce subtle artifacts around sharp edges
          that are much more noticeable on this kind of content than they are on
          a photo.
        </p>

        <h3 className={h3}>When JPEG is still the right call</h3>
        <p className={p}>
          Honestly, rarely by choice in 2026 - but if your image needs to render
          correctly in genuinely old software (some email clients, certain
          embedded devices, older enterprise systems), JPEG&apos;s universal
          support is hard to beat. It is the format you fall back to, not the
          one you reach for first.
        </p>

        <h2 className={h2}>A simple decision framework</h2>
        <ul className={ul}>
          <li>Does it need transparency? Rule out JPEG immediately.</li>
          <li>
            Is it a photo where file size matters (hero banners, galleries)? Try
            AVIF first, fall back to WebP if your pipeline needs faster
            encoding.
          </li>
          <li>
            Is it a logo, icon, or screenshot with sharp edges or text? Use PNG.
          </li>
          <li>
            Everything else, general web images? WebP, without overthinking it.
          </li>
        </ul>

        <h2 className={h2}>Converting between formats</h2>
        <p className={p}>
          If you already have images in one format and need another, the
          conversion itself is straightforward - the harder part is usually just
          deciding which format to target, which is what this guide was for. Our{' '}
          <Link
            href="/image/convert"
            className="text-blue-600 dark:text-blue-400 font-semibold hover:underline"
          >
            image format converter
          </Link>{' '}
          handles JPEG, PNG, WebP, AVIF, and well over a hundred other formats
          entirely in your browser, so you can test a few options on your own
          images and compare the actual file sizes yourself rather than relying
          on generic percentages like the ones above.
        </p>
      </article>

      <div className="mx-auto max-w-[44rem] border-t border-slate-200 px-4 pb-16 pt-10 sm:px-6 dark:border-slate-800">
        <PostList current={post.slug} heading="Keep reading" />
      </div>
    </main>
  );
}

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

const post = getBlogPost('how-browser-file-conversion-works')!;

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

export default function BrowserConversionPost() {
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
          &quot;Runs entirely in your browser&quot; is a claim a lot of
          conversion tools make, and it sounds like marketing until you
          understand what is actually happening under the hood. It is not a
          trick or a small file-size limit in disguise - it is a real shift in
          where computation happens, made possible by a technology called
          WebAssembly. Here is what is genuinely going on when you drop a file
          into a browser-based converter.
        </p>

        <h2 className={h2}>The old way: upload, wait, download</h2>
        <p className={p}>
          Traditionally, an online file converter works like this: you upload
          your file to a server, the server&apos;s software converts it, and you
          download the result. This is simple to build, but it means your file -
          which might be a personal photo, a scanned document, or a business
          spreadsheet - physically leaves your device and sits on someone
          else&apos;s server, even if only temporarily. It also means the tool
          needs bandwidth and server capacity that scales with every user, and
          it does not work without an internet connection.
        </p>

        <h2 className={h2}>
          The browser-based way: bring the engine to the file
        </h2>
        <p className={p}>
          WebAssembly (often shortened to WASM) is a low-level format that lets
          code written in languages like C, C++, or Rust run inside a web
          browser at speeds close to a native desktop application. Instead of
          sending your file to a server-side converter, a browser-based tool
          sends the <em>converter itself</em> - compiled to WebAssembly - to
          your browser tab. From that point on, everything happens on your own
          machine, using your own CPU.
        </p>

        <h3 className={h3}>What actually happens, step by step</h3>
        <ul className={ul}>
          <li>
            <strong>The tool loads.</strong> When you open a converter page,
            your browser downloads a compact WebAssembly module - often the same
            underlying engine used by professional desktop software, compiled
            for the web.
          </li>
          <li>
            <strong>You drop a file.</strong> The file goes directly into your
            browser&apos;s memory. No upload request is made, because there is
            nowhere for it to be uploaded to.
          </li>
          <li>
            <strong>Conversion happens locally.</strong> The WebAssembly module
            reads the file&apos;s bytes, transforms them according to the target
            format&apos;s specification, and produces the output - all inside
            the browser tab, using your device&apos;s processor.
          </li>
          <li>
            <strong>You download the result.</strong> The browser generates a
            downloadable file directly from memory. At no point did the original
            file or the converted output travel over the network.
          </li>
        </ul>

        <h2 className={h2}>Why this matters beyond privacy</h2>
        <p className={p}>
          Privacy is the most obvious benefit, but it is not the only one:
        </p>
        <ul className={ul}>
          <li>
            <strong>No file size limits imposed by a server.</strong> The only
            real ceiling is your own device&apos;s memory, not an arbitrary cap
            set to protect someone else&apos;s server costs.
          </li>
          <li>
            <strong>It keeps working with a flaky connection.</strong> Once the
            page and its WebAssembly module have loaded, losing your internet
            connection mid-conversion does not interrupt the process, because
            nothing further needs to be sent or received.
          </li>
          <li>
            <strong>Speed, for most file sizes.</strong> There is no upload
            wait, no server queue, and no download wait for the result -
            conversion starts the moment you drop the file.
          </li>
        </ul>

        <h3 className={h3}>The trade-off worth knowing about</h3>
        <p className={p}>
          Browser-based conversion uses your device&apos;s own CPU, so very
          large files or very demanding conversions (long video files, for
          example) will run faster on a powerful laptop than on an older phone.
          It is a genuine trade-off, not a hidden downside - you are borrowing
          your own hardware instead of someone else&apos;s server, and the
          performance reflects whatever hardware you brought to the job.
        </p>

        <h2 className={h2}>How to tell if a tool is really doing this</h2>
        <p className={p}>
          A simple test: open your browser&apos;s network activity panel (in
          Chrome or Firefox&apos;s developer tools, under the
          &quot;Network&quot; tab), then convert a file. If the tool is
          genuinely browser-based, you will see the page and its WebAssembly
          module load once, and then - critically - no new network request
          containing your file&apos;s data when you drop it in or download the
          result. If you see a request firing off to an API endpoint carrying
          your file, it is uploading it somewhere, regardless of what the
          marketing copy says.
        </p>

        <p className={p}>
          Every conversion on Swift Converter Hub - across{' '}
          <Link
            href="/image"
            className="text-blue-600 dark:text-blue-400 font-semibold hover:underline"
          >
            image
          </Link>
          ,{' '}
          <Link
            href="/audio"
            className="text-blue-600 dark:text-blue-400 font-semibold hover:underline"
          >
            audio
          </Link>
          , and{' '}
          <Link
            href="/video"
            className="text-blue-600 dark:text-blue-400 font-semibold hover:underline"
          >
            video
          </Link>{' '}
          tools - works exactly this way, which is why the same tools also work
          with your connection turned off once the page has loaded.
        </p>
      </article>

      <div className="mx-auto max-w-[44rem] border-t border-slate-200 px-4 pb-16 pt-10 sm:px-6 dark:border-slate-800">
        <PostList current={post.slug} heading="Keep reading" />
      </div>
    </main>
  );
}

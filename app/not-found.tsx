'use client';

import Link from 'next/link';
import { StudioDirectory } from '@/components/site/StudioDirectory';
import { SearchToolsButton } from '@/components/site/SearchToolsButton';

export default function NotFound() {
  return (
    <main className="flex flex-1 items-center px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-4xl">
        <p className="font-display text-sm font-semibold text-blue-700 dark:text-blue-300">
          Error 404
        </p>
        <h1 className="mt-2 text-4xl font-bold text-slate-900 sm:text-5xl dark:text-white">
          We couldn&apos;t find that page
        </h1>
        <p className="mt-4 max-w-xl text-lg leading-relaxed text-slate-600 dark:text-slate-400">
          The link may be old or mistyped. Search for the tool you were after,
          or start from one of the studios below.
        </p>
        <div className="mt-7 flex flex-wrap items-center gap-3">
          <SearchToolsButton />
          <Link
            href="/"
            className="inline-flex h-11 items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 text-[15px] font-semibold text-slate-900 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:hover:bg-slate-800"
          >
            Go to the home page
          </Link>
        </div>
        <div className="mt-12">
          <StudioDirectory />
        </div>
      </div>
    </main>
  );
}

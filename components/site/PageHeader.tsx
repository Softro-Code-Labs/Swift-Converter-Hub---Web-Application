import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

/** Header for content pages (about, blog, legal, contact). */
export function PageHeader({
  crumbs = [],
  title,
  lead,
  meta,
  children,
  width = 'max-w-3xl',
}: {
  /** Ancestors only - the current page is the title. */
  crumbs?: { name: string; href: string }[];
  title: string;
  lead?: React.ReactNode;
  meta?: React.ReactNode;
  children?: React.ReactNode;
  width?: string;
}) {
  return (
    <header className="border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900/50">
      <div className={cn('mx-auto px-4 pb-10 pt-6 sm:px-6 lg:px-8', width)}>
        <nav aria-label="Breadcrumb" className="mb-8">
          <ol className="flex flex-wrap items-center gap-1 text-[13px] text-slate-500 dark:text-slate-400">
            {[{ name: 'Home', href: '/' }, ...crumbs].map((c) => (
              <li key={c.href} className="flex items-center gap-1">
                <Link
                  href={c.href}
                  className="hover:text-slate-900 hover:underline underline-offset-4 dark:hover:text-white"
                >
                  {c.name}
                </Link>
                <ChevronRight
                  className="h-3.5 w-3.5 text-slate-300 dark:text-slate-600"
                  aria-hidden
                />
              </li>
            ))}
            <li
              aria-current="page"
              className="max-w-[16rem] truncate font-medium text-slate-700 dark:text-slate-200"
            >
              {title}
            </li>
          </ol>
        </nav>
        {meta && (
          <div className="mb-3 text-sm text-slate-500 dark:text-slate-400">
            {meta}
          </div>
        )}
        <h1 className="text-4xl font-bold leading-[1.1] text-slate-900 sm:text-5xl dark:text-white">
          {title}
        </h1>
        {lead && (
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-slate-600 dark:text-slate-400">
            {lead}
          </p>
        )}
        {children}
      </div>
    </header>
  );
}

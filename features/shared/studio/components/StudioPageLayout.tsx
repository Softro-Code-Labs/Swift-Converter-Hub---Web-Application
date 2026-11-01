'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  ChevronRight,
  Cpu,
  Search,
  ShieldCheck,
  X,
} from 'lucide-react';
import {
  STUDIOS,
  getStudio,
  getStudioTools,
  type StudioId,
} from '@/config/tools';
import { STUDIO_ACCENT } from '@/config/studio-theme';
import { cn } from '@/lib/utils';

interface StudioPageLayoutProps {
  studioId: StudioId;
  /** e.g. "Missing an image tool?" */
  footerNote?: string;
}

/** Hub page for one studio: what it does, every tool grouped by task, and a
 *  way across to the other studios. All content comes from config/tools.ts. */
export function StudioPageLayout({
  studioId,
  footerNote,
}: StudioPageLayoutProps) {
  const studio = getStudio(studioId);
  const accent = STUDIO_ACCENT[studioId];
  const tools = getStudioTools(studioId);
  const Icon = studio.icon;
  const [query, setQuery] = useState('');

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return tools;
    return tools.filter((t) =>
      [t.name, t.title, t.desc, ...t.keywords]
        .join(' ')
        .toLowerCase()
        .includes(q),
    );
  }, [query, tools]);

  return (
    <div className="flex-1">
      {/* -- Header ---------------------------------------------------------- */}
      <section className="border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900/50">
        <div className="mx-auto max-w-7xl px-4 pb-10 pt-6 sm:px-6 lg:px-8">
          <nav aria-label="Breadcrumb" className="mb-8">
            <ol className="flex items-center gap-1 text-[13px] text-slate-500 dark:text-slate-400">
              <li className="flex items-center gap-1">
                <Link
                  href="/"
                  className="hover:text-slate-900 hover:underline underline-offset-4 dark:hover:text-white"
                >
                  Home
                </Link>
                <ChevronRight
                  className="h-3.5 w-3.5 text-slate-300 dark:text-slate-600"
                  aria-hidden
                />
              </li>
              <li
                aria-current="page"
                className="font-medium text-slate-700 dark:text-slate-200"
              >
                {studio.name}
              </li>
            </ol>
          </nav>

          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="flex max-w-2xl items-start gap-5">
              <span
                className={cn(
                  'flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl',
                  accent.tile,
                )}
              >
                <Icon className="h-7 w-7" aria-hidden />
              </span>
              <div>
                <h1 className="text-4xl font-bold leading-tight text-slate-900 dark:text-white">
                  {studio.name}
                </h1>
                <p className="mt-3 text-[17px] leading-relaxed text-slate-600 dark:text-slate-400">
                  {studio.description}
                </p>
              </div>
            </div>

            <dl className="grid shrink-0 gap-3 text-sm sm:grid-cols-2 lg:w-80 lg:grid-cols-1">
              <div className="flex gap-2.5">
                <dt className="sr-only">Works with</dt>
                <span
                  className={cn(
                    'mt-1.5 h-2 w-2 shrink-0 rounded-full',
                    accent.solid,
                  )}
                  aria-hidden
                />
                <dd className="text-slate-700 dark:text-slate-300">
                  {studio.handles}
                </dd>
              </div>
              <div className="flex gap-2.5">
                <dt className="sr-only">Engine</dt>
                <Cpu
                  className="mt-0.5 h-4 w-4 shrink-0 text-slate-400"
                  aria-hidden
                />
                <dd className="text-slate-700 dark:text-slate-300">
                  {studio.engine}
                </dd>
              </div>
              <div className="flex gap-2.5">
                <dt className="sr-only">Privacy</dt>
                <ShieldCheck
                  className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400"
                  aria-hidden
                />
                <dd className="text-slate-700 dark:text-slate-300">
                  Files never leave your device
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </section>

      {/* -- Tools ----------------------------------------------------------- */}
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            {tools.length} tools
          </h2>
          {tools.length > 5 && (
            <label className="relative block w-full sm:w-72">
              <span className="sr-only">Filter {studio.name} tools</span>
              <Search
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
                aria-hidden
              />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={`Filter, e.g. “${tools[0].keywords[0]}”`}
                className="h-10 w-full rounded-lg border border-slate-200 bg-white pl-9 pr-9 text-[15px] text-slate-900 placeholder:text-slate-400 focus:border-blue-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
              />
              {query && (
                <button
                  onClick={() => setQuery('')}
                  className="absolute right-2 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                  aria-label="Clear filter"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </label>
          )}
        </div>

        {visible.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 px-6 py-12 text-center dark:border-slate-700">
            <p className="text-[15px] font-medium text-slate-900 dark:text-white">
              No {studio.name} tool matches “{query}”
            </p>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Clear the filter, or try the site-wide search at the top of the
              page.
            </p>
          </div>
        ) : (
          <div className="space-y-10">
            {studio.groups.map((group) => {
              const items = visible.filter((t) => t.group === group.id);
              if (!items.length) return null;
              return (
                <div key={group.id}>
                  <div className="mb-3 flex items-baseline gap-3">
                    <h3 className="text-[15px] font-semibold text-slate-900 dark:text-white">
                      {group.label}
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      {group.desc}
                    </p>
                  </div>
                  <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {items.map((tool) => {
                      const TIcon = tool.icon;
                      return (
                        <li key={tool.id}>
                          <Link
                            href={tool.href}
                            className={cn(
                              'group flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-5 transition-[border-color,box-shadow] hover:shadow-md hover:shadow-slate-900/[0.04] dark:border-slate-800 dark:bg-slate-900',
                              accent.hoverBorder,
                            )}
                          >
                            <span
                              className={cn(
                                'flex h-10 w-10 items-center justify-center rounded-xl',
                                accent.tile,
                              )}
                            >
                              <TIcon className="h-5 w-5" aria-hidden />
                            </span>
                            <span className="mt-4 flex items-center gap-1.5 text-base font-semibold text-slate-900 dark:text-white">
                              {tool.title}
                            </span>
                            <span className="mt-1 flex-1 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                              {tool.desc}
                            </span>
                            <span
                              className={cn(
                                'mt-4 inline-flex items-center gap-1 text-sm font-semibold',
                                accent.text,
                              )}
                            >
                              Open tool
                              <ArrowRight
                                className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                                aria-hidden
                              />
                            </span>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* -- Other studios + suggestion -------------------------------------- */}
      <section className="mx-auto max-w-7xl px-4 pb-14 sm:px-6 lg:px-8">
        <div className="border-t border-slate-200 pt-8 dark:border-slate-800">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            Other studios
          </h2>
          <ul className="mt-4 flex flex-wrap gap-2">
            {STUDIOS.filter((s) => s.id !== studioId).map((s) => {
              const SIcon = s.icon;
              return (
                <li key={s.id}>
                  <Link
                    href={s.href}
                    className="inline-flex h-10 items-center gap-2 rounded-full border border-slate-200 bg-white pl-1.5 pr-4 text-sm font-medium text-slate-700 hover:border-slate-300 hover:text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:text-white"
                  >
                    <span
                      className={cn(
                        'flex h-7 w-7 items-center justify-center rounded-full',
                        STUDIO_ACCENT[s.id].tile,
                      )}
                    >
                      <SIcon className="h-3.5 w-3.5" aria-hidden />
                    </span>
                    {s.name}
                  </Link>
                </li>
              );
            })}
          </ul>
          <p className="mt-8 text-sm text-slate-600 dark:text-slate-400">
            {footerNote ?? 'Missing a tool?'}{' '}
            <Link
              href="/contact"
              className="font-medium text-slate-900 underline underline-offset-4 dark:text-white"
            >
              Suggest one
            </Link>
            .
          </p>
        </div>
      </section>
    </div>
  );
}

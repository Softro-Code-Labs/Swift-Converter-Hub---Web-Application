'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowRight, Search } from 'lucide-react';
import { getStudioTools, type Studio, type Tool } from '@/config/tools';
import { STUDIO_ACCENT } from '@/config/studio-theme';
import { cn } from '@/lib/utils';
import { openCommandMenu } from './CommandMenu';

/** Sticky bar under the site header listing every tool in the current
 *  studio, so people can hop between sibling tools without going back. */
export function StudioToolRail({
  studio,
  current,
}: {
  studio: Studio;
  current?: Tool;
}) {
  const accent = STUDIO_ACCENT[studio.id];
  const tools = getStudioTools(studio.id);
  const Icon = studio.icon;
  const railRef = useRef<HTMLUListElement>(null);

  // Bring the active tab into view on small screens.
  useEffect(() => {
    const el = railRef.current?.querySelector<HTMLElement>(
      '[aria-current="page"]',
    );
    if (el && railRef.current) {
      const rail = railRef.current;
      rail.scrollLeft =
        el.offsetLeft - rail.clientWidth / 2 + el.clientWidth / 2;
    }
  }, [current?.id]);

  return (
    <div className="sticky top-[var(--header-h)] z-40 border-b border-slate-200/80 bg-white/90 backdrop-blur-md dark:border-slate-800 dark:bg-slate-950/90">
      <nav
        aria-label={`${studio.name} tools`}
        className="mx-auto flex h-12 max-w-7xl items-stretch gap-2 px-4 sm:px-6 lg:px-8"
      >
        <Link
          href={studio.href}
          className="group hidden shrink-0 items-center gap-2 pr-3 text-sm font-semibold text-slate-900 sm:flex dark:text-white"
        >
          <span
            className={cn(
              'flex h-7 w-7 items-center justify-center rounded-md',
              accent.tile,
            )}
          >
            <Icon className="h-4 w-4" aria-hidden />
          </span>
          <span className="group-hover:underline underline-offset-4">
            {studio.name}
          </span>
        </Link>
        <span
          className="my-3 hidden w-px bg-slate-200 sm:block dark:bg-slate-800"
          aria-hidden
        />
        <ul
          ref={railRef}
          className="scrollbar-none -mx-1 flex flex-1 items-stretch gap-0.5 overflow-x-auto px-1"
        >
          <li className="flex sm:hidden">
            <Link
              href={studio.href}
              className="flex items-center gap-1.5 whitespace-nowrap px-2.5 text-sm font-semibold text-slate-900 dark:text-white"
            >
              <span
                className={cn(
                  'flex h-6 w-6 items-center justify-center rounded-md',
                  accent.tile,
                )}
              >
                <Icon className="h-3.5 w-3.5" aria-hidden />
              </span>
              {studio.name.replace(' Studio', '').replace(' Suite', '')}
            </Link>
          </li>
          {tools.map((tool) => {
            const active = tool.id === current?.id;
            return (
              <li key={tool.id} className="relative flex">
                <Link
                  href={tool.href}
                  aria-current={active ? 'page' : undefined}
                  className={cn(
                    'flex items-center whitespace-nowrap rounded-md px-2.5 text-sm transition-colors',
                    active
                      ? 'font-semibold text-slate-900 dark:text-white'
                      : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white',
                  )}
                >
                  {tool.name}
                </Link>
                {active && (
                  <span
                    className={cn(
                      'absolute inset-x-2.5 bottom-0 h-0.5 rounded-full',
                      accent.solid,
                    )}
                    aria-hidden
                  />
                )}
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}

/** "More in this studio" block shown under every tool. */
export function RelatedTools({
  studio,
  current,
}: {
  studio: Studio;
  current?: Tool;
}) {
  const accent = STUDIO_ACCENT[studio.id];
  const others = getStudioTools(studio.id).filter((t) => t.id !== current?.id);
  if (!others.length) return null;

  return (
    <section aria-labelledby="related-tools" className="mt-10">
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <h2
          id="related-tools"
          className="text-xl font-bold text-slate-900 dark:text-white"
        >
          More in {studio.name}
        </h2>
        <button
          onClick={() => openCommandMenu()}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
        >
          <Search className="h-4 w-4" aria-hidden />
          Search every tool
        </button>
      </div>
      <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {others.map((tool) => {
          const Icon = tool.icon;
          return (
            <li key={tool.id}>
              <Link
                href={tool.href}
                className={cn(
                  'group flex h-full items-start gap-3 rounded-xl border border-slate-200 bg-white p-4 transition-colors dark:border-slate-800 dark:bg-slate-900',
                  accent.hoverBorder,
                )}
              >
                <span
                  className={cn(
                    'flex h-9 w-9 shrink-0 items-center justify-center rounded-lg',
                    accent.tile,
                  )}
                >
                  <Icon className="h-[18px] w-[18px]" aria-hidden />
                </span>
                <span className="min-w-0">
                  <span className="flex items-center gap-1 text-[15px] font-semibold text-slate-900 dark:text-white">
                    {tool.title}
                    <ArrowRight
                      className="h-3.5 w-3.5 -translate-x-1 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100"
                      aria-hidden
                    />
                  </span>
                  <span className="mt-0.5 block text-sm leading-snug text-slate-600 dark:text-slate-400">
                    {tool.desc}
                  </span>
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

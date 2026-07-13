'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Search } from 'lucide-react';
import { StudioHero } from './StudioHero';
import { StudioSearchBar } from './StudioSearchBar';
import { StudioFilterChips } from './StudioFilterChips';
import { StudioToolGroup } from './StudioToolGroup';
import { StudioSearchResult } from './StudioSearchResult';
import type {
  StudioTool,
  StudioGroup,
  StudioHeroConfig,
} from '../types/studio';

interface StudioPageLayoutProps {
  tools: StudioTool[];
  groups: StudioGroup[];
  hero: StudioHeroConfig;
  searchPlaceholder?: string;
  backHref?: string;
  backLabel?: string;
  footerCta?: { label: string; href: string };
  footerNote?: string;
  accentHover?: string;
}

export function StudioPageLayout({
  tools,
  groups,
  hero,
  searchPlaceholder = 'Search tools…',
  backHref = '/',
  backLabel = 'Back to home',
  footerCta,
  footerNote,
  accentHover = 'hover:text-blue-600 dark:hover:text-blue-400',
}: StudioPageLayoutProps) {
  const [query, setQuery] = useState('');
  const [activeGroup, setActiveGroup] = useState('all');

  const liveCount = tools.filter((t) => t.status === 'live').length;
  const totalCount = tools.length;

  const searchResults = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return null;
    return tools.filter(
      (t) =>
        t.title.toLowerCase().includes(q) ||
        t.desc.toLowerCase().includes(q) ||
        t.tags.some((tag) => tag.includes(q)),
    );
  }, [query, tools]);

  const filteredGroups = useMemo(
    () =>
      activeGroup === 'all'
        ? groups
        : groups.filter((g) => g.id === activeGroup),
    [activeGroup, groups],
  );

  const isSearching = searchResults !== null;

  const handleQueryChange = (v: string) => {
    setQuery(v);
    if (v) setActiveGroup('all');
  };

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300 selection:bg-blue-500 selection:text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back nav */}
        <Link
          href={backHref}
          className={`inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 ${accentHover} transition-colors group mb-8`}
        >
          <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
          {backLabel}
        </Link>

        {/* Hero */}
        <StudioHero
          config={hero}
          liveCount={liveCount}
          totalCount={totalCount}
        />

        {/* Search */}
        <StudioSearchBar
          value={query}
          onChange={handleQueryChange}
          placeholder={searchPlaceholder}
        />

        {/* Filter chips */}
        {!isSearching && (
          <StudioFilterChips
            groups={groups}
            activeGroup={activeGroup}
            toolCount={(id) => tools.filter((t) => t.group === id).length}
            onChange={setActiveGroup}
          />
        )}

        {/* Search results */}
        {isSearching && (
          <div className="space-y-3 mb-8">
            <div className="flex items-center justify-between">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                {searchResults!.length === 0
                  ? 'No results'
                  : `${searchResults!.length} result${searchResults!.length !== 1 ? 's' : ''} for "${query}"`}
              </p>
              <button
                onClick={() => setQuery('')}
                className="text-[11px] font-bold text-blue-500 hover:text-blue-700 cursor-pointer transition-colors"
              >
                Clear search
              </button>
            </div>

            {searchResults!.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 gap-3 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl">
                <Search className="w-8 h-8 text-slate-200 dark:text-slate-700" />
                <p className="text-sm font-semibold text-slate-400 dark:text-slate-500">
                  No tools match &quot;{query}&quot;
                </p>
                <p className="text-xs text-slate-300 dark:text-slate-600 max-w-xs">
                  Try a different keyword or browse by category below
                </p>
                <button
                  onClick={() => setQuery('')}
                  className="mt-1 px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs font-bold hover:bg-slate-200 dark:hover:bg-slate-700 cursor-pointer transition-colors"
                >
                  Browse all tools
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-2.5">
                {searchResults!.map((tool) => (
                  <StudioSearchResult
                    key={tool.id}
                    tool={tool}
                    query={query}
                    groups={groups}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Grouped tools */}
        {!isSearching && (
          <div className="space-y-10">
            {filteredGroups.map((group) => (
              <StudioToolGroup
                key={group.id}
                group={group}
                tools={tools.filter((t) => t.group === group.id)}
                query=""
              />
            ))}
          </div>
        )}

        {/* Footer */}
        {(footerCta || footerNote) && (
          <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-800">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              {footerNote && (
                <div className="text-center sm:text-left">
                  <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
                    {footerNote}
                  </p>
                  <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                    We&apos;re always adding new tools
                  </p>
                </div>
              )}
              {footerCta && (
                <Link
                  href={footerCta.href}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-sm font-bold hover:bg-slate-700 dark:hover:bg-slate-100 transition-all active:scale-[0.98]"
                >
                  {footerCta.label}
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

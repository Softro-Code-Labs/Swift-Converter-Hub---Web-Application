'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronDown, Menu, Search, X } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import CommandMenu, {
  openCommandMenu,
  useShortcutLabel,
} from './shell/CommandMenu';
import {
  STUDIOS,
  TOOL_COUNT,
  getStudioTools,
  studioForPath,
} from '@/config/tools';
import { STUDIO_ACCENT } from '@/config/studio-theme';
import { cn } from '@/lib/utils';
import { LogoMark } from '@/components/brand/LogoMark';

const PAGES = [
  { label: 'Blog', href: '/blog' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
];

export function BrandMark({ size = 'md' }: { size?: 'sm' | 'md' }) {
  return (
    <span className="flex items-center gap-2.5">
      <LogoMark size={size === 'sm' ? 26 : 30} />
      <span
        className={cn(
          'font-display tracking-tight text-slate-900 dark:text-white',
          size === 'sm' ? 'text-[15px]' : 'text-[17px]',
        )}
      >
        <span className="font-extrabold">Swift</span>{' '}
        <span className="font-semibold text-slate-600 dark:text-slate-300">
          Converter Hub
        </span>
      </span>
    </span>
  );
}

export default function Navbar() {
  const pathname = usePathname();
  const shortcut = useShortcutLabel();
  const [menuOpen, setMenuOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const currentStudio = studioForPath(pathname);

  // Close menus on navigation (adjusted during render, no extra effect pass).
  const [prevPathname, setPrevPathname] = useState(pathname);
  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    setMenuOpen(false);
    setDrawerOpen(false);
  }

  // Close the tools menu on outside click / Escape.
  useEffect(() => {
    if (!menuOpen) return;
    const onDown = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node))
        setMenuOpen(false);
    };
    const onKey = (e: KeyboardEvent) =>
      e.key === 'Escape' && setMenuOpen(false);
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [menuOpen]);

  // Lock page scroll while the mobile drawer is open; Escape closes it.
  useEffect(() => {
    document.body.style.overflow = drawerOpen ? 'hidden' : '';
    if (!drawerOpen) return;
    const onKey = (e: KeyboardEvent) =>
      e.key === 'Escape' && setDrawerOpen(false);
    document.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', onKey);
    };
  }, [drawerOpen]);

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-slate-200/80 bg-white/85 backdrop-blur-md dark:border-slate-800 dark:bg-slate-950/85">
        <div ref={menuRef} className="relative">
          <div className="mx-auto flex h-[var(--header-h)] max-w-7xl items-center gap-3 px-4 sm:px-6 lg:px-8">
            <Link
              href="/"
              className="shrink-0 rounded-lg"
              aria-label="Swift Converter Hub home"
            >
              <BrandMark />
            </Link>

            {/* Desktop navigation */}
            <nav
              className="ml-6 hidden items-center gap-1 md:flex"
              aria-label="Main"
            >
              <button
                type="button"
                data-tour="studios-nav"
                onClick={() => setMenuOpen((o) => !o)}
                aria-expanded={menuOpen}
                aria-controls="tools-menu"
                className={cn(
                  'flex h-9 items-center gap-1.5 rounded-lg px-3 text-sm font-medium transition-colors',
                  menuOpen || currentStudio
                    ? 'bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-white'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white',
                )}
              >
                All tools
                <ChevronDown
                  className={cn(
                    'h-4 w-4 transition-transform duration-200',
                    menuOpen && 'rotate-180',
                  )}
                  aria-hidden
                />
              </button>
              {PAGES.slice(0, 2).map((p) => (
                <Link
                  key={p.href}
                  href={p.href}
                  aria-current={isActive(p.href) ? 'page' : undefined}
                  className={cn(
                    'flex h-9 items-center rounded-lg px-3 text-sm font-medium transition-colors',
                    isActive(p.href)
                      ? 'bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-white'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white',
                  )}
                >
                  {p.label}
                </Link>
              ))}
            </nav>

            <div className="ml-auto flex items-center gap-2">
              {/* Search trigger - full field on desktop, icon on mobile */}
              <button
                type="button"
                data-tour="search"
                onClick={() => openCommandMenu()}
                className="hidden h-9 w-64 items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 pl-3 pr-1.5 text-sm text-slate-500 transition-colors hover:border-slate-300 hover:bg-white sm:flex lg:w-72 dark:border-slate-700/80 dark:bg-slate-900 dark:text-slate-400 dark:hover:border-slate-600"
              >
                <Search className="h-4 w-4" aria-hidden />
                <span className="flex-1 text-left">
                  Search {TOOL_COUNT} tools…
                </span>
                {shortcut && (
                  <kbd className="rounded-md border border-slate-200 bg-white px-1.5 py-0.5 font-sans text-[11px] font-medium text-slate-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400">
                    {shortcut}
                  </kbd>
                )}
              </button>
              <button
                type="button"
                onClick={() => openCommandMenu()}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-600 hover:bg-slate-100 sm:hidden dark:text-slate-300 dark:hover:bg-slate-800"
                aria-label="Search tools"
              >
                <Search className="h-[18px] w-[18px]" />
              </button>

              <ThemeToggle />

              <button
                type="button"
                onClick={() => setDrawerOpen(true)}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-600 hover:bg-slate-100 md:hidden dark:text-slate-300 dark:hover:bg-slate-800"
                aria-label="Open menu"
                aria-expanded={drawerOpen}
              >
                <Menu className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Desktop "All tools" directory */}
          {menuOpen && (
            <div
              id="tools-menu"
              className="absolute inset-x-0 top-full hidden border-b border-slate-200 bg-white shadow-xl shadow-slate-900/5 md:block dark:border-slate-800 dark:bg-slate-900 animate-in fade-in-0 slide-in-from-top-1 duration-150"
            >
              <div className="mx-auto grid max-w-7xl grid-cols-3 gap-x-8 gap-y-7 px-8 py-7 xl:grid-cols-6 xl:gap-x-6">
                {STUDIOS.map((studio) => {
                  const accent = STUDIO_ACCENT[studio.id];
                  const Icon = studio.icon;
                  return (
                    <div key={studio.id} className="min-w-0">
                      <Link
                        href={studio.href}
                        className="group mb-2.5 flex items-center gap-2.5 rounded-lg"
                      >
                        <span
                          className={cn(
                            'flex h-8 w-8 shrink-0 items-center justify-center rounded-lg',
                            accent.tile,
                          )}
                        >
                          <Icon className="h-4 w-4" aria-hidden />
                        </span>
                        <span className="text-sm font-semibold text-slate-900 group-hover:underline dark:text-white">
                          {studio.name}
                        </span>
                      </Link>
                      <ul className="space-y-0.5">
                        {getStudioTools(studio.id).map((tool) => (
                          <li key={tool.id}>
                            <Link
                              href={tool.href}
                              aria-current={
                                isActive(tool.href) ? 'page' : undefined
                              }
                              className={cn(
                                '-mx-2 block truncate rounded-md px-2 py-1 text-[13.5px] transition-colors',
                                isActive(tool.href)
                                  ? cn('font-medium', accent.soft, accent.text)
                                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white',
                              )}
                            >
                              {tool.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                })}
              </div>
              <div className="border-t border-slate-100 bg-slate-50/70 dark:border-slate-800 dark:bg-slate-950/40">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-8 py-3 text-[13px] text-slate-500 dark:text-slate-400">
                  <span>
                    Every tool runs in your browser. Files are never uploaded.
                  </span>
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      openCommandMenu();
                    }}
                    className="font-medium text-slate-700 hover:underline dark:text-slate-200"
                  >
                    Search all tools
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Mobile drawer */}
      {drawerOpen && (
        <div
          className="fixed inset-0 z-[80] md:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
        >
          <div
            className="absolute inset-0 bg-slate-950/40 animate-in fade-in-0"
            onClick={() => setDrawerOpen(false)}
          />
          <div className="absolute inset-y-0 right-0 flex w-full max-w-sm flex-col bg-white shadow-2xl dark:bg-slate-900 animate-in slide-in-from-right duration-200">
            <div className="flex h-[var(--header-h)] shrink-0 items-center justify-between border-b border-slate-200 px-4 dark:border-slate-800">
              <BrandMark size="sm" />
              <button
                onClick={() => setDrawerOpen(false)}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                aria-label="Close menu"
                autoFocus
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-4">
              <button
                onClick={() => {
                  setDrawerOpen(false);
                  openCommandMenu();
                }}
                className="mb-4 flex h-11 w-full items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 text-[15px] text-slate-500 dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-400"
              >
                <Search className="h-4 w-4" />
                Search {TOOL_COUNT} tools…
              </button>

              <div className="space-y-1">
                {STUDIOS.map((studio) => {
                  const accent = STUDIO_ACCENT[studio.id];
                  const Icon = studio.icon;
                  const here = currentStudio?.id === studio.id;
                  return (
                    <details
                      key={studio.id}
                      open={here}
                      className="group rounded-xl"
                    >
                      <summary className="flex list-none items-center gap-3 rounded-xl px-2 py-2.5 hover:bg-slate-50 dark:hover:bg-slate-800/60 [&::-webkit-details-marker]:hidden">
                        <span
                          className={cn(
                            'flex h-9 w-9 shrink-0 items-center justify-center rounded-lg',
                            accent.tile,
                          )}
                        >
                          <Icon className="h-[18px] w-[18px]" aria-hidden />
                        </span>
                        <span className="flex-1">
                          <span className="block text-[15px] font-semibold text-slate-900 dark:text-white">
                            {studio.name}
                          </span>
                          <span className="block text-[13px] text-slate-500 dark:text-slate-400">
                            {getStudioTools(studio.id).length} tools
                          </span>
                        </span>
                        <ChevronDown className="h-4 w-4 text-slate-400 transition-transform group-open:rotate-180" />
                      </summary>
                      <ul className="mb-2 ml-[1.625rem] border-l border-slate-200 pl-4 dark:border-slate-700">
                        <li>
                          <Link
                            href={studio.href}
                            className="block py-2 text-[15px] font-medium text-slate-900 dark:text-white"
                          >
                            Overview
                          </Link>
                        </li>
                        {getStudioTools(studio.id).map((tool) => (
                          <li key={tool.id}>
                            <Link
                              href={tool.href}
                              aria-current={
                                isActive(tool.href) ? 'page' : undefined
                              }
                              className={cn(
                                'block py-2 text-[15px]',
                                isActive(tool.href)
                                  ? cn('font-semibold', accent.text)
                                  : 'text-slate-600 dark:text-slate-300',
                              )}
                            >
                              {tool.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </details>
                  );
                })}
              </div>

              <div className="mt-4 border-t border-slate-200 pt-4 dark:border-slate-800">
                {PAGES.map((p) => (
                  <Link
                    key={p.href}
                    href={p.href}
                    className="block rounded-lg px-2 py-2.5 text-[15px] font-medium text-slate-700 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-800/60"
                  >
                    {p.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <CommandMenu />
    </>
  );
}

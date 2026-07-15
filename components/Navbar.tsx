'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import ThemeToggle from './ThemeToggle';
import {
  ChevronDown,
  Menu,
  X,
  ImageIcon,
  FileText,
  AudioLines,
  Clapperboard,
  Database,
  Type,
  Info,
  ArrowRight,
  Mail,
} from 'lucide-react';

const STUDIOS = [
  {
    name: 'Image Studio',
    href: '/image',
    icon: ImageIcon,
    color: 'bg-blue-100 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400',
    desc: 'Convert WebP, PNG, JPEG and 150+ formats.',
  },
  {
    name: 'Audio Studio',
    href: '/audio',
    icon: AudioLines,
    color:
      'bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400',
    desc: 'Transcode MP3, WAV, FLAC and more.',
  },
  {
    name: 'Video Studio',
    href: '/video',
    icon: Clapperboard,
    color:
      'bg-purple-100 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400',
    desc: 'Convert MP4, WebM, clip and compress.',
  },
  {
    name: 'Document Suite',
    href: '/file',
    icon: FileText,
    color: 'bg-cyan-100 dark:bg-cyan-950/50 text-cyan-600 dark:text-cyan-400',
    desc: 'PDF, Word, Excel and document tools.',
  },
  {
    name: 'Data Studio',
    href: '/data',
    icon: Database,
    color:
      'bg-amber-100 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400',
    desc: 'JSON, CSV, XML conversion and parsing.',
  },
  {
    name: 'Character Studio',
    href: '/character',
    icon: Type,
    color: 'bg-rose-100 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400',
    desc: 'Text encoding, case and regex tools.',
  },
];

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropOpen, setDropOpen] = useState(false);
  const dropRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMobileOpen(false);
    setDropOpen(false);
  }, [pathname]);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropRef.current && !dropRef.current.contains(e.target as Node)) {
        setDropOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const isStudioActive = STUDIOS.some((s) => pathname.startsWith(s.href));

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-950/90 backdrop-blur-md transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-15 items-center justify-between gap-4 py-3">
          {/* -- Logo ------------------------------------------------------ */}
          <Link
            href="/"
            className="flex items-center gap-2.5 shrink-0 group focus:outline-none"
          >
            <div className="relative h-8 w-8 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 flex items-center justify-center shadow-sm group-hover:border-blue-400 dark:group-hover:border-blue-500 transition-all duration-200">
              <Image
                src="/logo-icon.png"
                alt="Swift Converter Hub"
                width={20}
                height={20}
                className="object-contain group-hover:scale-110 transition-transform duration-300"
                priority
              />
            </div>
            <span className="text-sm sm:text-base font-black text-slate-900 dark:text-white tracking-tight">
              Swift{' '}
              <span className="bg-gradient-to-r from-blue-600 to-cyan-500 dark:from-blue-400 dark:to-cyan-400 bg-clip-text text-transparent">
                Converter Hub
              </span>
            </span>
          </Link>

          {/* -- Desktop nav ----------------------------------------------- */}
          <div className="hidden md:flex items-center gap-1">
            {/* Studios dropdown */}
            <div className="relative" ref={dropRef}>
              <button
                onClick={() => setDropOpen((p) => !p)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold cursor-pointer transition-all
                  ${
                    isStudioActive || dropOpen
                      ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                  }`}
                aria-expanded={dropOpen}
                aria-haspopup="true"
              >
                Studios
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${dropOpen ? 'rotate-180' : ''}`}
                />
              </button>

              {dropOpen && (
                <div className="absolute left-[-30vh] top-full mt-2 w-[520px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-3 z-50">
                  {/* Header */}
                  <div className="px-2 py-1.5 mb-2 border-b border-slate-100 dark:border-slate-800">
                    <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                      Processing Studios
                    </p>
                  </div>

                  {/* Grid */}
                  <div className="grid grid-cols-2 gap-1">
                    {STUDIOS.map((studio) => {
                      const Icon = studio.icon;
                      const active = pathname.startsWith(studio.href);
                      return (
                        <Link
                          key={studio.name}
                          href={studio.href}
                          className={`flex items-start gap-3 p-3 rounded-xl transition-all group/item
                            ${
                              active
                                ? 'bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/50'
                                : 'hover:bg-slate-50 dark:hover:bg-slate-800/60 border border-transparent'
                            }`}
                        >
                          <div
                            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${studio.color}`}
                          >
                            <Icon className="w-4 h-4" />
                          </div>
                          <div className="min-w-0">
                            <p
                              className={`text-xs font-bold ${active ? 'text-blue-600 dark:text-blue-400' : 'text-slate-800 dark:text-slate-200 group-hover/item:text-blue-600 dark:group-hover/item:text-blue-400'}`}
                            >
                              {studio.name}
                            </p>
                            <p className="text-[10px] text-slate-400 dark:text-slate-500 leading-relaxed mt-0.5">
                              {studio.desc}
                            </p>
                          </div>
                        </Link>
                      );
                    })}
                  </div>

                  {/* Footer */}
                  <div className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-800 px-2">
                    <Link
                      href="/"
                      className="flex items-center justify-between text-[11px] font-semibold text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                    >
                      <span>View all tools on homepage</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* About & Contact */}
            <Link
              href="/about"
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold transition-all
                ${
                  pathname === '/about'
                    ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                }`}
            >
              <Info className="w-3.5 h-3.5" />
              About
            </Link>

            <Link
              href="/contact"
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold transition-all
                ${
                  pathname === '/contact'
                    ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                }`}
            >
              <Mail className="w-3.5 h-3.5" />
              Contact
            </Link>

            <div className="w-px h-5 bg-slate-200 dark:bg-slate-700 mx-1" />
            <ThemeToggle />
          </div>

          {/* -- Mobile controls ------------------------------------------- */}
          <div className="flex md:hidden items-center gap-2">
            <ThemeToggle />
            <button
              onClick={() => setMobileOpen((p) => !p)}
              className="flex items-center justify-center w-9 h-9 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-all"
              aria-label="Toggle menu"
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? (
                <X className="w-4 h-4" />
              ) : (
                <Menu className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* -- Mobile menu --------------------------------------------------- */}
      {mobileOpen && (
        <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 max-h-[calc(100vh-60px)] overflow-y-auto">
          <div className="px-4 py-4 space-y-4">
            {/* Studios */}
            <div>
              <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest px-1 mb-2">
                Studios
              </p>
              <div className="space-y-1">
                {STUDIOS.map((studio) => {
                  const Icon = studio.icon;
                  const active = pathname.startsWith(studio.href);
                  return (
                    <Link
                      key={studio.name}
                      href={studio.href}
                      className={`flex items-center gap-3 p-3 rounded-xl border transition-all
                        ${
                          active
                            ? 'bg-blue-50 dark:bg-blue-950/30 border-blue-100 dark:border-blue-900/40 text-blue-600 dark:text-blue-400'
                            : 'border-transparent hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-300'
                        }`}
                    >
                      <div
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${studio.color}`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs font-bold">{studio.name}</p>
                        <p className="text-[10px] text-slate-400 dark:text-slate-500">
                          {studio.desc}
                        </p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* About & Contact */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
              <Link
                href="/about"
                className={`flex items-center gap-3 p-3 rounded-xl border transition-all
                  ${
                    pathname === '/about'
                      ? 'bg-blue-50 dark:bg-blue-950/30 border-blue-100 dark:border-blue-900/40 text-blue-600 dark:text-blue-400'
                      : 'border-transparent text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                  }`}
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500">
                  <Info className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold">About</span>
              </Link>

              <Link
                href="/contact"
                className={`flex items-center gap-3 p-3 rounded-xl border transition-all
                  ${
                    pathname === '/contact'
                      ? 'bg-blue-50 dark:bg-blue-950/30 border-blue-100 dark:border-blue-900/40 text-blue-600 dark:text-blue-400'
                      : 'border-transparent hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-600 dark:text-slate-400'
                  }`}
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500">
                  <Mail className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold">Contact</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

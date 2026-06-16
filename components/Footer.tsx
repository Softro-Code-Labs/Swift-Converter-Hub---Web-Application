'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Shield, Zap, Globe, ArrowRight } from 'lucide-react';

const STUDIO_LINKS = [
  {
    label: 'Image Studio',
    href: '/image',
    color: 'hover:text-blue-600 dark:hover:text-blue-400',
  },
  {
    label: 'Audio Studio',
    href: '/audio',
    color: 'hover:text-emerald-600 dark:hover:text-emerald-400',
  },
  {
    label: 'Video Studio',
    href: '/video',
    color: 'hover:text-purple-600 dark:hover:text-purple-400',
  },
  {
    label: 'Document Suite',
    href: '/file',
    color: 'hover:text-cyan-600 dark:hover:text-cyan-400',
  },
  {
    label: 'Data Studio',
    href: '/data',
    color: 'hover:text-amber-600 dark:hover:text-amber-400',
  },
  {
    label: 'Character Studio',
    href: '/character',
    color: 'hover:text-rose-600 dark:hover:text-rose-400',
  },
];

const POPULAR_LINKS = [
  { label: 'JPG to PNG', href: '/image/jpg-to-png' },
  { label: 'PNG to WebP', href: '/image/png-to-webp' },
  { label: 'HEIC to JPG', href: '/image/heic-to-jpg' },
  { label: 'JPG to ICO', href: '/image/jpg-to-ico' },
  { label: 'SVG to PNG', href: '/image/svg-to-png' },
  { label: 'PDF Convert', href: '/file' },
];

const LEGAL_LINKS = [
  { label: 'Privacy Policy', href: '/privacy' },
  { label: 'Terms of Use', href: '/terms' },
  { label: 'Contact', href: '/contact' },
  { label: 'About', href: '/about' },
];

const TRUST_BADGES = [
  {
    icon: Shield,
    label: 'No server uploads',
    color:
      'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 ring-emerald-200 dark:ring-emerald-800/50',
  },
  {
    icon: Zap,
    label: 'WebAssembly powered',
    color:
      'bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-400 ring-blue-200 dark:ring-blue-800/50',
  },
  {
    icon: Globe,
    label: 'Works offline',
    color:
      'bg-slate-50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400 ring-slate-200 dark:ring-slate-700',
  },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 mt-auto transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ── Main grid ───────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 py-12 border-b border-slate-100 dark:border-slate-800">
          {/* Brand */}
          <div className="col-span-2 sm:col-span-1 space-y-4">
            <Link
              href="/"
              className="flex items-center gap-2 group focus:outline-none"
            >
              <div className="h-7 w-7 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center">
                <Image
                  src="/logo-icon.png"
                  alt="Swift Converter Hub"
                  width={16}
                  height={16}
                  className="object-contain"
                />
              </div>
              <span className="text-sm font-black text-slate-900 dark:text-white">
                Swift{' '}
                <span className="bg-gradient-to-r from-blue-600 to-cyan-500 dark:from-blue-400 dark:to-cyan-400 bg-clip-text text-transparent">
                  Converter Hub
                </span>
              </span>
            </Link>
            <p className="text-xs text-slate-400 dark:text-slate-500 leading-relaxed">
              A free, privacy-first file conversion toolkit. Everything runs in
              your browser — nothing is ever uploaded.
            </p>
            {/* Trust badges */}
            <div className="space-y-1.5">
              {TRUST_BADGES.map(({ icon: Icon, label, color }) => (
                <span
                  key={label}
                  className={`inline-flex items-center gap-1.5 text-[10px] font-semibold px-2.5 py-1 rounded-lg ring-1 ring-inset ${color} mr-1.5`}
                >
                  <Icon className="w-3 h-3" />
                  {label}
                </span>
              ))}
            </div>
          </div>

          {/* Studios */}
          <div className="space-y-3">
            <h3 className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
              Studios
            </h3>
            <ul className="space-y-2">
              {STUDIO_LINKS.map(({ label, href, color }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className={`text-xs font-semibold text-slate-500 dark:text-slate-400 ${color} transition-colors inline-flex items-center gap-1 group`}
                  >
                    {label}
                    <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Popular conversions */}
          <div className="space-y-3">
            <h3 className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
              Popular
            </h3>
            <ul className="space-y-2">
              {POPULAR_LINKS.map(({ label, href }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors inline-flex items-center gap-1 group"
                  >
                    {label}
                    <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div className="space-y-3">
            <h3 className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
              Company
            </h3>
            <ul className="space-y-2">
              {LEGAL_LINKS.map(({ label, href }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors inline-flex items-center gap-1 group"
                  >
                    {label}
                    <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* ── Bottom bar ──────────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 py-5 text-[11px] text-slate-400 dark:text-slate-500">
          <p>© {year} SwiftConverterHub · All rights reserved</p>
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-medium">
              All systems operational · Zero server processing
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}

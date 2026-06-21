'use client';

import Link from 'next/link';
import {
  ArrowLeft,
  Type,
  Hash,
  CaseSensitive,
  RefreshCw,
  FileCheck,
  Binary,
  Shield,
  Bell,
} from 'lucide-react';

const TOOLS = [
  {
    icon: Hash,
    title: 'Word & Character Counter',
    desc: 'Live count of words, characters, sentences and estimated read time.',
    color: 'bg-rose-100 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400',
  },
  {
    icon: CaseSensitive,
    title: 'Case Converter',
    desc: 'UPPERCASE, lowercase, camelCase, snake_case, Title Case and more.',
    color: 'bg-blue-100 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400',
  },
  {
    icon: RefreshCw,
    title: 'Find & Replace',
    desc: 'Swap text or use regex patterns to replace matches in bulk.',
    color:
      'bg-amber-100 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400',
  },
  {
    icon: FileCheck,
    title: 'Markdown Preview',
    desc: 'Live-render Markdown into formatted HTML as you type.',
    color:
      'bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400',
  },
  {
    icon: Binary,
    title: 'Regex Tester',
    desc: 'Test patterns live with match highlighting and capture groups.',
    color:
      'bg-purple-100 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400',
  },
] as const;

export default function CharacterStudioClient() {
  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300 selection:bg-blue-500 selection:text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors group mb-8"
        >
          <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
          Back to home
        </Link>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 mb-6">
          <div className="flex items-start gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-rose-100 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400">
              <Type className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
                  Character Studio
                </h1>
                <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/50 text-amber-700 dark:text-amber-400">
                  <Bell className="w-2.5 h-2.5" /> Coming soon
                </span>
              </div>
              <p className="text-xs text-slate-400 dark:text-slate-500">
                Pure JavaScript text utilities - no engine needed
              </p>
            </div>
          </div>
          <p className="mt-5 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            Unlike our image tools, text utilities run on plain JavaScript - no
            WebAssembly required. That means these tools will be instant the
            moment they ship, with zero processing delay.
          </p>
          <div className="mt-4 flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400">
            <Shield className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
            <span className="font-semibold">
              100% private - your text never leaves the page
            </span>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest flex items-center gap-2">
            <span className="w-1 h-3 rounded-full bg-rose-500 inline-block" />
            Planned tools
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {TOOLS.map(({ icon: Icon, title, desc, color }) => (
              <div
                key={title}
                className="flex gap-4 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 opacity-80"
              >
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${color}`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                    {title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    {desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Have a text tool idea?{' '}
            <Link
              href="/contact"
              className="font-bold text-blue-600 dark:text-blue-400 hover:underline"
            >
              Suggest it
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}

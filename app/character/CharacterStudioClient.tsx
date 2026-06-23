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
  ArrowRight,
  Sparkles,
} from 'lucide-react';

// --- Tool registry ------------------------------------------------------------
const TOOLS = [
  {
    id: 'word-counter',
    icon: Hash,
    title: 'Word & Character Counter',
    desc: 'Live count of words, characters, sentences, and estimated read time as you type.',
    color: 'bg-rose-100 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400',
    accentBorder: 'hover:border-rose-300 dark:hover:border-rose-700',
    href: '/character/word-counter',
    status: 'live' as const,
  },
  {
    id: 'case-converter',
    icon: CaseSensitive,
    title: 'Case Converter',
    desc: 'UPPERCASE, lowercase, camelCase, snake_case, Title Case, and more in one click.',
    color: 'bg-blue-100 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400',
    accentBorder: 'hover:border-blue-300 dark:hover:border-blue-700',
    href: '/character/case-converter',
    status: 'live' as const,
  },
  {
    id: 'find-replace',
    icon: RefreshCw,
    title: 'Find & Replace',
    desc: 'Swap plain text or use regex patterns to replace matches across your content in bulk.',
    color:
      'bg-amber-100 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400',
    accentBorder: 'hover:border-amber-300 dark:hover:border-amber-700',
    href: '/character/find-replace',
    status: 'live' as const,
  },
  {
    id: 'markdown-preview',
    icon: FileCheck,
    title: 'Markdown Preview',
    desc: 'Live-render Markdown into formatted HTML as you type - great for READMEs and docs.',
    color:
      'bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400',
    accentBorder: 'hover:border-emerald-300 dark:hover:border-emerald-700',
    href: '/character/markdown-preview',
    status: 'soon' as const,
  },
  {
    id: 'regex-tester',
    icon: Binary,
    title: 'Regex Tester',
    desc: 'Test patterns live with full match highlighting, capture groups, and flag controls.',
    color:
      'bg-purple-100 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400',
    accentBorder: 'hover:border-purple-300 dark:hover:border-purple-700',
    href: '/character/regex-tester',
    status: 'soon' as const,
  },
] as const;

// --- Sub-components -----------------------------------------------------------

function StatusBadge({ status }: { status: 'live' | 'soon' }) {
  if (status === 'live') {
    return (
      <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400">
        <span className="relative flex h-1.5 w-1.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
        </span>
        Live
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
      Soon
    </span>
  );
}

interface ToolCardProps {
  tool: (typeof TOOLS)[number];
}

function ToolCard({ tool }: ToolCardProps) {
  const { icon: Icon, title, desc, color, accentBorder, href, status } = tool;

  const isLive = status === 'live';

  const inner = (
    <div
      className={`group flex gap-4 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 transition-all duration-200
        ${isLive ? `cursor-pointer ${accentBorder} hover:shadow-md hover:-translate-y-0.5` : 'opacity-60 cursor-default'}`}
    >
      <div
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${color}`}
      >
        <Icon className="w-5 h-5" />
      </div>
      <div className="flex-1 min-w-0 space-y-1">
        <div className="flex items-center gap-2 flex-wrap">
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
            {title}
          </h3>
          <StatusBadge status={status} />
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
          {desc}
        </p>
      </div>
      {isLive && (
        <ArrowRight className="w-4 h-4 text-slate-300 dark:text-slate-600 shrink-0 self-center group-hover:text-blue-500 group-hover:translate-x-0.5 transition-all" />
      )}
    </div>
  );

  return isLive ? <Link href={href}>{inner}</Link> : <div>{inner}</div>;
}

// --- Page ---------------------------------------------------------------------

export default function CharacterStudioClient() {
  const liveCount = TOOLS.filter((t) => t.status === 'live').length;

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300 selection:bg-blue-500 selection:text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back nav */}
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors group mb-8"
        >
          <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
          Back to home
        </Link>

        {/* Hero card */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 mb-8">
          <div className="flex items-start gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-rose-100 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400">
              <Type className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
                  Character Studio
                </h1>
                {liveCount > 0 && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400">
                    <Sparkles className="w-2.5 h-2.5" />
                    {liveCount} tool{liveCount !== 1 ? 's' : ''} live
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 dark:text-slate-500">
                Pure JavaScript text utilities - no engine, no wait, no upload
              </p>
            </div>
          </div>

          <p className="mt-5 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            Unlike our image tools, every Character Studio utility runs on plain
            JavaScript - no WebAssembly, no server round-trips. Open a tool and
            it&apos;s instantly ready. Your text never leaves your browser tab.
          </p>

          <div className="mt-4 flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400">
            <Shield className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
            <span className="font-semibold">
              100% private - your text is never sent to any server
            </span>
          </div>
        </div>

        {/* Tool grid */}
        <div className="space-y-4">
          <h2 className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest flex items-center gap-2">
            <span className="w-1 h-3 rounded-full bg-rose-500 inline-block" />
            Text tools
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {TOOLS.map((tool) => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>
        </div>

        {/* Footer CTA */}
        <div className="mt-10 text-center">
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

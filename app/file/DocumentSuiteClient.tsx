'use client';

import Link from 'next/link';
import {
  ArrowLeft,
  FileText,
  Layers,
  Scissors,
  FileDown,
  RefreshCw,
  FileSignature,
  Shield,
  Bell,
} from 'lucide-react';

const TOOLS = [
  {
    icon: Layers,
    title: 'Merge PDF Files',
    desc: 'Combine multiple PDFs into a single document.',
    color: 'bg-cyan-100 dark:bg-cyan-950/50 text-cyan-600 dark:text-cyan-400',
  },
  {
    icon: Scissors,
    title: 'Split PDF Pages',
    desc: 'Extract specific pages or split into separate files.',
    color: 'bg-blue-100 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400',
  },
  {
    icon: FileDown,
    title: 'Compress PDF',
    desc: 'Reduce file size for easier sharing and email attachments.',
    color:
      'bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400',
  },
  {
    icon: RefreshCw,
    title: 'Word / Excel to PDF',
    desc: 'Convert .docx and .xlsx files to print-ready PDF documents.',
    color:
      'bg-amber-100 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400',
  },
  {
    icon: FileSignature,
    title: 'PDF Page Rotator',
    desc: 'Rotate individual pages without re-uploading the whole file.',
    color:
      'bg-purple-100 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400',
  },
] as const;

export default function DocumentSuiteClient() {
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
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-cyan-100 dark:bg-cyan-950/50 text-cyan-600 dark:text-cyan-400">
              <FileText className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
                  Document Suite
                </h1>
                <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/50 text-amber-700 dark:text-amber-400">
                  <Bell className="w-2.5 h-2.5" /> Coming soon
                </span>
              </div>
              <p className="text-xs text-slate-400 dark:text-slate-500">
                PDF and document tools, browser-native
              </p>
            </div>
          </div>
          <p className="mt-5 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            We're building PDF manipulation using pdf-lib - merge, split,
            compress and rotate pages without a server. Document conversion to
            PDF reuses the same engine that powers our Word and Excel rendering.
          </p>
          <div className="mt-4 flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400">
            <Shield className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
            <span className="font-semibold">
              Sensitive documents never leave your browser
            </span>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest flex items-center gap-2">
            <span className="w-1 h-3 rounded-full bg-cyan-500 inline-block" />
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
            Need a document tool we haven't listed?{' '}
            <Link
              href="/contact"
              className="font-bold text-blue-600 dark:text-blue-400 hover:underline"
            >
              Tell us
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}

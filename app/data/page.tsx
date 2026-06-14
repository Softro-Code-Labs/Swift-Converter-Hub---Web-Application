'use client';

import Link from 'next/link';
import {
  Database,
  ArrowLeft,
  FileSpreadsheet,
  Code,
  Layers,
  ShieldCheck,
  Sparkles,
  FileJson,
  Braces,
  Binary,
} from 'lucide-react';

export default function DataStudio() {
  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 px-4 py-12 transition-colors duration-300 selection:bg-blue-500 selection:text-white">
      <div className="max-w-4xl mx-auto space-y-10">
        {/* Navigation Breadcrumb */}
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 dark:text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors group"
          >
            <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5" />
            Back to Hub Workspace
          </Link>
        </div>

        {/* Workspace Module Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-100 dark:bg-amber-900/50 text-amber-600 dark:text-amber-400 shadow-sm">
                <Database className="w-5 h-5" />
              </span>
              <h1 className="text-2xl font-black tracking-tight sm:text-3xl text-slate-900 dark:text-white">
                Data Studio
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-xl">
              Map, sanitize, and convert complex dataset structures directly
              inside your active browser thread.
              <span className="font-semibold text-amber-600 dark:text-amber-500">
                {' '}
                Zero runtime cloud leakage. Absolute operational privacy.
              </span>
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-center px-3 py-1.5 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-100 dark:border-amber-900/50 text-amber-700 dark:text-amber-400 text-[11px] font-bold tracking-wide">
            <ShieldCheck className="w-3.5 h-3.5" />
            Laboratory Pipeline Under Construction
          </div>
        </div>

        {/* Laboratory Releases Matrix Grid */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-purple-500" />
            <h2 className="text-sm font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
              Planned Laboratory Modules
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Tool 1: CSV to JSON / JSON to CSV */}
            <div className="relative overflow-hidden flex gap-4 p-4 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800/80 bg-slate-100/40 dark:bg-slate-900/10 select-none">
              <div className="absolute top-3 right-3 px-2 py-0.5 rounded-md bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-400 text-[9px] font-black tracking-wider uppercase scale-90">
                Coming Soon
              </div>
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-200/60 dark:bg-slate-800/60 text-slate-400">
                <FileSpreadsheet className="w-5 h-5" />
              </div>
              <div className="space-y-1 pr-14">
                <h3 className="font-bold text-sm text-slate-400 dark:text-slate-500">
                  CSV ↔ JSON Array Mapper
                </h3>
                <p className="text-xs text-slate-400 dark:text-slate-600 leading-relaxed">
                  Transpose flat layout sheet tables into dynamic nested
                  JavaScript object configurations instantly.
                </p>
              </div>
            </div>

            {/* Tool 2: JSON to XML / XML to JSON */}
            <div className="relative overflow-hidden flex gap-4 p-4 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800/80 bg-slate-100/40 dark:bg-slate-900/10 select-none">
              <div className="absolute top-3 right-3 px-2 py-0.5 rounded-md bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-400 text-[9px] font-black tracking-wider uppercase scale-90">
                Coming Soon
              </div>
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-200/60 dark:bg-slate-800/60 text-slate-400">
                <Code className="w-5 h-5" />
              </div>
              <div className="space-y-1 pr-14">
                <h3 className="font-bold text-sm text-slate-400 dark:text-slate-500">
                  JSON ↔ XML Transcoder
                </h3>
                <p className="text-xs text-slate-400 dark:text-slate-600 leading-relaxed">
                  Bridge modern API data directly into standard enterprise
                  structures without server intercept setups.
                </p>
              </div>
            </div>

            {/* Tool 3: Excel to JSON */}
            <div className="relative overflow-hidden flex gap-4 p-4 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800/80 bg-slate-100/40 dark:bg-slate-900/10 select-none">
              <div className="absolute top-3 right-3 px-2 py-0.5 rounded-md bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-400 text-[9px] font-black tracking-wider uppercase scale-90">
                Coming Soon
              </div>
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-200/60 dark:bg-slate-800/60 text-slate-400">
                <Layers className="w-5 h-5" />
              </div>
              <div className="space-y-1 pr-14">
                <h3 className="font-bold text-sm text-slate-400 dark:text-slate-500">
                  Excel to JSON Extractor
                </h3>
                <p className="text-xs text-slate-400 dark:text-slate-600 leading-relaxed">
                  Parse heavy `.xlsx` multi-sheet files and convert relational
                  matrices down to light raw data tracks.
                </p>
              </div>
            </div>

            {/* Tool 4: YAML to JSON / JSON to YAML */}
            <div className="relative overflow-hidden flex gap-4 p-4 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800/80 bg-slate-100/40 dark:bg-slate-900/10 select-none">
              <div className="absolute top-3 right-3 px-2 py-0.5 rounded-md bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-400 text-[9px] font-black tracking-wider uppercase scale-90">
                Coming Soon
              </div>
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-200/60 dark:bg-slate-800/60 text-slate-400">
                <Braces className="w-5 h-5" />
              </div>
              <div className="space-y-1 pr-14">
                <h3 className="font-bold text-sm text-slate-400 dark:text-slate-500">
                  YAML ↔ JSON Schema Adaptor
                </h3>
                <p className="text-xs text-slate-400 dark:text-slate-600 leading-relaxed">
                  Fluidly flip dev-ops deployment maps back and forth between
                  object keys and tabular configuration files.
                </p>
              </div>
            </div>

            {/* Tool 5: JSON Minifier / Beautifier */}
            <div className="relative overflow-hidden flex gap-4 p-4 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800/80 bg-slate-100/40 dark:bg-slate-900/10 select-none">
              <div className="absolute top-3 right-3 px-2 py-0.5 rounded-md bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-400 text-[9px] font-black tracking-wider uppercase scale-90">
                Coming Soon
              </div>
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-200/60 dark:bg-slate-800/60 text-slate-400">
                <FileJson className="w-5 h-5" />
              </div>
              <div className="space-y-1 pr-14">
                <h3 className="font-bold text-sm text-slate-400 dark:text-slate-500">
                  JSON Formatter & Minifier
                </h3>
                <p className="text-xs text-slate-400 dark:text-slate-600 leading-relaxed">
                  Compress text spacing footprint files or inject pristine
                  semantic tabs for clean development audits.
                </p>
              </div>
            </div>

            {/* Tool 6: Base64 Decoder */}
            <div className="relative overflow-hidden flex gap-4 p-4 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800/80 bg-slate-100/40 dark:bg-slate-900/10 select-none">
              <div className="absolute top-3 right-3 px-2 py-0.5 rounded-md bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-400 text-[9px] font-black tracking-wider uppercase scale-90">
                Coming Soon
              </div>
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-200/60 dark:bg-slate-800/60 text-slate-400">
                <Binary className="w-5 h-5" />
              </div>
              <div className="space-y-1 pr-14">
                <h3 className="font-bold text-sm text-slate-400 dark:text-slate-500">
                  Base64 Encode / Decode
                </h3>
                <p className="text-xs text-slate-400 dark:text-slate-600 leading-relaxed">
                  Safely pack binary script assets into secure string arrays or
                  unwind existing streams effortlessly.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

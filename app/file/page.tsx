'use client';

import Link from 'next/link';
import {
  FileText,
  ArrowLeft,
  Layers,
  Scissors,
  FileDown,
  Lock,
  FileSignature,
  History,
  ShieldCheck,
  Sparkles,
  RefreshCw,
} from 'lucide-react';

export default function DocumentSuite() {
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
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-100 dark:bg-cyan-900/50 text-cyan-600 dark:text-cyan-400 shadow-sm">
                <FileText className="w-5 h-5" />
              </span>
              <h1 className="text-2xl font-black tracking-tight sm:text-3xl text-slate-900 dark:text-white">
                Document Suite
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-xl">
              Compile, secure, and transcode office documents natively in your
              browser thread.
              <span className="font-semibold text-cyan-600 dark:text-cyan-400">
                {' '}
                Zero cloud uploads. 100% private data isolation.
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
            {/* Tool 1: PDF Merger */}
            <div className="relative overflow-hidden flex gap-4 p-4 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800/80 bg-slate-100/40 dark:bg-slate-900/10 select-none">
              <div className="absolute top-3 right-3 px-2 py-0.5 rounded-md bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-400 text-[9px] font-black tracking-wider uppercase scale-90">
                Coming Soon
              </div>
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-200/60 dark:bg-slate-800/60 text-slate-400">
                <Layers className="w-5 h-5" />
              </div>
              <div className="space-y-1 pr-14">
                <h3 className="font-bold text-sm text-slate-400 dark:text-slate-500">
                  Merge PDF Documents
                </h3>
                <p className="text-xs text-slate-400 dark:text-slate-600 leading-relaxed">
                  Combine multiple PDF layouts or scanned file sequences into a
                  single compiled document file.
                </p>
              </div>
            </div>

            {/* Tool 2: PDF Splitter */}
            <div className="relative overflow-hidden flex gap-4 p-4 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800/80 bg-slate-100/40 dark:bg-slate-900/10 select-none">
              <div className="absolute top-3 right-3 px-2 py-0.5 rounded-md bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-400 text-[9px] font-black tracking-wider uppercase scale-90">
                Coming Soon
              </div>
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-200/60 dark:bg-slate-800/60 text-slate-400">
                <Scissors className="w-5 h-5" />
              </div>
              <div className="space-y-1 pr-14">
                <h3 className="font-bold text-sm text-slate-400 dark:text-slate-500">
                  Split PDF Pages
                </h3>
                <p className="text-xs text-slate-400 dark:text-slate-600 leading-relaxed">
                  Extract dedicated page bounds or isolate single data sheets
                  into separate individual standalone files.
                </p>
              </div>
            </div>

            {/* Tool 3: PDF Compressor */}
            <div className="relative overflow-hidden flex gap-4 p-4 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800/80 bg-slate-100/40 dark:bg-slate-900/10 select-none">
              <div className="absolute top-3 right-3 px-2 py-0.5 rounded-md bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-400 text-[9px] font-black tracking-wider uppercase scale-90">
                Coming Soon
              </div>
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-200/60 dark:bg-slate-800/60 text-slate-400">
                <FileDown className="w-5 h-5" />
              </div>
              <div className="space-y-1 pr-14">
                <h3 className="font-bold text-sm text-slate-400 dark:text-slate-500">
                  Compress PDF File Size
                </h3>
                <p className="text-xs text-slate-400 dark:text-slate-600 leading-relaxed">
                  Downscale resource-heavy document vectors to reduce file
                  weight for clean email attachments.
                </p>
              </div>
            </div>

            {/* Tool 4: Office Converter */}
            <div className="relative overflow-hidden flex gap-4 p-4 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800/80 bg-slate-100/40 dark:bg-slate-900/10 select-none">
              <div className="absolute top-3 right-3 px-2 py-0.5 rounded-md bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-400 text-[9px] font-black tracking-wider uppercase scale-90">
                Coming Soon
              </div>
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-200/60 dark:bg-slate-800/60 text-slate-400">
                <RefreshCw className="w-5 h-5" />
              </div>
              <div className="space-y-1 pr-14">
                <h3 className="font-bold text-sm text-slate-400 dark:text-slate-500">
                  Word / Excel to PDF Converter
                </h3>
                <p className="text-xs text-slate-400 dark:text-slate-600 leading-relaxed">
                  Native system translation to transcode `.docx` and `.xlsx`
                  matrices directly into readable text views.
                </p>
              </div>
            </div>

            {/* Tool 5: PDF Encrypter */}
            <div className="relative overflow-hidden flex gap-4 p-4 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800/80 bg-slate-100/40 dark:bg-slate-900/10 select-none">
              <div className="absolute top-3 right-3 px-2 py-0.5 rounded-md bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-400 text-[9px] font-black tracking-wider uppercase scale-90">
                Coming Soon
              </div>
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-200/60 dark:bg-slate-800/60 text-slate-400">
                <Lock className="w-5 h-5" />
              </div>
              <div className="space-y-1 pr-14">
                <h3 className="font-bold text-sm text-slate-400 dark:text-slate-500">
                  Password Encrypt & Protect
                </h3>
                <p className="text-xs text-slate-400 dark:text-slate-600 leading-relaxed">
                  Inject custom 128-bit AES local key encryption headers into
                  raw file formats to freeze access blocks.
                </p>
              </div>
            </div>

            {/* Tool 6: Digital Signatures */}
            <div className="relative overflow-hidden flex gap-4 p-4 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800/80 bg-slate-100/40 dark:bg-slate-900/10 select-none">
              <div className="absolute top-3 right-3 px-2 py-0.5 rounded-md bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-400 text-[9px] font-black tracking-wider uppercase scale-90">
                Coming Soon
              </div>
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-200/60 dark:bg-slate-800/60 text-slate-400">
                <FileSignature className="w-5 h-5" />
              </div>
              <div className="space-y-1 pr-14">
                <h3 className="font-bold text-sm text-slate-400 dark:text-slate-500">
                  Digital Signature Injector
                </h3>
                <p className="text-xs text-slate-400 dark:text-slate-600 leading-relaxed">
                  Draw or drop vector signatures to embed transparency tracks
                  right into system agreement pages.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

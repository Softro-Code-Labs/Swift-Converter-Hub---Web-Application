'use client';

import { useCallback, useRef } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  FileDown,
  Download,
  Trash2,
  Loader2,
  CheckCircle2,
  FileText,
  AlertCircle,
  Info,
} from 'lucide-react';
import { usePdfCompress } from '../hooks/usePdfCompress';
import { PRESETS } from '../types/pdfCompress';
import type { CompressionLevel } from '../types/pdfCompress';

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

export default function PdfCompressTool() {
  const fileRef = useRef<HTMLInputElement>(null);
  const {
    file,
    level,
    setLevel,
    isCompressing,
    result,
    error,
    loadFile,
    compress,
    clear,
  } = usePdfCompress();

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const f = e.target.files?.[0];
      if (f) loadFile(f);
      e.target.value = '';
    },
    [loadFile],
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const f = e.dataTransfer.files?.[0];
      if (f && (f.type === 'application/pdf' || f.name.endsWith('.pdf'))) {
        loadFile(f);
      }
    },
    [loadFile],
  );

  const handleDownload = useCallback(() => {
    if (!result) return;
    const baseName = file?.name.replace(/\.pdf$/i, '') ?? 'document';
    const a = document.createElement('a');
    a.href = result.url;
    a.download = `${baseName}_compressed.pdf`;
    a.click();
  }, [result, file]);

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back nav */}
        <Link
          href="/file"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors group mb-8"
        >
          <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
          Document Suite
        </Link>

        {/* Header */}
        <div className="flex items-start gap-4 mb-8">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400">
            <FileDown className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
              Compress PDF
            </h1>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
              Reduce PDF file size for easier sharing - processed entirely in
              your browser
            </p>
          </div>
        </div>

        {/* Drop zone */}
        {!file ? (
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            onClick={() => fileRef.current?.click()}
            className="flex flex-col items-center justify-center gap-4 py-16 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700 hover:border-emerald-300 dark:hover:border-emerald-700 hover:bg-emerald-50/30 dark:hover:bg-emerald-950/10 transition-all cursor-pointer"
          >
            <input
              ref={fileRef}
              type="file"
              accept=".pdf,application/pdf"
              className="hidden"
              onChange={handleFileInput}
            />
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 dark:bg-emerald-950/50 text-emerald-500">
              <FileDown className="w-7 h-7" />
            </div>
            <div className="text-center space-y-1">
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                Drop a PDF here or{' '}
                <span className="text-emerald-600 dark:text-emerald-400 font-bold underline underline-offset-2">
                  browse
                </span>
              </p>
              <p className="text-xs text-slate-400 dark:text-slate-500">
                Single PDF - processed entirely in your browser
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-5">
            {/* File info */}
            <div className="flex items-center gap-3 px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl">
              <FileText className="w-5 h-5 text-emerald-500 shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-slate-700 dark:text-slate-300 truncate">
                  {file.name}
                </p>
                <p className="text-[10px] text-slate-400 tabular-nums">
                  {formatBytes(file.size)} original
                </p>
              </div>
              <button
                onClick={clear}
                className="flex items-center gap-1 text-[10px] font-bold text-slate-400 hover:text-red-500 cursor-pointer transition-colors shrink-0"
              >
                <Trash2 className="w-3 h-3" /> Remove
              </button>
            </div>

            {/* Compression level */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-3">
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
                Compression level
              </p>
              <div className="grid grid-cols-3 gap-2">
                {PRESETS.map((preset) => (
                  <button
                    key={preset.id}
                    onClick={() => setLevel(preset.id as CompressionLevel)}
                    className={`flex flex-col gap-1.5 p-3.5 rounded-xl border-2 text-left cursor-pointer transition-all
                      ${
                        level === preset.id
                          ? 'border-emerald-400 bg-emerald-50 dark:bg-emerald-950/40'
                          : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-emerald-300 dark:hover:border-emerald-700'
                      }`}
                  >
                    <span
                      className={`text-xs font-black ${level === preset.id ? 'text-emerald-700 dark:text-emerald-300' : 'text-slate-700 dark:text-slate-300'}`}
                    >
                      {preset.label}
                    </span>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 leading-relaxed">
                      {preset.desc}
                    </span>
                  </button>
                ))}
              </div>

              {/* What gets removed */}
              {(() => {
                const preset = PRESETS.find((p) => p.id === level)!;
                const stripped: string[] = [];
                if (preset.removeMetadata) stripped.push('metadata');
                if (preset.removeAnnotations) stripped.push('annotations');
                if (preset.removeBookmarks) stripped.push('bookmarks');
                if (preset.removeAttachments) stripped.push('attachments');
                return stripped.length > 0 ? (
                  <div className="flex items-start gap-2 px-3 py-2.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl">
                    <Info className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                    <p className="text-[10px] text-slate-500 dark:text-slate-400">
                      Will remove:{' '}
                      <span className="font-bold text-slate-700 dark:text-slate-300">
                        {stripped.join(', ')}
                      </span>
                    </p>
                  </div>
                ) : null;
              })()}
            </div>

            {/* Browser limitation note */}
            <div className="flex items-start gap-2 px-4 py-3 bg-amber-50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/40 rounded-xl">
              <Info className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
              <p className="text-[11px] text-amber-700 dark:text-amber-400 font-semibold leading-relaxed">
                Browser-based compression works best on PDFs with heavy
                metadata, annotations, or bookmarks. Image-heavy PDFs may see
                minimal reduction - for those, desktop tools like Acrobat or
                Ghostscript give better results.
              </p>
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-start gap-3 px-5 py-4 rounded-2xl border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-950/20">
                <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-red-600 dark:text-red-400">
                    Compression failed
                  </p>
                  <p className="text-[11px] text-red-500 font-mono mt-0.5">
                    {error}
                  </p>
                </div>
              </div>
            )}

            {/* Compress button */}
            <button
              onClick={compress}
              disabled={isCompressing}
              className={`w-full py-3.5 rounded-2xl text-sm font-bold flex items-center justify-center gap-2 cursor-pointer transition-all
                ${
                  !isCompressing
                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm active:scale-[0.99]'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                }`}
            >
              {isCompressing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Compressing…
                </>
              ) : (
                <>
                  <FileDown className="w-4 h-4" /> Compress PDF
                </>
              )}
            </button>

            {/* Result */}
            {result && !isCompressing && (
              <div className="bg-white dark:bg-slate-900 border border-emerald-200 dark:border-emerald-900/50 rounded-2xl overflow-hidden">
                {/* Header */}
                <div className="flex items-center gap-3 px-5 py-4 border-b border-emerald-100 dark:border-emerald-900/30 bg-emerald-50/60 dark:bg-emerald-950/20">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <p className="text-sm font-bold text-emerald-700 dark:text-emerald-300">
                    {result.savedPct > 0
                      ? `Reduced by ${result.savedPct}% (${formatBytes(result.savedBytes)} saved)`
                      : 'Compressed - minimal size change for this file'}
                  </p>
                </div>

                {/* Size comparison bar */}
                <div className="px-5 py-4 space-y-3">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-[10px] text-slate-400 tabular-nums">
                      <span>
                        Original:{' '}
                        <span className="font-bold text-slate-600 dark:text-slate-300">
                          {result.originalLabel}
                        </span>
                      </span>
                      <span>
                        Compressed:{' '}
                        <span className="font-bold text-emerald-600 dark:text-emerald-400">
                          {result.sizeLabel}
                        </span>
                      </span>
                    </div>
                    <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden relative">
                      {/* Original bar (full width background) */}
                      <div className="absolute inset-0 bg-slate-200 dark:bg-slate-700 rounded-full" />
                      {/* Compressed bar */}
                      <div
                        className="absolute inset-y-0 left-0 bg-emerald-500 rounded-full transition-all duration-700"
                        style={{
                          width: `${Math.min(100, (result.compressedSize / result.originalSize) * 100)}%`,
                        }}
                      />
                    </div>
                    {result.savedPct === 0 && (
                      <p className="text-[10px] text-slate-400 italic">
                        This PDF was already well-optimised - try Maximum level
                        or a desktop tool for further reduction.
                      </p>
                    )}
                  </div>

                  {/* Download */}
                  <button
                    onClick={handleDownload}
                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold cursor-pointer transition-all active:scale-[0.98]"
                  >
                    <Download className="w-4 h-4" />
                    Download compressed PDF
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Privacy note */}
        <div className="mt-8 flex items-center gap-1.5">
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
          </span>
          <p className="text-[10px] font-semibold text-slate-400 dark:text-slate-500">
            Compressed entirely in your browser using pdf-lib - your file never
            leaves your device
          </p>
        </div>
      </div>
    </main>
  );
}

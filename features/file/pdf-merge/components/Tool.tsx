'use client';

import { useCallback, useRef } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Layers,
  Upload,
  Download,
  Trash2,
  Loader2,
  FileText,
  CheckCircle2,
  Plus,
} from 'lucide-react';
import { usePdfMerge } from '../hooks/usePdfMerge';
import { PdfFileCard } from './PdfFileCard';

export default function PdfMergeTool() {
  const fileRef = useRef<HTMLInputElement>(null);
  const {
    files,
    isMerging,
    result,
    addFiles,
    removeFile,
    reorder,
    merge,
    clearResult,
    clearAll,
  } = usePdfMerge();

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const picked = Array.from(e.target.files ?? []);
      if (picked.length) addFiles(picked);
      e.target.value = '';
    },
    [addFiles],
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const dropped = Array.from(e.dataTransfer.files);
      if (dropped.length) addFiles(dropped);
    },
    [addFiles],
  );

  const handleDownload = useCallback(() => {
    if (!result) return;
    const a = document.createElement('a');
    a.href = result.url;
    a.download = 'merged.pdf';
    a.click();
  }, [result]);

  const totalPages = files.reduce((s, f) => s + (f.pageCount ?? 0), 0);
  const hasFiles = files.length > 0;
  const canMerge = files.length >= 2 && files.every((f) => !f.error);

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back nav */}
        <Link
          href="/file"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors group mb-8"
        >
          <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
          Document Suite
        </Link>

        {/* Header */}
        <div className="flex items-start gap-4 mb-8">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-cyan-100 dark:bg-cyan-950/50 text-cyan-600 dark:text-cyan-400">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
              Merge PDF Files
            </h1>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
              Drag to reorder, then merge - processed entirely in your browser
            </p>
          </div>
        </div>

        {/* Drop zone */}
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          onClick={() => !hasFiles && fileRef.current?.click()}
          className={`relative rounded-2xl border-2 border-dashed transition-all duration-200
            ${
              hasFiles
                ? 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-4'
                : 'border-slate-200 dark:border-slate-700 hover:border-cyan-300 dark:hover:border-cyan-700 hover:bg-cyan-50/30 dark:hover:bg-cyan-950/10 cursor-pointer p-12'
            }`}
        >
          <input
            ref={fileRef}
            type="file"
            accept=".pdf,application/pdf"
            multiple
            className="hidden"
            onChange={handleFileInput}
          />

          {!hasFiles ? (
            /* Empty drop zone */
            <div className="flex flex-col items-center gap-4 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-100 dark:bg-cyan-950/50 text-cyan-500">
                <Layers className="w-7 h-7" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Drop PDF files here or{' '}
                  <span className="text-cyan-600 dark:text-cyan-400 font-bold underline underline-offset-2">
                    browse
                  </span>
                </p>
                <p className="text-xs text-slate-400 dark:text-slate-500">
                  Select two or more PDFs - you can reorder them before merging
                </p>
              </div>
            </div>
          ) : (
            /* File list */
            <div className="space-y-2">
              {/* Toolbar */}
              <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
                <div className="flex items-center gap-3 text-[10px] text-slate-400 tabular-nums">
                  <span className="text-cyan-600 dark:text-cyan-400 font-bold">
                    {files.length} file{files.length !== 1 ? 's' : ''}
                  </span>
                  {totalPages > 0 && (
                    <>
                      <span>·</span>
                      <span>{totalPages} pages total</span>
                    </>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      fileRef.current?.click();
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-[10px] font-bold text-slate-500 hover:border-cyan-300 hover:text-cyan-600 cursor-pointer transition-all"
                  >
                    <Plus className="w-3 h-3" /> Add more
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      clearAll();
                      clearResult();
                    }}
                    className="flex items-center gap-1 text-[10px] font-bold text-slate-400 hover:text-red-500 cursor-pointer transition-colors"
                  >
                    <Trash2 className="w-3 h-3" /> Clear all
                  </button>
                </div>
              </div>

              {/* Cards */}
              {files.map((item, i) => (
                <PdfFileCard
                  key={item.id}
                  item={item}
                  index={i}
                  total={files.length}
                  onRemove={removeFile}
                  onReorder={reorder}
                />
              ))}

              {/* Drop-more hint */}
              <div
                onDragOver={(e) => e.stopPropagation()}
                onDrop={(e) => {
                  e.stopPropagation();
                  handleDrop(e);
                }}
                className="flex items-center justify-center gap-2 py-3 rounded-xl border border-dashed border-slate-200 dark:border-slate-700 text-[10px] font-semibold text-slate-400 hover:border-cyan-300 hover:text-cyan-500 transition-colors cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  fileRef.current?.click();
                }}
              >
                <Upload className="w-3 h-3" />
                Drop more PDFs here
              </div>
            </div>
          )}
        </div>

        {/* Merge button + result */}
        {hasFiles && (
          <div className="mt-5 space-y-4">
            {/* Min 2 files warning */}
            {files.length === 1 && (
              <p className="text-[11px] text-slate-400 text-center">
                Add at least one more PDF to merge
              </p>
            )}

            {/* Merge button */}
            <button
              onClick={merge}
              disabled={!canMerge || isMerging}
              className={`w-full py-3.5 rounded-2xl text-sm font-bold flex items-center justify-center gap-2 cursor-pointer transition-all
                ${
                  canMerge && !isMerging
                    ? 'bg-cyan-600 hover:bg-cyan-700 text-white shadow-sm active:scale-[0.99]'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                }`}
            >
              {isMerging ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Merging…
                </>
              ) : (
                <>
                  <Layers className="w-4 h-4" /> Merge {files.length} PDFs
                </>
              )}
            </button>

            {/* Result card */}
            {result && !isMerging && (
              <div className="flex items-center gap-4 p-4 bg-white dark:bg-slate-900 border border-cyan-200 dark:border-cyan-900/50 rounded-2xl">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100 dark:bg-emerald-950/50 text-emerald-500">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
                    merged.pdf
                  </p>
                  <p className="text-[10px] text-slate-400 tabular-nums">
                    {result.pageCount} pages · {result.sizeLabel}
                  </p>
                </div>
                <button
                  onClick={handleDownload}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-bold cursor-pointer transition-all active:scale-[0.98]"
                >
                  <Download className="w-3.5 h-3.5" />
                  Download
                </button>
                <button
                  onClick={clearResult}
                  className="text-slate-300 hover:text-slate-500 cursor-pointer transition-colors"
                  title="Dismiss"
                >
                  <FileText className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        )}

        {/* Privacy note */}
        <div className="mt-8 flex items-center gap-1.5">
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-cyan-500" />
          </span>
          <p className="text-[10px] font-semibold text-slate-400 dark:text-slate-500">
            PDFs are merged entirely in your browser using pdf-lib - your files
            never leave your device
          </p>
        </div>
      </div>
    </main>
  );
}

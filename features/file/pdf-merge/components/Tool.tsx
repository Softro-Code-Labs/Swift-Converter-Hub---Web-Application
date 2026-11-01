'use client';

import { useFileHandoff } from '@/features/shared/lib/fileHandoff';

import { useCallback, useRef } from 'react';
import {
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

  // Load files handed over from the home page, if any.
  useFileHandoff((picked) => addFiles(picked), {
    accept: '.pdf,application/pdf',
  });

  return (
    <div className="space-y-5">
      {/* Drop zone */}
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        onClick={() => !hasFiles && fileRef.current?.click()}
        role={hasFiles ? undefined : 'button'}
        tabIndex={hasFiles ? undefined : 0}
        aria-label={hasFiles ? undefined : 'Choose PDF files'}
        onKeyDown={(e) => {
          if (!hasFiles && (e.key === 'Enter' || e.key === ' ')) {
            e.preventDefault();
            fileRef.current?.click();
          }
        }}
        className={`relative rounded-2xl border-2 border-dashed transition-all duration-200
            ${
              hasFiles
                ? 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-4'
                : 'border-slate-300 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-900/40 hover:border-blue-400 dark:hover:border-blue-500/60 hover:bg-blue-50/40 dark:hover:bg-blue-500/5 cursor-pointer px-6 py-12'
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
          <div className="flex flex-col items-center gap-3 text-center">
            <span className="flex h-12 w-12 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400">
              <Layers className="h-6 w-6" />
            </span>
            <div>
              <p className="text-base font-semibold text-slate-900 dark:text-white">
                Drop PDF files here
              </p>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Add two or more - you can reorder them before merging
              </p>
            </div>
            <span className="inline-flex h-10 items-center rounded-lg bg-blue-600 px-4 text-sm font-semibold text-white shadow-sm dark:bg-blue-500">
              Choose PDFs
            </span>
          </div>
        ) : (
          /* File list */
          <div className="space-y-2">
            {/* Toolbar */}
            <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
              <div className="flex items-center gap-3 text-xs text-slate-400 tabular-nums">
                <span className="text-slate-900 dark:text-white font-semibold">
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
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold text-slate-500 hover:border-blue-300 hover:text-blue-600 cursor-pointer transition-all"
                >
                  <Plus className="w-3 h-3" /> Add more
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    clearAll();
                    clearResult();
                  }}
                  className="flex items-center gap-1 text-xs font-bold text-slate-400 hover:text-red-500 cursor-pointer transition-colors"
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
            <button
              type="button"
              onDragOver={(e) => e.stopPropagation()}
              onDrop={(e) => {
                e.stopPropagation();
                handleDrop(e);
              }}
              className="flex items-center justify-center gap-2 py-3 rounded-xl border border-dashed border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-400 hover:border-blue-300 hover:text-blue-500 transition-colors cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                fileRef.current?.click();
              }}
            >
              <Upload className="w-3 h-3" />
              Drop more PDFs here
            </button>
          </div>
        )}
      </div>

      {/* Merge button + result */}
      {hasFiles && (
        <div className="mt-5 space-y-4">
          {/* Min 2 files warning */}
          {files.length === 1 && (
            <p className="text-[13px] text-slate-400 text-center">
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
                    ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm active:scale-[0.99]'
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
            <div className="flex items-center gap-4 p-4 bg-white dark:bg-slate-900 border border-emerald-200 dark:border-emerald-500/25 rounded-2xl">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100 dark:bg-emerald-950/50 text-emerald-500">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
                  merged.pdf
                </p>
                <p className="text-xs text-slate-400 tabular-nums">
                  {result.pageCount} pages · {result.sizeLabel}
                </p>
              </div>
              <button
                onClick={handleDownload}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold cursor-pointer transition-all active:scale-[0.98]"
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
    </div>
  );
}

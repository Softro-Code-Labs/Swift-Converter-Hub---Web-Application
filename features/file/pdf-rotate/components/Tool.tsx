'use client';

import { DropZoneSurface } from '@/features/shared/components/DropZoneSurface';
import {
  useFileHandoff,
  dropEventFrom,
} from '@/features/shared/lib/fileHandoff';

import { useCallback, useRef } from 'react';
import {
  FileSignature,
  Trash2,
  Loader2,
  CheckCircle2,
  FileText,
  AlertCircle,
  Download,
  RotateCcw,
  RotateCw,
  RefreshCw,
} from 'lucide-react';
import { usePdfRotate } from '../hooks/usePdfRotate';
import { RotatePageCard } from './RotatePageCard';

export default function PdfRotateTool() {
  const fileRef = useRef<HTMLInputElement>(null);
  const {
    file,
    pages,
    pageCount,
    thumbsLoading,
    isApplying,
    result,
    error,
    hasChanges,
    loadFile,
    rotatePage,
    rotateAll,
    resetAll,
    apply,
    clear,
  } = usePdfRotate();

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
    a.download = `${baseName}_rotated.pdf`;
    a.click();
  }, [result, file]);

  const rotatedCount = pages.filter((p) => p.currentRotation !== 0).length;

  // Load a file handed over from the home page, if any.
  useFileHandoff((files) => handleDrop(dropEventFrom(files)));

  return (
    <div className="space-y-5">
      {/* Drop zone */}
      {!file ? (
        <DropZoneSurface
          icon={FileSignature}
          title="Drop a PDF here"
          hint="You can rotate each page separately"
          buttonLabel="Choose PDF"
          ariaLabel="Choose PDF"
          onPick={() => fileRef.current?.click()}
          onDropFiles={(files) => handleDrop(dropEventFrom(files))}
        >
          <input
            ref={fileRef}
            type="file"
            accept=".pdf,application/pdf"
            className="hidden"
            onChange={handleFileInput}
          />
        </DropZoneSurface>
      ) : (
        <div className="space-y-5">
          {/* File info bar */}
          <div className="flex items-center gap-3 px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl">
            <FileText className="w-5 h-5 text-purple-500 shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-slate-700 dark:text-slate-300 truncate">
                {file.name}
              </p>
              <p className="text-xs text-slate-400 tabular-nums">
                {pageCount} {pageCount === 1 ? 'page' : 'pages'}
                {thumbsLoading && ' · Loading previews…'}
                {rotatedCount > 0 && (
                  <span className="text-purple-500 ml-1">
                    · {rotatedCount} page{rotatedCount !== 1 ? 's' : ''} rotated
                  </span>
                )}
              </p>
            </div>
            <button
              onClick={clear}
              className="flex items-center gap-1 text-xs font-bold text-slate-400 hover:text-red-500 cursor-pointer transition-colors shrink-0"
            >
              <Trash2 className="w-3 h-3" /> Remove
            </button>
          </div>

          {/* Bulk rotate toolbar */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold text-slate-400 mr-1">
                All pages
              </span>
              <button
                onClick={() => rotateAll(-90)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold text-slate-600 dark:text-slate-400 hover:border-blue-300 hover:text-blue-600 dark:hover:border-blue-700 dark:hover:text-blue-400 cursor-pointer transition-all"
              >
                <RotateCcw className="w-3 h-3" /> 90° CCW
              </button>
              <button
                onClick={() => rotateAll(90)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold text-slate-600 dark:text-slate-400 hover:border-blue-300 hover:text-blue-600 dark:hover:border-blue-700 dark:hover:text-blue-400 cursor-pointer transition-all"
              >
                <RotateCw className="w-3 h-3" /> 90° CW
              </button>
              <button
                onClick={() => rotateAll(180)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold text-slate-600 dark:text-slate-400 hover:border-blue-300 hover:text-blue-600 dark:hover:border-blue-700 dark:hover:text-blue-400 cursor-pointer transition-all"
              >
                <RefreshCw className="w-3 h-3" /> 180°
              </button>
              {hasChanges && (
                <>
                  <div className="w-px h-4 bg-slate-200 dark:bg-slate-700 mx-1" />
                  <button
                    onClick={resetAll}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-400 hover:text-red-500 hover:border-red-300 dark:hover:border-red-700 bg-white dark:bg-slate-900 cursor-pointer transition-all"
                  >
                    <RotateCcw className="w-3 h-3" /> Reset all
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Page grid */}
          <div
            className="grid gap-2"
            style={{
              gridTemplateColumns: 'repeat(auto-fill, minmax(88px, 1fr))',
            }}
          >
            {pages.map((page) => (
              <RotatePageCard
                key={page.pageIndex}
                page={page}
                onRotateCw={() => rotatePage(page.pageIndex, 90)}
                onRotateCcw={() => rotatePage(page.pageIndex, -90)}
              />
            ))}
          </div>

          {/* Hint */}
          {pages.length > 0 && !thumbsLoading && (
            <p className="text-center text-[13px] text-slate-500 dark:text-slate-400">
              Click a page to turn it clockwise. Rotated pages are outlined in
              blue.
            </p>
          )}

          {/* Error */}
          {error && (
            <div className="flex items-start gap-3 px-5 py-4 rounded-2xl border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-950/20">
              <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-red-600 dark:text-red-400">
                  Failed to apply rotation
                </p>
                <p className="text-[13px] text-red-500 font-mono mt-0.5">
                  {error}
                </p>
              </div>
            </div>
          )}

          {/* Apply button */}
          <button
            onClick={apply}
            disabled={!hasChanges || isApplying}
            className={`w-full py-3.5 rounded-2xl text-sm font-bold flex items-center justify-center gap-2 cursor-pointer transition-all
                ${
                  hasChanges && !isApplying
                    ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm active:scale-[0.99]'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                }`}
          >
            {isApplying ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Applying rotations…
              </>
            ) : hasChanges ? (
              <>
                <FileSignature className="w-4 h-4" /> Apply {rotatedCount}{' '}
                rotation{rotatedCount !== 1 ? 's' : ''}
              </>
            ) : (
              'Rotate pages above to continue'
            )}
          </button>

          {/* Result */}
          {result && !isApplying && (
            <div className="flex items-center gap-4 p-4 bg-white dark:bg-slate-900 border border-purple-200 dark:border-purple-900/50 rounded-2xl">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100 dark:bg-emerald-950/50 text-emerald-500">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
                  {file?.name.replace(/\.pdf$/i, '')}_rotated.pdf
                </p>
                <p className="text-xs text-slate-400 tabular-nums">
                  {result.pageCount} {result.pageCount === 1 ? 'page' : 'pages'}{' '}
                  · {result.sizeLabel}
                </p>
              </div>
              <button
                onClick={handleDownload}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold cursor-pointer transition-all active:scale-[0.98]"
              >
                <Download className="w-3.5 h-3.5" />
                Download
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

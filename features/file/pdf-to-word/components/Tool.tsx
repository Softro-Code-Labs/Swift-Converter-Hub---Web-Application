'use client';

import { formatBytes } from '@/features/shared/lib/format';

import { DropZoneSurface } from '@/features/shared/components/DropZoneSurface';
import {
  useFileHandoff,
  dropEventFrom,
} from '@/features/shared/lib/fileHandoff';

import { useCallback, useRef } from 'react';
import {
  RefreshCw,
  Download,
  Trash2,
  Loader2,
  CheckCircle2,
  FileText,
  AlertCircle,
  AlertTriangle,
  Info,
} from 'lucide-react';
import { usePdfToWord } from '../hooks/usePdfToWord';
import { PDF_TO_WORD_FAQS } from '../config/faqs';
import { FaqAccordion } from '@/features/shared/components/page-sections';

function formatProgressLabel(stage: string, current: number, total: number) {
  if (stage === 'extracting' && total > 0) {
    return `Reading page ${current} of ${total}…`;
  }
  if (stage === 'building') return 'Building Word document…';
  if (stage === 'reading') return 'Loading PDF…';
  return 'Converting…';
}

export default function PdfToWordTool() {
  const fileRef = useRef<HTMLInputElement>(null);
  const {
    file,
    isConverting,
    progress,
    result,
    error,
    loadFile,
    convert,
    clear,
  } = usePdfToWord();

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
    const a = document.createElement('a');
    a.href = result.url;
    a.download = result.fileName;
    a.click();
  }, [result]);

  // Load a file handed over from the home page, if any.
  useFileHandoff((files) => handleDrop(dropEventFrom(files)));

  return (
    <div className="space-y-5">
      {/* Drop zone */}
      {!file ? (
        <DropZoneSurface
          icon={RefreshCw}
          title="Drop a PDF here"
          hint="One PDF at a time"
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
          {/* File info */}
          <div className="flex items-center gap-3 px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl">
            <FileText className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-slate-700 dark:text-slate-300 truncate">
                {file.name}
              </p>
              <p className="text-xs text-slate-400 tabular-nums">
                {formatBytes(file.size)}
              </p>
            </div>
            <button
              onClick={clear}
              className="flex items-center gap-1 text-xs font-bold text-slate-400 hover:text-red-500 cursor-pointer transition-colors shrink-0"
            >
              <Trash2 className="w-3 h-3" /> Remove
            </button>
          </div>

          {/* What this tool does / doesn't do */}
          <div className="flex items-start gap-2 px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl">
            <Info className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
            <p className="text-[13px] text-slate-700 dark:text-slate-300 leading-relaxed">
              Reflows the PDF&rsquo;s text into an editable Word document,
              detecting headings and paragraphs automatically. Best for
              text-based PDFs (reports, letters, articles); tables, columns, and
              embedded images aren&rsquo;t preserved, and scanned PDFs with no
              selectable text can&rsquo;t be converted (no OCR).
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="flex items-start gap-3 px-5 py-4 rounded-2xl border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-950/20">
              <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-red-600 dark:text-red-400">
                  Conversion failed
                </p>
                <p className="text-[13px] text-red-500 font-mono mt-0.5">
                  {error}
                </p>
              </div>
            </div>
          )}

          {/* Convert button */}
          <button
            onClick={convert}
            disabled={isConverting}
            className={`w-full py-3.5 rounded-2xl text-sm font-bold flex items-center justify-center gap-2 cursor-pointer transition-all
                ${
                  !isConverting
                    ? 'bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-400 text-white shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                }`}
          >
            {isConverting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                {formatProgressLabel(
                  progress?.stage ?? 'reading',
                  progress?.currentPage ?? 0,
                  progress?.totalPages ?? 0,
                )}
              </>
            ) : (
              <>
                <RefreshCw className="w-4 h-4" /> Convert to Word
              </>
            )}
          </button>

          {/* Result */}
          {result && !isConverting && (
            <div
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden"
              aria-live="polite"
            >
              <div
                className={`flex items-center gap-3 px-5 py-4 border-b ${result.lowTextWarning ? 'border-amber-200 bg-amber-50 dark:border-amber-500/30 dark:bg-amber-500/10' : 'border-emerald-200 bg-emerald-50 dark:border-emerald-500/25 dark:bg-emerald-500/10'}`}
              >
                {result.lowTextWarning ? (
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                ) : (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                )}
                <p className="text-sm font-semibold text-slate-900 dark:text-white">
                  {result.lowTextWarning
                    ? 'Little or no selectable text found'
                    : 'Converted to Word'}
                </p>
              </div>

              <div className="px-5 py-4 space-y-3">
                {result.lowTextWarning && (
                  <p className="text-[13px] text-slate-500 dark:text-slate-400 leading-relaxed">
                    This PDF looks like a scanned image with no embedded text
                    layer, so there was little to reflow. The downloaded file
                    explains this instead of arriving empty.
                  </p>
                )}
                <div className="flex items-center gap-4 text-xs text-slate-400 tabular-nums">
                  <span>
                    <span className="font-bold text-slate-600 dark:text-slate-300">
                      {result.pageCount}
                    </span>{' '}
                    page{result.pageCount === 1 ? '' : 's'}
                  </span>
                  <span>
                    <span className="font-bold text-slate-600 dark:text-slate-300">
                      {result.paragraphCount}
                    </span>{' '}
                    lines of text
                  </span>
                  <span>
                    <span className="font-bold text-slate-600 dark:text-slate-300">
                      {result.sizeLabel}
                    </span>
                  </span>
                </div>

                <button
                  onClick={handleDownload}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-400 text-white text-[15px] font-semibold cursor-pointer transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Download {result.fileName}
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* FAQ */}
      <div className="mt-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden">
        <FaqAccordion
          title="Frequently asked questions"
          items={PDF_TO_WORD_FAQS}
          accentColor="bg-amber-500"
        />
      </div>
    </div>
  );
}

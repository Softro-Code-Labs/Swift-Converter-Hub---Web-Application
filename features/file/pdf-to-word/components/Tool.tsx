'use client';

import { useCallback, useRef } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
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

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back nav */}
        <Link
          href="/file"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-amber-600 dark:hover:text-amber-400 transition-colors group mb-8"
        >
          <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
          Document Suite
        </Link>

        {/* Header */}
        <div className="flex items-start gap-4 mb-8">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-100 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400">
            <RefreshCw className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
              PDF to Word Converter
            </h1>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
              Turn a PDF into an editable .docx - processed entirely in your
              browser
            </p>
          </div>
        </div>

        {/* Drop zone */}
        {!file ? (
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            onClick={() => fileRef.current?.click()}
            className="flex flex-col items-center justify-center gap-4 py-16 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700 hover:border-amber-300 dark:hover:border-amber-700 hover:bg-amber-50/30 dark:hover:bg-amber-950/10 transition-all cursor-pointer"
          >
            <input
              ref={fileRef}
              type="file"
              accept=".pdf,application/pdf"
              className="hidden"
              onChange={handleFileInput}
            />
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-100 dark:bg-amber-950/50 text-amber-500">
              <RefreshCw className="w-7 h-7" />
            </div>
            <div className="text-center space-y-1">
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                Drop a PDF here or{' '}
                <span className="text-amber-600 dark:text-amber-400 font-bold underline underline-offset-2">
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
              <FileText className="w-5 h-5 text-amber-500 shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-slate-700 dark:text-slate-300 truncate">
                  {file.name}
                </p>
                <p className="text-[10px] text-slate-400 tabular-nums">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
              <button
                onClick={clear}
                className="flex items-center gap-1 text-[10px] font-bold text-slate-400 hover:text-red-500 cursor-pointer transition-colors shrink-0"
              >
                <Trash2 className="w-3 h-3" /> Remove
              </button>
            </div>

            {/* What this tool does / doesn't do */}
            <div className="flex items-start gap-2 px-4 py-3 bg-amber-50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/40 rounded-xl">
              <Info className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
              <p className="text-[11px] text-amber-700 dark:text-amber-400 font-semibold leading-relaxed">
                Reflows the PDF&rsquo;s text into an editable Word document,
                detecting headings and paragraphs automatically. Best for
                text-based PDFs (reports, letters, articles); tables, columns,
                and embedded images aren&rsquo;t preserved, and scanned PDFs
                with no selectable text can&rsquo;t be converted (no OCR).
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
                  <p className="text-[11px] text-red-500 font-mono mt-0.5">
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
                    ? 'bg-amber-600 hover:bg-amber-700 text-white shadow-sm active:scale-[0.99]'
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
              <div className="bg-white dark:bg-slate-900 border border-amber-200 dark:border-amber-900/50 rounded-2xl overflow-hidden">
                <div className="flex items-center gap-3 px-5 py-4 border-b border-amber-100 dark:border-amber-900/30 bg-amber-50/60 dark:bg-amber-950/20">
                  {result.lowTextWarning ? (
                    <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
                  ) : (
                    <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0" />
                  )}
                  <p className="text-sm font-bold text-amber-700 dark:text-amber-300">
                    {result.lowTextWarning
                      ? 'Little or no selectable text found'
                      : 'Converted to Word'}
                  </p>
                </div>

                <div className="px-5 py-4 space-y-3">
                  {result.lowTextWarning && (
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                      This PDF looks like a scanned image with no embedded
                      text layer, so there was little to reflow. The
                      downloaded file explains this instead of arriving
                      empty.
                    </p>
                  )}
                  <div className="flex items-center gap-4 text-[10px] text-slate-400 tabular-nums">
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
                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-sm font-bold cursor-pointer transition-all active:scale-[0.98]"
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

        {/* Privacy note */}
        <div className="mt-8 flex items-center gap-1.5">
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-amber-500" />
          </span>
          <p className="text-[10px] font-semibold text-slate-400 dark:text-slate-500">
            Converted entirely in your browser using pdf.js and docx - your
            file never leaves your device
          </p>
        </div>
      </div>
    </main>
  );
}

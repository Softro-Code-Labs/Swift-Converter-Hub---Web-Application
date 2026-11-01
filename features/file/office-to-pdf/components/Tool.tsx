'use client';

import { DropZoneSurface } from '@/features/shared/components/DropZoneSurface';
import {
  useFileHandoff,
  dropEventFrom,
} from '@/features/shared/lib/fileHandoff';

import { useCallback, useRef } from 'react';
import {
  RefreshCw,
  Trash2,
  Loader2,
  FileText,
  AlertCircle,
  Printer,
  Eye,
  FileSpreadsheet,
} from 'lucide-react';
import { buildPrintHtml, useOfficeToPdf } from '../hooks/useOfficeToPdf';
import { ACCEPTED_TYPES } from '../types/officeToPdf';

export default function OfficeToPdfTool() {
  const fileRef = useRef<HTMLInputElement>(null);
  const {
    file,
    fileType,
    isConverting,
    result,
    error,
    isPrinting,
    loadFile,
    convert,
    printToPdf,
    clear,
  } = useOfficeToPdf();

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
      if (f) loadFile(f);
    },
    [loadFile],
  );

  const FileIcon = fileType === 'xlsx' ? FileSpreadsheet : FileText;
  const accentColor =
    fileType === 'xlsx'
      ? 'text-emerald-600 dark:text-emerald-400'
      : 'text-amber-600 dark:text-amber-400';

  // Load a file handed over from the home page, if any.
  useFileHandoff((files) => handleDrop(dropEventFrom(files)));

  return (
    <div className="space-y-5">
      {/* Drop zone */}
      {!file ? (
        <DropZoneSurface
          icon={RefreshCw}
          title="Drop a Word or Excel file here"
          hint="Word (.docx) or spreadsheet (.xlsx, .xls, .ods, .csv)"
          buttonLabel="Choose file"
          ariaLabel="Choose file"
          onPick={() => fileRef.current?.click()}
          onDropFiles={(files) => handleDrop(dropEventFrom(files))}
        >
          <input
            ref={fileRef}
            type="file"
            accept={ACCEPTED_TYPES}
            className="hidden"
            onChange={handleFileInput}
          />
        </DropZoneSurface>
      ) : (
        <div className="space-y-5">
          {/* File info */}
          <div className="flex items-center gap-3 px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl">
            <FileIcon className={`w-5 h-5 shrink-0 ${accentColor}`} />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-slate-700 dark:text-slate-300 truncate">
                {file.name}
              </p>
              <p className="text-xs text-slate-400 tabular-nums">
                {(file.size / 1024).toFixed(1)} KB ·{' '}
                <span className={`font-bold uppercase ${accentColor}`}>
                  {fileType}
                </span>
              </p>
            </div>
            <button
              onClick={clear}
              className="flex items-center gap-1 text-xs font-bold text-slate-400 hover:text-red-500 cursor-pointer transition-colors shrink-0"
            >
              <Trash2 className="w-3 h-3" /> Remove
            </button>
          </div>

          {/* Unsupported type */}
          {fileType === 'unsupported' && (
            <div
              role="alert"
              className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 dark:border-red-500/30 dark:bg-red-500/10"
            >
              <AlertCircle
                className="mt-0.5 h-4 w-4 shrink-0 text-red-600"
                aria-hidden
              />
              <div className="text-sm text-red-800 dark:text-red-200">
                {file.name.toLowerCase().endsWith('.doc') ? (
                  <>
                    <p className="font-semibold">
                      Old Word (.doc) files can&apos;t be read here
                    </p>
                    <p className="mt-0.5">
                      Open it in Word, Google Docs or LibreOffice, choose
                      &quot;Save as&quot; .docx, then add the new file.
                    </p>
                  </>
                ) : (
                  <>
                    <p className="font-semibold">
                      This file type isn&apos;t supported
                    </p>
                    <p className="mt-0.5">
                      Add a Word document (.docx) or a spreadsheet (.xlsx, .xls,
                      .ods or .csv).
                    </p>
                  </>
                )}
              </div>
            </div>
          )}

          {fileType === 'docx' && !result && (
            <p className="text-[13px] text-slate-600 dark:text-slate-400">
              Headings, paragraphs, lists, tables and images are kept. Text
              boxes, embedded objects and unusual fonts may look different.
            </p>
          )}

          {error && (
            <div
              role="alert"
              className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 dark:border-red-500/30 dark:bg-red-500/10"
            >
              <AlertCircle
                className="mt-0.5 h-4 w-4 shrink-0 text-red-600"
                aria-hidden
              />
              <div className="text-sm text-red-800 dark:text-red-200">
                <p className="font-semibold">This file couldn&apos;t be read</p>
                <p className="mt-0.5">
                  It may be damaged or password-protected. Technical detail:{' '}
                  {error}
                </p>
              </div>
            </div>
          )}

          {!result && fileType !== 'unsupported' && (
            <button
              type="button"
              onClick={convert}
              disabled={isConverting}
              className="flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-blue-600 text-[15px] font-semibold text-white shadow-sm transition-colors hover:bg-blue-700 disabled:opacity-60 dark:bg-blue-500 dark:hover:bg-blue-400"
            >
              {isConverting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden />{' '}
                  Preparing preview…
                </>
              ) : (
                <>
                  <Eye className="h-4 w-4" aria-hidden /> Preview document
                </>
              )}
            </button>
          )}

          {result && !isConverting && (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  <span className="font-semibold text-slate-900 dark:text-white">
                    Preview
                  </span>{' '}
                  - about {result.pageEstimate}{' '}
                  {result.pageEstimate === 1 ? 'page' : 'pages'}
                  {result.fileType === 'xlsx'
                    ? ', one sheet per page, landscape'
                    : ', A4'}
                </p>
                <button
                  type="button"
                  onClick={clear}
                  className="text-sm font-medium text-slate-600 underline-offset-4 hover:text-slate-900 hover:underline dark:text-slate-400 dark:hover:text-white"
                >
                  Use a different file
                </button>
              </div>

              {result.warnings.length > 0 && (
                <details className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-100">
                  <summary className="font-semibold">
                    {result.warnings.length} part
                    {result.warnings.length !== 1 ? 's' : ''} of this document
                    may look different
                  </summary>
                  <ul className="mt-2 list-disc space-y-1 pl-5 text-[13px]">
                    {result.warnings.map((w, i) => (
                      <li key={i}>{w}</li>
                    ))}
                  </ul>
                </details>
              )}

              {/* Sandboxed, uses the exact print stylesheet - what you see is what prints. */}
              <iframe
                title={`Preview of ${result.fileName}`}
                sandbox=""
                srcDoc={buildPrintHtml(
                  result.htmlContent,
                  result.fileType,
                  result.fileName,
                )}
                className="h-[520px] w-full rounded-xl border border-slate-200 bg-white shadow-inner dark:border-slate-700"
              />

              <button
                type="button"
                onClick={printToPdf}
                disabled={isPrinting}
                className="flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-blue-600 text-[15px] font-semibold text-white shadow-sm transition-colors hover:bg-blue-700 disabled:opacity-60 dark:bg-blue-500 dark:hover:bg-blue-400"
              >
                {isPrinting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" aria-hidden />{' '}
                    Opening Save as PDF…
                  </>
                ) : (
                  <>
                    <Printer className="h-4 w-4" aria-hidden /> Save as PDF
                  </>
                )}
              </button>
              <p className="text-[13px] text-slate-600 dark:text-slate-400">
                Your browser&apos;s print window opens. Set the destination to{' '}
                <strong className="font-semibold text-slate-900 dark:text-white">
                  Save as PDF
                </strong>{' '}
                (on Windows, &quot;Microsoft Print to PDF&quot;), then save. The
                PDF keeps real, selectable text.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

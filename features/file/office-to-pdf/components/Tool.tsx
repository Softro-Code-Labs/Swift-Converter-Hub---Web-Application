'use client';

import { useCallback, useRef } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  RefreshCw,
  Trash2,
  Loader2,
  FileText,
  AlertCircle,
  Info,
  Printer,
  Eye,
  CheckCircle2,
  FileSpreadsheet,
} from 'lucide-react';
import { useOfficeToPdf } from '../hooks/useOfficeToPdf';
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
              Word / Excel to PDF
            </h1>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
              Convert .docx and .xlsx to PDF via browser print - no server, no
              upload
            </p>
          </div>
        </div>

        {/* How it works note */}
        <div className="flex items-start gap-2 px-4 py-3 bg-blue-50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/40 rounded-xl mb-6">
          <Info className="w-3.5 h-3.5 text-blue-500 shrink-0 mt-0.5" />
          <p className="text-[11px] text-blue-700 dark:text-blue-400 font-semibold leading-relaxed">
            This tool converts your file to formatted HTML, then opens the
            browser&apos;s <strong>Print dialog</strong> - select{' '}
            <em>&quot;Save as PDF&quot;</em> (or <em>&quot;Microsoft Print to PDF&quot;</em> on
            Windows) as the destination to save your PDF.
          </p>
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
              accept={ACCEPTED_TYPES}
              className="hidden"
              onChange={handleFileInput}
            />
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-100 dark:bg-amber-950/50 text-amber-500">
              <RefreshCw className="w-7 h-7" />
            </div>
            <div className="text-center space-y-1">
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                Drop a Word or Excel file here or{' '}
                <span className="text-amber-600 dark:text-amber-400 font-bold underline underline-offset-2">
                  browse
                </span>
              </p>
              <p className="text-xs text-slate-400 dark:text-slate-500">
                .docx, .doc, .xlsx, .xls - processed entirely in your browser
              </p>
            </div>
            <div className="flex gap-2">
              {['.docx', '.doc', '.xlsx', '.xls'].map((ext) => (
                <span
                  key={ext}
                  className="text-[10px] font-bold text-slate-400 dark:text-slate-600 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-2 py-0.5 rounded-md"
                >
                  {ext}
                </span>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-5">
            {/* File info */}
            <div className="flex items-center gap-3 px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl">
              <FileIcon className={`w-5 h-5 shrink-0 ${accentColor}`} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-slate-700 dark:text-slate-300 truncate">
                  {file.name}
                </p>
                <p className="text-[10px] text-slate-400 tabular-nums">
                  {(file.size / 1024).toFixed(1)} KB ·{' '}
                  <span className={`font-bold uppercase ${accentColor}`}>
                    {fileType}
                  </span>
                </p>
              </div>
              <button
                onClick={clear}
                className="flex items-center gap-1 text-[10px] font-bold text-slate-400 hover:text-red-500 cursor-pointer transition-colors shrink-0"
              >
                <Trash2 className="w-3 h-3" /> Remove
              </button>
            </div>

            {/* Unsupported type */}
            {fileType === 'unsupported' && (
              <div className="flex items-start gap-3 px-5 py-4 rounded-2xl border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-950/20">
                <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-red-600 dark:text-red-400">
                    Unsupported file type
                  </p>
                  <p className="text-[11px] text-red-500 mt-0.5">
                    Only .docx, .doc, .xlsx, and .xls files are supported.
                  </p>
                </div>
              </div>
            )}

            {/* DOCX warning */}
            {fileType === 'docx' && (
              <div className="flex items-start gap-2 px-4 py-3 bg-amber-50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/40 rounded-xl">
                <Info className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                <p className="text-[11px] text-amber-700 dark:text-amber-400 font-semibold leading-relaxed">
                  Complex Word formatting (text boxes, embedded objects, custom
                  fonts) may not render perfectly. Simple documents with
                  headings, paragraphs, tables, and lists work best.
                </p>
              </div>
            )}

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
            {!result && (
              <button
                onClick={convert}
                disabled={isConverting || fileType === 'unsupported'}
                className={`w-full py-3.5 rounded-2xl text-sm font-bold flex items-center justify-center gap-2 cursor-pointer transition-all
                  ${
                    !isConverting && fileType !== 'unsupported'
                      ? 'bg-amber-500 hover:bg-amber-600 text-white shadow-sm active:scale-[0.99]'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                  }`}
              >
                {isConverting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Converting…
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-4 h-4" /> Convert to PDF-ready HTML
                  </>
                )}
              </button>
            )}

            {/* Result */}
            {result && !isConverting && (
              <div className="space-y-4">
                {/* Success bar */}
                <div className="flex items-center gap-3 px-5 py-4 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/40 rounded-2xl">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm font-bold text-emerald-700 dark:text-emerald-300">
                      Ready to print as PDF
                    </p>
                    <p className="text-[10px] text-emerald-600 dark:text-emerald-500 tabular-nums">
                      ~{result.pageEstimate} page
                      {result.pageEstimate !== 1 ? 's' : ''} estimated
                      {result.warnings.length > 0 &&
                        ` · ${result.warnings.length} formatting warning${result.warnings.length !== 1 ? 's' : ''}`}
                    </p>
                  </div>
                  <button
                    onClick={clear}
                    className="text-[10px] font-bold text-slate-400 hover:text-red-500 cursor-pointer transition-colors"
                  >
                    Start over
                  </button>
                </div>

                {/* Conversion warnings */}
                {result.warnings.length > 0 && (
                  <div className="px-4 py-3 bg-amber-50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/40 rounded-xl space-y-1">
                    <p className="text-[10px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-widest">
                      Formatting notes
                    </p>
                    {result.warnings.map((w, i) => (
                      <p
                        key={i}
                        className="text-[10px] text-amber-600 dark:text-amber-500"
                      >
                        · {w}
                      </p>
                    ))}
                  </div>
                )}

                {/* HTML Preview */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Eye className="w-3.5 h-3.5 text-slate-400" />
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
                      Document preview
                    </p>
                  </div>
                  <div
                    className="w-full h-[480px] overflow-auto rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-white p-8"
                    dangerouslySetInnerHTML={{ __html: result.htmlContent }}
                    style={{
                      fontFamily:
                        fileType === 'xlsx'
                          ? 'Arial, sans-serif'
                          : "'Times New Roman', serif",
                      fontSize: '12px',
                      lineHeight: '1.6',
                      color: '#000',
                    }}
                  />
                </div>

                {/* Print button */}
                <button
                  onClick={printToPdf}
                  disabled={isPrinting}
                  className={`w-full py-3.5 rounded-2xl text-sm font-bold flex items-center justify-center gap-2 cursor-pointer transition-all
                    ${
                      !isPrinting
                        ? 'bg-amber-500 hover:bg-amber-600 text-white shadow-sm active:scale-[0.99]'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                    }`}
                >
                  {isPrinting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" /> Opening print
                      dialog…
                    </>
                  ) : (
                    <>
                      <Printer className="w-4 h-4" /> Open Print Dialog → Save
                      as PDF
                    </>
                  )}
                </button>

                {/* Print instructions */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    {
                      step: '1',
                      label: 'Click the button above',
                      desc: "Opens your browser's print dialog",
                    },
                    {
                      step: '2',
                      label: 'Choose "Save as PDF"',
                      desc: 'Select PDF as the printer destination',
                    },
                    {
                      step: '3',
                      label: 'Save your file',
                      desc: 'Choose filename and location, done!',
                    },
                  ].map(({ step, label, desc }) => (
                    <div
                      key={step}
                      className="flex items-start gap-3 p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl"
                    >
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-lg bg-amber-100 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 text-[10px] font-black">
                        {step}
                      </span>
                      <div>
                        <p className="text-[10px] font-bold text-slate-700 dark:text-slate-300">
                          {label}
                        </p>
                        <p className="text-[9px] text-slate-400 mt-0.5">
                          {desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Privacy note */}
        <div className="mt-8 flex items-center gap-1.5">
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-amber-500" />
          </span>
          <p className="text-[10px] font-semibold text-slate-400 dark:text-slate-500">
            Converted entirely in your browser - your documents never leave your
            device
          </p>
        </div>
      </div>
    </main>
  );
}

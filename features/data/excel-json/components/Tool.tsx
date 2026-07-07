'use client';

import { useState, useCallback, useRef, useMemo } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Layers,
  Copy,
  Check,
  Download,
  Trash2,
  AlertCircle,
  FileSpreadsheet,
  Loader2,
} from 'lucide-react';
import { useExcelParser } from '../hooks/useExcelParser';
import { SheetTabs } from './SheetTabs';
import { SheetPreviewTable } from './SheetPreviewTable';
import type { ParseOptions } from '../types/excelJson';
import { DEFAULT_OPTIONS } from '../types/excelJson';

function OptionChip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-2.5 py-1 rounded-lg border text-[10px] font-bold cursor-pointer transition-all
        ${
          active
            ? 'border-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300'
            : 'border-slate-200 dark:border-slate-700 text-slate-500 hover:border-emerald-300 hover:text-emerald-600 bg-white dark:bg-slate-900'
        }`}
    >
      {label}
    </button>
  );
}

export default function ExcelJsonTool() {
  const fileRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [opts, setOpts] = useState<ParseOptions>(DEFAULT_OPTIONS);
  const [activeSheet, setActiveSheet] = useState(0);
  const [activeTab, setActiveTab] = useState<'preview' | 'json'>('preview');
  const [copied, setCopied] = useState(false);
  const [exportAll, setExportAll] = useState(false);

  const { result, isParsing, parseFile, reparse, clear } = useExcelParser();

  const handleFile = useCallback(
    async (f: File) => {
      setFile(f);
      setActiveSheet(0);
      setActiveTab('preview');
      await parseFile(f, opts);
    },
    [opts, parseFile],
  );

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const f = e.target.files?.[0];
      if (f) handleFile(f);
      e.target.value = '';
    },
    [handleFile],
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const f = e.dataTransfer.files?.[0];
      if (f) handleFile(f);
    },
    [handleFile],
  );

  const handleOptChange = useCallback(
    async <K extends keyof ParseOptions>(key: K, value: ParseOptions[K]) => {
      const next = { ...opts, [key]: value };
      setOpts(next);
      if (file) await reparse(file, next);
    },
    [opts, file, reparse],
  );

  const handleClear = useCallback(() => {
    setFile(null);
    setActiveSheet(0);
    clear();
  }, [clear]);

  // JSON output for current sheet or all sheets
  const jsonOutput = useMemo(() => {
    if (!result?.sheets?.length) return '';
    const indent = opts.prettyJson ? 2 : undefined;
    if (exportAll && result.sheets.length > 1) {
      const combined: Record<string, unknown[]> = {};
      result.sheets.forEach((s) => {
        combined[s.name] = s.rows;
      });
      return JSON.stringify(combined, null, indent);
    }
    const sheet = result.sheets[activeSheet];
    return sheet ? JSON.stringify(sheet.rows, null, indent) : '';
  }, [result, activeSheet, opts.prettyJson, exportAll]);

  const handleCopy = useCallback(() => {
    if (!jsonOutput) return;
    navigator.clipboard.writeText(jsonOutput);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }, [jsonOutput]);

  const handleDownload = useCallback(() => {
    if (!jsonOutput) return;
    const sheetName = exportAll
      ? 'all-sheets'
      : (result?.sheets[activeSheet]?.name ?? 'sheet');
    const baseName = file?.name.replace(/\.[^.]+$/, '') ?? 'workbook';
    const blob = new Blob([jsonOutput], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${baseName}_${sheetName}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [jsonOutput, file, result, activeSheet, exportAll]);

  const currentSheet = result?.sheets[activeSheet];
  const hasResult = !!result && !result.error && result.sheets.length > 0;

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back nav */}
        <Link
          href="/data"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors group mb-8"
        >
          <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
          Data Studio
        </Link>

        {/* Header */}
        <div className="flex items-start gap-4 mb-8">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
              Excel to JSON
            </h1>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
              Parse .xlsx workbooks into JSON — pick sheets, configure columns,
              download
            </p>
          </div>
        </div>

        {/* Drop zone */}
        {!file && (
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            onClick={() => fileRef.current?.click()}
            className="flex flex-col items-center justify-center gap-4 py-16 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700 hover:border-emerald-300 dark:hover:border-emerald-700 hover:bg-emerald-50/30 dark:hover:bg-emerald-950/10 transition-all cursor-pointer"
          >
            <input
              ref={fileRef}
              type="file"
              accept=".xlsx,.xls,.ods,.csv"
              className="hidden"
              onChange={handleFileInput}
            />
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 dark:bg-emerald-950/50 text-emerald-500">
              <FileSpreadsheet className="w-7 h-7" />
            </div>
            <div className="text-center space-y-1">
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                Drop a spreadsheet or{' '}
                <span className="text-emerald-600 dark:text-emerald-400 font-bold underline underline-offset-2">
                  browse
                </span>
              </p>
              <p className="text-xs text-slate-400 dark:text-slate-500">
                .xlsx · .xls · .ods · .csv — processed entirely in your browser
              </p>
            </div>
            <div className="flex gap-2">
              {['.xlsx', '.xls', '.ods', '.csv'].map((ext) => (
                <span
                  key={ext}
                  className="text-[10px] font-bold text-slate-400 dark:text-slate-600 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-2 py-0.5 rounded-md"
                >
                  {ext}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* File loaded state */}
        {file && (
          <div className="space-y-5">
            {/* File info bar */}
            <div className="flex items-center gap-3 px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl">
              <FileSpreadsheet className="w-5 h-5 text-emerald-500 shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-slate-700 dark:text-slate-300 truncate">
                  {file.name}
                </p>
                {result && !result.error && (
                  <p className="text-[10px] text-slate-400 tabular-nums">
                    {result.meta.length} sheet
                    {result.meta.length !== 1 ? 's' : ''} ·{' '}
                    {(file.size / 1024).toFixed(1)} KB
                  </p>
                )}
              </div>
              <button
                onClick={() => fileRef.current?.click()}
                className="text-[10px] font-bold text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 cursor-pointer transition-colors shrink-0"
              >
                Change
              </button>
              <button
                onClick={handleClear}
                className="flex items-center gap-1 text-[10px] font-bold text-slate-400 hover:text-red-500 cursor-pointer transition-colors shrink-0"
              >
                <Trash2 className="w-3 h-3" /> Remove
              </button>
              <input
                ref={fileRef}
                type="file"
                accept=".xlsx,.xls,.ods,.csv"
                className="hidden"
                onChange={handleFileInput}
              />
            </div>

            {/* Options */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-3">
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
                Options
              </p>
              <div className="flex items-center gap-2 flex-wrap">
                <OptionChip
                  label="Header row"
                  active={opts.hasHeader}
                  onClick={() => handleOptChange('hasHeader', !opts.hasHeader)}
                />
                <OptionChip
                  label="Pretty JSON"
                  active={opts.prettyJson}
                  onClick={() =>
                    handleOptChange('prettyJson', !opts.prettyJson)
                  }
                />
                <OptionChip
                  label="Include empty cells"
                  active={opts.includeEmpty}
                  onClick={() =>
                    handleOptChange('includeEmpty', !opts.includeEmpty)
                  }
                />

                <div className="w-px h-4 bg-slate-200 dark:bg-slate-700 mx-1" />

                {/* Date format */}
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                    Dates
                  </span>
                  {(
                    [
                      { value: 'iso', label: 'ISO' },
                      { value: 'string', label: 'String' },
                      { value: 'serial', label: 'Serial' },
                    ] as const
                  ).map(({ value, label }) => (
                    <OptionChip
                      key={value}
                      label={label}
                      active={opts.dateFormat === value}
                      onClick={() => handleOptChange('dateFormat', value)}
                    />
                  ))}
                </div>

                {/* Export all sheets toggle */}
                {result && result.sheets.length > 1 && (
                  <>
                    <div className="w-px h-4 bg-slate-200 dark:bg-slate-700 mx-1" />
                    <OptionChip
                      label="Export all sheets"
                      active={exportAll}
                      onClick={() => setExportAll((v) => !v)}
                    />
                  </>
                )}
              </div>
            </div>

            {/* Loading */}
            {isParsing && (
              <div className="flex items-center justify-center py-16">
                <Loader2 className="w-6 h-6 text-emerald-500 animate-spin" />
              </div>
            )}

            {/* Error */}
            {result?.error && (
              <div className="flex items-start gap-3 p-5 rounded-2xl border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-950/20">
                <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="text-xs font-bold text-red-600 dark:text-red-400">
                    Failed to parse file
                  </p>
                  <p className="text-[11px] text-red-500 font-mono">
                    {result.error}
                  </p>
                </div>
              </div>
            )}

            {/* Results */}
            {!isParsing && hasResult && (
              <div className="space-y-4">
                {/* Sheet tabs */}
                <SheetTabs
                  sheets={result.meta}
                  activeSheet={activeSheet}
                  onChange={(i) => {
                    setActiveSheet(i);
                    setActiveTab('preview');
                  }}
                />

                {/* Preview / JSON toggle */}
                <div className="flex items-center justify-between flex-wrap gap-3">
                  <div className="flex gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl w-fit">
                    {(['preview', 'json'] as const).map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-4 py-1.5 rounded-lg text-xs font-bold capitalize cursor-pointer transition-all
                          ${
                            activeTab === tab
                              ? 'bg-white dark:bg-slate-700 text-emerald-700 dark:text-emerald-300 shadow-sm'
                              : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                          }`}
                      >
                        {tab === 'preview' ? 'Table Preview' : 'JSON Output'}
                      </button>
                    ))}
                  </div>

                  {/* Stats */}
                  {currentSheet && (
                    <div className="flex items-center gap-3 text-[10px] text-slate-400 tabular-nums">
                      <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                        {currentSheet.rows.length.toLocaleString()} rows
                      </span>
                      <span>·</span>
                      <span>{currentSheet.headers.length} columns</span>
                      {exportAll && result.sheets.length > 1 && (
                        <>
                          <span>·</span>
                          <span className="text-emerald-500">
                            All {result.sheets.length} sheets
                          </span>
                        </>
                      )}
                    </div>
                  )}
                </div>

                {/* Preview table */}
                {activeTab === 'preview' && currentSheet && (
                  <div className="space-y-2">
                    <SheetPreviewTable
                      headers={currentSheet.headers}
                      rawRows={currentSheet.rawRows}
                      hasHeader={opts.hasHeader}
                    />
                    <p className="text-[10px] text-slate-400 italic">
                      Showing up to 5 rows · {currentSheet.rows.length} total
                      data rows
                    </p>
                  </div>
                )}

                {/* JSON output */}
                {activeTab === 'json' && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
                        {exportAll
                          ? 'All sheets — JSON object'
                          : `Sheet: ${currentSheet?.name}`}
                      </p>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={handleCopy}
                          className="flex items-center gap-1 text-[10px] font-bold text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 cursor-pointer transition-colors"
                        >
                          {copied ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-500" />{' '}
                              Copied!
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" /> Copy
                            </>
                          )}
                        </button>
                        <span className="text-slate-200 dark:text-slate-700">
                          |
                        </span>
                        <button
                          onClick={handleDownload}
                          className="flex items-center gap-1 text-[10px] font-bold text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 cursor-pointer transition-colors"
                        >
                          <Download className="w-3 h-3" /> .json
                        </button>
                      </div>
                    </div>
                    <textarea
                      readOnly
                      value={jsonOutput}
                      className="w-full h-[480px] resize-none rounded-2xl border border-emerald-100 dark:border-emerald-900/40 bg-emerald-50/30 dark:bg-emerald-950/10 px-5 py-4 text-xs font-mono text-slate-800 dark:text-slate-200 leading-relaxed focus:outline-none"
                    />
                    <p className="text-[10px] text-slate-400 tabular-nums">
                      {jsonOutput.length.toLocaleString()} chars ·{' '}
                      {jsonOutput.split('\n').length} lines
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Live indicator */}
        <div className="mt-8 flex items-center gap-1.5">
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
          </span>
          <p className="text-[10px] font-semibold text-slate-400 dark:text-slate-500">
            Parsed entirely in your browser — your spreadsheet never leaves this
            page
          </p>
        </div>
      </div>
    </main>
  );
}

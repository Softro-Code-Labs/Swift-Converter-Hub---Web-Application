'use client';

import { useCallback, useRef, useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Scissors,
  Download,
  Trash2,
  Loader2,
  CheckCircle2,
  FileText,
  X,
  Plus,
} from 'lucide-react';
import { usePdfSplit } from '../hooks/usePdfSplit';
import { PageGrid } from './PageGrid';
import { RangeInput } from './RangeInput';
import type { SplitMode } from '../types/pdfSplit';
import { parseRangeString } from '../hooks/usePdfSplit';

function ModeTab({
  mode,
  onChange,
}: {
  mode: SplitMode;
  onChange: (m: SplitMode) => void;
}) {
  const TABS: { id: SplitMode; label: string; desc: string }[] = [
    { id: 'extract', label: 'Extract pages', desc: 'Pick pages → one PDF' },
    {
      id: 'ranges',
      label: 'Split by ranges',
      desc: 'Named groups → multiple PDFs',
    },
    {
      id: 'every',
      label: 'Every N pages',
      desc: 'Auto-split into equal parts',
    },
  ];
  return (
    <div className="grid grid-cols-3 gap-2">
      {TABS.map(({ id, label, desc }) => (
        <button
          key={id}
          onClick={() => onChange(id)}
          className={`flex flex-col gap-1 p-3 rounded-xl border-2 text-left cursor-pointer transition-all
            ${
              mode === id
                ? 'border-blue-400 bg-blue-50 dark:bg-blue-950/40'
                : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-blue-300 dark:hover:border-blue-700'
            }`}
        >
          <span
            className={`text-xs font-black ${mode === id ? 'text-blue-700 dark:text-blue-300' : 'text-slate-700 dark:text-slate-300'}`}
          >
            {label}
          </span>
          <span className="text-[10px] text-slate-400 dark:text-slate-500">
            {desc}
          </span>
        </button>
      ))}
    </div>
  );
}

export default function PdfSplitTool() {
  const [rawRangeValues, setRawRangeValues] = useState<Record<string, string>>(
    {},
  );
  const fileRef = useRef<HTMLInputElement>(null);
  const {
    file,
    pageCount,
    thumbs,
    thumbsLoading,
    selectedPages,
    rangeString,
    setRangeString,
    rangeGroups,
    setRangeGroups,
    splitMode,
    setSplitMode,
    everyN,
    setEveryN,
    isSplitting,
    result,
    loadFile,
    togglePage,
    selectAll,
    selectNone,
    split,
    clear,
  } = usePdfSplit();

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

  const handleDownload = useCallback((url: string, name: string) => {
    const a = document.createElement('a');
    a.href = url;
    a.download = name;
    a.click();
  }, []);

  const handleDownloadAll = useCallback(() => {
    result?.files.forEach((f, i) => {
      setTimeout(() => handleDownload(f.url, f.name), i * 200);
    });
  }, [result, handleDownload]);

  // For 'ranges' mode - add a new range group
  const addRangeGroup = useCallback(() => {
    setRangeGroups((prev) => [
      ...prev,
      { id: crypto.randomUUID(), label: `Part ${prev.length + 1}`, pages: [] },
    ]);
  }, [setRangeGroups]);

  const updateRangeGroup = useCallback(
    (id: string, raw: string) => {
      setRangeGroups((prev) =>
        prev.map((g) =>
          g.id === id ? { ...g, pages: parseRangeString(raw, pageCount) } : g,
        ),
      );
    },
    [setRangeGroups, pageCount],
  );

  const removeRangeGroup = useCallback(
    (id: string) => {
      setRangeGroups((prev) => prev.filter((g) => g.id !== id));
    },
    [setRangeGroups],
  );

  const canSplit = (() => {
    if (!file || isSplitting) return false;
    if (splitMode === 'extract') {
      const fromGrid = selectedPages.size > 0;
      const fromRange =
        rangeString.trim().length > 0 &&
        parseRangeString(rangeString, pageCount).length > 0;
      return fromGrid || fromRange;
    }
    if (splitMode === 'ranges')
      return rangeGroups.some((g) => g.pages.length > 0);
    if (splitMode === 'every') return everyN >= 1 && pageCount > 0;
    return false;
  })();

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back nav */}
        <Link
          href="/file"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors group mb-8"
        >
          <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
          Document Suite
        </Link>

        {/* Header */}
        <div className="flex items-start gap-4 mb-8">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-100 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400">
            <Scissors className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
              Split PDF Pages
            </h1>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
              Extract pages, split by ranges, or divide into equal parts - all
              in your browser
            </p>
          </div>
        </div>

        {/* Drop zone / file info */}
        {!file ? (
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            onClick={() => fileRef.current?.click()}
            className="flex flex-col items-center justify-center gap-4 py-16 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-700 hover:bg-blue-50/30 dark:hover:bg-blue-950/10 transition-all cursor-pointer"
          >
            <input
              ref={fileRef}
              type="file"
              accept=".pdf,application/pdf"
              className="hidden"
              onChange={handleFileInput}
            />
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100 dark:bg-blue-950/50 text-blue-500">
              <Scissors className="w-7 h-7" />
            </div>
            <div className="text-center space-y-1">
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                Drop a PDF here or{' '}
                <span className="text-blue-600 dark:text-blue-400 font-bold underline underline-offset-2">
                  browse
                </span>
              </p>
              <p className="text-xs text-slate-400 dark:text-slate-500">
                Single PDF file - processed entirely in your browser
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* File info bar */}
            <div className="flex items-center gap-3 px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl">
              <FileText className="w-5 h-5 text-blue-500 shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-slate-700 dark:text-slate-300 truncate">
                  {file.name}
                </p>
                <p className="text-[10px] text-slate-400 tabular-nums">
                  {pageCount} pages
                  {thumbsLoading && ' · Loading previews…'}
                </p>
              </div>
              <button
                onClick={clear}
                className="flex items-center gap-1 text-[10px] font-bold text-slate-400 hover:text-red-500 cursor-pointer transition-colors shrink-0"
              >
                <Trash2 className="w-3 h-3" /> Remove
              </button>
            </div>

            {/* Mode selector */}
            <div className="space-y-3">
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
                Split mode
              </p>
              <ModeTab mode={splitMode} onChange={setSplitMode} />
            </div>

            {/* -- Extract mode ---------------------------------------- */}
            {splitMode === 'extract' && (
              <div className="space-y-5">
                {/* Range string input */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4">
                  <RangeInput
                    value={rangeString}
                    onChange={setRangeString}
                    pageCount={pageCount}
                  />
                </div>

                {/* OR divider */}
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700" />
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    or click pages below
                  </span>
                  <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700" />
                </div>

                {/* Page grid */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4">
                  <PageGrid
                    thumbs={thumbs}
                    selectedPages={
                      rangeString.trim() ? new Set() : selectedPages
                    }
                    rangeSummary={
                      rangeString.trim()
                        ? ''
                        : rangeGroupToString(Array.from(selectedPages))
                    }
                    onToggle={(idx) => {
                      setRangeString(''); // clear range when clicking grid
                      togglePage(idx);
                    }}
                    onSelectAll={() => {
                      setRangeString('');
                      selectAll();
                    }}
                    onSelectNone={() => {
                      setRangeString('');
                      selectNone();
                    }}
                  />
                </div>
              </div>
            )}

            {/* -- Ranges mode ----------------------------------------- */}
            {splitMode === 'ranges' && (
              <div className="space-y-3">
                {rangeGroups.map((group, gi) => (
                  <div
                    key={group.id}
                    className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 space-y-3"
                  >
                    <div className="flex items-center gap-2">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 text-[10px] font-black">
                        {gi + 1}
                      </span>
                      <input
                        value={group.label}
                        onChange={(e) =>
                          setRangeGroups((prev) =>
                            prev.map((g) =>
                              g.id === group.id
                                ? { ...g, label: e.target.value }
                                : g,
                            ),
                          )
                        }
                        placeholder="Part name"
                        className="flex-1 text-xs font-bold text-slate-700 dark:text-slate-300 bg-transparent focus:outline-none border-b border-transparent focus:border-blue-400 transition-colors"
                      />
                      {rangeGroups.length > 1 && (
                        <button
                          onClick={() => {
                            removeRangeGroup(group.id);
                            setRawRangeValues((prev) => {
                              const next = { ...prev };
                              delete next[group.id];
                              return next;
                            });
                          }}
                          className="text-slate-300 hover:text-red-500 cursor-pointer transition-colors"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                    <RangeInput
                      value={rawRangeValues[group.id] ?? ''}
                      onChange={(v) => {
                        // Always update the raw display value immediately
                        setRawRangeValues((prev) => ({
                          ...prev,
                          [group.id]: v,
                        }));
                        // Only update parsed pages - don't touch display value
                        updateRangeGroup(group.id, v);
                      }}
                      pageCount={pageCount}
                    />
                  </div>
                ))}
                <button
                  onClick={() => {
                    addRangeGroup();
                  }}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-dashed border-slate-200 dark:border-slate-700 text-[10px] font-bold text-slate-500 hover:border-blue-300 hover:text-blue-600 cursor-pointer transition-all"
                >
                  <Plus className="w-3.5 h-3.5" /> Add another range
                </button>
              </div>
            )}

            {/* -- Every N mode ---------------------------------------- */}
            {splitMode === 'every' && (
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-4">
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
                  Split every N pages
                </p>
                <div className="flex items-center gap-4">
                  <input
                    type="number"
                    min={1}
                    max={pageCount}
                    value={everyN}
                    onChange={(e) =>
                      setEveryN(Math.max(1, parseInt(e.target.value) || 1))
                    }
                    className="w-24 px-3 py-2 text-sm font-bold text-center rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-400/30"
                  />
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    pages per part →{' '}
                    <span className="font-bold text-blue-600 dark:text-blue-400 tabular-nums">
                      {pageCount > 0
                        ? Math.ceil(pageCount / Math.max(1, everyN))
                        : 0}{' '}
                      PDF
                      {Math.ceil(pageCount / Math.max(1, everyN)) !== 1
                        ? 's'
                        : ''}
                    </span>
                  </p>
                </div>
                {/* Quick presets */}
                <div className="flex gap-2 flex-wrap">
                  {[1, 2, 5, 10].map((n) => (
                    <button
                      key={n}
                      onClick={() => setEveryN(n)}
                      className={`px-3 py-1.5 rounded-lg border text-[10px] font-bold cursor-pointer transition-all
                        ${
                          everyN === n
                            ? 'border-blue-400 bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300'
                            : 'border-slate-200 dark:border-slate-700 text-slate-500 hover:border-blue-300 bg-white dark:bg-slate-900'
                        }`}
                    >
                      Every {n} page{n !== 1 ? 's' : ''}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Split button */}
            <button
              onClick={split}
              disabled={!canSplit}
              className={`w-full py-3.5 rounded-2xl text-sm font-bold flex items-center justify-center gap-2 cursor-pointer transition-all
                ${
                  canSplit
                    ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm active:scale-[0.99]'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                }`}
            >
              {isSplitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Processing…
                </>
              ) : (
                <>
                  <Scissors className="w-4 h-4" /> Split PDF
                </>
              )}
            </button>

            {/* Results */}
            {result && !isSplitting && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                    {result.files.length} file
                    {result.files.length !== 1 ? 's' : ''} ready
                  </p>
                  {result.files.length > 1 && (
                    <button
                      onClick={handleDownloadAll}
                      className="flex items-center gap-1.5 text-[10px] font-bold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                    >
                      <Download className="w-3 h-3" /> Download all
                    </button>
                  )}
                </div>
                {result.files.map((f) => (
                  <div
                    key={f.url}
                    className="flex items-center gap-3 p-3.5 bg-white dark:bg-slate-900 border border-blue-100 dark:border-blue-900/40 rounded-2xl"
                  >
                    <FileText className="w-4 h-4 text-blue-500 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-slate-700 dark:text-slate-300 truncate">
                        {f.name}
                      </p>
                      <p className="text-[10px] text-slate-400 tabular-nums">
                        {f.pageCount} {f.pageCount === 1 ? 'page' : 'pages'} ·{' '}
                        {f.sizeLabel}
                      </p>
                    </div>
                    <button
                      onClick={() => handleDownload(f.url, f.name)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-bold cursor-pointer transition-all active:scale-[0.98]"
                    >
                      <Download className="w-3 h-3" /> Download
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Privacy note */}
        <div className="mt-8 flex items-center gap-1.5">
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-blue-500" />
          </span>
          <p className="text-[10px] font-semibold text-slate-400 dark:text-slate-500">
            PDFs are split entirely in your browser using pdf-lib - your files
            never leave your device
          </p>
        </div>
      </div>
    </main>
  );
}

function rangeGroupToString(pages: number[]): string {
  if (!pages.length) return '';
  const sorted = [...pages].sort((a, b) => a - b);
  const ranges: string[] = [];
  let start = sorted[0];
  let end = sorted[0];
  for (let i = 1; i < sorted.length; i++) {
    if (sorted[i] === end + 1) {
      end = sorted[i];
    } else {
      ranges.push(start === end ? `${start + 1}` : `${start + 1}-${end + 1}`);
      start = end = sorted[i];
    }
  }
  ranges.push(start === end ? `${start + 1}` : `${start + 1}-${end + 1}`);
  return ranges.join(', ');
}

'use client';

import { useState, useCallback, useMemo } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  ArrowUpDown,
  Copy,
  Check,
  Trash2,
  ClipboardPaste,
  Download,
  CaseSensitive,
} from 'lucide-react';
import { useTextSorter } from '../hooks/useTextSorter';
import { OperationChip } from './OperationChip';
import type {
  OperationId,
  Operation,
  SorterOptions,
} from '../types/textSorter';

// ─── Operation registry ───────────────────────────────────────────────────────

const OPERATIONS: Operation[] = [
  // Sort group
  {
    id: 'sort-az',
    label: 'A → Z',
    desc: 'Sort lines alphabetically ascending',
    group: 'sort',
    icon: '↑',
  },
  {
    id: 'sort-za',
    label: 'Z → A',
    desc: 'Sort lines alphabetically descending',
    group: 'sort',
    icon: '↓',
  },
  {
    id: 'sort-length-asc',
    label: 'Shortest first',
    desc: 'Sort by line length ascending',
    group: 'sort',
    icon: '↕',
  },
  {
    id: 'sort-length-desc',
    label: 'Longest first',
    desc: 'Sort by line length descending',
    group: 'sort',
    icon: '↕',
  },
  {
    id: 'sort-numeric',
    label: 'Numeric',
    desc: 'Sort lines by numeric value',
    group: 'sort',
    icon: '#',
  },
  {
    id: 'shuffle',
    label: 'Shuffle',
    desc: 'Randomise line order',
    group: 'sort',
    icon: '⇄',
  },
  {
    id: 'reverse',
    label: 'Reverse',
    desc: 'Flip line order',
    group: 'sort',
    icon: '⇅',
  },
  // Filter group
  {
    id: 'deduplicate',
    label: 'Remove dupes',
    desc: 'Remove duplicate lines',
    group: 'filter',
    icon: '⊘',
  },
  {
    id: 'remove-blanks',
    label: 'Remove blanks',
    desc: 'Delete empty and whitespace-only lines',
    group: 'filter',
    icon: '✕',
  },
  // Transform group
  {
    id: 'trim-lines',
    label: 'Trim spaces',
    desc: 'Strip leading and trailing whitespace',
    group: 'transform',
    icon: '⌧',
  },
  {
    id: 'lowercase',
    label: 'lowercase',
    desc: 'Convert all lines to lowercase',
    group: 'transform',
    icon: 'aa',
  },
  {
    id: 'uppercase',
    label: 'UPPERCASE',
    desc: 'Convert all lines to uppercase',
    group: 'transform',
    icon: 'AA',
  },
];

const GROUPS: { id: Operation['group']; label: string; color: string }[] = [
  { id: 'sort', label: 'Sort', color: 'bg-teal-400' },
  { id: 'filter', label: 'Filter', color: 'bg-sky-400' },
  { id: 'transform', label: 'Transform', color: 'bg-violet-400' },
];

const PLACEHOLDER = `Paste your lines here - one item per line.

apple
banana
cherry
apple
banana
date
`;

export default function TextSorterTool() {
  const [text, setText] = useState('');
  const [activeOps, setActiveOps] = useState<OperationId[]>([]);
  const [caseSensitive, setCaseSens] = useState(false);
  const [copied, setCopied] = useState(false);

  const opts: SorterOptions = useMemo(
    () => ({ operations: activeOps, caseSensitive }),
    [activeOps, caseSensitive],
  );

  const result = useTextSorter(text, opts);
  const output = result.lines.join('\n');

  const toggleOp = useCallback((id: OperationId) => {
    setActiveOps((prev) => {
      // Mutually exclusive sort ops - only one sort at a time
      const SORT_OPS: OperationId[] = [
        'sort-az',
        'sort-za',
        'sort-length-asc',
        'sort-length-desc',
        'sort-numeric',
        'shuffle',
        'reverse',
      ];
      const isSortOp = SORT_OPS.includes(id);

      if (prev.includes(id)) {
        return prev.filter((o) => o !== id);
      }
      if (isSortOp) {
        // Replace any existing sort op
        return [...prev.filter((o) => !SORT_OPS.includes(o)), id];
      }
      return [...prev, id];
    });
  }, []);

  const handlePaste = useCallback(async () => {
    try {
      setText(await navigator.clipboard.readText());
    } catch {
      /* denied */
    }
  }, []);

  const handleCopy = useCallback(() => {
    if (!output.trim()) return;
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }, [output]);

  const handleDownload = useCallback(() => {
    const blob = new Blob([output], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sorted.txt';
    a.click();
    URL.revokeObjectURL(url);
  }, [output]);

  const handleClear = useCallback(() => {
    setText('');
    setActiveOps([]);
  }, []);

  const isEmpty = !text.trim();
  const hasOutput = activeOps.length > 0 && !isEmpty;

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300 selection:bg-teal-400 selection:text-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back nav */}
        <Link
          href="/character"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-teal-600 dark:hover:text-teal-400 transition-colors group mb-8"
        >
          <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
          Character Studio
        </Link>

        {/* Header */}
        <div className="flex items-start gap-4 mb-8">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-teal-100 dark:bg-teal-950/50 text-teal-600 dark:text-teal-400">
            <ArrowUpDown className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
              Text Sorter & Deduplicator
            </h1>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
              Stack operations - sort, filter, and transform lines instantly
            </p>
          </div>
        </div>

        {/* Operations panel */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 mb-5 space-y-4">
          {GROUPS.map(({ id: groupId, label: groupLabel, color }) => (
            <div key={groupId} className="space-y-2">
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 flex items-center gap-2">
                <span
                  className={`w-1 h-2.5 rounded-full inline-block ${color}`}
                />
                {groupLabel}
              </p>
              <div className="flex flex-wrap gap-2">
                {OPERATIONS.filter((o) => o.group === groupId).map((op) => (
                  <OperationChip
                    key={op.id}
                    op={op}
                    active={activeOps.includes(op.id)}
                    onToggle={toggleOp}
                  />
                ))}
              </div>
            </div>
          ))}

          {/* Options row */}
          <div className="flex items-center gap-3 pt-3 border-t border-slate-100 dark:border-slate-800 flex-wrap">
            <button
              onClick={() => setCaseSens((v) => !v)}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-[10px] font-bold cursor-pointer transition-all
                ${
                  caseSensitive
                    ? 'border-teal-400 bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-300'
                    : 'border-slate-200 dark:border-slate-700 text-slate-400 hover:border-teal-300 hover:text-teal-600 bg-white dark:bg-slate-900'
                }`}
            >
              <CaseSensitive className="w-3.5 h-3.5" />
              Case sensitive
            </button>

            {/* Active pipeline display */}
            {activeOps.length > 0 && (
              <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
                <span className="font-bold text-slate-500">Pipeline:</span>
                {activeOps.map((id, i) => (
                  <span key={id} className="flex items-center gap-1">
                    {i > 0 && <span className="text-slate-300">→</span>}
                    <span className="font-semibold text-slate-600 dark:text-slate-300">
                      {OPERATIONS.find((o) => o.id === id)?.label}
                    </span>
                  </span>
                ))}
              </div>
            )}

            {activeOps.length > 0 && (
              <button
                onClick={() => setActiveOps([])}
                className="ml-auto text-[10px] font-bold text-slate-400 hover:text-red-500 cursor-pointer transition-colors"
              >
                Clear all
              </button>
            )}
          </div>
        </div>

        {/* Editor + output */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Input */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
                Input
                {!isEmpty && (
                  <span className="ml-2 font-normal text-slate-300 dark:text-slate-600 tabular-nums normal-case">
                    {result.inputCount} lines
                  </span>
                )}
              </label>
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePaste}
                  className="flex items-center gap-1 text-[10px] font-bold text-slate-400 hover:text-teal-600 dark:hover:text-teal-400 cursor-pointer transition-colors"
                >
                  <ClipboardPaste className="w-3 h-3" /> Paste
                </button>
                {!isEmpty && (
                  <>
                    <span className="text-slate-200 dark:text-slate-700">
                      |
                    </span>
                    <button
                      onClick={handleClear}
                      className="flex items-center gap-1 text-[10px] font-bold text-slate-400 hover:text-red-500 cursor-pointer transition-colors"
                    >
                      <Trash2 className="w-3 h-3" /> Clear
                    </button>
                  </>
                )}
              </div>
            </div>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={PLACEHOLDER}
              spellCheck={false}
              className="w-full h-96 resize-none rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-5 py-4 text-sm font-mono text-slate-800 dark:text-slate-200 placeholder:text-slate-300 dark:placeholder:text-slate-600 leading-relaxed focus:outline-none focus:ring-2 focus:ring-teal-400/30 transition-all"
            />
          </div>

          {/* Output */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
                Output
                {hasOutput && (
                  <span className="ml-2 font-normal text-slate-300 dark:text-slate-600 tabular-nums normal-case">
                    {result.outputCount} lines
                    {result.removedCount > 0 && (
                      <span className="text-red-400 ml-1">
                        (−{result.removedCount})
                      </span>
                    )}
                  </span>
                )}
              </label>
              {hasOutput && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-1 text-[10px] font-bold text-slate-400 hover:text-teal-600 dark:hover:text-teal-400 cursor-pointer transition-colors"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-500" /> Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" /> Copy
                      </>
                    )}
                  </button>
                  <span className="text-slate-200 dark:text-slate-700">|</span>
                  <button
                    onClick={handleDownload}
                    className="flex items-center gap-1 text-[10px] font-bold text-slate-400 hover:text-teal-600 dark:hover:text-teal-400 cursor-pointer transition-colors"
                  >
                    <Download className="w-3 h-3" /> .txt
                  </button>
                </div>
              )}
            </div>
            <div
              className={`w-full h-96 rounded-2xl border overflow-auto
              ${
                hasOutput
                  ? 'border-teal-100 dark:border-teal-900/40 bg-teal-50/30 dark:bg-teal-950/10'
                  : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900'
              }`}
            >
              {hasOutput ? (
                <pre className="px-5 py-4 text-sm font-mono text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap break-words">
                  {output}
                </pre>
              ) : (
                <div className="flex flex-col items-center justify-center h-full gap-2 text-center px-6">
                  <ArrowUpDown className="w-7 h-7 text-slate-200 dark:text-slate-700" />
                  <p className="text-xs text-slate-300 dark:text-slate-600">
                    {isEmpty
                      ? 'Paste lines on the left, then pick operations above'
                      : 'Select an operation above to process your text'}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Stats row */}
        {hasOutput && (
          <div className="mt-4 grid grid-cols-3 gap-3">
            {[
              {
                label: 'Input lines',
                value: result.inputCount,
                color: 'text-slate-600 dark:text-slate-400',
              },
              {
                label: 'Output lines',
                value: result.outputCount,
                color: 'text-teal-600 dark:text-teal-400',
              },
              {
                label: 'Lines removed',
                value: result.removedCount,
                color:
                  result.removedCount > 0 ? 'text-red-500' : 'text-slate-400',
              },
            ].map(({ label, value, color }) => (
              <div
                key={label}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-center"
              >
                <p className={`text-xl font-black tabular-nums ${color}`}>
                  {value}
                </p>
                <p className="text-[10px] text-slate-400 mt-0.5">{label}</p>
              </div>
            ))}
          </div>
        )}

        {/* Live indicator */}
        <div className="mt-5 flex items-center gap-1.5">
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-teal-500" />
          </span>
          <p className="text-[10px] font-semibold text-slate-400 dark:text-slate-500">
            Operations apply instantly - no server, no delay
          </p>
        </div>
      </div>
    </main>
  );
}

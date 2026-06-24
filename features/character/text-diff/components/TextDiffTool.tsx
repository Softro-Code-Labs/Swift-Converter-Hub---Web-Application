'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, GitCompare, Columns2, AlignLeft, Hash } from 'lucide-react';
import { useTextDiff } from '../hooks/useTextDiff';
import { DiffStatsBar } from './DiffStatsBar';
import { DiffLineRow } from './DiffLineRow';
import { TextInputPane } from './TextInputPane';
import type { DiffMode } from '../types/textDiff';

const LEFT_PLACEHOLDER = `Paste original text here…

The diff engine compares line by line
and highlights every change instantly.`;

const RIGHT_PLACEHOLDER = `Paste modified text here…

Added lines appear in green,
removed lines in red.`;

export default function TextDiffTool() {
  const [leftText, setLeftText] = useState('');
  const [rightText, setRightText] = useState('');
  const [mode, setMode] = useState<DiffMode>('split');
  const [showLineNums, setShowLineNums] = useState(true);

  const diff = useTextDiff(leftText, rightText);
  const hasContent = leftText || rightText;
  const hasDiff = !diff.isEmpty;

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back nav */}
        <Link
          href="/character"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-sky-600 dark:hover:text-sky-400 transition-colors group mb-8"
        >
          <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
          Character Studio
        </Link>

        {/* Header */}
        <div className="flex items-start gap-4 mb-8">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-sky-100 dark:bg-sky-950/50 text-sky-600 dark:text-sky-400">
            <GitCompare className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
              Text Diff Viewer
            </h1>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
              Line-by-line comparison - added, removed, and unchanged at a
              glance
            </p>
          </div>
        </div>

        {/* Main card */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden">
          {/* Toolbar */}
          <div className="flex items-center gap-2 flex-wrap px-4 py-3 border-b border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/60">
            {/* View mode */}
            <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
              <button
                onClick={() => setMode('split')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all
                  ${
                    mode === 'split'
                      ? 'bg-white dark:bg-slate-700 text-sky-700 dark:text-sky-300 shadow-sm'
                      : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
                  }`}
              >
                <Columns2 className="w-3.5 h-3.5" /> Split
              </button>
              <button
                onClick={() => setMode('unified')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all
                  ${
                    mode === 'unified'
                      ? 'bg-white dark:bg-slate-700 text-sky-700 dark:text-sky-300 shadow-sm'
                      : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
                  }`}
              >
                <AlignLeft className="w-3.5 h-3.5" /> Unified
              </button>
            </div>

            <div className="w-px h-4 bg-slate-200 dark:bg-slate-700" />

            {/* Line numbers toggle */}
            <button
              onClick={() => setShowLineNums((v) => !v)}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-[10px] font-bold transition-all
                ${
                  showLineNums
                    ? 'border-sky-400 bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300'
                    : 'border-slate-200 dark:border-slate-700 text-slate-400 hover:border-sky-300 hover:text-sky-600 bg-white dark:bg-slate-900'
                }`}
            >
              <Hash className="w-3 h-3" /> Line numbers
            </button>

            {/* Stats */}
            {hasDiff && (
              <div className="ml-auto flex-1 min-w-0">
                <DiffStatsBar
                  added={diff.addedCount}
                  removed={diff.removedCount}
                  unchanged={diff.unchangedCount}
                />
              </div>
            )}
          </div>

          {/* Input panes - always visible */}
          <div
            className="grid grid-cols-1 lg:grid-cols-2 border-b border-slate-100 dark:border-slate-800"
            style={{ height: '260px' }}
          >
            <div className="border-b lg:border-b-0 lg:border-r border-slate-100 dark:border-slate-800 flex flex-col">
              <TextInputPane
                label="Original"
                value={leftText}
                onChange={setLeftText}
                placeholder={LEFT_PLACEHOLDER}
              />
            </div>
            <div className="flex flex-col">
              <TextInputPane
                label="Modified"
                value={rightText}
                onChange={setRightText}
                placeholder={RIGHT_PLACEHOLDER}
              />
            </div>
          </div>

          {/* Diff output */}
          {hasDiff && (
            <div className="overflow-auto max-h-[520px]">
              {mode === 'split' ? (
                <div className="grid grid-cols-2 divide-x divide-slate-100 dark:divide-slate-800 min-w-[640px]">
                  {/* Left (original) */}
                  <div>
                    <div className="px-4 py-1.5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40">
                      <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400">
                        Original
                      </span>
                    </div>
                    {diff.left.lines.map((line, i) => (
                      <DiffLineRow
                        key={i}
                        line={line}
                        showLineNumbers={showLineNums}
                      />
                    ))}
                  </div>
                  {/* Right (modified) */}
                  <div>
                    <div className="px-4 py-1.5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40">
                      <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400">
                        Modified
                      </span>
                    </div>
                    {diff.right.lines.map((line, i) => (
                      <DiffLineRow
                        key={i}
                        line={line}
                        showLineNumbers={showLineNums}
                      />
                    ))}
                  </div>
                </div>
              ) : (
                // Unified view
                <div className="min-w-[400px]">
                  <div className="px-4 py-1.5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40">
                    <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400">
                      Unified diff
                    </span>
                  </div>
                  {diff.unified.map((line, i) => (
                    <DiffLineRow
                      key={i}
                      line={line}
                      showLineNumbers={showLineNums}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Empty state */}
          {!hasContent && (
            <div className="flex flex-col items-center justify-center py-12 gap-3 text-center border-t border-slate-100 dark:border-slate-800">
              <GitCompare className="w-8 h-8 text-slate-200 dark:text-slate-700" />
              <p className="text-sm font-semibold text-slate-400 dark:text-slate-500">
                Paste text into both panes to see the diff
              </p>
              <p className="text-xs text-slate-300 dark:text-slate-600 max-w-xs">
                Works great for comparing code, config files, draft revisions,
                or any two versions of text
              </p>
            </div>
          )}

          {/* Content in one pane only */}
          {hasContent && diff.isEmpty && (
            <div className="flex flex-col items-center justify-center py-10 gap-2 text-center border-t border-slate-100 dark:border-slate-800">
              <p className="text-sm font-semibold text-slate-400">
                Paste text into the second pane to compare
              </p>
            </div>
          )}
        </div>

        {/* Legend */}
        <div className="mt-4 flex items-center gap-4 flex-wrap">
          {[
            { color: 'bg-emerald-400', label: 'Added' },
            { color: 'bg-red-400', label: 'Removed' },
            { color: 'bg-slate-200 dark:bg-slate-700', label: 'Unchanged' },
          ].map(({ color, label }) => (
            <div key={label} className="flex items-center gap-1.5">
              <span className={`w-2.5 h-2.5 rounded-sm ${color}`} />
              <span className="text-[10px] font-semibold text-slate-400">
                {label}
              </span>
            </div>
          ))}
          <div className="ml-auto flex items-center gap-1.5">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-sky-500" />
            </span>
            <p className="text-[10px] font-semibold text-slate-400 dark:text-slate-500">
              Diff updates as you type - no server
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}

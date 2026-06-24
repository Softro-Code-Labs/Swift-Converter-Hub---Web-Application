'use client';

import { useState, useCallback, useMemo } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  ScanText,
  ClipboardPaste,
  Trash2,
  Filter,
  AlertTriangle,
} from 'lucide-react';
import { useUnicodeInspector } from '../hooks/useUnicodeInspector';
import { CharCard } from './CharCard';
import { CategoryBadge } from './CategoryBadge';
import type { CharCategory } from '../types/unicodeInspector';

const CATEGORY_FILTERS: { id: CharCategory | 'all'; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'letter', label: 'Letters' },
  { id: 'digit', label: 'Digits' },
  { id: 'punctuation', label: 'Punctuation' },
  { id: 'symbol', label: 'Symbols' },
  { id: 'space', label: 'Spaces' },
  { id: 'invisible', label: 'Invisible' },
  { id: 'emoji', label: 'Emoji' },
  { id: 'control', label: 'Control' },
];

const PLACEHOLDER = `Paste any text to inspect it character by character.

Try pasting text from a PDF, Word doc, or webpage — hidden characters like zero-width spaces, smart quotes, and byte-order marks will be revealed.`;

const SAMPLE_TEXT = `Hello, "World"! Zero​Width here.
Smart quotes: \u201CHello\u201D \u2018World\u2019
En dash \u2013, em dash \u2014, ellipsis\u2026
Invisible: \u200B\u200C\u200D\uFEFF`;

export default function UnicodeInspectorTool() {
  const [text, setText] = useState('');
  const [filter, setFilter] = useState<CharCategory | 'all'>('all');
  const [highlightInvisible, setHighlightInvisible] = useState(true);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const { chars, stats } = useUnicodeInspector(text);

  const filtered = useMemo(
    () =>
      filter === 'all' ? chars : chars.filter((c) => c.category === filter),
    [chars, filter],
  );

  const handlePaste = useCallback(async () => {
    try {
      setText(await navigator.clipboard.readText());
    } catch {
      /* denied */
    }
  }, []);

  const loadSample = useCallback(() => {
    setText(SAMPLE_TEXT);
    setFilter('all');
  }, []);

  const isEmpty = !text;
  const hasInvisible = stats.invisible > 0;

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300 selection:bg-violet-400 selection:text-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back nav */}
        <Link
          href="/character"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-violet-600 dark:hover:text-violet-400 transition-colors group mb-8"
        >
          <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
          Character Studio
        </Link>

        {/* Header */}
        <div className="flex items-start gap-4 mb-8">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-violet-100 dark:bg-violet-950/50 text-violet-600 dark:text-violet-400">
            <ScanText className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
              Unicode Inspector
            </h1>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
              Every character revealed — code points, names, categories,
              invisible chars
            </p>
          </div>
        </div>

        {/* Input card */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 mb-5 space-y-3">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
              Input text
            </label>
            <div className="flex items-center gap-2">
              <button
                onClick={loadSample}
                className="text-[10px] font-bold text-violet-500 hover:text-violet-700 dark:hover:text-violet-300 cursor-pointer transition-colors"
              >
                Load sample
              </button>
              <span className="text-slate-200 dark:text-slate-700">|</span>
              <button
                onClick={handlePaste}
                className="flex items-center gap-1 text-[10px] font-bold text-slate-400 hover:text-violet-600 dark:hover:text-violet-400 cursor-pointer transition-colors"
              >
                <ClipboardPaste className="w-3 h-3" /> Paste
              </button>
              {!isEmpty && (
                <>
                  <span className="text-slate-200 dark:text-slate-700">|</span>
                  <button
                    onClick={() => {
                      setText('');
                      setFilter('all');
                      setSelectedIndex(null);
                    }}
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
            onChange={(e) => {
              setText(e.target.value);
              setSelectedIndex(null);
            }}
            placeholder={PLACEHOLDER}
            spellCheck={false}
            rows={5}
            className="w-full resize-none rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 px-5 py-4 text-sm font-mono text-slate-800 dark:text-slate-200 placeholder:text-slate-300 dark:placeholder:text-slate-600 leading-relaxed focus:outline-none focus:ring-2 focus:ring-violet-400/30 transition-all"
          />
        </div>

        {/* Invisible character warning banner */}
        {hasInvisible && (
          <div className="flex items-center gap-3 px-4 py-3 mb-5 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/40 rounded-xl">
            <AlertTriangle className="w-4 h-4 text-red-500 shrink-0" />
            <p className="text-xs font-semibold text-red-700 dark:text-red-400">
              {stats.invisible} invisible character
              {stats.invisible !== 1 ? 's' : ''} detected —{' '}
              <button
                onClick={() => setFilter('invisible')}
                className="underline underline-offset-2 hover:text-red-800 dark:hover:text-red-300 cursor-pointer transition-colors"
              >
                show only invisible chars
              </button>
            </p>
          </div>
        )}

        {/* Stats strip */}
        {!isEmpty && (
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-5">
            {[
              {
                label: 'Total chars',
                value: stats.total,
                color: 'text-violet-600 dark:text-violet-400',
              },
              {
                label: 'Unique chars',
                value: stats.unique,
                color: 'text-slate-700 dark:text-slate-300',
              },
              {
                label: 'Non-ASCII',
                value: stats.nonAscii,
                color:
                  stats.nonAscii > 0
                    ? 'text-amber-600 dark:text-amber-400'
                    : 'text-slate-400',
              },
              {
                label: 'Invisible',
                value: stats.invisible,
                color:
                  stats.invisible > 0
                    ? 'text-red-600 dark:text-red-400'
                    : 'text-slate-400',
              },
              {
                label: 'Emoji',
                value: stats.emoji,
                color:
                  stats.emoji > 0
                    ? 'text-pink-600 dark:text-pink-400'
                    : 'text-slate-400',
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

        {/* Toolbar: filter + highlight toggle */}
        {!isEmpty && (
          <div className="flex items-center gap-3 flex-wrap mb-4">
            <div className="flex items-center gap-1.5">
              <Filter className="w-3 h-3 text-slate-400" />
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                Filter
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {CATEGORY_FILTERS.map(({ id, label }) => {
                const count =
                  id === 'all'
                    ? chars.length
                    : chars.filter((c) => c.category === id).length;
                if (count === 0 && id !== 'all') return null;
                return (
                  <button
                    key={id}
                    onClick={() => setFilter(id)}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-lg border text-[10px] font-bold cursor-pointer transition-all
                      ${
                        filter === id
                          ? 'border-violet-400 bg-violet-50 dark:bg-violet-950/40 text-violet-700 dark:text-violet-300'
                          : 'border-slate-200 dark:border-slate-700 text-slate-400 hover:border-violet-300 hover:text-violet-600 bg-white dark:bg-slate-900'
                      }`}
                  >
                    {label}
                    <span
                      className={`tabular-nums ${filter === id ? 'text-violet-400' : 'text-slate-300 dark:text-slate-600'}`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Highlight toggle */}
            <div className="ml-auto flex items-center gap-2">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <div
                  onClick={() => setHighlightInvisible((v) => !v)}
                  className={`relative w-8 h-4 rounded-full transition-colors
                    ${highlightInvisible ? 'bg-red-400' : 'bg-slate-200 dark:bg-slate-700'}`}
                >
                  <span
                    className={`absolute top-0.5 w-3 h-3 rounded-full bg-white shadow transition-transform
                    ${highlightInvisible ? 'translate-x-4' : 'translate-x-0.5'}`}
                  />
                </div>
                <span className="text-[10px] font-bold text-slate-400">
                  Highlight invisible
                </span>
              </label>
            </div>
          </div>
        )}

        {/* Character grid */}
        {!isEmpty && (
          <>
            <div
              className="grid gap-2"
              style={{
                gridTemplateColumns: 'repeat(auto-fill, minmax(96px, 1fr))',
              }}
            >
              {filtered.map((info) => (
                <div
                  key={info.index}
                  onClick={() =>
                    setSelectedIndex(
                      selectedIndex === info.index ? null : info.index,
                    )
                  }
                  className="cursor-pointer"
                >
                  <CharCard
                    info={info}
                    highlight={
                      selectedIndex === info.index ||
                      (highlightInvisible && info.isInvisible)
                    }
                  />
                </div>
              ))}
            </div>

            {filtered.length === 0 && (
              <div className="text-center py-12">
                <p className="text-sm text-slate-400">
                  No characters match this filter
                </p>
              </div>
            )}
          </>
        )}

        {/* Detail panel for selected char */}
        {selectedIndex !== null &&
          chars[selectedIndex] &&
          (() => {
            const info = chars[selectedIndex];
            return (
              <div className="mt-5 bg-white dark:bg-slate-900 border border-violet-200 dark:border-violet-800 rounded-2xl p-5 space-y-3">
                <div className="flex items-start gap-4">
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-violet-50 dark:bg-violet-950/30 border border-violet-100 dark:border-violet-800 text-3xl">
                    {info.isInvisible ? '⬜' : info.char}
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-lg font-black font-mono text-violet-600 dark:text-violet-400">
                        {info.hex}
                      </span>
                      <CategoryBadge category={info.category} />
                      {info.isInvisible && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-100 dark:bg-red-950/40 text-red-600 dark:text-red-400">
                          ⚠ Invisible
                        </span>
                      )}
                    </div>
                    <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                      {info.name}
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-slate-100 dark:border-slate-800">
                  {[
                    { label: 'Code point', value: info.hex },
                    { label: 'Decimal', value: info.codePoint.toString() },
                    { label: 'HTML entity', value: info.htmlEntity },
                    { label: 'UTF-8 bytes', value: info.utf8Bytes },
                  ].map(({ label, value }) => (
                    <div key={label}>
                      <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400 mb-1">
                        {label}
                      </p>
                      <p className="text-xs font-mono text-slate-700 dark:text-slate-300 break-all">
                        {value}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            );
          })()}

        {/* Empty state */}
        {isEmpty && (
          <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
            <ScanText className="w-10 h-10 text-slate-200 dark:text-slate-700" />
            <p className="text-sm font-semibold text-slate-400 dark:text-slate-500">
              Paste text above to inspect its characters
            </p>
            <p className="text-xs text-slate-300 dark:text-slate-600 max-w-sm">
              Great for finding hidden characters, smart quotes, zero-width
              spaces, and byte-order marks lurking in text from PDFs or Word
              docs
            </p>
            <button
              onClick={loadSample}
              className="mt-2 px-4 py-2 rounded-xl bg-violet-100 dark:bg-violet-950/40 text-violet-700 dark:text-violet-300 text-xs font-bold hover:bg-violet-200 dark:hover:bg-violet-950/60 cursor-pointer transition-colors"
            >
              Try a sample with hidden chars →
            </button>
          </div>
        )}

        {/* Live indicator */}
        <div className="mt-6 flex items-center gap-1.5">
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-violet-500" />
          </span>
          <p className="text-[10px] font-semibold text-slate-400 dark:text-slate-500">
            Characters inspected locally — your text never leaves this page
          </p>
        </div>
      </div>
    </main>
  );
}

'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Hash,
  Copy,
  Check,
  Trash2,
  ClipboardPaste,
} from 'lucide-react';
import { useTextStats } from '../hooks/useTextStats';
import { StatCard } from './StatCard';
import { KeywordPill } from './KeywordPill';

const PLACEHOLDER = `Start typing or paste your text here…

Character Studio counts every word, character, sentence, and paragraph as you type - with no delay and no server connection. Your text stays on this page.`;

export default function WordCounterTool() {
  const [text, setText] = useState('');
  const [copied, setCopied] = useState(false);
  const stats = useTextStats(text);

  const handlePaste = useCallback(async () => {
    try {
      const t = await navigator.clipboard.readText();
      setText(t);
    } catch {
      // clipboard access denied - ignore silently
    }
  }, []);

  const handleCopy = useCallback(() => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }, [text]);

  const handleClear = useCallback(() => setText(''), []);

  const isEmpty = text.trim().length === 0;
  const topMax = stats.topKeywords[0]?.count ?? 1;

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300 selection:bg-rose-500 selection:text-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back nav */}
        <Link
          href="/character"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 transition-colors group mb-8"
        >
          <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
          Character Studio
        </Link>

        {/* Header */}
        <div className="flex items-start gap-4 mb-8">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-rose-100 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400">
            <Hash className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
              Word & Character Counter
            </h1>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
              Live stats as you type - nothing sent to any server
            </p>
          </div>
        </div>

        {/* Primary stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3">
          <StatCard
            label="Words"
            value={stats.words.toLocaleString()}
            large
            accent="text-rose-600 dark:text-rose-400"
          />
          <StatCard
            label="Characters"
            value={stats.characters.toLocaleString()}
            sub={`${stats.charactersNoSpaces.toLocaleString()} without spaces`}
          />
          <StatCard
            label="Sentences"
            value={stats.sentences.toLocaleString()}
          />
          <StatCard
            label="Paragraphs"
            value={stats.paragraphs.toLocaleString()}
          />
        </div>

        {/* Secondary stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          <StatCard
            label="Reading time"
            value={stats.readingTime}
            sub="at 238 wpm"
          />
          <StatCard
            label="Speaking time"
            value={stats.speakingTime}
            sub="at 130 wpm"
          />
          <StatCard
            label="Avg word length"
            value={stats.avgWordLength || '-'}
            sub="characters"
          />
          <StatCard label="Longest word" value={stats.longestWord || '-'} />
        </div>

        {/* Editor + sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_220px] gap-5">
          {/* Textarea */}
          <div className="relative">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={PLACEHOLDER}
              spellCheck
              className="w-full h-[420px] resize-none rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-5 py-4 text-sm text-slate-800 dark:text-slate-200 placeholder:text-slate-300 dark:placeholder:text-slate-600 leading-relaxed focus:outline-none focus:ring-2 focus:ring-rose-400/40 transition-all"
            />
            {/* Progress bar - fills toward 500 words */}
            {!isEmpty && (
              <div
                className="absolute bottom-0 left-0 h-0.5 bg-rose-400 dark:bg-rose-500 rounded-b-2xl transition-all duration-300"
                style={{
                  width: `${Math.min((stats.words / 500) * 100, 100)}%`,
                  opacity: 0.7,
                }}
              />
            )}
          </div>

          {/* Sidebar */}
          <div className="flex flex-col gap-3">
            {/* Actions */}
            <div className="flex flex-col gap-2">
              <button
                onClick={handlePaste}
                className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold text-slate-600 dark:text-slate-400 hover:border-rose-300 dark:hover:border-rose-700 hover:text-rose-600 dark:hover:text-rose-400 cursor-pointer transition-all"
              >
                <ClipboardPaste className="w-3.5 h-3.5" />
                Paste from clipboard
              </button>
              <button
                onClick={handleCopy}
                disabled={isEmpty}
                className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold text-slate-600 dark:text-slate-400 hover:border-rose-300 dark:hover:border-rose-700 hover:text-rose-600 dark:hover:text-rose-400 cursor-pointer transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {copied ? (
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
                {copied ? 'Copied!' : 'Copy text'}
              </button>
              <button
                onClick={handleClear}
                disabled={isEmpty}
                className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold text-slate-500 hover:border-red-300 dark:hover:border-red-800 hover:text-red-500 cursor-pointer transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Clear
              </button>
            </div>

            {/* Top keywords */}
            <div className="flex-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 space-y-3">
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
                Top keywords
              </p>
              {stats.topKeywords.length > 0 ? (
                <div className="space-y-1.5">
                  {stats.topKeywords.map(({ word, count }) => (
                    <KeywordPill
                      key={word}
                      word={word}
                      count={count}
                      max={topMax}
                    />
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-300 dark:text-slate-600 italic">
                  Appears once you start typing
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Live indicator */}
        <div className="mt-4 flex items-center gap-1.5">
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-rose-500" />
          </span>
          <p className="text-[10px] font-semibold text-slate-400 dark:text-slate-500">
            Stats update as you type - no internet connection needed
          </p>
        </div>
      </div>
    </main>
  );
}
